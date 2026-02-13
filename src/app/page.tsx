'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import LoginButton from '@/components/LoginButton';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        router.push('/dashboard');
      }
    };
    checkUser();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-50">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-8">
          Welcome to <span className="text-blue-600">Smart Bookmark App</span>
        </h1>

        <p className="mt-3 text-2xl text-gray-600 mb-12">
          Save and organize your bookmarks intelligently.
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <LoginButton />
        </div>
      </main>
    </div>
  );
}
