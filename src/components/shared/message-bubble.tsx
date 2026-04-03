import type { Message } from "@/types";

export function MessageBubble({
  message,
  isOwn,
}: {
  message: Message;
  isOwn: boolean;
}) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
          isOwn
            ? "rounded-br-md bg-gradient-to-br from-brand-accent to-brand-accent/80 text-brand-dark"
            : "rounded-bl-md bg-card text-white"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <p
          className={`mt-1 text-[10px] ${
            isOwn ? "text-brand-dark/50" : "text-white/30"
          }`}
        >
          {new Date(message.created_at).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
