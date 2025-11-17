import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const dynamoClient = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

export const handler = async (event) => {
  try {
    console.log('Fetching all images from DynamoDB');

    // Scan DynamoDB table to get all items
    const command = new ScanCommand({
      TableName: process.env.TABLE_NAME,
    });

    const response = await docClient.send(command);

    // Transform DynamoDB response to clean format
    const images = response.Items.map((item) => ({
      imageId: item.imageId.S,
      fileName: item.fileName.S,
      fileUrl: item.fileUrl.S,
      fileType: item.fileType.S,
      fileSize: item.fileSize ? item.fileSize.N : 0,
      uploadedAt: item.uploadedAt.S,
    }));

    // Sort by uploadedAt (newest first)
    images.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    console.log(`Successfully fetched ${images.length} images`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: images,
        count: images.length,
      }),
    };
  } catch (error) {
    console.error('Error fetching images:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to fetch images',
        message: error.message,
      }),
    };
  }
};
