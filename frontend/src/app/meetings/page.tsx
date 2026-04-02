"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Video, Search, Plus, Calendar, Clock, Users, MoreVertical, Loader2 } from "lucide-react";

// Mock data - will be replaced with API data
const mockMeetings = [
  {
    id: "1",
    title: "Weekly Team Sync",
    description: "Discuss Q2 goals and roadmap",
    platform: "ZOOM",
    startTime: "2026-04-15T10:00:00Z",
    duration: 3600,
    status: "COMPLETED",
    participantsCount: 8,
    actionItemsCount: 5,
    hasTranscript: true,
  },
  {
    id: "2",
    title: "Product Design Review",
    description: "Review new UI mockups and user flows",
    platform: "GOOGLE_MEET",
    startTime: "2026-04-14T14:00:00Z",
    duration: 2700,
    status: "COMPLETED",
    participantsCount: 5,
    actionItemsCount: 3,
    hasTranscript: true,
  },
  {
    id: "3",
    title: "Client Kickoff Meeting",
    description: "Initial discussion with new client",
    platform: "TEAMS",
    startTime: "2026-04-16T11:00:00Z",
    duration: null,
    status: "SCHEDULED",
    participantsCount: 6,
    actionItemsCount: 0,
    hasTranscript: false,
  },
];

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading] = useState(false);

  const filteredMeetings = mockMeetings.filter((meeting) =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const minutes = Math.floor(seconds / 60);
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
            <p className="text-muted-foreground">
              Manage and review all your meetings
            </p>
          </div>
          <Link
            href="/meetings/new"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Meeting
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Meetings List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredMeetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No meetings found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try adjusting your search"
                : "Get started by creating your first meeting"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMeetings.map((meeting) => (
              <Link
                key={meeting.id}
                href={`/meetings/${meeting.id}`}
                className="flex flex-col gap-4 rounded-lg border bg-card p-4 hover:bg-accent/50 transition-colors sm:flex-row sm:items-center"
              >
                {/* Meeting Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{meeting.title}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        meeting.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : meeting.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {meeting.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {meeting.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(meeting.startTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(meeting.duration)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {meeting.participantsCount} participants
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  {meeting.hasTranscript && (
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      Transcribed
                    </span>
                  )}
                  {meeting.actionItemsCount > 0 && (
                    <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                      {meeting.actionItemsCount} actions
                    </span>
                  )}
                  <button className="rounded-md p-2 hover:bg-accent">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
