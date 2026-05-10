import {
  type ActivityEntry,
  type AuthResponse,
  type Chapter,
  type LeaderboardApiUser,
  type ProgressRecord,
  type RankResponse,
  type StudySession,
  type Subject,
  type Task,
} from "@/lib/types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

type RequestOptions = RequestInit & {
  token?: string | null;
};

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      if (typeof errorBody?.message === "string") {
        message = errorBody.message;
      }
    } catch {}
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = (await response.json()) as T | ApiEnvelope<T>;
  if (
    body &&
    typeof body === "object" &&
    "success" in body &&
    "data" in body
  ) {
    return (body as ApiEnvelope<T>).data;
  }

  return body as T;
}

export function registerUser(payload: { name: string; email: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: { email: string; password: string }) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getSubjects(token: string) {
  return apiRequest<Subject[]>("/subjects", { token });
}

export function getSubject(token: string, id: string) {
  return apiRequest<Subject>(`/subjects/${id}`, { token });
}

export function getChaptersBySubject(token: string, subjectId: string) {
  return apiRequest<Chapter[]>(`/chapters/subject/${subjectId}`, { token });
}

export function getProgressMe(token: string) {
  return apiRequest<ProgressRecord[]>("/progress/me", { token });
}

export function getProgressForSubject(token: string, subjectId: string) {
  return apiRequest<ProgressRecord[]>(`/progress/subject/${subjectId}`, { token });
}

export function updateProgress(
  token: string,
  payload: { chapterId: string; completionPercent: number; studyMinutes?: number; revisionCount?: number },
) {
  return apiRequest<ProgressRecord>("/progress", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export function completeSubjectProgress(token: string, subjectId: string) {
  return apiRequest<{ subjectName: string; updatedChapters: number; newlyCompleted: number }>(`/progress/subject/${subjectId}/complete`, {
    method: "POST",
    token,
  });
}

export function getLeaderboard(token: string) {
  return apiRequest<LeaderboardApiUser[]>("/leaderboard", { token });
}

export function getMyRank(token: string) {
  return apiRequest<RankResponse>("/leaderboard/me/rank", { token });
}

export function getActiveStudySession(token: string) {
  return apiRequest<StudySession | null>("/study-sessions/active", { token });
}

export function getStudySessions(token: string) {
  return apiRequest<StudySession[]>("/study-sessions/me", { token });
}

export function getTasks(token: string) {
  return apiRequest<Task[]>("/tasks", { token });
}

export function createTask(
  token: string,
  payload: { title: string; xpReward?: number; estimatedMinutes?: number },
) {
  return apiRequest<Task>("/tasks", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function completeTask(token: string, id: string) {
  return apiRequest<Task>(`/tasks/${id}/complete`, {
    method: "PATCH",
    token,
  });
}

export function deleteTask(token: string, id: string) {
  return apiRequest<void>(`/tasks/${id}`, {
    method: "DELETE",
    token,
  });
}

export function getActivity(token: string) {
  return apiRequest<ActivityEntry[]>("/activity", { token });
}
