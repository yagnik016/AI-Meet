"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  Users,
  Mic2,
  Loader2,
} from "lucide-react";

// Mock data - will be replaced with API data
const mockAnalytics = {
  overview: {
    totalMeetings: 45,
    totalHours: 32.5,
    totalActionItems: 128,
    completedActionItems: 89,
    averageSentiment: "POSITIVE",
  },
  meetingsOverTime: [
    { date: "2026-03-01", count: 2 },
    { date: "2026-03-05", count: 3 },
    { date: "2026-03-10", count: 1 },
    { date: "2026-03-15", count: 4 },
    { date: "2026-03-20", count: 2 },
    { date: "2026-03-25", count: 5 },
    { date: "2026-03-30", count: 3 },
  ],
  sentimentDistribution: [
    { sentiment: "POSITIVE", count: 28 },
    { sentiment: "NEUTRAL", count: 12 },
    { sentiment: "MIXED", count: 4 },
    { sentiment: "NEGATIVE", count: 1 },
  ],
  topTopics: [
    { topic: "Product Roadmap", count: 12 },
    { topic: "User Research", count: 9 },
    { topic: "Q2 Planning", count: 8 },
    { topic: "Design Review", count: 7 },
    { topic: "Team Sync", count: 6 },
  ],
  platformUsage: [
    { platform: "ZOOM", count: 20 },
    { platform: "GOOGLE_MEET", count: 15 },
    { platform: "TEAMS", count: 8 },
    { platform: "UPLOAD", count: 2 },
  ],
};

const SENTIMENT_COLORS = {
  POSITIVE: "#22c55e",
  NEUTRAL: "#6b7280",
  NEGATIVE: "#ef4444",
  MIXED: "#f59e0b",
};

const PLATFORM_COLORS = {
  ZOOM: "#2d8cff",
  GOOGLE_MEET: "#00832d",
  TEAMS: "#6264a7",
  UPLOAD: "#f97316",
};

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState(mockAnalytics);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setAnalytics(mockAnalytics);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const completionRate = Math.round(
    (analytics.overview.completedActionItems / analytics.overview.totalActionItems) * 100
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Insights and metrics for your meetings
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Meetings</span>
            </div>
            <p className="mt-2 text-3xl font-bold">{analytics.overview.totalMeetings}</p>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Hours Recorded</span>
            </div>
            <p className="mt-2 text-3xl font-bold">{analytics.overview.totalHours}h</p>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Action Items</span>
            </div>
            <p className="mt-2 text-3xl font-bold">{completionRate}%</p>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.completedActionItems} of {analytics.overview.totalActionItems} completed
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Avg. Sentiment</span>
            </div>
            <p className="mt-2 text-3xl font-bold">{analytics.overview.averageSentiment}</p>
            <p className="text-xs text-muted-foreground">Based on AI analysis</p>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Meetings Over Time */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Meetings Over Time</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.meetingsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) =>
                      new Date(date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: "#2563eb" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Sentiment Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.sentimentDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="sentiment"
                  >
                    {analytics.sentimentDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={SENTIMENT_COLORS[entry.sentiment as keyof typeof SENTIMENT_COLORS]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-4 flex-wrap">
              {analytics.sentimentDistribution.map((item) => (
                <div key={item.sentiment} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: SENTIMENT_COLORS[item.sentiment as keyof typeof SENTIMENT_COLORS],
                    }}
                  />
                  <span className="text-sm">
                    {item.sentiment} ({item.count})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Topics */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Top Topics</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topTopics} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="topic" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Platform Usage */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Platform Usage</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.platformUsage}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    nameKey="platform"
                    label={({ platform, count }) => `${platform}: ${count}`}
                  >
                    {analytics.platformUsage.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PLATFORM_COLORS[entry.platform as keyof typeof PLATFORM_COLORS] || "#6b7280"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
