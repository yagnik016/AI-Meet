export interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  platform: 'ZOOM' | 'GOOGLE_MEET' | 'TEAMS' | 'UPLOAD' | 'RECORDED';
  platformMeetingId: string | null;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  transcriptionStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  userId: string;
  createdAt: string;
  updatedAt: string;
  transcript?: TranscriptSummary;
  _count?: {
    participants: number;
    actionItems: number;
  };
}

export interface TranscriptSummary {
  id: string;
  summary: string | null;
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
  createdAt: string;
}

export interface Transcript {
  id: string;
  content: string;
  segments: TranscriptSegment[] | null;
  summary: string | null;
  keyTopics: string[];
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';
  meetingId: string;
  createdAt: string;
}

export interface TranscriptSegment {
  timestamp: string;
  speaker: string;
  text: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  joinTime: string | null;
  leaveTime: string | null;
  meetingId: string;
}

export interface ActionItem {
  id: string;
  content: string;
  assignee: string | null;
  dueDate: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  meetingId: string;
  createdAt: string;
}

export interface MeetingInsight {
  id: string;
  type: 'KEY_DECISION' | 'RISK' | 'OPPORTUNITY' | 'FOLLOW_UP' | 'TOPIC' | 'SENTIMENT';
  content: string;
  confidence: number;
  meetingId: string;
  createdAt: string;
}

export interface MeetingDetail extends Meeting {
  transcript?: TranscriptSummary;
  participants: Participant[];
  actionItems: ActionItem[];
  insights: MeetingInsight[];
}

export interface CreateMeetingRequest {
  title: string;
  description?: string;
  platform: 'ZOOM' | 'GOOGLE_MEET' | 'TEAMS' | 'UPLOAD' | 'RECORDED';
  startTime: string;
  endTime?: string;
}

export interface UpdateMeetingRequest {
  title?: string;
  description?: string;
  platform?: 'ZOOM' | 'GOOGLE_MEET' | 'TEAMS' | 'UPLOAD' | 'RECORDED';
  startTime?: string;
  endTime?: string;
  status?: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
