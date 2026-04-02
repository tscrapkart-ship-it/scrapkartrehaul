"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/types";

type ThreadType = "booking" | "transaction";

export function useRealtimeMessages(
  threadId: string,
  threadType: ThreadType = "booking"
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const column = threadType === "transaction" ? "transaction_id" : "booking_id";

  useEffect(() => {
    const supabase = createClient();

    async function fetchMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq(column, threadId)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
      setLoading(false);
    }

    fetchMessages();

    const channel = supabase
      .channel(`messages:${threadType}:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `${column}=eq.${threadId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId, threadType, column]);

  const sendMessage = useCallback(
    async (content: string, senderId: string, receiverId: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("messages").insert({
        [column]: threadId,
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      });
      return !error;
    },
    [threadId, column]
  );

  return { messages, loading, sendMessage };
}

// Backward-compatible alias
export function useRealtimeBookingMessages(bookingId: string) {
  return useRealtimeMessages(bookingId, "booking");
}
