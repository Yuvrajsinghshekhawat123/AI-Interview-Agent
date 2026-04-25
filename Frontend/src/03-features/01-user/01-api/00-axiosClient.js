import axios from "axios";

// Create event emitter for retry status
export const retryEvents = {
  listeners: [],
  
  subscribe(callback) {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  },
  
  emit(event, data) {
    this.listeners.forEach(callback => callback(event, data));
  }
};

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/user`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 30000,
});

// Add retry interceptor
axiosClient.interceptors.response.use(
    (response) => {
        // Emit success event
        retryEvents.emit('retry-success', null);
        return response;
    },
    async (error) => {
        const { config, code, message } = error;
        
        // Only retry on network errors or connection refused
        const shouldRetry = 
            code === "ERR_NETWORK" ||
            code === "ECONNABORTED" ||
            message?.includes("ERR_CONNECTION_REFUSED") ||
            message?.includes("Failed to fetch") ||
            message?.includes("Network Error");
        
        if (!shouldRetry || !config) {
            // Emit failure event for non-retryable errors
            retryEvents.emit('retry-failed', { fatal: true });
            return Promise.reject(error);
        }
        
        // Initialize retry count
        config.retryCount = config.retryCount || 0;
        
        // Max 3 retries
        const MAX_RETRIES = 3;
        
        if (config.retryCount >= MAX_RETRIES) {
            // Emit failure event after all retries
            retryEvents.emit('retry-failed', { maxRetriesReached: true });
            return Promise.reject(error);
        }
        
        config.retryCount += 1;
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, config.retryCount - 1) * 1000;
        
        // Emit retry attempt event
        retryEvents.emit('retry-attempt', {
            attempt: config.retryCount,
            max: MAX_RETRIES,
            delay: delay
        });
        
        console.log(`🔄 Retrying request (${config.retryCount}/${MAX_RETRIES}) after ${delay}ms...`);
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Retry the request
        return axiosClient(config);
    }
);

export default axiosClient;