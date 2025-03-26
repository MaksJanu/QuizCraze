'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function GoogleLoginHandler() {
    const router = useRouter();

    useEffect(() => {
        const handleAuth = async () => {
            const code = new URLSearchParams(window.location.search).get('code');
            
            if (code) {
                try {
                    const res = await axios.post(
                        'http://localhost:4000/api/auth/google/callback',
                        { code },
                        {
                            withCredentials: true,
                            baseURL: 'http://localhost:4000/api'
                        }
                    );

                    if (res.data.userData) {
                        localStorage.setItem('isAuthenticated', 'true');
                        localStorage.setItem('userId', res.data.userData._id);
                        localStorage.setItem('rootAccess', res.data.userData.rootAccess);
                        window.dispatchEvent(new Event('authStateChange'));
                        router.push('/');
                    }
                } catch (error) {
                    console.error('Authentication failed:', error);
                    router.push('/auth/login');
                }
            } else {
                router.push('/auth/login');
            }
        };

        handleAuth();
    }, [router]);

    return (
        <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
            <div className="text-center">
                <p className="text-lg text-gray-600 mb-4">Processing Google login...</p>
                <div className="mt-4">
                    <svg 
                        className="animate-spin h-8 w-8 mx-auto text-[#A7D129]" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                    >
                        <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                        ></circle>
                        <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}