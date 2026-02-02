'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, ThumbsUp, CornerDownRight, Bold, Italic, List, Paperclip, AtSign, MoreHorizontal, Trash2, Edit2, X, FileText } from 'lucide-react';

interface User {
    name: string;
    avatar: string | null;
    is_lead: boolean;
}

interface Attachment {
    name: string;
    type: string;
    size: string;
}

interface CommentData {
    id: string;
    user: User;
    text: string;
    timestamp: Date; // Use Date object for sorting
    helpful_count: number;
    replies: CommentData[];
    attachments?: Attachment[];
    is_liked?: boolean;
}

interface DiscussionSectionProps {
    discussion: any[];
}

const CURRENT_USER: User = { name: 'Odinaka', avatar: null, is_lead: true };

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

// Parse mock time string to Date object
const parseMockDate = (timeAgoStr: string) => {
    const now = new Date();
    if (!timeAgoStr) return now;

    const parts = timeAgoStr.split(' ');
    // Handle "Just now" or irregular formats
    if (parts.length < 2) return now;

    const val = parseInt(parts[0]);
    const unit = parts[1]; // 'm', 'h', 'd' usually accompanied by 'ago'

    if (isNaN(val)) return now;

    if (unit.startsWith('m')) return new Date(now.getTime() - val * 60000);
    if (unit.startsWith('h')) return new Date(now.getTime() - val * 3600000);
    if (unit.startsWith('d')) return new Date(now.getTime() - val * 86400000);

    return now;
};

// Simple Time Ago helper
const timeAgo = (date: Date) => {
    const diff = (new Date().getTime() - new Date(date).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
};

export default function DiscussionSection({ discussion: initialDiscussion }: DiscussionSectionProps) {
    // Transform initial data to include Date objects if they are strings
    const [comments, setComments] = useState<CommentData[]>(() =>
        initialDiscussion.map(c => ({
            ...c,
            timestamp: parseMockDate(c.time_ago),
            replies: c.replies?.map((r: any) => ({ ...r, timestamp: parseMockDate(r.time_ago) })) || [],
            attachments: []
        }))
    );
    const [sortMode, setSortMode] = useState<'helpful' | 'recent'>('helpful');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const VISIBLE_LIMIT = 3;

    // Main Input State
    const [inputText, setInputText] = useState('');
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sorting Logic
    const sortedComments = [...comments].sort((a, b) => {
        if (sortMode === 'helpful') return b.helpful_count - a.helpful_count;
        return b.timestamp.getTime() - a.timestamp.getTime();
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAttachments(prev => [...prev, {
                name: file.name,
                type: file.type,
                size: `${(file.size / 1024).toFixed(1)} KB`
            }]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handlePost = () => {
        if (!inputText.trim() && attachments.length === 0) return;

        const newComment: CommentData = {
            id: generateId(),
            user: CURRENT_USER,
            text: inputText,
            timestamp: new Date(),
            helpful_count: 0,
            replies: [],
            attachments: [...attachments]
        };

        setComments(prev => [newComment, ...prev]);
        setInputText('');
        setAttachments([]);
    };

    const handleReply = (parentId: string, text: string, replyAttachments: Attachment[]) => {
        const newReply: CommentData = {
            id: generateId(),
            user: CURRENT_USER,
            text: text,
            timestamp: new Date(),
            helpful_count: 0,
            replies: [] // Nested replies are flat in this UI for depth=2 usually, but structure supports deep nesting
        };

        setComments(prev => prev.map(c => {
            if (c.id === parentId) {
                return { ...c, replies: [...c.replies, newReply] };
            }
            return c;
        }));
        setReplyingTo(null);
    };

    const handleEdit = (id: string, newText: string, parentId?: string) => {
        if (parentId) {
            setComments(prev => prev.map(c => {
                if (c.id === parentId) {
                    return {
                        ...c,
                        replies: c.replies.map(r => r.id === id ? { ...r, text: newText } : r)
                    };
                }
                return c;
            }));
        } else {
            setComments(prev => prev.map(c => c.id === id ? { ...c, text: newText } : c));
        }
        setEditingId(null);
    };

    const toggleLike = (id: string, parentId?: string) => {
        const updater = (c: CommentData) => {
            if (c.id === id) {
                return {
                    ...c,
                    helpful_count: c.is_liked ? c.helpful_count - 1 : c.helpful_count + 1,
                    is_liked: !c.is_liked
                };
            }
            return c;
        };

        if (parentId) {
            setComments(prev => prev.map(c => {
                if (c.id === parentId) {
                    return { ...c, replies: c.replies.map(updater) };
                }
                return c;
            }));
        } else {
            setComments(prev => prev.map(updater));
        }
    };

    // Sub-component for individual comments
    const CommentItem = ({ comment, parentId }: { comment: CommentData, parentId?: string }) => {
        const isEditing = editingId === comment.id;
        const [editText, setEditText] = useState(comment.text);
        const [replyText, setReplyText] = useState('');

        return (
            <div className={`group flex gap-3 ${parentId ? 'ml-10 mt-4 relative' : 'border-b border-slate-100 pb-6 mb-6 last:border-0 last:mb-0'}`}>
                {parentId && <div className="absolute -left-6 top-0 w-4 h-4 border-l-2 border-b-2 border-slate-200 rounded-bl-xl"></div>}

                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 font-bold text-sm text-slate-500 shadow-sm">
                    {comment.user.name.charAt(0)}
                </div>

                <div className="flex-1 w-full min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{comment.user.name}</span>
                            {comment.user.is_lead && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100 uppercase tracking-wide">Deal Lead</span>
                            )}
                            <span className="text-xs text-slate-400 font-medium">• {timeAgo(comment.timestamp)}</span>
                        </div>
                        {comment.user.name === CURRENT_USER.name && !isEditing && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button onClick={() => { setEditingId(comment.id); setEditText(comment.text); }} className="text-slate-400 hover:text-indigo-600"><Edit2 size={12} /></button>
                                <button className="text-slate-400 hover:text-red-600"><Trash2 size={12} /></button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mb-2">
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                                rows={3}
                                autoFocus
                            />
                            <div className="flex gap-2 justify-end mt-2">
                                <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                                <button onClick={() => handleEdit(comment.id, editText, parentId)} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700">Save Changes</button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2 mb-2">
                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                            {comment.attachments && comment.attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {comment.attachments.map((file, idx) => (
                                        <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg max-w-fit">
                                            <div className="bg-white p-1 rounded shadow-sm">
                                                <FileText size={14} className="text-indigo-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{file.name}</span>
                                                <span className="text-[10px] text-slate-400">{file.size}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {!isEditing && (
                        <div className="flex items-center gap-4">
                            {!parentId && (
                                <button
                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                    className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${replyingTo === comment.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    <CornerDownRight size={13} /> {replyingTo === comment.id ? 'Cancel Reply' : 'Reply'}
                                </button>
                            )}
                            <button
                                onClick={() => toggleLike(comment.id, parentId)}
                                className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${comment.is_liked ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                <ThumbsUp size={13} className={comment.is_liked ? 'fill-current' : ''} />
                                {comment.helpful_count > 0 ? `${comment.helpful_count} Helpful` : 'Helpful'}
                            </button>
                        </div>
                    )}

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                        <div className="mt-3 ml-2 flex gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 text-white text-xs font-bold">
                                {CURRENT_USER.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={`Reply to ${comment.user.name}...`}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none mb-2"
                                    rows={2}
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => handleReply(comment.id, replyText, [])}
                                        disabled={!replyText.trim()}
                                        className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Post Reply
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Render Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2">
                            {comment.replies.map(reply => (
                                <CommentItem key={reply.id} comment={reply} parentId={comment.id} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Modal Component
    const DiscussionModal = () => (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <MessageSquare size={24} className="text-indigo-600" />
                            Full Discussion
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">{comments.length} comments in this thread</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="space-y-4">
                        {sortedComments.map((comment) => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </div>
                </div>

                {/* Modal Footer (Input) */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
                    <div className="bg-white rounded-xl p-4 border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/50 transition-all shadow-sm">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Add to the discussion..."
                            className="w-full bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 border-none outline-none resize-none min-h-[60px]"
                        ></textarea>

                        {attachments.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3 px-1">
                                {attachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-600">
                                        <span className="max-w-[120px] truncate">{file.name}</span>
                                        <button onClick={() => removeAttachment(idx)} className="hover:text-red-500"><X size={12} /></button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-3 mt-1 border-t border-slate-100">
                            <div className="flex gap-1 text-slate-400">
                                <button onClick={() => setInputText(prev => prev + "**bold** ")} className="p-1.5 hover:bg-slate-100 hover:text-indigo-600 rounded"><Bold size={15} /></button>
                                <button onClick={() => setInputText(prev => prev + "_italic_ ")} className="p-1.5 hover:bg-slate-100 hover:text-indigo-600 rounded"><Italic size={15} /></button>
                                <button onClick={() => setInputText(prev => prev + "\n- ")} className="p-1.5 hover:bg-slate-100 hover:text-indigo-600 rounded"><List size={15} /></button>
                                <div className="w-px h-5 bg-slate-200 mx-1.5 self-center"></div>
                                <button onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-slate-100 hover:text-indigo-600 rounded"><Paperclip size={15} /></button>
                                <button onClick={() => setInputText(prev => prev + "@")} className="p-1.5 hover:bg-slate-100 hover:text-indigo-600 rounded"><AtSign size={15} /></button>
                            </div>
                            <button
                                onClick={() => { handlePost(); setIsModalOpen(false); }}
                                disabled={!inputText.trim() && attachments.length === 0}
                                className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare size={20} className="text-slate-400" />
                    Network Discussion
                </h3>
                <div className="relative">
                    <select
                        value={sortMode}
                        onChange={(e: any) => setSortMode(e.target.value)}
                        className="text-xs font-bold text-slate-500 bg-transparent border-none outline-none cursor-pointer hover:text-slate-700 appearance-none pr-4"
                    >
                        <option value="helpful">Most Helpful</option>
                        <option value="recent">Recent</option>
                    </select>
                </div>
            </div>

            <div className="my-6 space-y-2">
                {sortedComments.slice(0, VISIBLE_LIMIT).map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}

                {sortedComments.length > VISIBLE_LIMIT && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-3 mt-4 text-sm font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 border border-dashed border-slate-200 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        View {sortedComments.length - VISIBLE_LIMIT} more comments
                        <CornerDownRight size={14} />
                    </button>
                )}
            </div>

            {/* Main Post Input - Only show if not scrolling or hidden (Actually, keeping it always visible on the card is good UX, users expect a 'Write a comment' box at the bottom) */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/50 transition-all shadow-inner">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Add your thoughts or questions..."
                    className="w-full bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 border-none outline-none resize-none min-h-[80px]"
                ></textarea>

                {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3 px-1">
                        {attachments.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 animate-in fade-in zoom-in duration-200">
                                <span className="max-w-[120px] truncate">{file.name}</span>
                                <button onClick={() => removeAttachment(idx)} className="hover:text-red-500"><X size={12} /></button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center pt-3 mt-1 border-t border-slate-200/60">
                    <div className="flex gap-1 text-slate-400">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                        <button onClick={() => setInputText(prev => prev + "**bold** ")} className="p-1.5 hover:bg-slate-200 hover:text-indigo-600 rounded transition-colors" title="Bold"><Bold size={15} /></button>
                        <button onClick={() => setInputText(prev => prev + "_italic_ ")} className="p-1.5 hover:bg-slate-200 hover:text-indigo-600 rounded transition-colors" title="Italic"><Italic size={15} /></button>
                        <button onClick={() => setInputText(prev => prev + "\n- ")} className="p-1.5 hover:bg-slate-200 hover:text-indigo-600 rounded transition-colors" title="List"><List size={15} /></button>
                        <div className="w-px h-5 bg-slate-300 mx-1.5 self-center"></div>
                        <button onClick={() => fileInputRef.current?.click()} className="p-1.5 hover:bg-slate-200 hover:text-indigo-600 rounded transition-colors" title="Attach File"><Paperclip size={15} /></button>
                        <button onClick={() => setInputText(prev => prev + "@")} className="p-1.5 hover:bg-slate-200 hover:text-indigo-600 rounded transition-colors" title="Mention"><AtSign size={15} /></button>
                    </div>
                    <button
                        onClick={handlePost}
                        disabled={!inputText.trim() && attachments.length === 0}
                        className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed active:scale-95"
                    >
                        Post Comment
                    </button>
                </div>
            </div>

            {/* Modal Portal */}
            {isModalOpen && <DiscussionModal />}
        </div>
    );
}
