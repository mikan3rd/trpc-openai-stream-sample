/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, publicProcedure, router } from '../trpc';
import { z } from 'zod';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

export const appRouter = router({
  examples: {
    // HTTP Batch Stream Link
    // https://trpc.io/docs/client/links/httpBatchStreamLink
    iterable: publicProcedure.query(async function* () {
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        yield i;
      }
    }),
    iterable2: publicProcedure.mutation(async function* () {
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

        let fullContent = '';
        for await (const chunk of stream) {
          const targetIndex = 0;
          const target = chunk.choices[targetIndex];
          const content = target?.delta?.content ?? '';
          yield content;

          fullContent += content;
        }

        console.log({ fullContent });
      }),

    openai2: publicProcedure
      .input(
        z.object({
          text: z.string().min(1),
        }),
      )
      .mutation(async function* ({ input }) {
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
          yield content;
        }
      }),
  },
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
