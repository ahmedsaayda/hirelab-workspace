export const getBackendUrl = () =>
  process.env.NODE_ENV !== "production"
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : "https://hirelab-api.onrender.com/";