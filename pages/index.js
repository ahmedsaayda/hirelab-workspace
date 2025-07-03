export default function Home() {
  // This page should never render - middleware handles all redirects
  return null;
}

export async function getServerSideProps(context) {
  // Server-side redirect - no client-side delay
  // Middleware should handle authentication and redirect accordingly:
  // - Unauthenticated users → /auth/login
  // - Authenticated users → /dashboard
  // This is just a fallback in case middleware doesn't catch it
  return {
    redirect: {
      destination: '/auth/login',
      permanent: false,
    },
  };
} 
