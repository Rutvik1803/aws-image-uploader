# API Examples

This document contains example requests and responses for testing the Image Upload API.

## Endpoints

### 1. Upload Image (Generate Presigned URL)

**Endpoint:** `POST /upload`

**Request:**
```json
{
  "fileName": "profile.jpg",
  "fileType": "image/jpeg"
}
```

**Response:**
```json
{
  "uploadUrl": "https://your-bucket.s3.amazonaws.com/...",
  "fileUrl": "https://your-bucket.s3.amazonaws.com/profile.jpg",
  "imageId": "uuid-v4-here"
}
```

---

## Testing with Postman

### Step 1: Generate Presigned URL
1. Create a POST request
2. URL: `https://[your-api-id].execute-api.us-east-1.amazonaws.com/prod/upload`
3. Headers: `Content-Type: application/json`
4. Body: Raw JSON with fileName and fileType
5. Send request
6. Copy the `uploadUrl` from response

### Step 2: Upload File to S3
1. Create a PUT request
2. URL: [paste the uploadUrl from step 1]
3. Body: Binary → Select image file
4. Headers: `Content-Type: image/jpeg`
5. Send request
6. Verify 200 OK response

---

## Example Test Cases

1. **Valid Upload (Happy Path)**
   - fileName: "test.jpg"
   - fileType: "image/jpeg"
   - Expected: 200 OK with presigned URL

2. **Missing fileName**
   - fileType: "image/jpeg" only
   - Expected: 400 Bad Request

3. **Missing fileType**
   - fileName: "test.jpg" only
   - Expected: 400 Bad Request

4. **Invalid File Type**
   - fileType: "application/pdf"
   - Expected: 400 Bad Request (if validation implemented)

---

## Notes

- Presigned URLs expire in 5 minutes (configurable)
- Maximum file size: 5MB (configurable)
- Supported formats: JPEG, PNG, GIF, WebP
