/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { chatCompletionsStream } from '../functions/openai';

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
        yield* chatCompletionsStream(input.text);
      }),

    openai2: publicProcedure
      .input(
        z.object({
          text: z.string().min(1),
        }),
      )
      .mutation(async function* ({ input }) {
        yield* chatCompletionsStream(input.text);
      }),
  },
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
