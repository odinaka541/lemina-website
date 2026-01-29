import Link from 'next/link';
import { Target, Search, FolderPlus, ArrowRight } from 'lucide-react';

export default function OnboardingState() {
    return (
        <div className="bg-indigo-900/5 border border-indigo-100 rounded-2xl p-6 md:p-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] rotate-12">
                <Target size={300} />
            </div>

            <div className="relative z-10 max-w-2xl">
                <h2 className="text-2xl font-bold text-indigo-950 mb-2 tracking-tight">Welcome to Your Investor Dashboard</h2>
                <p className="text-slate-600 mb-8 max-w-lg text-sm leading-relaxed">
                    Your personalized workspace for finding, tracking, and managing deal flow is ready. Here are 3 steps to get started:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Step 1 */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-50 hover:border-indigo-200 transition-colors group cursor-pointer relative">
                        <div className="absolute top-4 right-4 text-slate-200/50 font-black text-4xl leading-none select-none group-hover:text-indigo-50 transition-colors">1</div>
                        <div className="bg-slate-100 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 mb-3 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors relative z-10">
                            <Target size={16} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mb-1 relative z-10">Set Focus</h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3 relative z-10">Define your sectors, stages, and geography.</p>
                        <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 uppercase tracking-wide relative z-10">
                            Set Preferences <ArrowRight size={10} />
                        </span>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-50 hover:border-indigo-200 transition-colors group cursor-pointer relative">
                        <div className="absolute top-4 right-4 text-slate-200/50 font-black text-4xl leading-none select-none group-hover:text-emerald-50 transition-colors">2</div>
                        <div className="bg-slate-100 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 mb-3 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors relative z-10">
                            <Search size={16} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mb-1 relative z-10">Explore</h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3 relative z-10">Browse verified African startups.</p>
                        <Link href="/search" className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 uppercase tracking-wide relative z-10">
                            View Database <ArrowRight size={10} />
                        </Link>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-50 hover:border-indigo-200 transition-colors group cursor-pointer relative">
                        <div className="absolute top-4 right-4 text-slate-200/50 font-black text-4xl leading-none select-none group-hover:text-blue-50 transition-colors">3</div>
                        <div className="bg-slate-100 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 mb-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors relative z-10">
                            <FolderPlus size={16} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm mb-1 relative z-10">Track</h3>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3 relative z-10">Add matched companies to your pipeline.</p>
                        <Link href="/dashboard/pipeline" className="text-[10px] font-bold text-blue-600 flex items-center gap-1 uppercase tracking-wide relative z-10">
                            Go to Pipeline <ArrowRight size={10} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
