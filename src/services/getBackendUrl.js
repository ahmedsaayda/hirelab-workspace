export const getBackendUrl = () =>
  process.env.NODE_ENV !== "production"
    // ? "http://localhost:5155/api"
    ? "https://fresh-colt-maximum.ngrok-free.app/api"
    : process.env.NEXT_PUBLIC_BACKEND_URL;
