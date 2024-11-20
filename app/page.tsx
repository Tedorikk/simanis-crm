'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use 'next/navigation' for client-side routing

export default function Home() {
  const router = useRouter();

  // Redirect when the component mounts
  useEffect(() => {
    router.push('/dashboard'); // Redirect to the dashboard page
  }, [router]);

  return null; // Return null because we're redirecting immediately
}