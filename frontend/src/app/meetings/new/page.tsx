"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { FileUpload } from "@/components/file-upload";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  Mic,
  Upload,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function NewMeetingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [meetingData, setMeetingData] = useState({
    title: "",
    description: "",
    platform: "ZOOM",
    startTime: "",
    endTime: "",
  });
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState("");

  const handleCreateMeeting = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push("/meetings");
  };

  const addParticipant = () => {
    if (newParticipant && !participants.includes(newParticipant)) {
      setParticipants([...participants, newParticipant]);
      setNewParticipant("");
    }
  };

  const removeParticipant = (email: string) => {
    setParticipants(participants.filter((p) => p !== email));
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/meetings"
            className="rounded-md border p-2 hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">New Meeting</h1>
            <p className="text-sm text-muted-foreground">
              Create a new meeting or upload a recording
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              <span
                className={`text-sm ${
                  step >= s ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s === 1 ? "Details" : s === 2 ? "Participants" : "Recording"}
              </span>
              {s < 3 && (
                <div
                  className={`w-8 h-px mx-2 ${
                    step > s ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="rounded-lg border bg-card p-6">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Meeting Details</h2>

              <div>
                <label className="text-sm font-medium">Meeting Title</label>
                <input
                  type="text"
                  placeholder="e.g., Weekly Team Sync"
                  value={meetingData.title}
                  onChange={(e) =>
                    setMeetingData({ ...meetingData, title: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="What's this meeting about?"
                  value={meetingData.description}
                  onChange={(e) =>
                    setMeetingData({ ...meetingData, description: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Platform</label>
                  <select
                    value={meetingData.platform}
                    onChange={(e) =>
                      setMeetingData({ ...meetingData, platform: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ZOOM">Zoom</option>
                    <option value="GOOGLE_MEET">Google Meet</option>
                    <option value="TEAMS">Microsoft Teams</option>
                    <option value="UPLOAD">Upload Recording</option>
                    <option value="RECORDED">Live Recording</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Start Time</label>
                  <input
                    type="datetime-local"
                    value={meetingData.startTime}
                    onChange={(e) =>
                      setMeetingData({ ...meetingData, startTime: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">End Time (Optional)</label>
                <input
                  type="datetime-local"
                  value={meetingData.endTime}
                  onChange={(e) =>
                    setMeetingData({ ...meetingData, endTime: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Participants</h2>
              <p className="text-sm text-muted-foreground">
                Add email addresses of participants to invite them
              </p>

              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="colleague@example.com"
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addParticipant()}
                  className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={addParticipant}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                {participants.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                        {email[0].toUpperCase()}
                      </div>
                      <span className="text-sm">{email}</span>
                    </div>
                    <button
                      onClick={() => removeParticipant(email)}
                      className="rounded-md p-1 hover:bg-accent"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {participants.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No participants added yet
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Meeting Recording</h2>
              <p className="text-sm text-muted-foreground">
                Upload an existing recording or skip to add it later
              </p>

              {meetingData.platform === "UPLOAD" ? (
                <FileUpload
                  onUploadComplete={(result) => console.log(result)}
                  onUploadError={(error) => console.error(error)}
                />
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <button className="flex flex-col items-center gap-2 rounded-lg border p-6 hover:bg-accent">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="font-medium">Upload Recording</span>
                    <span className="text-xs text-muted-foreground">
                      MP3, WAV, MP4, etc.
                    </span>
                  </button>
                  <button className="flex flex-col items-center gap-2 rounded-lg border p-6 hover:bg-accent">
                    <Mic className="h-8 w-8 text-muted-foreground" />
                    <span className="font-medium">Live Record</span>
                    <span className="text-xs text-muted-foreground">
                      Record in browser
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex justify-between border-t pt-6">
            <button
              onClick={() => setStep((s) => (s > 1 ? (s - 1) as 1 | 2 | 3 : s))}
              disabled={step === 1}
              className="rounded-md border px-4 py-2 text-sm hover:bg-accent disabled:opacity-50"
            >
              Back
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleCreateMeeting}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                Create Meeting
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
