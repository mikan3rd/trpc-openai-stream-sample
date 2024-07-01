import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';

// https://js.langchain.com/v0.2/docs/how_to/streaming/
const chatOpenAI = new ChatOpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
  model: 'gpt-3.5-turbo',
});

const chatAnthropic = new ChatAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-haiku-20240307',
});

export const chatLangChain = async function* (args: {
  modelType: 'openai' | 'anthropic';
  text: string;
}) {
  const { modelType, text } = args;

  const model = (() => {
    switch (modelType) {
      case 'openai':
        return chatOpenAI;
      case 'anthropic':
        return chatAnthropic;
      default:
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        throw new Error(`Unknown modelType: ${modelType}`);
    }
  })();

  const stream = await model.stream([['user', text]]);

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
