# AWS Serverless Image Upload System

A serverless image upload application built with AWS Lambda, S3, DynamoDB, and API Gateway.

## 🎯 Project Overview

This project demonstrates a production-ready serverless architecture for handling image uploads securely using AWS services. Users can upload images through an API, which are stored in S3, with metadata tracked in DynamoDB.

## 🏗️ Architecture

```
User/Postman → API Gateway → Lambda → S3 (Image Storage)
                              ↓
                          DynamoDB (Metadata)
                              ↓
                          CloudWatch (Logs)
```

## 🛠️ Technologies Used

- **AWS Lambda** - Serverless compute (Node.js 18.x)
- **Amazon S3** - Object storage for images
- **DynamoDB** - NoSQL database for metadata
- **API Gateway** - REST API endpoint
- **CloudWatch** - Logging and monitoring
- **IAM** - Security and permissions

## 📋 Prerequisites

- AWS Account (Free Tier eligible)
- Postman (for API testing)
- Basic knowledge of JavaScript/Node.js
- AWS CLI (optional)

## 🚀 Setup Instructions

### 1. AWS Resources Setup

1. **Create S3 Bucket**
   - Name: `image-upload-[your-name]-[random]`
   - Region: `us-east-1`
   - Block public access: ✅ Enabled
   - Enable CORS configuration

2. **Create DynamoDB Table**
   - Table name: `ImageMetadata`
   - Partition key: `imageId` (String)
   - Billing mode: On-demand

3. **Create IAM Role**
   - Name: `ImageUploadLambdaRole`
   - Attach policies for S3, DynamoDB, CloudWatch Logs

4. **Create Lambda Function**
   - Name: `ImageUploadHandler`
   - Runtime: Node.js 18.x
   - Role: `ImageUploadLambdaRole`
   - Upload code from `lambda/` folder

5. **Create API Gateway**
   - Type: REST API
   - Name: `ImageUploadAPI`
   - Create `/upload` POST endpoint
   - Enable CORS
   - Deploy to `prod` stage

### 2. Local Development

```bash
cd lambda
npm install
```

### 3. Environment Variables

Configure in Lambda Console:
- `BUCKET_NAME`: Your S3 bucket name
- `TABLE_NAME`: `ImageMetadata`
- `REGION`: `us-east-1`

## 📡 API Documentation

### Upload Image

**Endpoint:** `POST /upload`

**Request Body:**
```json
{
  "fileName": "profile.jpg",
  "fileType": "image/jpeg"
}
```

**Response:**
```json
{
  "uploadUrl": "https://bucket.s3.amazonaws.com/presigned-url",
  "fileUrl": "https://bucket.s3.amazonaws.com/profile.jpg",
  "imageId": "uuid-v4"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request (missing parameters)
- `500` - Internal Server Error

## 🧪 Testing

See `docs/api-examples.md` for detailed testing instructions with Postman.

### Quick Test
1. Call POST `/upload` with fileName and fileType
2. Get presigned URL in response
3. Upload file to S3 using presigned URL
4. Verify file in S3 console
5. Check metadata in DynamoDB

## 📊 Monitoring

View logs in CloudWatch:
- Log group: `/aws/lambda/ImageUploadHandler`
- Monitor invocations, errors, and duration

## 💰 Cost

This project runs entirely on AWS Free Tier:
- Lambda: 1M requests/month
- S3: 5GB storage
- DynamoDB: 25GB storage
- API Gateway: 1M requests/month

**Expected cost: $0.00** (within free tier limits)

## 🔒 Security

- S3 bucket is private (no public access)
- Presigned URLs for secure uploads (5-minute expiry)
- IAM roles follow least-privilege principle
- CORS configured for specific origins

## 📚 Resources Created

- [ ] S3 Bucket: `_______________`
- [ ] DynamoDB Table: `ImageMetadata`
- [ ] Lambda Function: `ImageUploadHandler`
- [ ] IAM Role: `ImageUploadLambdaRole`
- [ ] API Gateway: `_______________`

**API Endpoint:**
```
https://[your-api-id].execute-api.us-east-1.amazonaws.com/prod/upload
```

## 🧹 Cleanup

To avoid future charges (after free tier expires):

1. Delete API Gateway API
2. Delete Lambda function
3. Empty and delete S3 bucket
4. Delete DynamoDB table
5. Delete IAM role
6. Delete CloudWatch log groups

## 📖 What I Learned

- Serverless architecture patterns
- AWS service integration
- IAM policies and security
- Presigned URLs for secure uploads
- NoSQL database design with DynamoDB
- API Gateway configuration
- CloudWatch monitoring and debugging

## 🎯 Future Enhancements

- [ ] Add file type validation
- [ ] Implement file size limits
- [ ] Add image thumbnail generation
- [ ] Create GET endpoint to list images
- [ ] Add authentication (AWS Cognito)
- [ ] Add React frontend
- [ ] Implement CloudFront CDN

## 📝 Notes

**Start Date:** `___________`  
**Completion Date:** `___________`

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

Feel free to fork and improve this project!

---

Built with ☁️ AWS Serverless Services
