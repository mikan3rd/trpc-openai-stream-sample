import { trpc } from '../utils/trpc';
import { useState } from 'react';

export const useChatSubscription = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>(
    'ChatGPT-4の特徴を簡潔に説明してください',
  );
  const [content, setContent] = useState<string>('');
  const submitText = async () => {
    setEnabled(true);
  };

  trpc.openai.chat.useSubscription(
    {
      text: inputText,
    },
    {
      enabled: enabled,
      onData(data) {
        setContent((prev) => prev + data.data);
      },
    },
  );

  return {
    inputText,
    setInputText,
    enabled,
    submitText,
    content,
  };
};
