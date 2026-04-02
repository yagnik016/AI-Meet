"use client";

import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import { toast } from "sonner";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export function SocketProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) return;

    const socket = io(`${SOCKET_URL}/notifications`, {
      auth: { token: session.accessToken },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("notification", (data) => {
      if (data.type === "TRANSCRIPT_READY") {
        toast.success(data.title, {
          description: data.message,
          action: data.data?.meetingId ? {
            label: "View",
            onClick: () => window.location.href = `/meetings/${data.data.meetingId}`,
          } : undefined,
        });
      } else if (data.type === "ACTION_ITEM_ASSIGNED") {
        toast.info(data.title, { description: data.message });
      } else if (data.type !== "CONNECTED") {
        toast(data.title, { description: data.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, [session?.accessToken, status]);

  return <>{children}</>;
}
