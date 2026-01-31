import { MessageSquare, ThumbsUp, CornerDownRight, Bold, Italic, List, Paperclip, AtSign } from 'lucide-react';

interface DiscussionSectionProps {
    discussion: any[];
}

export default function DiscussionSection({ discussion }: DiscussionSectionProps) {
    const Comment = ({ comment, isReply = false }: any) => (
        <div className={`flex gap-3 ${isReply ? 'ml-8 mt-3 relative' : 'border-b border-slate-100 pb-6 mb-6 last:border-0 last:mb-0 last:pb-0'}`}>
            {isReply && <div className="absolute -left-5 top-0 w-3 h-3 border-l border-b border-slate-200 rounded-bl-lg"></div>}

            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 font-bold text-xs text-slate-500">
                {comment.user.name.charAt(0)}
            </div>

            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900">{comment.user.name}</span>
                    {comment.user.is_lead && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded">DEAL LEAD</span>
                    )}
                    <span className="text-xs text-slate-400">• {comment.time_ago}</span>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed mb-2">
                    {comment.text}
                </p>

                <div className="flex items-center gap-4">
                    <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1">
                        <CornerDownRight size={12} /> Reply
                    </button>
                    <button className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1">
                        <ThumbsUp size={12} /> {comment.helpful_count > 0 && comment.helpful_count} Helpful
                    </button>
                </div>

                {comment.replies && comment.replies.map((reply: any) => (
                    <Comment key={reply.id} comment={reply} isReply={true} />
                ))}
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
                <select className="text-xs font-bold text-slate-500 bg-transparent border-none outline-none cursor-pointer hover:text-slate-700">
                    <option>Most Helpful</option>
                    <option>Recent</option>
                </select>
            </div>

            <div className="mb-6">
                {discussion.map((comment: any) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
            </div>

            {/* Comment Box */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500/50 transition-all">
                <textarea
                    placeholder="Add your thoughts or questions..."
                    className="w-full bg-transparent text-sm border-none outline-none resize-none min-h-[80px]"
                ></textarea>

                <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-200">
                    <div className="flex gap-2 text-slate-400">
                        <button className="p-1 hover:bg-slate-200 rounded"><Bold size={14} /></button>
                        <button className="p-1 hover:bg-slate-200 rounded"><Italic size={14} /></button>
                        <button className="p-1 hover:bg-slate-200 rounded"><List size={14} /></button>
                        <div className="w-px h-4 bg-slate-300 mx-1 self-center"></div>
                        <button className="p-1 hover:bg-slate-200 rounded"><Paperclip size={14} /></button>
                        <button className="p-1 hover:bg-slate-200 rounded"><AtSign size={14} /></button>
                    </div>
                    <button className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                        Post Comment
                    </button>
                </div>
            </div>
        </div>
    );
}
