import { useState, useEffect } from 'react';

// Load API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [viewingImage, setViewingImage] = useState(null);

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  // Fetch all images from API
  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/images`);
      const data = await response.json();

      if (response.ok) {
        // Handle nested response structure from Lambda
        let imagesData = data;

        // If response has body property (Lambda returns nested structure)
        if (data.body && typeof data.body === 'string') {
          imagesData = JSON.parse(data.body);
        }

        setImages(imagesData.images || []);
      } else {
        showMessage('error', 'Failed to load images');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      showMessage('error', 'Error loading images. Please check API URL.');
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    // Validate file type
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!validTypes.includes(file.type)) {
      showMessage(
        'error',
        'Invalid file type. Only images (JPEG, PNG, GIF, WEBP) are allowed.'
      );
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showMessage(
        'error',
        `File size exceeds 5MB limit. Your file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB`
      );
      return;
    }

    setSelectedFile(file);
    setMessage({ type: '', text: '' });
  };

  // Upload file to S3 via presigned URL
  const handleUpload = async () => {
    if (!selectedFile) {
      showMessage('error', 'Please select a file first');
      return;
    }

    setUploading(true);
    setMessage({ type: 'info', text: 'Uploading...' });

    try {
      // Step 1: Get presigned URL from API
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get upload URL');
      }

      // Step 2: Upload file to S3 using presigned URL
      const uploadResponse = await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': selectedFile.type,
        },
        body: selectedFile,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      // Success!
      showMessage('success', `✓ ${selectedFile.name} uploaded successfully!`);
      setSelectedFile(null);

      // Reset file input
      document.getElementById('file-input').value = '';

      // Refresh images list
      setTimeout(fetchImages, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      showMessage('error', error.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Show message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    if (type === 'success') {
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Open image in modal
  const openImageModal = (image) => {
    setViewingImage(image);
  };

  // Close image modal
  const closeImageModal = () => {
    setViewingImage(null);
  };

  return (
    <div className="app">
      <div className="header">
        <h1>📸 AWS Image Upload</h1>
        <p>Serverless Image Storage with S3, Lambda, DynamoDB & API Gateway</p>
      </div>

      <div className="container">
        {/* Upload Section */}
        <div className="upload-section">
          <h2>Upload New Image</h2>

          {message.text && (
            <div className={`alert alert-${message.type}`}>{message.text}</div>
          )}

          <div className="file-input-wrapper">
            <label htmlFor="file-input" className="file-input-label">
              {selectedFile ? '📁 Change File' : '📁 Choose Image File'}
            </label>
            <input
              id="file-input"
              type="file"
              className="file-input"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </div>

          {selectedFile && (
            <div className="selected-file">
              <div>
                <strong>Selected:</strong> {selectedFile.name}
              </div>
              <div className="selected-file-info">
                <span>Type: {selectedFile.type}</span>
                <span>Size: {formatFileSize(selectedFile.size)}</span>
              </div>
            </div>
          )}

          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
          >
            {uploading ? '⏳ Uploading...' : '🚀 Upload Image'}
          </button>
        </div>

        {/* Gallery Section */}
        <div className="gallery-section">
          <h2>Uploaded Images ({images.length})</h2>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <div>Loading images...</div>
            </div>
          ) : images.length === 0 ? (
            <div className="no-images">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
              <h3>No images yet</h3>
              <p>Upload your first image to get started!</p>
            </div>
          ) : (
            <div className="image-grid">
              {images.map((image) => (
                <div
                  key={image.imageId}
                  className="image-card"
                  onClick={() => openImageModal(image)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="image-wrapper">
                    <img
                      src={image.fileUrl}
                      alt={image.fileName}
                      onError={(e) => {
                        e.target.src =
                          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23ddd" width="200" height="200"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Image</text></svg>';
                      }}
                    />
                  </div>
                  <div className="image-info">
                    <div className="image-name" title={image.fileName}>
                      {image.fileName}
                    </div>
                    <div className="image-meta">
                      <span>
                        <span className="badge">
                          {image.fileType?.split('/')[1]?.toUpperCase()}
                        </span>
                        {image.fileSize &&
                          ` • ${formatFileSize(parseInt(image.fileSize))}`}
                      </span>
                      <span>📅 {formatDate(image.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {viewingImage && (
        <div className="modal-overlay" onClick={closeImageModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeImageModal}>
              ✕
            </button>
            <div className="modal-image-wrapper">
              <img
                src={viewingImage.fileUrl}
                alt={viewingImage.fileName}
                className="modal-image"
              />
            </div>
            <div className="modal-info">
              <h3>{viewingImage.fileName}</h3>
              <div className="modal-details">
                <span className="badge">
                  {viewingImage.fileType?.split('/')[1]?.toUpperCase()}
                </span>
                <span>
                  {viewingImage.fileSize &&
                    formatFileSize(parseInt(viewingImage.fileSize))}
                </span>
                <span>📅 {formatDate(viewingImage.uploadedAt)}</span>
              </div>
              <a
                href={viewingImage.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="view-original-link"
              >
                🔗 Open Original in New Tab
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
