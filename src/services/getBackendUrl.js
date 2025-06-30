export const getBackendUrl = () =>
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5055/api"
    : process.env.NEXT_PUBLIC_BACKEND_URL;
