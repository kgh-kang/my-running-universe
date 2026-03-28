import { create } from 'zustand';
import type { RunningPath } from '../types/strava';

interface AppState {
  // Nike Auth
  nikeToken: string | null;
  setNikeToken: (token: string) => void;

  // Data
  paths: RunningPath[];
  setPaths: (paths: RunningPath[]) => void;
  isLoading: boolean;
  setLoading: (v: boolean) => void;

  // UI
  selectedPath: RunningPath | null;
  setSelectedPath: (path: RunningPath | null) => void;
}

export const useStore = create<AppState>((set) => ({
  nikeToken: null,
  setNikeToken: (nikeToken) => set({ nikeToken }),

  paths: [],
  setPaths: (paths) => set({ paths }),
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),

  selectedPath: null,
  setSelectedPath: (selectedPath) => set({ selectedPath }),
}));
