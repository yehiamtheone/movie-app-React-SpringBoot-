// setupInterceptor.js
export const setupAxiosInterceptors = (moviesApi, logout) => {
  moviesApi.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.data?.error === "INVALID_TOKEN") {
        logout();
      }
      return Promise.reject(error);
    }
  );
};
