'use client';

import { supabase } from '@/lib/supabase';

export default function LoginButton() {
    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`,
            },
        });
    };

    return (
        <button
            onClick={handleLogin}
            className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors font-medium cursor-pointer"
        >
            <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
            />
            Sign in with Google
        </button>
    );
}
