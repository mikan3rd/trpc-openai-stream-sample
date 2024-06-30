/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, publicProcedure, router } from '../trpc';
import { postRouter } from './post';
import { z } from 'zod';
import { sse } from '@trpc/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),

  post: postRouter,

  examples: {
    // HTTP Batch Stream Link
    // https://trpc.io/docs/client/links/httpBatchStreamLink
    iterable: publicProcedure.query(async function* () {
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        yield i;
      }
    }),
    openai: publicProcedure
      .input(
        z.object({
          text: z.string().min(1),
        }),
      )
      .query(async function* ({ input }) {
        const stream = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: input.text,
            },
          ],
          stream: true,
        });

        for await (const chunk of stream) {
          const targetIndex = 0;
          const target = chunk.choices[targetIndex];
          const content = target?.delta?.content ?? '';

          if (target?.index === undefined) {
            throw new Error('missing index');
          }

          yield content;
        }
      }),
  },

  openai: {
    chat: publicProcedure
      .input(
        z.object({
          text: z.string().min(1),
        }),
      )
      .subscription(async function* ({ input }) {
        const stream = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: input.text,
            },
          ],
          stream: true,
        });
        for await (const chunk of stream) {
          const targetIndex = 0;
          const target = chunk.choices[targetIndex];
          const content = target?.delta?.content ?? '';

          if (target?.index === undefined) {
            throw new Error('missing index');
          }

          yield sse({
            // yielding the post id ensures the client can reconnect at any time and get the latest events this id
            id: target.index.toString(),
            data: content,
          });
        }
      }),
  },
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
