import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';

// Initialize AWS clients
const s3Client = new S3Client({ region: process.env.REGION || 'ap-south-1' });
const dynamoClient = new DynamoDBClient({
  region: process.env.REGION || 'ap-south-1',
});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Define max file size
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const handler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  try {
    //Parse request body
    const body = JSON.parse(event.body || '{}');
    const { fileName, fileType, fileSize } = body;

    //Valid Input
    if (!fileName || !fileType) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Missing required fields: fileName and fileType',
        }),
      };
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (!allowedTypes.includes(fileType.toLowerCase())) {
      console.log('Invalid file type:', fileType);
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error:
            'Invalid file type. Only image files are allowed (jpeg, jpg, png, gif, webp)',
        }),
      };
    }

    // File size validation
    if (fileSize && fileSize > MAX_FILE_SIZE) {
      console.log('File size exceeds the limit:', fileSize);
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'File size exceeds the limit (5MB)',
        }),
      };
    }

    // Generate unique Image ID
    const imageId = crypto.randomUUID();

    // Get bucket name from environment variable
    const bucketName = process.env.BUCKET_NAME;

    if (!bucketName) {
      throw new Error('Bucket name not found in environment variables');
    }

    // Create S3 key (file path in bucket)
    const s3Key = `${imageId}-${fileName}`;

    // Generate presigned URL for upload (expires in 5 minutes)
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

    // Construct the public file URL
    const fileUrl = `https://${bucketName}.s3.${
      process.env.REGION || 'ap-south-1'
    }.amazonaws.com/${s3Key}`;

    // Store metadata in DynamoDB
    const timeStamp = new Date().toISOString();

    await docClient.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          imageId: imageId,
          fileName: fileName,
          fileUrl: fileUrl,
          fileType: fileType,
          fileSize: fileSize,
          uploadedAt: timeStamp,
          s3Key: s3Key,
        },
      })
    );

    console.log('Successfully created presigned URL and stored metadata');

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        uploadUrl: uploadUrl,
        fileUrl: fileUrl,
        imageId: imageId,
        message: 'Upload URL generated successfully',
      }),
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
      }),
    };
  }
};
