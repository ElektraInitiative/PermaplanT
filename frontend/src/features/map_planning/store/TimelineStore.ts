import { create } from 'zustand';

interface TimeLineState {
  state: 'loading' | 'idle' | 'error';
  setTimelineLoading: () => void;
  setTimelineIdle: () => void;
}

export const useTimeLineStore = create<TimeLineState>((set) => {
  return {
    state: 'idle',
    setTimelineLoading: () => {
      set({ state: 'loading' });
    },
    setTimelineIdle: () => {
      set({ state: 'idle' });
    },
  };
});
