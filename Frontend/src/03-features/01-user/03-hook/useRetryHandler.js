import { create } from 'zustand';

const useRetryStore = create((set) => ({
  isRetrying: false,
  retryCount: 0,
  maxRetries: 3,
  startRetry: () => set({ isRetrying: true, retryCount: 0 }),
  updateRetry: (count) => set({ retryCount: count }),
  stopRetry: () => set({ isRetrying: false, retryCount: 0 }),
}));

export const useRetryHandler = () => {
  const { isRetrying, retryCount, maxRetries, startRetry, updateRetry, stopRetry } = useRetryStore();
  
  return {
    isRetrying,
    retryCount,
    maxRetries,
    startRetry,
    updateRetry,
    stopRetry,
  };
};