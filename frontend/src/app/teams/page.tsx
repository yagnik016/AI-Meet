"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Users,
  Plus,
  MoreVertical,
  Crown,
  Shield,
  User,
  Trash2,
  Loader2,
  X,
} from "lucide-react";

// Mock data
const mockTeams = [
  {
    id: "1",
    name: "Engineering Team",
    slug: "engineering",
    role: "OWNER",
    memberCount: 8,
    owner: { name: "John Doe", email: "john@example.com" },
  },
  {
    id: "2",
    name: "Product Team",
    slug: "product",
    role: "ADMIN",
    memberCount: 5,
    owner: { name: "Jane Smith", email: "jane@example.com" },
  },
];

const mockMembers = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "OWNER", avatar: null },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "ADMIN", avatar: null },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", role: "MEMBER", avatar: null },
  { id: "4", name: "Alice Brown", email: "alice@example.com", role: "MEMBER", avatar: null },
];

export default function TeamsPage() {
  const [teams, setTeams] = useState(mockTeams);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedTeamData = selectedTeam
    ? teams.find((t) => t.id === selectedTeam)
    : null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "OWNER":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "ADMIN":
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      OWNER: "bg-yellow-100 text-yellow-800",
      ADMIN: "bg-blue-100 text-blue-800",
      MEMBER: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${
          styles[role as keyof typeof styles]
        }`}
      >
        {role}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
            <p className="text-muted-foreground">
              Manage your teams and collaborate with others
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Team
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Teams List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-semibold text-lg">Your Teams</h2>
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team.id)}
                className={`w-full text-left rounded-lg border p-4 transition-colors ${
                  selectedTeam === team.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-accent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{team.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {team.memberCount} members • {team.role}
                      </p>
                    </div>
                  </div>
                  {getRoleIcon(team.role)}
                </div>
              </button>
            ))}
          </div>

          {/* Team Details */}
          <div className="lg:col-span-2">
            {selectedTeamData ? (
              <div className="rounded-lg border bg-card">
                {/* Team Header */}
                <div className="border-b p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold">{selectedTeamData.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        slug: {selectedTeamData.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedTeamData.role === "OWNER" && (
                        <button className="rounded-md border p-2 hover:bg-accent text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Members List */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Members</h3>
                    {(selectedTeamData.role === "OWNER" ||
                      selectedTeamData.role === "ADMIN") && (
                      <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
                      >
                        <Plus className="h-4 w-4" />
                        Invite Member
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {mockMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <span className="text-sm font-medium">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRoleBadge(member.role)}
                          {selectedTeamData.role === "OWNER" &&
                            member.role !== "OWNER" && (
                              <button className="rounded-md p-1 hover:bg-accent">
                                <MoreVertical className="h-4 w-4" />
                              </button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 rounded-lg border bg-card">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a team to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Team Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create New Team</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-md p-1 hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium">Team Name</label>
                <input
                  type="text"
                  placeholder="e.g., Engineering Team"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Team Slug</label>
                <input
                  type="text"
                  placeholder="e.g., engineering"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used in URLs and must be unique
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Invite Team Member</h2>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="rounded-md p-1 hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="colleague@example.com"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <select className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
