"use client";

import { useEffect, useRef, useState } from "react";
import { useRealtimeMessages } from "@/lib/hooks/use-realtime-messages";
import { MessageBubble } from "./message-bubble";
import { ChatInput } from "./chat-input";
import { MessageSquare, Loader2, ArrowDown } from "lucide-react";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleScroll() {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollButton(distFromBottom > 120);
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleSend(content: string) {
    sendMessage(content, currentUserId, otherUserId);
  }

  // Group messages by date
  function getDateLabel(dateStr: string) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  // Build date-grouped messages
  const groupedMessages: { date: string; messages: typeof messages }[] = [];
  let currentDate = "";
  for (const msg of messages) {
    const label = getDateLabel(msg.created_at);
    if (label !== currentDate) {
      currentDate = label;
      groupedMessages.push({ date: label, messages: [msg] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col rounded-2xl border border-[#262626] bg-[#141414] overflow-hidden">
      {/* Messages area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#262626 transparent" }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A] border border-[#262626]">
              <Loader2 className="h-5 w-5 animate-spin text-[#10B981]" />
            </div>
            <p className="mt-3 text-base text-[#525252]">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20">
              <MessageSquare className="h-6 w-6 text-[#10B981]" />
            </div>
            <p className="mt-4 text-base font-medium text-[#A3A3A3]">
              Start the conversation
            </p>
            <p className="mt-1 text-sm text-[#525252]">
              Send a message to begin discussing this deal.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {groupedMessages.map((group) => (
              <div key={group.date}>
                {/* Date separator */}
                <div className="flex items-center justify-center py-4">
                  <div className="h-px flex-1 bg-[#262626]" />
                  <span className="mx-3 text-xs font-medium uppercase tracking-widest text-[#525252]">
                    {group.date}
                  </span>
                  <div className="h-px flex-1 bg-[#262626]" />
                </div>
                {/* Messages for this date */}
                <div className="space-y-3">
                  {group.messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isOwn={msg.sender_id === currentUserId}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="relative">
          <button
            onClick={scrollToBottom}
            className="absolute -top-12 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-[#1A1A1A] border border-[#262626] text-[#A3A3A3] hover:bg-[#262626] hover:text-white transition-all shadow-lg"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-[#262626] bg-[#141414] px-4 py-3">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
