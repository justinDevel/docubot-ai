const AWS = require('aws-sdk');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const s3 = new AWS.S3();
const bedrock = new BedrockRuntimeClient({ region: process.env.BEDROCK_REGION });
const BUCKET_NAME = process.env.DOCUMENTS_BUCKET;

exports.handler = async (event) => {
  try {
    console.log('Processing event:', JSON.stringify(event));

    for (const record of event.Records) {
      const bucketName = record.s3.bucket.name;
      const objectKey = record.s3.object.key;

      // Only process documents, not metadata
      if (objectKey.startsWith('metadata/')) continue;

      await processDocument(bucketName, objectKey);
    }

    return { statusCode: 200, body: 'Processing completed' };

  } catch (error) {
    console.error('Processing error:', error);
    throw error;
  }
};

async function processDocument(bucketName, objectKey) {
  try {
    console.log(`Processing document: ${objectKey}`);

    // Get document from S3
    const object = await s3.getObject({
      Bucket: bucketName,
      Key: objectKey
    }).promise();

    // Extract text based on file type
    const contentType = object.ContentType || '';
    let extractedText = '';

    if (contentType.includes('pdf')) {
      const pdfData = await pdfParse(object.Body);
      extractedText = pdfData.text;
    } else if (contentType.includes('document') || contentType.includes('docx')) {
      const docxResult = await mammoth.extractRawText({ buffer: object.Body });
      extractedText = docxResult.value;
    } else if (contentType.includes('text')) {
      extractedText = object.Body.toString('utf-8');
    } else {
      throw new Error(`Unsupported file type: ${contentType}`);
    }

    console.log(`Extracted text length: ${extractedText.length}`);

    // Generate insights using Bedrock
    const insights = await generateInsights(extractedText);

    // Get document ID from metadata
    const documentId = object.Metadata['document-id'];

    // Update metadata with processing results
    const metadataKey = `metadata/${documentId}.json`;
    const existingMetadata = await s3.getObject({
      Bucket: bucketName,
      Key: metadataKey
    }).promise();

    const metadata = JSON.parse(existingMetadata.Body.toString());
    metadata.status = 'processed';
    metadata.processedAt = new Date().toISOString();
    metadata.textLength = extractedText.length;
    metadata.insights = insights;

    // Store updated metadata
    await s3.putObject({
      Bucket: bucketName,
      Key: metadataKey,
      Body: JSON.stringify(metadata),
      ContentType: 'application/json'
    }).promise();

    // Store extracted text for chat functionality
    const textKey = `processed/${documentId}.txt`;
    await s3.putObject({
      Bucket: bucketName,
      Key: textKey,
      Body: extractedText,
      ContentType: 'text/plain'
    }).promise();

    console.log(`Document processed successfully: ${documentId}`);

  } catch (error) {
    console.error('Document processing error:', error);
    
    // Update metadata with error status
    try {
      const documentId = object.Metadata['document-id'];
      const metadataKey = `metadata/${documentId}.json`;
      const existingMetadata = await s3.getObject({
        Bucket: bucketName,
        Key: metadataKey
      }).promise();

      const metadata = JSON.parse(existingMetadata.Body.toString());
      metadata.status = 'error';
      metadata.error = error.message;
      metadata.errorAt = new Date().toISOString();

      await s3.putObject({
        Bucket: bucketName,
        Key: metadataKey,
        Body: JSON.stringify(metadata),
        ContentType: 'application/json'
      }).promise();
    } catch (metadataError) {
      console.error('Failed to update metadata with error:', metadataError);
    }

    throw error;
  }
}

async function generateInsights(text) {
  try {
    const prompt = `Analyze the following document and provide insights in JSON format:

Document Text:
${text.substring(0, 8000)}...

Please provide a JSON response with the following structure:
{
  "summary": "A brief 1-2 sentence summary of the document",
  "keyEntities": ["list", "of", "key", "entities", "or", "topics"],
  "sentiment": "positive/neutral/negative",
  "readingTime": "estimated reading time in minutes",
  "documentType": "type of document (manual, policy, contract, etc.)",
  "language": "detected language"
}

Respond only with valid JSON.`;

    const input = {
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    };

    const command = new InvokeModelCommand(input);
    const response = await bedrock.send(command);
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const insightsText = responseBody.content[0].text;
    
    // Parse the JSON response from Claude
    const insights = JSON.parse(insightsText);
    
    return insights;

  } catch (error) {
    console.error('Insights generation error:', error);
    
    // Return fallback insights
    return {
      summary: "Document analysis completed",
      keyEntities: ["document", "content"],
      sentiment: "neutral",
      readingTime: Math.ceil(text.length / 1000) + " minutes",
      documentType: "document",
      language: "en"
    };
  }
}