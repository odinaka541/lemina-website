'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const MOCK_NOTIFICATIONS = [
    {
        id: 1,
        title: 'New Deal Match',
        message: 'Paystack matches your investment thesis.',
        time: '2m ago',
        read: false,
        type: 'deal'
    },
    {
        id: 2,
        title: 'Alert Triggered',
        message: 'Flutterwave raised a Series E round.',
        time: '1h ago',
        read: false,
        type: 'alert'
    },
    {
        id: 3,
        title: 'System Update',
        message: 'Platform maintenance scheduled for tonight.',
        time: '5h ago',
        read: true,
        type: 'system'
    }
];

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const containerRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const removeNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-[var(--color-text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[var(--color-bg-primary)]" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 animate-fade-in overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-[var(--color-accent-primary)] hover:text-emerald-700 font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <Bell size={24} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No notifications</p>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group relative ${!notification.read ? 'bg-emerald-50/50' : ''}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm font-bold ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                                            {notification.title}
                                        </h4>
                                        <span className="text-xs text-slate-400 font-medium">{notification.time}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 font-medium pr-6 leading-relaxed">
                                        {notification.message}
                                    </p>

                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.read && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); markAsRead(notification.id); }}
                                                className="p-1 text-slate-400 hover:text-[var(--color-accent-primary)] rounded"
                                                title="Mark as read"
                                            >
                                                <Check size={14} />
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeNotification(notification.id); }}
                                            className="p-1 text-slate-400 hover:text-red-500 rounded"
                                            title="Remove"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                        <Link href="/dashboard/alerts" className="block w-full text-center py-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
                            View All Notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
