import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Send, FileText, Zap, MessageSquare, Download, Share2, ChevronRight, Lock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AISidePanelProps {
    analysis: any;
    companyName: string;
    className?: string;
    companyId?: string;
}

export default function AISidePanel({ analysis, companyName, className = '', companyId }: AISidePanelProps) {
    const [activeTab, setActiveTab] = useState<'memo' | 'summary' | 'chat'>('memo');
    const [hasGenerated, setHasGenerated] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingStep, setLoadingStep] = useState('Initializing...');
    const [chatInput, setChatInput] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'ai', text: `Hi! I've analyzed ${companyName}. Ask me anything about their market, risks, or competition.` }
    ]);

    const handleGenerate = () => {
        setIsGenerating(true);
        setLoadingStep('Gathering public data...');

        setTimeout(() => setLoadingStep('Analyzing market structure...'), 800);
        setTimeout(() => setLoadingStep('Extracting key risks...'), 1600);
        setTimeout(() => setLoadingStep('Drafting investment memo...'), 2400);

        setTimeout(() => {
            setIsGenerating(false);
            setHasGenerated(true);
        }, 3200);
    };

    const router = useRouter(); // Initialize router

    const handleSendMessage = () => {
        if (!chatInput.trim()) return;
        setChatHistory([...chatHistory, { role: 'user', text: chatInput }]);
        setChatInput('');

        // Mock AI response for demo
        setTimeout(() => {
            setChatHistory(prev => [...prev, {
                role: 'ai',
                text: "That's a great question. Based on the data, the key risk is currency volatility in their primary market, which affects subscription pricing power."
            }]);
        }, 1000);
    };

    return (
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-xl shadow-indigo-900/5 overflow-hidden flex flex-col h-full ${className}`}>

            {/* Premium Header */}
            <div className="px-5 py-4 bg-[#0F172A] flex items-center justify-between shrink-0 relative overflow-hidden">
                {/* Background Sparkles/Glow */}
                <div className="absolute top-0 right-0 p-8 bg-indigo-500/10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>

                <div className="flex items-center gap-3 relative z-10">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
                        <Sparkles size={16} className="fill-indigo-300/20" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white tracking-wide">Lemina Intelligence</h2>
                        <p className="text-[10px] text-indigo-200/70 font-medium">Live Analysis • {companyName}</p>
                    </div>
                </div>
                <div className="px-2 py-1 rounded border border-white/10 bg-white/5 text-[10px] font-bold text-indigo-200">
                    BETA
                </div>
            </div>

            {/* Tabs */}
            <div className="px-2 border-b border-slate-100 flex items-center gap-1 shrink-0 bg-white pt-2">
                {[
                    { id: 'memo', label: 'Invesment Memo', icon: FileText, disabled: false },
                    { id: 'summary', label: 'Key Facts', icon: Zap, disabled: false },
                    { id: 'chat', label: 'Ask AI', icon: MessageSquare, disabled: true },
                ].map(tab => (
                    <button
                        key={tab.id}
                        disabled={tab.disabled}
                        onClick={() => !tab.disabled && setActiveTab(tab.id as any)}
                        className={`flex-1 pb-3 pt-2 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-all relative ${activeTab === tab.id
                            ? 'border-indigo-600 text-indigo-700 bg-indigo-50/10'
                            : tab.disabled
                                ? 'border-transparent text-slate-300 cursor-not-allowed'
                                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                    >
                        <tab.icon size={12} strokeWidth={2.5} />
                        {tab.label}
                        {tab.disabled && <Lock size={8} className="absolute top-2 right-2 opacity-50" />}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">

                {/* TAB: MEMO */}
                {activeTab === 'memo' && (
                    <div className="flex flex-col h-full">
                        {!hasGenerated && !isGenerating ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-xl shadow-indigo-100/50 flex items-center justify-center mb-6 relative group">
                                    <div className="absolute inset-0 bg-indigo-500/5 blur-xl rounded-full group-hover:bg-indigo-500/10 transition-all duration-500"></div>
                                    <Sparkles size={32} className="text-indigo-600 relative z-10" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Generate Investment Memo</h3>
                                <p className="text-sm text-slate-500 max-w-[240px] mb-8 leading-relaxed">
                                    Analyze <span className="font-semibold text-slate-700">{companyName}</span>'s market position, risks, and upside potential.
                                </p>
                                <button
                                    onClick={handleGenerate}
                                    className="group relative px-8 py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/30 hover:scale-[1.02] transition-all duration-300"
                                >
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 via-white/10 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={16} />
                                        <span>Generate Analysis</span>
                                    </div>
                                </button>
                            </div>
                        ) : isGenerating ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                                <div className="relative mb-6">
                                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Zap size={20} className="text-indigo-600 fill-indigo-600 animate-pulse" />
                                    </div>
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 mb-1">{loadingStep}</h4>
                                <p className="text-xs text-slate-500">This usually takes about 10 seconds...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                                    {/* Markdown Styling */}
                                    <div className="prose prose-sm prose-slate max-w-none 
                                        prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mb-3 prose-headings:mt-6
                                        prose-p:text-slate-600 prose-p:leading-7 prose-p:mb-4 prose-p:text-[13px]
                                        prose-strong:text-slate-800 prose-strong:font-bold
                                        prose-ul:my-4 prose-ul:list-disc prose-ul:pl-4
                                        prose-li:text-slate-600 prose-li:text-[13px] prose-li:mb-1
                                        marker:text-indigo-400
                                    ">
                                        <ReactMarkdown
                                            components={{
                                                h1: ({ node, ...props }) => <h1 className="text-xl border-b border-slate-100 pb-2 mb-4" {...props} />,
                                                h2: ({ node, ...props }) => <h2 className="text-sm uppercase tracking-wider text-slate-500 font-bold border-l-4 border-indigo-500 pl-3 mt-8 mb-4" {...props} />,
                                                h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-slate-900 mt-6 mb-2" {...props} />,
                                                ul: ({ node, ...props }) => <ul className="space-y-2 my-4" {...props} />,
                                                li: ({ node, ...props }) => (
                                                    <li className="flex gap-2 text-[13px] text-slate-600 leading-relaxed">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0 opacity-60"></div>
                                                        <span>{props.children}</span>
                                                    </li>
                                                )
                                            }}
                                        >
                                            {analysis?.investment_memo || ''}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {/* Sticky Footer Actions */}
                                <div className="p-4 border-t border-slate-100 bg-slate-50/50 backdrop-blur-sm sticky bottom-0 shrink-0">
                                    <div className="flex gap-3">
                                        <button className="flex-1 py-2.5 flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all group">
                                            <Download size={14} className="text-slate-400 group-hover:text-slate-600" />
                                            Download PDF
                                        </button>
                                        <button className="flex-1 py-2.5 flex items-center justify-center gap-2 bg-[#0F172A] border border-transparent rounded-xl text-xs font-bold text-white hover:bg-[#1E293B] shadow-lg shadow-slate-900/10 transition-all">
                                            <Share2 size={14} />
                                            Share Memo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: SUMMARY */}
                {activeTab === 'summary' && (
                    <div className="p-5 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Facts Grid */}
                        <div>
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3 px-1">Quick Facts</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(analysis?.quick_summary?.facts || {}).map(([key, val]: any) => (
                                    <div key={key} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <span className="block text-[10px] font-medium text-slate-500 capitalize mb-0.5">{key}</span>
                                        <span className="block text-sm font-bold text-slate-900 truncate" title={String(val)}>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Signal / Risk */}
                        <div className="space-y-4">
                            <div className="relative overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
                                <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <Zap size={14} className="fill-emerald-600 text-emerald-600" />
                                    </div>
                                    Key Strengths
                                </h3>
                                <ul className="space-y-3">
                                    {analysis?.signals?.map((sig: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2.5 text-xs font-medium text-slate-700 leading-relaxed">
                                            <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <ChevronRight size={10} className="text-emerald-600 stroke-[3]" />
                                            </div>
                                            {sig}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="relative overflow-hidden rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5">
                                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                                        <Zap size={14} className="fill-amber-600 text-amber-600" />
                                    </div>
                                    Risk Factors
                                </h3>
                                <ul className="space-y-3">
                                    {analysis?.risks?.map((risk: string, i: number) => (
                                        <li key={i} className="flex items-start gap-2.5 text-xs font-medium text-slate-700 leading-relaxed">
                                            <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                            </div>
                                            {risk}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB: CHAT */}
                {activeTab === 'chat' && (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex-1 p-4 space-y-4">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-[#0F172A] text-white rounded-br-none'
                                        : 'bg-slate-100 text-slate-700 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                                    placeholder="Ask for more details..."
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!chatInput.trim()}
                                    className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-500/20"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
