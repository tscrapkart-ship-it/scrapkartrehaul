"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/types";

export function useRealtimeMessages(bookingId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Fetch existing messages
    async function fetchMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
      setLoading(false);
    }

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId]);

  const sendMessage = useCallback(
    async (content: string, senderId: string, receiverId: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("messages").insert({
        booking_id: bookingId,
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      });
      return !error;
    },
    [bookingId]
  );

  return { messages, loading, sendMessage };
}
