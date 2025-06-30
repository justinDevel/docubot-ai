import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// AWS Configuration
const AWS_REGION = import.meta.env.VITE_AWS_REGION;
const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const S3_BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME;

// Initialize AWS clients
export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export const bedrockClient = new BedrockRuntimeClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// S3 Operations
export const uploadToS3 = async (file: File, key: string): Promise<string> => {
  try {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: file.type,
      Metadata: {
        'original-name': file.name,
        'uploaded-at': new Date().toISOString(),
      },
    });

    await s3Client.send(command);
    return `s3://${S3_BUCKET_NAME}/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file');
  }
};

export const getSignedDownloadUrl = async (key: string): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate download URL');
  }
};

// Bedrock Operations
export const generateChatResponse = async (
  documentText: string,
  userMessage: string,
  context?: any
): Promise<string> => {
  try {
    const prompt = `You are a helpful AI assistant that answers questions about documents. You have access to the full content of a document and should provide accurate, helpful answers based on that content.

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
    const response = await bedrockClient.send(command);
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    return responseBody.content[0].text;
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw new Error('Failed to generate response');
  }
};

export const generateDocumentInsights = async (text: string) => {
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
    const response = await bedrockClient.send(command);
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const insightsText = responseBody.content[0].text;
    
    return JSON.parse(insightsText);
  } catch (error) {
    console.error('Error generating insights:', error);
    return {
      summary: "Document analysis completed",
      keyEntities: ["document", "content"],
      sentiment: "neutral",
      readingTime: Math.ceil(text.length / 1000) + " minutes",
      documentType: "document",
      language: "en"
    };
  }
};