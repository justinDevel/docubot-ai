const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.DOCUMENTS_BUCKET;

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
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
    const { fileName, fileType, content } = JSON.parse(event.body);
    
    if (!fileName || !fileType || !content) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields: fileName, fileType, content'
        })
      };
    }

    // Generate unique document ID
    const documentId = uuidv4();
    const key = `documents/${documentId}/${fileName}`;

    // Convert base64 content to buffer
    const buffer = Buffer.from(content, 'base64');

    // Upload to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: fileType,
      Metadata: {
        'original-name': fileName,
        'document-id': documentId,
        'uploaded-at': new Date().toISOString()
      }
    };

    await s3.upload(uploadParams).promise();

    // Create document metadata
    const metadata = {
      documentId,
      fileName,
      fileType,
      size: buffer.length,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
      s3Key: key
    };

    // Store metadata
    const metadataKey = `metadata/${documentId}.json`;
    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: metadataKey,
      Body: JSON.stringify(metadata),
      ContentType: 'application/json'
    }).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        documentId,
        message: 'Document uploaded successfully'
      })
    };

  } catch (error) {
    console.error('Upload error:', error);
    
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