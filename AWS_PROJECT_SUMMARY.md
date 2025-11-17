# AWS Serverless Image Upload - Quick Reference

## 🎯 Project Overview
**Serverless image upload system** using AWS services with React frontend.
**Region:** ap-south-1 (Mumbai)

---

## 📋 AWS Services & Configuration

### 1. **S3 Bucket** (Storage)
- **Name:** `image-upload-rutvikrana-001`
- **Purpose:** Store uploaded images
- **Settings:** 
  - Versioning: Disabled
  - Encryption: Enabled (SSE-S3)
  - Public access: Blocked (initially), then allowed for demo
  - Bucket Policy: Allow public GetObject for image display

### 2. **DynamoDB Table** (Metadata Database)
- **Name:** `ImageMetadata`
- **Primary Key:** `imageId` (String)
- **Purpose:** Store image metadata (fileName, fileType, fileSize, uploadedAt, fileUrl)
- **Capacity:** On-demand billing

### 3. **IAM Role** (Permissions)
- **Name:** `ImageUploadLambdaRole`
- **Attached Policies:**
  - `AWSLambdaBasicExecutionRole` (CloudWatch Logs)
  - Custom inline policies:
    - **S3 Permissions:** `s3:PutObject`, `s3:GetObject` on bucket
    - **DynamoDB Permissions:** `dynamodb:PutItem`, `dynamodb:Scan` on table

### 4. **Lambda Functions** (Backend Logic)

#### **Function 1: ImageUploadHandler**
- **Runtime:** Node.js 18.x
- **Role:** ImageUploadLambdaRole
- **Purpose:** Generate presigned S3 URL & save metadata to DynamoDB
- **Key Features:**
  - Validates file type (jpeg, jpg, png, gif, webp)
  - Enforces 5MB size limit
  - Creates unique S3 key: `${imageId}-${fileName}`
  - Returns presigned URL (5-minute expiry)
- **Environment Variables:**
  - `BUCKET_NAME`: image-upload-rutvikrana-001
  - `TABLE_NAME`: ImageMetadata

#### **Function 2: ListImagesHandler**
- **Runtime:** Node.js 18.x
- **Role:** ImageUploadLambdaRole
- **Purpose:** Retrieve all images from DynamoDB
- **Returns:** JSON array of image objects with metadata

### 5. **API Gateway** (REST API)
- **Name:** `ImageUploadAPI`
- **Type:** REST API
- **Endpoints:**
  - `POST /upload` → ImageUploadHandler (get presigned URL)
  - `GET /images` → ListImagesHandler (fetch all images)
- **CORS:** Enabled for all origins
- **Stage:** `prod`
- **Deployment:** Manual deploy after configuration

### 6. **CloudWatch** (Monitoring)
- **Log Groups:** Auto-created for both Lambda functions
- **Alarms:**
  - ImageUploadHandler errors > 5 in 5 minutes
  - ListImagesHandler errors > 5 in 5 minutes
- **SNS Topic:** `ImageUploadAlerts` with email subscription

---

## 🔄 Data Flow

### **Upload Process:**
1. User selects image in React frontend
2. Frontend validates file (type + size)
3. Frontend calls `POST /upload` with file metadata
4. Lambda generates presigned S3 URL
5. Lambda saves metadata to DynamoDB
6. Frontend uploads file directly to S3 using presigned URL
7. Success message displayed

### **Display Process:**
1. Frontend calls `GET /images` on page load
2. Lambda scans DynamoDB table
3. Returns array of image objects with S3 URLs
4. Frontend displays images in gallery grid
5. Click image → Modal with full-size view

---

## 🔐 Security Features
- **IAM:** Least privilege access for Lambda
- **Presigned URLs:** Temporary upload access (5 minutes)
- **Validation:** File type whitelist + size limit
- **CORS:** Controlled cross-origin requests
- **Environment Variables:** Sensitive data stored in Lambda config

---

## 🎨 Frontend Stack
- **Framework:** React 18 + Vite
- **Features:** File upload, image gallery, modal viewer
- **API Integration:** Environment variable for API URL
- **Styling:** Responsive CSS with animations

---

## 📊 Key Enhancements
- Unique file naming to prevent overwrites
- Comprehensive error handling
- CloudWatch monitoring with email alerts
- Input validation (type, size, required fields)
- Responsive UI with modal lightbox

---

## 💡 Interview Talking Points
- **Serverless Architecture:** No server management, auto-scaling
- **Cost-Effective:** Pay only for requests/storage used
- **Secure:** IAM roles, presigned URLs, validation
- **Scalable:** Handles concurrent uploads via S3 direct upload
- **Observable:** CloudWatch logs and alarms for monitoring
- **Production-Ready:** Error handling, validation, user feedback
