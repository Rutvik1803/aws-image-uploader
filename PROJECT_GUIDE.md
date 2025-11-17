# 📸 AWS Serverless Image Upload & Storage System

## 🎯 Project Overview

Welcome to your first AWS hands-on project! This project will teach you how to build a production-ready serverless image upload system using AWS services. By the end, you'll have practical experience with the core AWS services that are frequently discussed in interviews.

### What You'll Build
A complete serverless application where users can upload images through an API, store them securely in S3, and track metadata in DynamoDB - all without managing any servers!

### Real-World Use Case
Think of this as the backend for:
- Profile picture uploads (LinkedIn, Twitter)
- Product image uploads (E-commerce)
- Document management systems
- Any application that needs secure file storage

---

## 🏗️ Architecture Diagram

```
┌─────────────────┐
│  User/Postman   │
│   (Frontend)    │
└────────┬────────┘
         │ 1. POST /upload (fileName, fileType)
         ▼
┌─────────────────┐
│  API Gateway    │  ← Public HTTP Endpoint
└────────┬────────┘
         │ 2. Trigger Lambda
         ▼
┌─────────────────┐
│  Lambda Function│
│    (Node.js)    │
└────┬────────┬───┘
     │        │
     │        │ 3. Generate Presigned URL
     │        ▼
     │   ┌─────────┐
     │   │   S3    │  ← Image Storage
     │   └─────────┘
     │
     │ 4. Store Metadata
     ▼
┌─────────────────┐
│   DynamoDB      │  ← Metadata Database
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  CloudWatch     │  ← Logs & Monitoring
└─────────────────┘
```

---

## 📚 What You'll Learn

### AWS Services (Hands-on)
- ✅ **S3** - Object storage and file management
- ✅ **Lambda** - Serverless compute functions
- ✅ **API Gateway** - RESTful API creation
- ✅ **DynamoDB** - NoSQL database operations
- ✅ **IAM** - Security and permissions management
- ✅ **CloudWatch** - Logging and monitoring

### Technical Skills
- ✅ Writing Lambda functions in Node.js
- ✅ Working with AWS SDK
- ✅ Understanding event-driven architecture
- ✅ API design and testing
- ✅ Security best practices (IAM policies)
- ✅ Debugging cloud applications

### Interview Topics Covered
- Serverless architecture patterns
- AWS service integration
- Security and IAM roles
- Scalability and cost optimization
- Monitoring and troubleshooting

---

## 💰 Cost Estimate (Free Tier)

All services used in this project are covered under AWS Free Tier:

| Service | Free Tier | Our Usage |
|---------|-----------|-----------|
| Lambda | 1M requests/month | ~100 requests ✅ |
| S3 | 5GB storage, 20K GET, 2K PUT | ~10MB, <100 requests ✅ |
| DynamoDB | 25GB storage, 25 RCU/WCU | <1MB, <10 operations ✅ |
| API Gateway | 1M requests/month | ~100 requests ✅ |
| CloudWatch | 5GB logs | <100MB ✅ |

**Expected Cost: $0.00** (if you stay within Free Tier limits)

---

## 🗺️ Project Tasks (Jira-Style Stories)

### **EPIC 1: Environment Setup & AWS Account Configuration**

#### ✅ **Task 1.1: AWS Account Setup**
**Story Points:** 1  
**Priority:** P0 (Blocker)

**Description:**  
Set up your AWS account and configure security basics.

**Acceptance Criteria:**
- [ ] AWS account created and verified
- [ ] Root account MFA enabled
- [ ] IAM user created with admin access
- [ ] Access keys generated (for CLI if needed)
- [ ] Billing alerts configured (to stay in free tier)

**Steps:**
1. Sign up at aws.amazon.com
2. Verify email and add payment method
3. Enable MFA on root account
4. Create IAM user with AdministratorAccess
5. Set up billing alert for $1

**Resources:**
- AWS Free Tier: https://aws.amazon.com/free/
- IAM Best Practices: AWS Documentation

---

#### ✅ **Task 1.2: Install AWS CLI (Optional but Recommended)**
**Story Points:** 1  
**Priority:** P2 (Nice to have)

**Description:**  
Install AWS CLI for easier interaction with AWS services from your terminal.

**Acceptance Criteria:**
- [ ] AWS CLI installed on local machine
- [ ] CLI configured with IAM credentials
- [ ] Test command successful (`aws s3 ls`)

**Steps:**
1. Install AWS CLI v2
2. Run `aws configure`
3. Enter Access Key ID and Secret
4. Set default region (us-east-1)

---

#### ✅ **Task 1.3: Create Project Folder Structure**
**Story Points:** 0.5  
**Priority:** P1

**Description:**  
Set up local project folder with proper structure.

**Acceptance Criteria:**
- [ ] Project folder created
- [ ] Lambda code folder created
- [ ] README initialized

**Folder Structure:**
```
aws-image-upload/
├── lambda/
│   ├── index.js          (Lambda function code)
│   ├── package.json      (Dependencies)
│   └── .env.example      (Environment variables template)
├── docs/
│   └── api-examples.md   (API testing examples)
├── screenshots/          (For documentation)
└── README.md
```

---

### **EPIC 2: S3 Bucket Creation & Configuration**

#### ✅ **Task 2.1: Create S3 Bucket**
**Story Points:** 2  
**Priority:** P0 (Blocker)

**Description:**  
Create an S3 bucket to store uploaded images with proper security settings.

**Acceptance Criteria:**
- [ ] S3 bucket created with unique name
- [ ] Bucket versioning enabled (optional)
- [ ] Block public access configured correctly
- [ ] Bucket policy created for Lambda access

**Steps:**
1. Go to S3 console
2. Click "Create bucket"
3. Name: `image-upload-[your-name]-[random]` (must be globally unique)
4. Region: ap-south-1
5. Block all public access: ✅ CHECKED (keep private)
6. Enable bucket versioning: Optional
7. Create bucket

**Security Note:**  
We'll use presigned URLs, so the bucket should remain private!

---

#### ✅ **Task 2.2: Configure CORS for S3**
**Story Points:** 1  
**Priority:** P1

**Description:**  
Configure Cross-Origin Resource Sharing (CORS) to allow frontend uploads.

**Acceptance Criteria:**
- [ ] CORS policy added to S3 bucket
- [ ] Policy allows PUT requests from any origin (for testing)

**CORS Configuration:**
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"],
        "MaxAgeSeconds": 3000
    }
]
```

**Steps:**
1. Open your S3 bucket
2. Go to "Permissions" tab
3. Scroll to "CORS configuration"
4. Paste the JSON above
5. Save changes

---

### **EPIC 3: DynamoDB Table Creation**

#### ✅ **Task 3.1: Create DynamoDB Table**
**Story Points:** 2  
**Priority:** P0 (Blocker)

**Description:**  
Create a DynamoDB table to store image metadata.

**Acceptance Criteria:**
- [ ] DynamoDB table created
- [ ] Table has proper partition key
- [ ] On-demand billing mode selected (free tier friendly)
- [ ] Table is accessible from Lambda

**Table Schema:**
- **Table Name:** `ImageMetadata`
- **Partition Key:** `imageId` (String)
- **Attributes:** (created dynamically)
  - fileName (String)
  - fileUrl (String)
  - fileSize (Number)
  - fileType (String)
  - uploadedAt (String - ISO timestamp)

**Steps:**
1. Go to DynamoDB console
2. Click "Create table"
3. Table name: `ImageMetadata`
4. Partition key: `imageId` (String)
5. Table settings: Default settings (on-demand)
6. Create table

**Cost Optimization:**  
Use on-demand billing mode to stay in free tier!

---

### **EPIC 4: IAM Role & Permissions**

#### ✅ **Task 4.1: Create Lambda Execution Role**
**Story Points:** 2  
**Priority:** P0 (Blocker)

**Description:**  
Create an IAM role that gives Lambda permission to access S3, DynamoDB, and CloudWatch.

**Acceptance Criteria:**
- [ ] IAM role created for Lambda
- [ ] Role has trust relationship with Lambda service
- [ ] Policies attached: S3, DynamoDB, CloudWatch Logs
- [ ] Role ARN saved for Lambda creation

**Required Permissions:**
1. **S3 Access:**
   - `s3:PutObject`
   - `s3:GetObject`
   - `s3:PutObjectAcl`

2. **DynamoDB Access:**
   - `dynamodb:PutItem`
   - `dynamodb:GetItem`
   - `dynamodb:Query`

3. **CloudWatch Logs:**
   - `logs:CreateLogGroup`
   - `logs:CreateLogStream`
   - `logs:PutLogEvents`

**Steps:**
1. Go to IAM console
2. Click "Roles" → "Create role"
3. Select "Lambda" as trusted entity
4. Attach policies:
   - Create custom policy (see below)
   - Or use AWS managed: `AWSLambdaBasicExecutionRole` + custom inline policy
5. Name: `ImageUploadLambdaRole`
6. Create role
7. Copy Role ARN

**Custom Policy JSON:**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Query"
            ],
            "Resource": "arn:aws:dynamodb:us-east-1:*:table/ImageMetadata"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
```

**Interview Tip:**  
Understand principle of least privilege - only grant what's needed!

---

### **EPIC 5: Lambda Function Development**

#### ✅ **Task 5.1: Write Lambda Function - Initial Setup**
**Story Points:** 3  
**Priority:** P0 (Blocker)

**Description:**  
Create the Lambda function that generates presigned URLs and stores metadata.

**Acceptance Criteria:**
- [ ] Lambda function created in AWS console
- [ ] Runtime: Node.js 18.x
- [ ] Execution role attached
- [ ] Environment variables configured
- [ ] Basic code deployed

**Environment Variables:**
- `BUCKET_NAME`: Your S3 bucket name
- `TABLE_NAME`: `ImageMetadata`
- `REGION`: `us-east-1`

**Initial Steps:**
1. Go to Lambda console
2. Click "Create function"
3. Choose "Author from scratch"
4. Function name: `ImageUploadHandler`
5. Runtime: Node.js 18.x
6. Execution role: Use existing → Select `ImageUploadLambdaRole`
7. Create function

---

#### ✅ **Task 5.2: Implement Presigned URL Generation**
**Story Points:** 5  
**Priority:** P0 (Blocker)

**Description:**  
Write the core Lambda logic to generate S3 presigned URLs.

**Acceptance Criteria:**
- [ ] Lambda generates presigned URL for S3 upload
- [ ] URL expires in 5 minutes
- [ ] Function handles errors gracefully
- [ ] Code follows AWS SDK v3 best practices

**Lambda Code Structure:**
```javascript
// index.js
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require('uuid');

// TODO: Implement handler function
// TODO: Generate presigned URL
// TODO: Store metadata in DynamoDB
```

**We'll write this code together step-by-step!**

---

#### ✅ **Task 5.3: Implement DynamoDB Metadata Storage**
**Story Points:** 3  
**Priority:** P0 (Blocker)

**Description:**  
Add functionality to store image metadata in DynamoDB after URL generation.

**Acceptance Criteria:**
- [ ] Metadata stored in DynamoDB on successful upload
- [ ] Unique imageId generated (UUID)
- [ ] Timestamp in ISO format
- [ ] Error handling for DB failures

**Metadata Schema:**
```javascript
{
  imageId: "uuid-v4",
  fileName: "profile.jpg",
  fileUrl: "https://bucket.s3.amazonaws.com/...",
  fileSize: 2048576, // bytes
  fileType: "image/jpeg",
  uploadedAt: "2025-11-04T10:30:00.000Z"
}
```

---

#### ✅ **Task 5.4: Add Error Handling & Logging**
**Story Points:** 2  
**Priority:** P1

**Description:**  
Implement comprehensive error handling and CloudWatch logging.

**Acceptance Criteria:**
- [ ] All errors logged to CloudWatch
- [ ] Proper HTTP status codes returned
- [ ] Validation for input parameters
- [ ] Graceful error messages

**Error Scenarios to Handle:**
- Missing fileName or fileType
- S3 presigned URL generation failure
- DynamoDB write failure
- Invalid file type (optional validation)

---

### **EPIC 6: API Gateway Configuration**

#### ✅ **Task 6.1: Create REST API**
**Story Points:** 3  
**Priority:** P0 (Blocker)

**Description:**  
Create API Gateway endpoint to trigger Lambda function.

**Acceptance Criteria:**
- [ ] REST API created in API Gateway
- [ ] POST method configured for `/upload`
- [ ] Lambda integration set up
- [ ] CORS enabled
- [ ] API deployed to stage

**Steps:**
1. Go to API Gateway console
2. Create "REST API" (not HTTP API)
3. API name: `ImageUploadAPI`
4. Create API
5. Create resource: `/upload`
6. Create method: `POST`
7. Integration type: Lambda Function
8. Select `ImageUploadHandler`
9. Enable Lambda Proxy Integration ✅
10. Save

---

#### ✅ **Task 6.2: Enable CORS on API Gateway**
**Story Points:** 1  
**Priority:** P1

**Description:**  
Configure CORS to allow frontend applications to call the API.

**Acceptance Criteria:**
- [ ] CORS enabled on `/upload` resource
- [ ] OPTIONS method created automatically
- [ ] Headers configured properly

**Steps:**
1. Select `/upload` resource
2. Click "Actions" → "Enable CORS"
3. Leave defaults (or customize)
4. Enable CORS

---

#### ✅ **Task 6.3: Deploy API**
**Story Points:** 1  
**Priority:** P0 (Blocker)

**Description:**  
Deploy API to a stage and get invoke URL.

**Acceptance Criteria:**
- [ ] API deployed to `prod` stage
- [ ] Invoke URL obtained and tested
- [ ] URL documented

**Steps:**
1. Click "Actions" → "Deploy API"
2. Stage: New Stage → `prod`
3. Deploy
4. Copy invoke URL (looks like: `https://abc123.execute-api.us-east-1.amazonaws.com/prod`)

**Your API Endpoint:**
```
POST https://[your-api-id].execute-api.us-east-1.amazonaws.com/prod/upload
```

---

### **EPIC 7: Testing & Validation**

#### ✅ **Task 7.1: Test with Postman - Presigned URL Generation**
**Story Points:** 2  
**Priority:** P0 (Blocker)

**Description:**  
Test the API endpoint using Postman to generate presigned URLs.

**Acceptance Criteria:**
- [ ] Postman request created
- [ ] Presigned URL received successfully
- [ ] Response includes uploadUrl and fileUrl
- [ ] Request/response documented

**Postman Request:**
```
POST https://[your-api].execute-api.us-east-1.amazonaws.com/prod/upload

Headers:
Content-Type: application/json

Body (JSON):
{
  "fileName": "test-image.jpg",
  "fileType": "image/jpeg"
}

Expected Response:
{
  "uploadUrl": "https://bucket.s3.amazonaws.com/...",
  "fileUrl": "https://bucket.s3.amazonaws.com/test-image.jpg",
  "imageId": "uuid-here"
}
```

---

#### ✅ **Task 7.2: Test with Postman - File Upload to S3**
**Story Points:** 2  
**Priority:** P0 (Blocker)

**Description:**  
Use the presigned URL to upload an actual image file to S3.

**Acceptance Criteria:**
- [ ] File uploaded to S3 using presigned URL
- [ ] File visible in S3 console
- [ ] Upload completes with 200 status

**Steps:**
1. Get presigned URL from previous test
2. Create new Postman request:
   - Method: PUT
   - URL: [presigned URL from step 1]
   - Body: Binary → Select image file
   - Headers: Content-Type: image/jpeg
3. Send request
4. Check S3 console for uploaded file

---

#### ✅ **Task 7.3: Verify DynamoDB Entry**
**Story Points:** 1  
**Priority:** P1

**Description:**  
Confirm metadata is stored correctly in DynamoDB.

**Acceptance Criteria:**
- [ ] Item exists in DynamoDB table
- [ ] All attributes populated correctly
- [ ] Timestamp is accurate

**Steps:**
1. Go to DynamoDB console
2. Open `ImageMetadata` table
3. Click "Explore table items"
4. Verify your uploaded image metadata

---

#### ✅ **Task 7.4: End-to-End Testing**
**Story Points:** 2  
**Priority:** P1

**Description:**  
Perform complete workflow test from API call to file verification.

**Acceptance Criteria:**
- [ ] Full upload flow works without errors
- [ ] Multiple files can be uploaded
- [ ] Different file types work (jpg, png, gif)
- [ ] Error cases handled properly

**Test Cases:**
1. ✅ Valid upload (happy path)
2. ✅ Missing fileName parameter
3. ✅ Missing fileType parameter
4. ✅ Large file (5MB)
5. ✅ Special characters in filename

---

### **EPIC 8: Monitoring & CloudWatch**

#### ✅ **Task 8.1: View Lambda Execution Logs**
**Story Points:** 1  
**Priority:** P1

**Description:**  
Learn to view and analyze Lambda logs in CloudWatch.

**Acceptance Criteria:**
- [ ] CloudWatch Logs accessed
- [ ] Lambda log group located
- [ ] Recent executions visible
- [ ] Can search logs for errors

**Steps:**
1. Go to CloudWatch console
2. Click "Logs" → "Log groups"
3. Find `/aws/lambda/ImageUploadHandler`
4. Click on latest log stream
5. Review execution logs

---

#### ✅ **Task 8.2: Set Up CloudWatch Alarms (Optional)**
**Story Points:** 2  
**Priority:** P2

**Description:**  
Create CloudWatch alarms for error monitoring.

**Acceptance Criteria:**
- [ ] Alarm created for Lambda errors
- [ ] SNS topic configured
- [ ] Email notification set up

**Metrics to Monitor:**
- Lambda invocation errors
- Lambda throttles
- API Gateway 4XX/5XX errors

---

### **EPIC 9: Optimization & Best Practices**

#### ✅ **Task 9.1: Implement File Type Validation**
**Story Points:** 2  
**Priority:** P2

**Description:**  
Add validation to only allow image file uploads.

**Acceptance Criteria:**
- [ ] Only image types allowed (jpeg, jpg, png, gif, webp)
- [ ] Proper error message for invalid types
- [ ] Validation happens before presigned URL generation

**Allowed MIME Types:**
- image/jpeg
- image/png
- image/gif
- image/webp

---

#### ✅ **Task 9.2: Add File Size Limits**
**Story Points:** 1  
**Priority:** P2

**Description:**  
Limit maximum file size to prevent abuse.

**Acceptance Criteria:**
- [ ] Max file size: 5MB
- [ ] Validation in Lambda
- [ ] Clear error message

---

#### ✅ **Task 9.3: Implement Listing Endpoint (GET)**
**Story Points:** 3  
**Priority:** P3

**Description:**  
Create additional endpoint to list all uploaded images.

**Acceptance Criteria:**
- [ ] New Lambda function created
- [ ] GET /images endpoint created
- [ ] Returns all images from DynamoDB
- [ ] Results paginated (optional)

**Response Format:**
```json
{
  "images": [
    {
      "imageId": "uuid1",
      "fileName": "image1.jpg",
      "fileUrl": "https://...",
      "uploadedAt": "2025-11-04T..."
    }
  ],
  "count": 1
}
```

---

### **EPIC 10: Documentation & Cleanup**

#### ✅ **Task 10.1: Create API Documentation**
**Story Points:** 2  
**Priority:** P1

**Description:**  
Document all API endpoints with examples.

**Acceptance Criteria:**
- [ ] README.md updated
- [ ] API endpoints documented
- [ ] Example requests/responses included
- [ ] Architecture diagram added

---

#### ✅ **Task 10.2: Create Cleanup Script**
**Story Points:** 1  
**Priority:** P2

**Description:**  
Document steps to delete all AWS resources (to avoid future charges).

**Acceptance Criteria:**
- [ ] Cleanup checklist created
- [ ] Order of deletion documented
- [ ] Warnings about data loss included

**Cleanup Order:**
1. Delete API Gateway API
2. Delete Lambda function
3. Empty S3 bucket, then delete bucket
4. Delete DynamoDB table
5. Delete IAM role
6. Delete CloudWatch log groups

---

#### ✅ **Task 10.3: Take Screenshots & Demo**
**Story Points:** 1  
**Priority:** P3

**Description:**  
Document the working project with screenshots for portfolio/resume.

**Acceptance Criteria:**
- [ ] Screenshots of AWS console
- [ ] Postman requests/responses
- [ ] Architecture diagram
- [ ] Working demo video (optional)

---

## 📖 Learning Path & Timeline

### Week 1: Foundation (Tasks 1.x - 4.x)
**Focus:** AWS Console, IAM, S3, DynamoDB  
**Time:** 3-4 hours  
**Output:** All AWS resources created

### Week 2: Development (Tasks 5.x - 6.x)
**Focus:** Lambda coding, API Gateway  
**Time:** 5-6 hours  
**Output:** Working API endpoint

### Week 3: Testing & Polish (Tasks 7.x - 10.x)
**Focus:** Testing, monitoring, documentation  
**Time:** 3-4 hours  
**Output:** Production-ready, documented project

**Total Time:** 11-14 hours spread over 3 weeks

---

## 🎓 Interview Preparation Tips

### Key Talking Points for Interviews

1. **Architecture Decision:**
   - "I chose serverless architecture to eliminate server management and reduce costs"
   - "Used presigned URLs for secure, direct-to-S3 uploads"

2. **Security:**
   - "Implemented least-privilege IAM policies"
   - "Kept S3 bucket private, used presigned URLs for access"
   - "Enabled CORS properly to prevent unauthorized access"

3. **Scalability:**
   - "Lambda auto-scales based on requests"
   - "DynamoDB on-demand billing handles traffic spikes"
   - "No server capacity planning needed"

4. **Monitoring:**
   - "CloudWatch Logs for debugging"
   - "CloudWatch Metrics for performance tracking"
   - "Set up alarms for error rates"

5. **Cost Optimization:**
   - "Entire project runs on free tier"
   - "Presigned URLs reduce Lambda execution time"
   - "DynamoDB on-demand mode prevents over-provisioning"

---

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| "Access Denied" from S3 | IAM policy missing | Check Lambda execution role has S3 permissions |
| "AccessDenied" from DynamoDB | IAM policy missing | Add DynamoDB permissions to Lambda role |
| CORS error in browser | CORS not configured | Enable CORS on API Gateway and S3 |
| Lambda timeout | Code takes too long | Increase Lambda timeout (default 3s → 10s) |
| Presigned URL expired | URL lifetime too short | Increase expiry time in code |
| 502 Bad Gateway | Lambda error | Check CloudWatch logs for error details |

---

## 📚 Additional Resources

### AWS Documentation
- [S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html)
- [Lambda Node.js Guide](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html)
- [DynamoDB SDK Examples](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/dynamodb-examples.html)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [AWS CLI](https://aws.amazon.com/cli/) - Command line interface
- [VS Code AWS Toolkit](https://aws.amazon.com/visualstudiocode/) - IDE integration

---

## 🎯 Success Criteria

Your project is complete when:

✅ You can upload an image via API  
✅ Image appears in S3 bucket  
✅ Metadata appears in DynamoDB  
✅ CloudWatch shows execution logs  
✅ You can explain the architecture  
✅ All code is documented  
✅ You've tested error scenarios  

---

## 🚀 What's Next?

After completing this project, you can:

1. **Add Frontend:** Build React UI for uploads
2. **Add Image Processing:** Use Lambda to create thumbnails
3. **Add Authentication:** Integrate AWS Cognito
4. **Add CDN:** Use CloudFront for faster image delivery
5. **Project 2:** Build another AWS project (maybe a REST API with RDS?)

---

## 📝 Notes Section

Use this space to track your progress:

**Start Date:** ___________  
**End Date:** ___________

**Resources Created:**
- [ ] S3 Bucket: ___________
- [ ] DynamoDB Table: ImageMetadata
- [ ] Lambda Function: ImageUploadHandler
- [ ] IAM Role: ImageUploadLambdaRole
- [ ] API Gateway: ___________

**API Endpoint:**
```
https://[your-api-id].execute-api.us-east-1.amazonaws.com/prod/upload
```

**Challenges Faced:**
1. ___________
2. ___________

**Key Learnings:**
1. ___________
2. ___________

---

## 🙋‍♂️ Ready to Start?

Let's begin with **Task 1.1: AWS Account Setup**!

When you're ready, just let me know and we'll tackle each task step by step. Remember:
- Don't rush - understand each concept
- Test after each task
- Ask questions if anything is unclear
- Document your learnings

**Let's build something awesome! 🚀**
