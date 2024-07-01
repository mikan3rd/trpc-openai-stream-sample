import { trpc } from '../utils/trpc';
import type { NextPageWithLayout } from './_app';
import { useState } from 'react';
import { keepPreviousData } from '@tanstack/react-query';

const IndexPage: NextPageWithLayout = () => {
  // const iterable = trpc.examples.iterable.useQuery();

  // const [iterableText, setIterableText] = useState<string>('');
  // const iterable2 = trpc.examples.iterable2.useMutation();

  const [inputText, setInputText] = useState<string>(
    'ChatGPT、Claude、LangChainについて説明してください',
  );

  const openai = trpc.examples.openai.useQuery(
    { text: inputText },
    {
      enabled: false,
      placeholderData: keepPreviousData,
    },
  );
  const submitByQuery = async () => {
    openai.refetch();
  };

  const [text, setText] = useState<string>('');
  const openai2 = trpc.examples.openai2.useMutation();
  const submitByMutation = async () => {
    openai2.mutate(
      { text: inputText },
      {
        onSuccess: async (data) => {
          setText('');
          for await (const val of data) {
            setText((prev) => prev + val);
          }
        },
      },
    );
  };

  const langchainOpenai = trpc.langchain.openai.useQuery(
    { text: inputText },
    {
      enabled: false,
      placeholderData: keepPreviousData,
    },
  );
  const submitByQueryLangchain = async () => {
    langchainOpenai.refetch();
  };

  const [langchainOpenaiText, setLangchainOpenaiText] = useState<string>('');
  const langchainOpenai2 = trpc.langchain.openai2.useMutation();
  const submitByMutationLangchain = async () => {
    langchainOpenai2.mutate(
      { text: inputText },
      {
        onSuccess: async (data) => {
          setLangchainOpenaiText('');
          for await (const val of data) {
            setLangchainOpenaiText((prev) => prev + val);
          }
        },
      },
    );
  };

  return (
    <div className="flex flex-col bg-gray-800 py-8">
      <h1 className="text-4xl font-bold">
        Welcome to your tRPC with OpenAI stream!
      </h1>

      <div className="flex flex-col py-8 items-center">
        <form className="py-2 w-4/6">
          <div className="flex flex-col gap-y-4 font-semibold">
            <textarea
              className="resize-none focus-visible:outline-dashed outline-offset-4 outline-2 outline-gray-700 rounded-xl px-4 py-3 bg-gray-900"
              rows={10}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={openai.isFetching}
            />

            <div className="flex justify-center items-center gap-8">
              <h3 className="text-2xl font-semibold">OpenAI</h3>

              <button
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="button"
                onClick={submitByQuery}
                disabled={openai.isFetching}
              >
                query
              </button>

              <button
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="button"
                onClick={submitByMutation}
                disabled={openai2.isPending}
              >
                mutation
              </button>
            </div>

            {openai.error && (
              <p style={{ color: 'red' }}>{openai.error.message}</p>
            )}
            {openai2.error && (
              <p style={{ color: 'red' }}>{openai2.error.message}</p>
            )}

            <p className="py-4 break-all whitespace-pre-wrap">{openai.data}</p>
            <p className="py-4 break-all whitespace-pre-wrap">{text}</p>

            <div className="flex justify-center items-center gap-8">
              <h3 className="text-2xl font-semibold">LangChain OpenAI</h3>

              <button
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="button"
                onClick={submitByQueryLangchain}
                disabled={openai.isFetching}
              >
                query
              </button>

              <button
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="button"
                onClick={submitByMutationLangchain}
                disabled={openai2.isPending}
              >
                mutation
              </button>
            </div>

            {langchainOpenai.error && (
              <p style={{ color: 'red' }}>{langchainOpenai.error.message}</p>
            )}
            {openai2.error && (
              <p style={{ color: 'red' }}>{openai2.error.message}</p>
            )}

            <p className="py-4 break-all whitespace-pre-wrap">
              {langchainOpenai.data}
            </p>
            <p className="py-4 break-all whitespace-pre-wrap">
              {langchainOpenaiText}
            </p>
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
