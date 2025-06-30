const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.DOCUMENTS_BUCKET;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const documentId = event.pathParameters?.documentId;
    
    if (!documentId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing documentId parameter'
        })
      };
    }

    // Get document metadata
    const metadataKey = `metadata/${documentId}.json`;
    
    try {
      const object = await s3.getObject({
        Bucket: BUCKET_NAME,
        Key: metadataKey
      }).promise();
      
      const metadata = JSON.parse(object.Body.toString());
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          document: metadata
        })
      };
      
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            error: 'Document not found',
            documentId
          })
        };
      }
      throw error;
    }

  } catch (error) {
    console.error('Document info error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};