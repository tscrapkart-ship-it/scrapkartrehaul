"use client";

import type { Message } from "@/types";

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  const time = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return time;
  if (diffHours < 24) return time;

  // Different day — show date + time
  const dateStr2 = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
  return `${dateStr2}, ${time}`;
}

export function MessageBubble({
  message,
  isOwn,
  showTimestamp = true,
}: {
  message: Message;
  isOwn: boolean;
  showTimestamp?: boolean;
}) {
  return (
    <div
      className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-fade-in`}
    >
      <div className={`group max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`relative px-4 py-2.5 ${
            isOwn
              ? "rounded-2xl rounded-tr-md bg-[#10B981] text-black"
              : "rounded-2xl rounded-tl-md bg-[#1A1A1A] text-[#E5E5E5] border border-[#262626]"
          }`}
        >
          <p className={`text-[14px] leading-relaxed ${isOwn ? "font-medium" : ""}`}>
            {message.content}
          </p>
        </div>
        {showTimestamp && (
          <p
            className={`mt-1 px-1 text-[11px] ${
              isOwn ? "text-right text-[#525252]" : "text-left text-[#525252]"
            }`}
          >
            {formatTime(message.created_at)}
          </p>
        )}
      </div>
    </div>
  );
}
