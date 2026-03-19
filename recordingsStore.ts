import { create } from 'zustand';
import type { Recording, SearchFilters } from '../types';
import { db } from '../db/database';

interface RecordingsStore {
  recordings: Recording[];
  filters: SearchFilters;
  loading: boolean;

  loadRecordings: () => Promise<void>;
  addRecording: (rec: Recording) => Promise<void>;
  updateRecording: (id: string, updates: Partial<Recording>) => Promise<void>;
  deleteRecording: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  setFilters: (f: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  getFilteredRecordings: () => Recording[];
}

const defaultFilters: SearchFilters = {
  keyword: '',
  direction: 'all',
  minDuration: 0,
  maxDuration: 3600,
  dateFrom: '',
  dateTo: '',
  tags: [],
  favoritesOnly: false,
  sortBy: 'date',
  sortOrder: 'desc',
};

export const useRecordingsStore = create<RecordingsStore>()((set, get) => ({
  recordings: [],
  filters: { ...defaultFilters },
  loading: false,

  loadRecordings: async () => {
    set({ loading: true });
    const recordings = await db.recordings.toArray();
    // Convert stored date strings back to Date objects
    const parsed = recordings.map(r => ({
      ...r,
      startTime: new Date(r.startTime),
      endTime: r.endTime ? new Date(r.endTime) : undefined,
    }));
    set({ recordings: parsed, loading: false });
  },

  addRecording: async (rec) => {
    await db.recordings.add(rec);
    const recordings = [...get().recordings, rec].sort(
      (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    set({ recordings });
  },

  updateRecording: async (id, updates) => {
    await db.recordings.update(id, updates);
    set({
      recordings: get().recordings.map(r =>
        r.id === id ? { ...r, ...updates } : r
      ),
    });
  },

  deleteRecording: async (id) => {
    await db.recordings.delete(id);
    set({ recordings: get().recordings.filter(r => r.id !== id) });
  },

  toggleFavorite: async (id) => {
    const rec = get().recordings.find(r => r.id === id);
    if (!rec) return;
    const isFavorite = !rec.isFavorite;
    await db.recordings.update(id, { isFavorite });
    set({
      recordings: get().recordings.map(r =>
        r.id === id ? { ...r, isFavorite } : r
      ),
    });
  },

  setFilters: (f) => set({ filters: { ...get().filters, ...f } }),
  resetFilters: () => set({ filters: { ...defaultFilters } }),

  getFilteredRecordings: () => {
    const { recordings, filters } = get();
    let result = [...recordings];

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      result = result.filter(r =>
        (r.contactName?.toLowerCase().includes(kw)) ||
        r.phoneNumber.toLowerCase().includes(kw) ||
        r.transcript.toLowerCase().includes(kw) ||
        r.tags.some(t => t.toLowerCase().includes(kw)) ||
        r.summary?.toLowerCase().includes(kw)
      );
    }

    if (filters.direction !== 'all') {
      result = result.filter(r => r.direction === filters.direction);
    }

    if (filters.minDuration > 0) {
      result = result.filter(r => (r.durationSeconds || 0) >= filters.minDuration);
    }

    if (filters.maxDuration < 3600) {
      result = result.filter(r => (r.durationSeconds || 0) <= filters.maxDuration);
    }

    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom).getTime();
      result = result.filter(r => new Date(r.startTime).getTime() >= from);
    }

    if (filters.dateTo) {
      const to = new Date(filters.dateTo).getTime() + 86400000;
      result = result.filter(r => new Date(r.startTime).getTime() <= to);
    }

    if (filters.tags.length > 0) {
      result = result.filter(r =>
        filters.tags.some(t => r.tags.includes(t))
      );
    }

    if (filters.favoritesOnly) {
      result = result.filter(r => r.isFavorite);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (filters.sortBy) {
        case 'date':
          cmp = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
          break;
        case 'duration':
          cmp = (a.durationSeconds || 0) - (b.durationSeconds || 0);
          break;
        case 'name':
          cmp = (a.contactName || a.phoneNumber).localeCompare(b.contactName || b.phoneNumber);
          break;
      }
      return filters.sortOrder === 'desc' ? -cmp : cmp;
    });

    return result;
  },
}));
