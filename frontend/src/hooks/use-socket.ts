"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export function useSocket() {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!session?.accessToken) return;

    const socket = io(`${SOCKET_URL}/notifications`, {
      auth: {
        token: session.accessToken,
      },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to notifications");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from notifications");
    });

    socket.on("notification", (data) => {
      console.log("Received notification:", data);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [session?.accessToken]);

  const subscribe = useCallback((room: string) => {
    socketRef.current?.emit("subscribe", room);
  }, []);

  const unsubscribe = useCallback((room: string) => {
    socketRef.current?.emit("unsubscribe", room);
  }, []);

  return {
    socket: socketRef.current,
    subscribe,
    unsubscribe,
  };
}
