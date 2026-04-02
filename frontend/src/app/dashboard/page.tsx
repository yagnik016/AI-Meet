"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard-layout";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { DashboardSkeleton } from "@/components/skeletons";
import { Video, Clock, CheckCircle, Sparkles, ArrowRight } from "lucide-react";

interface DashboardStats {
  totalMeetings: number;
  hoursRecorded: number;
  actionItems: number;
  aiInsights: number;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats] = useState<DashboardStats>({
    totalMeetings: 24,
    hoursRecorded: 18.5,
    actionItems: 12,
    aiInsights: 48,
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <FadeIn>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back!</p>
            </div>
            <Link href="/meetings/new" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              New Meeting
            </Link>
          </div>

          <StaggerContainer className="grid gap-4 md:grid-cols-4">
            <StaggerItem>
              <div className="rounded-lg border p-6">
                <div className="text-sm text-muted-foreground">Total Meetings</div>
                <div className="text-3xl font-bold">{stats.totalMeetings}</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-lg border p-6">
                <div className="text-sm text-muted-foreground">Hours</div>
                <div className="text-3xl font-bold">{stats.hoursRecorded}</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-lg border p-6">
                <div className="text-sm text-muted-foreground">Action Items</div>
                <div className="text-3xl font-bold">{stats.actionItems}</div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="rounded-lg border p-6">
                <div className="text-sm text-muted-foreground">AI Insights</div>
                <div className="text-3xl font-bold">{stats.aiInsights}</div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </FadeIn>
    </DashboardLayout>
  );
}
