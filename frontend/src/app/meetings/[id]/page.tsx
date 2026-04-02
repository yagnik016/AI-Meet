"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Download,
  Play,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";

// Mock data
const meeting = {
  id: "1",
  title: "Weekly Team Sync",
  description: "Discuss Q2 goals and roadmap progress",
  platform: "ZOOM",
  startTime: "2026-04-15T10:00:00Z",
  endTime: "2026-04-15T11:00:00Z",
  duration: 3600,
  status: "COMPLETED",
  participants: [
    { name: "John Doe", email: "john@example.com", role: "Host" },
    { name: "Jane Smith", email: "jane@example.com", role: "Participant" },
    { name: "Bob Wilson", email: "bob@example.com", role: "Participant" },
  ],
};

const transcript = {
  summary:
    "The team discussed Q2 goals, focusing on improving user engagement by 25% and launching the new mobile app feature. Key decisions were made regarding the product roadmap and resource allocation.",
  sentiment: "POSITIVE",
  keyTopics: ["Q2 Goals", "User Engagement", "Mobile App", "Roadmap"],
  segments: [
    {
      timestamp: "00:00",
      speaker: "John Doe",
      text: "Welcome everyone to our weekly sync. Let's start with Q2 goals review.",
    },
    {
      timestamp: "02:15",
      speaker: "Jane Smith",
      text: "We've seen a 15% increase in user engagement since the last update.",
    },
    {
      timestamp: "05:30",
      speaker: "Bob Wilson",
      text: "The mobile app feature is on track for release next month.",
    },
  ],
};

const actionItems = [
  { id: "1", content: "Prepare Q2 metrics report", assignee: "Jane Smith", status: "PENDING" },
  { id: "2", content: "Schedule mobile app testing", assignee: "Bob Wilson", status: "COMPLETED" },
  { id: "3", content: "Update roadmap document", assignee: "John Doe", status: "IN_PROGRESS" },
];

const insights = [
  { type: "KEY_DECISION", content: "Target 25% user engagement increase for Q2" },
  { type: "OPPORTUNITY", content: "Mobile app feature has potential for high adoption" },
  { type: "FOLLOW_UP", content: "Review metrics again in 2 weeks" },
];

export default function MeetingDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<"transcript" | "insights" | "action-items">("transcript");

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link
          href="/meetings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to meetings
        </Link>

        {/* Meeting Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{meeting.title}</h1>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  meeting.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {meeting.status}
              </span>
            </div>
            <p className="text-muted-foreground">{meeting.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(meeting.startTime)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(meeting.duration)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {meeting.participants.length} participants
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
              <Play className="h-4 w-4" />
              Play Recording
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="rounded-md border p-2 hover:bg-accent">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* AI Summary Card */}
        <div className="rounded-lg border bg-gradient-to-r from-primary/5 to-transparent p-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI Summary</h3>
            <span
              className={`ml-auto rounded-full px-2 py-1 text-xs font-medium ${
                transcript.sentiment === "POSITIVE"
                  ? "bg-green-100 text-green-800"
                  : transcript.sentiment === "NEGATIVE"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {transcript.sentiment} sentiment
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{transcript.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {transcript.keyTopics.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex gap-6">
            {[
              { id: "transcript", label: "Transcript", icon: FileText },
              { id: "insights", label: "Insights", icon: Sparkles },
              { id: "action-items", label: "Action Items", icon: CheckCircle2 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "transcript" && (
            <div className="space-y-4">
              {transcript.segments.map((segment, index) => (
                <div key={index} className="flex gap-4 rounded-lg border p-4">
                  <div className="flex-shrink-0">
                    <span className="text-xs font-medium text-muted-foreground">
                      {segment.timestamp}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{segment.speaker}</p>
                    <p className="text-sm text-muted-foreground">{segment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "insights" && (
            <div className="grid gap-4 md:grid-cols-2">
              {insights.map((insight, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium uppercase text-muted-foreground">
                      {insight.type.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm">{insight.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "action-items" && (
            <div className="space-y-3">
              {actionItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-full p-1 ${
                        item.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : item.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.content}</p>
                      <p className="text-xs text-muted-foreground">
                        Assigned to {item.assignee}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      item.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : item.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
