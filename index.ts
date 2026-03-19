export interface Recording {
  id: string;
  callId: string;
  phoneNumber: string;
  contactName?: string;
  direction: 'incoming' | 'outgoing' | 'unknown';
  startTime: Date;
  endTime?: Date;
  durationSeconds?: number;
  audioFilePath: string;
  micFallbackPath?: string;
  transcript: string;
  tags: string[];
  isFavorite: boolean;
  sourceMethod: 'system' | 'microphone' | 'both';
  summary?: string;
}

export interface AppState {
  hasCompletedLegal: boolean;
  hasCompletedSetup: boolean;
  setupStep: number;
  isRecording: boolean;
  currentRecordingId: string | null;
  activeTab: 'home' | 'recordings' | 'search' | 'settings';
}

export interface PermissionState {
  microphone: boolean;
  callLog: boolean;
  accessibility: boolean;
  storage: boolean;
  notification: boolean;
}

export type FilterDirection = 'all' | 'incoming' | 'outgoing' | 'unknown';
export type SortBy = 'date' | 'duration' | 'name';
export type SortOrder = 'asc' | 'desc';

export interface SearchFilters {
  keyword: string;
  direction: FilterDirection;
  minDuration: number;
  maxDuration: number;
  dateFrom: string;
  dateTo: string;
  tags: string[];
  favoritesOnly: boolean;
  sortBy: SortBy;
  sortOrder: SortOrder;
}
