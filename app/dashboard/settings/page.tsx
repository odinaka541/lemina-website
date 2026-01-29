'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/providers/ToastProvider';
import { User, Bell, Shield, Wallet, Save, Loader2, Check, Database } from 'lucide-react';
import ProfileTab from '@/components/settings/ProfileTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import SecurityTab from '@/components/settings/SecurityTab';
import BillingTab from '@/components/settings/BillingTab';
import DataPrivacyTab from '@/components/settings/DataPrivacyTab';

export default function SettingsPage() {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        full_name: '',
        job_title: '',
        company_name: '',
        bio: '',
        email_notifications: true,
        investment_sectors: [],
        investment_stages: [],
        investment_geo: [],
        min_check_size: '',
        max_check_size: '',
        investment_thesis: '',
        email_frequency: 'instant',
        digest_time: '09:00',
        digest_day: 'Monday',
        dnd_start_time: '',
        dnd_end_time: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/settings/profile');
            const json = await res.json();
            if (json.data) {
                // Merge data, but also handle nulls gracefully by defaulting to empty strings
                setFormData(prev => ({
                    ...prev,
                    full_name: json.data.full_name || '',
                    job_title: json.data.job_title || '',
                    company_name: json.data.company_name || '',
                    bio: json.data.bio || '',
                    email_notifications: json.data.email_notifications ?? true,
                    // New fields
                    investment_sectors: json.data.investment_sectors || [],
                    investment_stages: json.data.investment_stages || [],
                    investment_geo: json.data.investment_geo || [],
                    min_check_size: json.data.min_check_size || '',
                    max_check_size: json.data.max_check_size || '',
                    investment_thesis: json.data.investment_thesis || '',
                    email_frequency: json.data.email_frequency || 'instant',
                    digest_time: json.data.digest_time || '09:00',
                    digest_day: json.data.digest_day || 'Monday',
                    dnd_start_time: json.data.dnd_start_time || '',
                    dnd_end_time: json.data.dnd_end_time || ''
                }));
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data: any) => {
        // Optimistic update
        setFormData(data);

        const res = await fetch('/api/settings/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error('Failed to save');
        // Let the child component handle success toast
    };

    if (loading) {
        return <div className="p-12 flex justify-center text-slate-400"><Loader2 className="animate-spin" /></div>;
    }

    const tabs = [
        { id: 'profile', label: 'Profile & Focus', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'billing', label: 'Billing & Plan', icon: Wallet },
        { id: 'data', label: 'Data & Privacy', icon: Database },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
            <p className="text-slate-500 mb-8">Manage your account preferences and investment profile.</p>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="space-y-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all ${activeTab === tab.id
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                        >
                            <tab.icon size={18} className={activeTab === tab.id ? 'text-emerald-400' : 'text-slate-400'} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                    {activeTab === 'profile' && (
                        <ProfileTab initialData={formData} onSave={handleSave} />
                    )}
                    {activeTab === 'notifications' && (
                        <NotificationsTab initialData={formData} onSave={handleSave} />
                    )}
                    {activeTab === 'security' && <SecurityTab />}
                    {activeTab === 'billing' && <BillingTab />}
                    {activeTab === 'data' && <DataPrivacyTab />}
                </div>
            </div>
        </div>
    );
}


