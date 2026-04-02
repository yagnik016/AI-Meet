"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Loader2, X } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  meetingId?: string;
  teamId?: string;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Mock notifications
  const mockNotifications: Notification[] = [
    {
      id: "1",
      type: "TRANSCRIPT_READY",
      title: "Transcript Ready",
      message: 'AI analysis for "Weekly Team Sync" is complete',
      read: false,
      createdAt: "2026-04-15T10:30:00Z",
      meetingId: "1",
    },
    {
      id: "2",
      type: "ACTION_ITEM_ASSIGNED",
      title: "Action Item Assigned",
      message: 'You have been assigned: "Prepare Q2 metrics report"',
      read: false,
      createdAt: "2026-04-14T14:20:00Z",
      meetingId: "1",
    },
    {
      id: "3",
      type: "MEETING_STARTED",
      title: "Meeting Started",
      message: '"Product Design Review" has started',
      read: true,
      createdAt: "2026-04-14T11:00:00Z",
      meetingId: "2",
    },
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.meetingId) {
      return `/meetings/${notification.meetingId}`;
    }
    if (notification.teamId) {
      return `/teams`;
    }
    return "#";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-md p-2 hover:bg-accent"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded-lg border bg-card shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Bell className="mx-auto h-8 w-8 mb-2" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`group flex items-start gap-3 p-4 hover:bg-accent ${
                        !notification.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <Link
                        href={getNotificationLink(notification)}
                        onClick={() => {
                          if (!notification.read) {
                            markAsRead(notification.id);
                          }
                          setIsOpen(false);
                        }}
                        className="flex-1"
                      >
                        <p className="font-medium text-sm">
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </Link>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="rounded p-1 hover:bg-accent"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="rounded p-1 hover:bg-accent"
                          title="Delete"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-2">
              <Link
                href="/notifications"
                onClick={() => setIsOpen(false)}
                className="block rounded-md px-3 py-2 text-center text-sm hover:bg-accent"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
