"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (content: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 border-[#262626] bg-brand-dark text-white placeholder:text-white/30 focus-visible:ring-brand-accent/30"
      />
      <Button
        type="submit"
        disabled={disabled || !text.trim()}
        className="bg-brand-accent text-brand-dark hover:bg-brand-accent/80 disabled:bg-white/[0.06] disabled:text-white/20"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
