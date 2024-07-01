import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const messageCreateStream = async function* (text: string) {
  const stream = await anthropic.messages.create({
    max_tokens: 1024,
    messages: [{ role: 'user', content: text }],
    model: 'claude-3-opus-20240229',
    stream: true,
  });

  let fullContent = '';
  for await (const messageStreamEvent of stream) {
    switch (messageStreamEvent.type) {
      case 'content_block_delta':
        switch (messageStreamEvent.delta.type) {
          case 'text_delta':
            const text = messageStreamEvent.delta.text;
            yield text;
            fullContent += text;
            break;

          default:
            break;
        }
        break;

      default:
        break;
    }
  }

  console.log({ fullContent });
};