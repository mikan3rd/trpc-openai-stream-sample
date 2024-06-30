import { trpc } from '../utils/trpc';
import type { NextPageWithLayout } from './_app';
import type { inferProcedureInput } from '@trpc/server';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import type { AppRouter } from '~/server/routers/_app';
import { keepPreviousData } from '@tanstack/react-query';

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useUtils();
  const postsQuery = trpc.post.list.useInfiniteQuery(
    {
      limit: 5,
    },
    {
      getNextPageParam(lastPage) {
        return lastPage.nextCursor;
      },
    },
  );

  // const iterable = trpc.examples.iterable.useQuery();

  const [inputText, setInputText] = useState<string>(
    'ChatGPT-4の特徴を簡潔に説明してください',
  );
  const openai = trpc.examples.openai.useQuery(
    { text: inputText },
    {
      enabled: false,
      placeholderData: keepPreviousData,
    },
  );

  const [text, setText] = useState<string>('');
  const openai2 = trpc.examples.openai2.useMutation();
  const submitText = async () => {
    openai2.mutate(
      { text: inputText },
      {
        onSuccess: async (data) => {
          for await (const val of data) {
            setText((prev) => prev + val);
          }
        },
      },
    );
    // await openai.refetch();
  };

  // const [posts, setPosts] = useState<any>(null);
  // trpc.post.onPostAdd.useSubscription(undefined, {
  //   onData(data) {
  //     setPosts(data);
  //   },
  // });
  // console.log({ posts });

  const addPost = trpc.post.add.useMutation({
    async onSuccess() {
      // refetches posts after a post is added
      await utils.post.list.invalidate();
    },
  });

  // prefetch all posts for instant navigation
  // useEffect(() => {
  //   const allPosts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  //   for (const { id } of allPosts) {
  //     void utils.post.byId.prefetch({ id });
  //   }
  // }, [postsQuery.data, utils]);

  return (
    <div className="flex flex-col bg-gray-800 py-8">
      <h1 className="text-4xl font-bold">
        Welcome to your tRPC with Prisma starter!
      </h1>
      <p className="text-gray-400">
        If you get stuck, check{' '}
        <Link className="underline" href="https://trpc.io">
          the docs
        </Link>
        , write a message in our{' '}
        <Link className="underline" href="https://trpc.io/discord">
          Discord-channel
        </Link>
        , or write a message in{' '}
        <Link
          className="underline"
          href="https://github.com/trpc/trpc/discussions"
        >
          GitHub Discussions
        </Link>
        .
      </p>

      <div className="flex flex-col py-8 items-center">
        <h2 className="text-3xl font-semibold">OpenAI</h2>

        <form className="py-2 w-4/6">
          <div className="flex flex-col gap-y-4 font-semibold">
            <textarea
              className="resize-none focus-visible:outline-dashed outline-offset-4 outline-2 outline-gray-700 rounded-xl px-4 py-3 bg-gray-900"
              rows={10}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={openai.isFetching}
            />

            <div className="flex justify-center">
              <input
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  submitText();
                }}
                disabled={openai.isFetching}
              />
              {addPost.error && (
                <p style={{ color: 'red' }}>{openai.error?.message}</p>
              )}
            </div>
          </div>
        </form>

        <p className="py-4 break-all">{text}</p>
      </div>

      {/* <hr />

      <div className="flex flex-col py-8 items-start gap-y-2">
        <h2 className="text-3xl font-semibold">Iterable</h2>
        <div>status={iterable.status}</div>
        <div>isLoading={`${iterable.isLoading}`}</div>
        <div>isFetching={`${iterable.isFetching}`}</div>
        <div>data={iterable.data}</div>
      </div> */}

      <hr />

      <div className="flex flex-col py-8 items-start gap-y-2">
        <div className="flex flex-col"></div>
        <h2 className="text-3xl font-semibold">
          Latest Posts
          {postsQuery.status === 'pending' && '(loading)'}
        </h2>

        <button
          className="bg-gray-900 p-2 rounded-md font-semibold disabled:bg-gray-700 disabled:text-gray-400"
          onClick={() => postsQuery.fetchNextPage()}
          disabled={!postsQuery.hasNextPage || postsQuery.isFetchingNextPage}
        >
          {postsQuery.isFetchingNextPage
            ? 'Loading more...'
            : postsQuery.hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
        </button>

        {postsQuery.data?.pages.map((page, index) => (
          <Fragment key={page.items[0]?.id ?? index}>
            {page.items.map((item) => (
              <article key={item.id}>
                <h3 className="text-2xl font-semibold">{item.title}</h3>
                <Link className="text-gray-400" href={`/post/${item.id}`}>
                  View more
                </Link>
              </article>
            ))}
          </Fragment>
        ))}
      </div>

      <hr />

      <div className="flex flex-col py-8 items-center">
        <h2 className="text-3xl font-semibold pb-2">Add a Post</h2>

        <form
          className="py-2 w-4/6"
          onSubmit={async (e) => {
            /**
             * In a real app you probably don't want to use this manually
             * Checkout React Hook Form - it works great with tRPC
             * @link https://react-hook-form.com/
             * @link https://kitchen-sink.trpc.io/react-hook-form
             */
            e.preventDefault();
            const $form = e.currentTarget;
            const values = Object.fromEntries(new FormData($form));
            type Input = inferProcedureInput<AppRouter['post']['add']>;
            //    ^?
            const input: Input = {
              title: values.title as string,
              text: values.text as string,
            };
            try {
              await addPost.mutateAsync(input);

              $form.reset();
            } catch (cause) {
              console.error({ cause }, 'Failed to add post');
            }
          }}
        >
          <div className="flex flex-col gap-y-4 font-semibold">
            <input
              className="focus-visible:outline-dashed outline-offset-4 outline-2 outline-gray-700 rounded-xl px-4 py-3 bg-gray-900"
              id="title"
              name="title"
              type="text"
              placeholder="Title"
              disabled={addPost.isPending}
            />
            <textarea
              className="resize-none focus-visible:outline-dashed outline-offset-4 outline-2 outline-gray-700 rounded-xl px-4 py-3 bg-gray-900"
              id="text"
              name="text"
              placeholder="Text"
              disabled={addPost.isPending}
              rows={6}
            />

            <div className="flex justify-center">
              <input
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="submit"
                disabled={addPost.isPending}
              />
              {addPost.error && (
                <p style={{ color: 'red' }}>{addPost.error.message}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndexPage;

/**
 * If you want to statically render this page
 * - Export `appRouter` & `createContext` from [trpc].ts
 * - Make the `opts` object optional on `createContext()`
 *
 * @link https://trpc.io/docs/v11/ssg
 */
// export const getStaticProps = async (
//   context: GetStaticPropsContext<{ filter: string }>,
// ) => {
//   const ssg = createServerSideHelpers({
//     router: appRouter,
//     ctx: await createContext(),
//   });
//
//   await ssg.post.all.fetch();
//
//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//       filter: context.params?.filter ?? 'all',
//     },
//     revalidate: 1,
//   };
// };
