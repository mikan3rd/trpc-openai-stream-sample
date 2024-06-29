/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, publicProcedure, router } from '../trpc';
import { postRouter } from './post';

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
  },
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
