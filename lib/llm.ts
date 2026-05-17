/**
 * LLM text generation wrapper supporting Google Gemini and IBM watsonx.ai
 *
 * This module provides a simple interface to multiple LLM providers.
 * Priority order: Gemini (if key is set) → watsonx (if keys are set) → mock fallback
 * If credentials are not configured, it falls back to a deterministic mock mode
 * that returns placeholder responses, allowing the app to run without credentials.
 */

// Read environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Cheapest current Gemini tier — keeps demo cost low. (gemini-2.0-flash-lite
// is no longer available to new API keys, so use the 2.5 lite tier.)
const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const WATSONX_API_KEY = process.env.WATSONX_API_KEY;
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID;
const WATSONX_URL = process.env.WATSONX_URL;

/**
 * Check if Gemini credentials are configured
 * @returns true if Gemini API key is present
 */
function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY;
}

/**
 * Check if watsonx.ai credentials are configured
 * @returns true if all required watsonx credentials are present
 */
function isWatsonxConfigured(): boolean {
  return !!(WATSONX_API_KEY && WATSONX_PROJECT_ID && WATSONX_URL);
}

/**
 * Check if any LLM provider credentials are configured
 * @returns true if either Gemini or watsonx credentials are present
 */
export function isLive(): boolean {
  return isGeminiConfigured() || isWatsonxConfigured();
}

/**
 * Generate text using Google Gemini, IBM watsonx.ai, or mock fallback
 * Priority: Gemini → watsonx → mock
 * @param prompt - The input prompt for text generation
 * @returns Generated text response
 */
export async function generate(prompt: string): Promise<string> {
  // Priority 1: Try Gemini if configured
  if (isGeminiConfigured()) {
    try {
      return await generateWithGemini(prompt);
    } catch (error) {
      console.error('Gemini generation failed:', error);
      // Fall through to try watsonx or mock
    }
  }

  // Priority 2: Try watsonx if configured
  if (isWatsonxConfigured()) {
    try {
      return await generateWithWatsonx(prompt);
    } catch (error) {
      console.error('watsonx generation failed:', error);
      // Fall through to mock
    }
  }

  // Priority 3: Use mock fallback
  return generateMockResponse(prompt);
}

/** Pause execution for the given number of milliseconds. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate text using the Google Gemini API.
 * Retries automatically on transient failures (HTTP 429/5xx and network
 * errors) with exponential backoff, since Gemini returns these intermittently.
 * @param prompt - The input prompt for text generation
 * @returns Generated text response
 */
async function generateWithGemini(prompt: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
      topP: 1,
      topK: 50,
    },
  });

  const MAX_ATTEMPTS = 3;
  const RETRYABLE_STATUS = [429, 500, 502, 503, 504];

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const isLastAttempt = attempt === MAX_ATTEMPTS;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (response.ok) {
        const data: any = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof text === 'string') {
          return text.trim();
        }
        throw new Error('Gemini API returned an unexpected response format');
      }

      // Non-OK response: retry transient server/rate-limit errors, fail fast otherwise.
      const errorText = await response.text();
      const message = `Gemini API error (${response.status}): ${errorText || response.statusText}`;
      if (RETRYABLE_STATUS.includes(response.status) && !isLastAttempt) {
        await sleep(500 * 2 ** (attempt - 1));
        continue;
      }
      throw new Error(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      // fetch() network failures throw a TypeError — retry those.
      if (error instanceof TypeError && !isLastAttempt) {
        await sleep(500 * 2 ** (attempt - 1));
        continue;
      }
      throw new Error(`Gemini generation failed: ${message}`);
    }
  }

  // The loop always returns or throws; this satisfies the type checker.
  throw new Error('Gemini generation failed: exhausted all retry attempts');
}

/**
 * Generate text using IBM watsonx.ai API
 * @param prompt - The input prompt for text generation
 * @returns Generated text response
 */
async function generateWithWatsonx(prompt: string): Promise<string> {
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
    throw new Error('Unknown error occurred during watsonx text generation');
  }
}

/**
 * Mock fallback for when no LLM credentials are configured
 * Returns a deterministic placeholder response based on the prompt
 *
 * This allows the application to run and be tested without requiring
 * actual LLM API credentials, useful for development and demos.
 */
function generateMockResponse(prompt: string): string {
  // Create a deterministic hash-like value from the prompt
  const hash = prompt.split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);

  const mockResponses = [
    'This is a mock response. Configure GEMINI_API_KEY or watsonx credentials (WATSONX_API_KEY, WATSONX_PROJECT_ID, WATSONX_URL) to use real AI generation.',
    'Mock AI response: The system is running in demo mode without LLM credentials.',
    'Placeholder response generated. Set up Gemini or watsonx environment variables for actual AI-powered responses.',
    'Demo mode active. This is a simulated response. Configure LLM credentials for real functionality.',
  ];

  // Select response deterministically based on prompt
  const index = Math.abs(hash) % mockResponses.length;

  return `[MOCK MODE] ${mockResponses[index]}\n\nPrompt received: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`;
}

// Made with Bob
