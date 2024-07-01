import { ChatOpenAI } from '@langchain/openai';

const chat = new ChatOpenAI({
  model: 'gpt-3.5-turbo',
  apiKey: process.env.OPEN_AI_API_KEY,
});

export const chatOpenAI = async function* (text: string) {
  const stream = await chat.stream([['user', text]]);

  let fullContent = '';
  for await (const chunk of stream) {
    const { content } = chunk;

    if (typeof content !== 'string') {
      console.log({ content });
      throw new Error('Expected content to be a string');
    }

    yield content;

    fullContent += content;
  }

  console.log({ fullContent });
};
