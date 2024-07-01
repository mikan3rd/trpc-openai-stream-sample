/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { chatCompletionsStream } from '../functions/openai';
import { iterablePromise } from '../functions/iterable';
import { chatLangChain } from '../functions/langchain';
import { messageCreateStream } from '../functions/anthropicAI';

export const appRouter = router({
  examples: {
    // HTTP Batch Stream Link
    // https://trpc.io/docs/client/links/httpBatchStreamLink
    iterable: publicProcedure.query(async function* () {
      yield* iterablePromise();
    }),
    iterable2: publicProcedure.mutation(async function* () {
      yield* iterablePromise();
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

    anthropic: publicProcedure
      .input(
        z.object({
          text: z.string().min(1),
        }),
      )
      .query(async function* ({ input }) {
        yield* messageCreateStream(input.text);
      }),

    anthropic2: publicProcedure
      .input(
        z.object({
          text: z.string().min(1),
        }),
      )
      .mutation(async function* ({ input }) {
        yield* messageCreateStream(input.text);
      }),
  },

  langchain: {
    openai: publicProcedure
      .input(
        z.object({
          text: z.string().min(1),
        }),
      )
      .query(async function* ({ input }) {
        yield* chatLangChain({ modelType: 'openai', text: input.text });
      }),

    openai2: publicProcedure
      .input(
        z.object({
          text: z.string().min(1),
        }),
      )
      .mutation(async function* ({ input }) {
        yield* chatLangChain({ modelType: 'openai', text: input.text });
      }),

    anthropic: publicProcedure
      .input(
        z.object({
          text: z.string().min(1),
        }),
      )
      .query(async function* ({ input }) {
        yield* chatLangChain({ modelType: 'anthropic', text: input.text });
      }),

    anthropic2: publicProcedure
      .input(
        z.object({
          text: z.string().min(1),
        }),
      )
      .mutation(async function* ({ input }) {
        yield* chatLangChain({ modelType: 'anthropic', text: input.text });
      }),
  },
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
