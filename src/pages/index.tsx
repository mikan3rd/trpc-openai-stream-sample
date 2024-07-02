import { trpc } from '../utils/trpc';
import type { NextPageWithLayout } from './_app';
import { Fragment, useState } from 'react';
import { keepPreviousData } from '@tanstack/react-query';

const IndexPage: NextPageWithLayout = () => {
  // const iterable = trpc.examples.iterable.useQuery();

  // const [iterableText, setIterableText] = useState<string>('');
  // const iterable2 = trpc.examples.iterable2.useMutation();

  const [inputText, setInputText] = useState<string>(
    'ChatGPT、Claude、LangChainについて簡潔に説明してください',
  );

  const openai = trpc.examples.openai.useQuery(
    { text: inputText },
    {
      enabled: false,
      placeholderData: keepPreviousData,
    },
  );
  const submitByQuery = async () => {
    await openai.refetch();
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

  const anthropic = trpc.examples.anthropic.useQuery(
    { text: inputText },
    {
      enabled: false,
      placeholderData: keepPreviousData,
    },
  );
  const submitByQueryAnthropic = async () => {
    await anthropic.refetch();
  };

  const [anthropicText, setAnthropicText] = useState<string>('');
  const anthropic2 = trpc.examples.anthropic2.useMutation();
  const submitByMutationAnthropic = async () => {
    anthropic2.mutate(
      { text: inputText },
      {
        onSuccess: async (data) => {
          setAnthropicText('');
          for await (const val of data) {
            setAnthropicText((prev) => prev + val);
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
    await langchainOpenai.refetch();
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

  const langchainAnthropic = trpc.langchain.anthropic.useQuery(
    { text: inputText },
    {
      enabled: false,
      placeholderData: keepPreviousData,
    },
  );
  const submitByQueryLangchainAnthropic = async () => {
    await langchainAnthropic.refetch();
  };

  const [langchainAnthropicText, setLangchainAnthropicText] =
    useState<string>('');
  const langchainAnthropic2 = trpc.langchain.anthropic2.useMutation();
  const submitByMutationLangchainAnthropic = async () => {
    langchainAnthropic2.mutate(
      { text: inputText },
      {
        onSuccess: async (data) => {
          setLangchainAnthropicText('');
          for await (const val of data) {
            setLangchainAnthropicText((prev) => prev + val);
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

            <hr />

            <div className="flex justify-center items-center gap-8">
              <h3 className="text-2xl font-semibold">OpenAI (GPT)</h3>

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

            <p className="py-4 break-all whitespace-pre-wrap">
              {openai.data?.map((chunk, index) => (
                <Fragment key={index}>{chunk}</Fragment>
              ))}
            </p>
            <p className="py-4 break-all whitespace-pre-wrap">{text}</p>

            <hr />

            <div className="flex justify-center items-center gap-8">
              <h3 className="text-2xl font-semibold">Anthropic (Claude)</h3>

              <button
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="button"
                onClick={submitByQueryAnthropic}
                disabled={anthropic.isFetching}
              >
                query
              </button>

              <button
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="button"
                onClick={submitByMutationAnthropic}
                disabled={anthropic2.isPending}
              >
                mutation
              </button>
            </div>

            {anthropic.error && (
              <p style={{ color: 'red' }}>{anthropic.error.message}</p>
            )}
            {anthropic2.error && (
              <p style={{ color: 'red' }}>{anthropic2.error.message}</p>
            )}

            <p className="py-4 break-all whitespace-pre-wrap">
              {anthropic.data?.map((chunk, index) => (
                <Fragment key={index}>{chunk}</Fragment>
              ))}
            </p>
            <p className="py-4 break-all whitespace-pre-wrap">
              {anthropicText}
            </p>

            <hr />

            <div className="flex justify-center items-center gap-8">
              <h3 className="text-2xl font-semibold">LangChain OpenAI (GPT)</h3>

              <button
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="button"
                onClick={submitByQueryLangchain}
                disabled={langchainOpenai.isFetching}
              >
                query
              </button>

              <button
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="button"
                onClick={submitByMutationLangchain}
                disabled={langchainOpenai2.isPending}
              >
                mutation
              </button>
            </div>

            {langchainOpenai.error && (
              <p style={{ color: 'red' }}>{langchainOpenai.error.message}</p>
            )}
            {langchainOpenai2.error && (
              <p style={{ color: 'red' }}>{langchainOpenai2.error.message}</p>
            )}

            <p className="py-4 break-all whitespace-pre-wrap">
              {langchainOpenai.data?.map((chunk, index) => (
                <Fragment key={index}>{chunk}</Fragment>
              ))}
            </p>
            <p className="py-4 break-all whitespace-pre-wrap">
              {langchainOpenaiText}
            </p>

            <hr />

            <div className="flex justify-center items-center gap-8">
              <h3 className="text-2xl font-semibold">
                LangChain Anthropic (Claude)
              </h3>

              <button
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="button"
                onClick={submitByQueryLangchainAnthropic}
                disabled={langchainAnthropic.isFetching}
              >
                query
              </button>

              <button
                className="cursor-pointer bg-gray-900 p-2 rounded-md px-16"
                type="button"
                onClick={submitByMutationLangchainAnthropic}
                disabled={langchainAnthropic2.isPending}
              >
                mutation
              </button>
            </div>

            {langchainAnthropic.error && (
              <p style={{ color: 'red' }}>{langchainAnthropic.error.message}</p>
            )}
            {langchainAnthropic2.error && (
              <p style={{ color: 'red' }}>
                {langchainAnthropic2.error.message}
              </p>
            )}

            <p className="py-4 break-all whitespace-pre-wrap">
              {langchainAnthropic.data?.map((chunk, index) => (
                <Fragment key={index}>{chunk}</Fragment>
              ))}
            </p>
            <p className="py-4 break-all whitespace-pre-wrap">
              {langchainAnthropicText}
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
