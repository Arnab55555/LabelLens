import axios from 'axios';
import fs from 'fs';

// Google Cloud Vision API Key
const VISION_API_KEY = process.env.VISION_API_KEY;
// Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Extract text from image using Google Cloud Vision API
export const extractTextFromImage = async (imagePath) => {

    const vision_api_key = process.env.VISION_API_KEY;
    console.log(vision_api_key)
  const image = fs.readFileSync(imagePath, { encoding: 'base64' });
  const visionResponse = await axios.post(
    `https://vision.googleapis.com/v1/images:annotate?key=${vision_api_key}`,
    {
      requests: [
        {
          image: { content: image },
          features: [{ type: 'TEXT_DETECTION' }],
        },
      ],
    }
  );
  return visionResponse.data.responses[0].fullTextAnnotation.text;
};

// Analyze text using Gemini API
export const analyzeTextWithGemini = async (text, prompt) => {
try{
  const geminiResponse = await axios.post(
    `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [{ text: `${prompt} Here is the text: ${text}` }],
        },
      ],
    }
  );
  return geminiResponse.data.candidates[0].content.parts[0].text;
} catch (error) {
    console.error('Error in analyzing text with Gemini:', error);
    throw new Error('Failed to analyze text with Gemini API');
  }
};
