import {
  Meeting,
  MeetingDetail,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  PaginatedResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API request failed");
  }

  return response.json();
}

export const meetingsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);

    return fetchWithAuth<PaginatedResponse<Meeting>>(
      `/meetings?${searchParams.toString()}`
    );
  },

  getById: (id: string) => {
    return fetchWithAuth<MeetingDetail>(`/meetings/${id}`);
  },

  create: (data: CreateMeetingRequest) => {
    return fetchWithAuth<Meeting>("/meetings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: (id: string, data: UpdateMeetingRequest) => {
    return fetchWithAuth<Meeting>(`/meetings/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: (id: string) => {
    return fetchWithAuth<{ message: string }>(`/meetings/${id}`, {
      method: "DELETE",
    });
  },
};

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.access_token);
    return data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  },

  getProfile: () => {
    return fetchWithAuth("/auth/profile");
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};
