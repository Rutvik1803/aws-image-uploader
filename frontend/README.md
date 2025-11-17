# AWS Image Upload - Frontend

Beautiful React frontend for the AWS Serverless Image Upload system.

## Features

✅ Upload images with drag-and-drop interface
✅ File type validation (JPEG, PNG, GIF, WEBP)
✅ File size validation (5MB max)
✅ Real-time upload progress
✅ Image gallery with metadata
✅ Responsive design
✅ Error handling

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then open `.env` and replace the API URL with your actual API Gateway URL:

```env
VITE_API_BASE_URL=https://YOUR-ACTUAL-API-ID.execute-api.ap-south-1.amazonaws.com/prod
```

**To get your API URL:**
1. Go to AWS API Gateway console
2. Select "ImageUploadAPI"
3. Click "Stages" → "prod"
4. Copy the "Invoke URL"

### 3. Run Development Server

```bash
npm run dev
```

The app will open at: http://localhost:3000

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Usage

1. **Upload Image:**
   - Click "Choose Image File"
   - Select an image (max 5MB)
   - Click "Upload Image"
   - Wait for success message

2. **View Gallery:**
   - All uploaded images appear in the gallery
   - Click refresh to see latest uploads
   - Images show metadata (type, size, date)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Vanilla CSS** - Styling (no external libraries)
- **Fetch API** - HTTP requests

## Error Handling

The app handles:
- Invalid file types (shows error)
- File size exceeds limit (shows error)
- Network errors (shows error)
- API errors (shows error message from backend)
- Missing API URL (shows helpful message)

## API Integration

### POST /upload
- Sends: `{ fileName, fileType, fileSize }`
- Receives: `{ uploadUrl, fileUrl, imageId }`

### GET /images
- Receives: `{ images: [...], count: n }`

## Screenshots

*Add screenshots of your running app here for your portfolio!*

## Demo URL

After deployment: `[Your deployed URL here]`

---

**Project:** AWS Serverless Image Upload System  
**Author:** Rutvik Rana  
**Tech:** AWS Lambda, S3, DynamoDB, API Gateway, React, Vite
