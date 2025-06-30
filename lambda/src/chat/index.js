const AWS = require('aws-sdk');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const s3 = new AWS.S3();
const bedrock = new BedrockRuntimeClient({ region: process.env.BEDROCK_REGION });
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
    const { documentId, message, sessionId } = JSON.parse(event.body);
    
    if (!documentId || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields: documentId, message'
        })
      };
    }

    // Get document content
    const documentText = await getDocumentText(documentId);
    
    // Get document metadata for context
    const metadata = await getDocumentMetadata(documentId);
    
    // Generate response using Bedrock
    const response = await generateChatResponse(documentText, message, metadata);
    
    // Store chat history (optional)
    await storeChatMessage(documentId, sessionId, message, response);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        content: response,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Chat error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'Failed to generate response'
      })
    };
  }
};

async function getDocumentText(documentId) {
  try {
    const textKey = `processed/${documentId}.txt`;
    const object = await s3.getObject({
      Bucket: BUCKET_NAME,
      Key: textKey
    }).promise();
    
    return object.Body.toString('utf-8');
  } catch (error) {
    throw new Error(`Document not found or not processed: ${documentId}`);
  }
}

async function getDocumentMetadata(documentId) {
  try {
    const metadataKey = `metadata/${documentId}.json`;
    const object = await s3.getObject({
      Bucket: BUCKET_NAME,
      Key: metadataKey
    }).promise();
    
    return JSON.parse(object.Body.toString());
  } catch (error) {
    return null;
  }
}

async function generateChatResponse(documentText, userMessage, metadata) {
  try {
    const contextInfo = metadata ? `
Document: ${metadata.fileName}
Type: ${metadata.insights?.documentType || 'document'}
Summary: ${metadata.insights?.summary || 'No summary available'}
` : '';

    const prompt = `You are a helpful AI assistant that answers questions about documents. You have access to the full content of a document and should provide accurate, helpful answers based on that content.

${contextInfo}

Document Content:
${documentText.substring(0, 10000)}...

User Question: ${userMessage}

Instructions:
- Answer based solely on the document content provided
- Be specific and cite relevant sections when possible
- If the information isn't in the document, say so clearly
- Keep answers concise but comprehensive
- Use a helpful, professional tone

Answer:`;

    const input = {
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 2000,
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
    return responseBody.content[0].text;

  } catch (error) {
    console.error('Response generation error:', error);
    throw new Error('Failed to generate response');
  }
}

async function storeChatMessage(documentId, sessionId, userMessage, botResponse) {
  try {
    if (!sessionId) return;

    const chatKey = `chats/${documentId}/${sessionId}.json`;
    
    // Try to get existing chat history
    let chatHistory = [];
    try {
      const existingChat = await s3.getObject({
        Bucket: BUCKET_NAME,
        Key: chatKey
      }).promise();
      chatHistory = JSON.parse(existingChat.Body.toString());
    } catch (error) {
      // File doesn't exist, start with empty history
    }

    // Add new messages
    const timestamp = new Date().toISOString();
    chatHistory.push(
      {
        type: 'user',
        content: userMessage,
        timestamp
      },
      {
        type: 'bot',
        content: botResponse,
        timestamp
      }
    );

    // Store updated chat history
    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: chatKey,
      Body: JSON.stringify(chatHistory),
      ContentType: 'application/json'
    }).promise();

  } catch (error) {
    console.error('Failed to store chat message:', error);
    // Don't fail the request if chat storage fails
  }
}