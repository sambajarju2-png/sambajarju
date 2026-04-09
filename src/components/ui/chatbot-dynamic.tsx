'use client';

import dynamic from 'next/dynamic';

export const ChatBotDynamic = dynamic(
  () => import('@/components/ui/chatbot').then(m => ({ default: m.ChatBot })),
  { ssr: false }
);
