'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserProfile {
    full_name: string;
    job_title: string;
    company_name: string;
    email: string;
    avatar_url?: string;
}

interface UserContextType {
    profile: UserProfile | null;
    isLoading: boolean;
    refreshProfile: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/settings/profile');
            if (res.ok) {
                const json = await res.json();
                if (json.data) {
                    setProfile({
                        full_name: json.data.full_name || 'User',
                        job_title: json.data.job_title || 'Investor',
                        company_name: json.data.company_name || '',
                        email: json.data.email || '',
                        avatar_url: json.data.avatar_url
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const updateProfile = async (data: Partial<UserProfile>) => {
        // Optimistic update
        setProfile(prev => prev ? { ...prev, ...data } : null);

        // The actual API call is typically handled by the form component, 
        // but we can expose a refresh method or a direct update if needed globally.
        // ideally, components call the API, then call refreshProfile() here.
    };

    return (
        <UserContext.Provider value={{ profile, isLoading, refreshProfile: fetchProfile, updateProfile }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
