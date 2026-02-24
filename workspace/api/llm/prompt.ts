// Next.js API route for handling LLM prompts
import type { NextApiRequest, NextApiResponse } from 'next';

// Define the structure for the LLM response
interface LLMResponse {
  success: boolean;
  response?: string;
  error?: string;
}

// API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse<LLMResponse>) {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ success: false, error: 'Prompt is required' });
      return;
    }

    try {
      // Example placeholder for connecting to the LLM service
      const llmResponse = `Received prompt: ${prompt}`; // Replace with real integration logic

      res.status(200).json({ success: true, response: llmResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to process prompt' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}