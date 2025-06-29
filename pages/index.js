import React from 'react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Middleware will handle the redirection, but this is a fallback
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">HireLab</h1>
        <p>Redirecting...</p>
      </div>
    </div>
  );
} 