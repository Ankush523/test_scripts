import axios, { AxiosResponse } from 'axios';
const OPENAI_API_KEY = "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";
const OPENAI_API_URL = 'https://api.openai.com/v1/completions';

if (!OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key. Please set the OPENAI_API_KEY environment variable.');
}

const instance = axios.create({
  baseURL: OPENAI_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
  },
});

async function convertTransactionHash(hash: string): Promise<string> {
  try {
    const prompt = `Convert the following Ethereum transaction hash into a human-readable form:\n${hash}\n\nHuman-readable form: `;
    const maxTokens = 50;

    const response: AxiosResponse = await instance.post('', {
      model :"text-davinci-003",
      prompt,
      max_tokens: maxTokens,
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    const readableForm = response.data.choices[0]?.text?.trim();
    return readableForm || 'Unable to convert transaction hash';
  } catch (error) {
    console.error('Error while converting transaction hash:', error);
    return 'Error while converting transaction hash';
  }
}

(async () => {
    const transactionHash = '0x729c14b31e9adcc1a7af96632ca34a36696f6f72050813501f87a6f9456706e4';
    const readableForm = await convertTransactionHash(transactionHash);
    console.log('Human-readable form:', readableForm);
})()

// const hash = '0x729c14b31e9adcc1a7af96632ca34a36696f6f72050813501f87a6f9456706e4';