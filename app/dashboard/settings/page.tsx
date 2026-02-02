'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/providers/ToastProvider';
import { User, Bell, Shield, Wallet, Save, Loader2, Check, Database } from 'lucide-react';
import ProfileTab from '@/components/settings/ProfileTab';
import NotificationsTab from '@/components/settings/NotificationsTab';
import SecurityTab from '@/components/settings/SecurityTab';
import BillingTab from '@/components/settings/BillingTab';
import DataPrivacyTab from '@/components/settings/DataPrivacyTab';

import { useUser } from '@/components/providers/UserProvider';

export default function SettingsPage() {
    const { showToast } = useToast();
    const { refreshProfile } = useUser(); // Hook to update global state
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
                setFormData(prev => ({
                    ...prev,
                    full_name: json.data.full_name || '',
                    job_title: json.data.job_title || '',
                    company_name: json.data.company_name || '',
                    bio: json.data.bio || '',
                    email_notifications: json.data.email_notifications ?? true,
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
        setFormData(data);

        // Sanitize data: Postgres Time/Numeric columns hate empty strings ""
        const payload = {
            ...data,
            dnd_start_time: data.dnd_start_time === '' ? null : data.dnd_start_time,
            dnd_end_time: data.dnd_end_time === '' ? null : data.dnd_end_time,
            digest_time: data.digest_time === '' ? null : data.digest_time,
            min_check_size: data.min_check_size === '' ? null : data.min_check_size,
            max_check_size: data.max_check_size === '' ? null : data.max_check_size,
        };

        const res = await fetch('/api/settings/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errBody = await res.json();
            console.error('Save failed details:', errBody);
            throw new Error(errBody.error || 'Failed to save');
        }

        // Update global user context immediately
        await refreshProfile();
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
        <div className="min-h-screen bg-slate-50/50 pb-32">
            {/* Header - Glass Canopy */}
            <div className="border-b border-slate-200 bg-white/50 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-8 pt-20 max-w-6xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight font-sans">Settings & Preferences</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href="mailto:admin@lemina.co"
                                className="text-xs font-bold text-slate-500 hover:text-slate-900 px-4 py-2 uppercase tracking-wide transition-colors"
                            >
                                Help Center
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3 space-y-2 sticky top-32 self-start">
                        <div className="mb-4 px-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account</p>
                        </div>
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full group flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 border ${activeTab === tab.id
                                    ? 'bg-white border-indigo-100 shadow-md shadow-indigo-500/5 text-indigo-700'
                                    : 'bg-transparent border-transparent text-slate-500 hover:bg-white hover:border-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                <div className={`p-1.5 rounded-lg transition-colors ${activeTab === tab.id
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-slate-600'
                                    }`}>
                                    <tab.icon size={16} strokeWidth={2.5} />
                                </div>
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
            </div>
        </div>
    );
}


