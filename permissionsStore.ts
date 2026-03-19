import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PermissionsStore {
  microphone: boolean;
  callLog: boolean;
  accessibility: boolean;
  storage: boolean;
  notification: boolean;

  grantPermission: (key: keyof Omit<PermissionsStore, 'grantPermission' | 'allGranted'>) => void;
  allGranted: () => boolean;
}

export const usePermissionsStore = create<PermissionsStore>()(
  persist(
    (set, get) => ({
      microphone: false,
      callLog: false,
      accessibility: false,
      storage: false,
      notification: false,

      grantPermission: (key) => set({ [key]: true }),
      allGranted: () => {
        const s = get();
        return s.microphone && s.callLog && s.accessibility;
      },
    }),
    { name: 'ultracall-permissions-store' }
  )
);
