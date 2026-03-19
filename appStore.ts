import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppStore {
  hasCompletedLegal: boolean;
  hasCompletedSetup: boolean;
  setupStep: number;
  isRecording: boolean;
  currentRecordingId: string | null;
  activeTab: 'home' | 'recordings' | 'search' | 'settings';
  selectedRecordingId: string | null;
  isSeeded: boolean;

  setHasCompletedLegal: (v: boolean) => void;
  setHasCompletedSetup: (v: boolean) => void;
  setSetupStep: (step: number) => void;
  setIsRecording: (v: boolean) => void;
  setCurrentRecordingId: (id: string | null) => void;
  setActiveTab: (tab: 'home' | 'recordings' | 'search' | 'settings') => void;
  setSelectedRecordingId: (id: string | null) => void;
  setIsSeeded: (v: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      hasCompletedLegal: false,
      hasCompletedSetup: false,
      setupStep: 0,
      isRecording: false,
      currentRecordingId: null,
      activeTab: 'home',
      selectedRecordingId: null,
      isSeeded: false,

      setHasCompletedLegal: (v) => set({ hasCompletedLegal: v }),
      setHasCompletedSetup: (v) => set({ hasCompletedSetup: v }),
      setSetupStep: (step) => set({ setupStep: step }),
      setIsRecording: (v) => set({ isRecording: v }),
      setCurrentRecordingId: (id) => set({ currentRecordingId: id }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedRecordingId: (id) => set({ selectedRecordingId: id }),
      setIsSeeded: (v) => set({ isSeeded: v }),
    }),
    { name: 'ultracall-app-store' }
  )
);
