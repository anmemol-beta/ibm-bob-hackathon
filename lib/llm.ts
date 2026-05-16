/**
 * IBM watsonx.ai text generation wrapper
 * 
 * This module provides a simple interface to IBM watsonx.ai's text generation API.
 * If credentials are not configured, it falls back to a deterministic mock mode
 * that returns placeholder responses, allowing the app to run without credentials.
 */

// Read environment variables
const WATSONX_API_KEY = process.env.WATSONX_API_KEY;
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID;
const WATSONX_URL = process.env.WATSONX_URL;

/**
 * Check if watsonx.ai credentials are configured
 * @returns true if all required credentials are present
 */
export function isLive(): boolean {
  return !!(WATSONX_API_KEY && WATSONX_PROJECT_ID && WATSONX_URL);
}

/**
 * Generate text using IBM watsonx.ai or mock fallback
 * @param prompt - The input prompt for text generation
 * @returns Generated text response
 */
export async function generate(prompt: string): Promise<string> {
  // If credentials are missing, use mock fallback
  if (!isLive()) {
    return generateMockResponse(prompt);
  }

  try {
    // Call watsonx.ai text generation API
    const response = await fetch(`${WATSONX_URL}/ml/v1/text/generation?version=2023-05-29`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${WATSONX_API_KEY}`,
      },
      body: JSON.stringify({
        input: prompt,
        model_id: 'ibm/granite-13b-chat-v2',
        project_id: WATSONX_PROJECT_ID,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 1,
          top_k: 50,
          repetition_penalty: 1.0,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `watsonx.ai API error (${response.status}): ${errorText || response.statusText}`
      );
    }

    const data: any = await response.json();
    
    // Extract generated text from response
    if (data.results && data.results.length > 0 && data.results[0].generated_text) {
      return data.results[0].generated_text.trim();
    }

    throw new Error('watsonx.ai API returned unexpected response format');
  } catch (error) {
    // Provide informative error messages
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        throw new Error(
          `Network error connecting to watsonx.ai: ${error.message}. Please check your internet connection and WATSONX_URL configuration.`
        );
      }
      throw new Error(`watsonx.ai generation failed: ${error.message}`);
    }
    throw new Error('Unknown error occurred during text generation');
  }
}

/**
 * Mock fallback for when credentials are not configured
 * Returns a deterministic placeholder response based on the prompt
 * 
 * This allows the application to run and be tested without requiring
 * actual watsonx.ai credentials, useful for development and demos.
 */
function generateMockResponse(prompt: string): string {
  // Create a deterministic hash-like value from the prompt
  const hash = prompt.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  const mockResponses = [
    'This is a mock response. Configure WATSONX_API_KEY, WATSONX_PROJECT_ID, and WATSONX_URL to use real AI generation.',
    'Mock AI response: The system is running in demo mode without watsonx.ai credentials.',
    'Placeholder response generated. Set up watsonx.ai environment variables for actual AI-powered responses.',
    'Demo mode active. This is a simulated response. Configure watsonx credentials for real functionality.',
  ];
  
  // Select response deterministically based on prompt
  const index = Math.abs(hash) % mockResponses.length;
  
  return `[MOCK MODE] ${mockResponses[index]}\n\nPrompt received: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`;
}

// Made with Bob
