import { useRef, useState, useEffect } from 'react';
import { X, Calendar, Trash2, Reply, Send, MoreHorizontal, User, CornerDownRight } from 'lucide-react';

export interface Note {
    id: string;
    content: string;
    date: string; // ISO string
    author: string; // "You" or "System" or others
    replies?: Note[];
}

interface PrivateNotesHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyName: string;
    notes: Note[];
    onAddNote: (note: Note) => void;
    onDeleteNote: (noteId: string) => void;
    onReplyNote: (parentId: string, reply: Note) => void;
}

export default function PrivateNotesHistoryModal({
    isOpen,
    onClose,
    companyName,
    notes,
    onAddNote,
    onDeleteNote,
    onReplyNote
}: PrivateNotesHistoryModalProps) {
    const [newNote, setNewNote] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom directly when opening or when notes change
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isOpen, notes]);

    if (!isOpen) return null;

    const handleSendMain = () => {
        if (!newNote.trim()) return;
        const note: Note = {
            id: Date.now().toString(),
            content: newNote,
            date: new Date().toISOString(),
            author: "You",
            replies: []
        };
        onAddNote(note);
        setNewNote('');
    };

    const handleSendReply = (parentId: string) => {
        if (!replyText.trim()) return;
        const reply: Note = {
            id: Date.now().toString(),
            content: replyText,
            date: new Date().toISOString(),
            author: "You"
        };
        onReplyNote(parentId, reply);
        setReplyText('');
        setReplyingTo(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100 flex flex-col h-[600px] max-h-[85vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Private Notes</h3>
                        <p className="text-xs text-slate-500">History for {companyName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white custom-scrollbar">
                    {notes.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                <MoreHorizontal size={24} className="text-slate-400" />
                            </div>
                            <p className="text-sm font-medium text-slate-500">No notes yet</p>
                            <p className="text-xs text-slate-400 max-w-[200px] mt-1">Start writing your private thoughts about this company.</p>
                        </div>
                    ) : (
                        notes.map((note) => (
                            <div key={note.id} className="relative group/note">
                                {/* Note Card */}
                                <div className="flex gap-3">
                                    <div className="flex-col items-center hidden sm:flex">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                            <User size={14} />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="bg-slate-50 rounded-2xl rounded-tl-none p-4 border border-slate-100 hover:border-indigo-100 transition-colors relative">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-900">{note.author}</span>
                                                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 bg-white rounded border border-slate-100">
                                                        {new Date(note.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => setReplyingTo(replyingTo === note.id ? null : note.id)}
                                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                                        title="Reply"
                                                    >
                                                        <Reply size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => onDeleteNote(note.id)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                                {note.content}
                                            </p>
                                        </div>

                                        {/* Replies */}
                                        {note.replies && note.replies.length > 0 && (
                                            <div className="space-y-3 pl-4 border-l-2 border-slate-100">
                                                {note.replies.map(reply => (
                                                    <div key={reply.id} className="flex gap-3 relative">
                                                        <CornerDownRight className="absolute -left-7 top-4 text-slate-300" size={16} />
                                                        <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm flex-1">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-xs font-bold text-slate-700">{reply.author}</span>
                                                                <span className="text-[10px] text-slate-400">
                                                                    {new Date(reply.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-slate-600 leading-relaxed">{reply.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Reply Input */}
                                        {replyingTo === note.id && (
                                            <div className="flex gap-2 items-center animate-in slide-in-from-top-2 fade-in pl-4">
                                                <div className="flex-1 relative">
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        placeholder="Write a reply..."
                                                        className="w-full pl-3 pr-10 py-2 bg-white border border-indigo-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSendReply(note.id)}
                                                    />
                                                    <button
                                                        onClick={() => handleSendReply(note.id)}
                                                        className="absolute right-1.5 top-1.5 p-1 text-indigo-600 hover:bg-indigo-50 rounded-md"
                                                    >
                                                        <Send size={14} />
                                                    </button>
                                                </div>
                                                <button onClick={() => setReplyingTo(null)} className="p-2 text-slate-400 hover:text-slate-600">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer / Main Input */}
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <div className="relative bg-white rounded-xl border border-slate-200 shadow-sm focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMain();
                                }
                            }}
                            placeholder="Type a new note..."
                            className="w-full bg-transparent p-3 pr-12 text-sm text-slate-700 placeholder:text-slate-400 outline-none resize-none h-[50px] max-h-[120px]"
                        />
                        <button
                            onClick={handleSendMain}
                            disabled={!newNote.trim()}
                            className="absolute right-2 bottom-2 p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
