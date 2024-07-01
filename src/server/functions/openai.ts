import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

export const chatCompletionsStream = async function* (text: string) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: text,
      },
    ],
    stream: true,
  });

  let fullContent = '';
  for await (const chunk of stream) {
    const targetIndex = 0;
    const target = chunk.choices[targetIndex];
    const content = target?.delta?.content ?? '';
    yield content;

    fullContent += content;
  }

  console.log({ fullContent });
};
