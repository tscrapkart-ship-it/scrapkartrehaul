"use client";

import { useEffect, useRef } from "react";
import { useRealtimeMessages } from "@/lib/hooks/use-realtime-messages";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Loader2 } from "lucide-react";

export function ChatInterface({
  bookingId,
  transactionId,
  currentUserId,
  otherUserId,
}: {
  bookingId?: string;
  transactionId?: string;
  currentUserId: string;
  otherUserId: string;
}) {
  const threadId = transactionId ?? bookingId ?? "";
  const threadType = transactionId ? "transaction" : "booking";
  const { messages, loading, sendMessage } = useRealtimeMessages(threadId, threadType as "booking" | "transaction");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(content: string) {
    sendMessage(content, currentUserId, otherUserId);
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col rounded-2xl border border-[#262626] bg-card">
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-brand-accent/60" />
            <p className="mt-3 text-sm text-white/40">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/10">
              <MessageSquare className="h-6 w-6 text-brand-accent" />
            </div>
            <p className="mt-3 text-sm font-medium text-white/60">
              Start the conversation
            </p>
            <p className="mt-1 text-xs text-white/30">
              Send a message to get things going.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isOwn={msg.sender_id === currentUserId}
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </ScrollArea>
      <div className="border-t border-[#262626] p-4">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
