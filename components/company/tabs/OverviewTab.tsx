
import { FileText, Download, CheckCircle, AlertTriangle } from 'lucide-react';

interface OverviewTabProps {
    company: any;
    // Analysis is passed if available, to show signals
    analysis?: any;
}

export default function OverviewTab({ company, analysis }: OverviewTabProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* About Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">About Company</h3>
                    <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-lg shadow-slate-200/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700"></div>

                    <p className="text-slate-600 leading-7 font-medium mb-8 relative z-10 text-sm max-w-4xl">
                        {company.description || "No detailed description available."}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-slate-100 relative z-10">
                        <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Founded</span>
                            <span className="text-base font-bold text-slate-900 font-mono tracking-tight">{company.founded_year || 'Unknown'}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Team Size</span>
                            <span className="text-base font-bold text-slate-900 font-mono tracking-tight">{company.employees_range || company.employee_count || 'Unknown'}</span>
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Website</span>
                            {company.website ? (
                                <a href={company.website} target="_blank" className="text-base font-bold text-indigo-600 hover:text-indigo-700 hover:underline truncate block transition-colors">
                                    {company.website.replace(/^https?:\/\//, '')}
                                </a>
                            ) : (
                                <span className="text-sm text-slate-400">N/A</span>
                            )}
                        </div>
                        <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">HQ</span>
                            <span className="text-base font-bold text-slate-900 font-mono tracking-tight">{company.location || 'Unknown'}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Funding Highlights (Conditional) */}
            {company.funding_amount > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Financial Profile</h3>
                        <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                    </div>
                    <div className="flex flex-wrap gap-5">
                        <div className="px-6 py-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default min-w-[180px]">
                            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1 group-hover:text-indigo-500 transition-colors">Total Raised</span>
                            <span className="block text-2xl font-bold text-slate-900 tracking-tight font-mono">${(company.funding_amount / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="px-6 py-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default min-w-[160px]">
                            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1 group-hover:text-indigo-500 transition-colors">Latest Stage</span>
                            <span className="block text-xl font-bold text-slate-900">{company.last_round_type || company.funding_stage || 'Seed'}</span>
                        </div>
                        {company.investors && company.investors.length > 0 && (
                            <div className="px-6 py-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-default flex-1">
                                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2 group-hover:text-indigo-500 transition-colors">Key Backers</span>
                                <div className="flex flex-wrap items-center gap-2">
                                    {company.investors.slice(0, 3).map((inv: string, i: number) => (
                                        <span key={i} className="text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg uppercase tracking-wide">{inv}</span>
                                    ))}
                                    {company.investors.length > 3 && <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">+{company.investors.length - 3}</span>}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Signals & Risks (If analysis available) */}
            {analysis && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Investment Thesis</h3>
                        <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-gradient-to-br from-emerald-50/80 to-white rounded-2xl border border-emerald-100/60 p-6 hover:shadow-md transition-shadow">
                            <h4 className="flex items-center gap-2 text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-5">
                                <div className="p-1 bg-emerald-100 rounded-md"><CheckCircle size={12} /></div> Bull Case
                            </h4>
                            <ul className="space-y-3">
                                {analysis.signals?.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium leading-relaxed">
                                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-sm shadow-emerald-200"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50/80 to-white rounded-2xl border border-amber-100/60 p-6 hover:shadow-md transition-shadow">
                            <h4 className="flex items-center gap-2 text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-5">
                                <div className="p-1 bg-amber-100 rounded-md"><AlertTriangle size={12} /></div> Key Risks
                            </h4>
                            <ul className="space-y-3">
                                {analysis.risks?.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium leading-relaxed">
                                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 shadow-sm shadow-amber-200"></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            )}

            {/* Documents Section */}
            {company.documents && company.documents.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Data Room</h3>
                        <span className="px-2.5 py-1 rounded-md bg-slate-50 text-[10px] font-bold text-slate-500 border border-slate-100 uppercase tracking-wide">{company.documents.length} files available</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {company.documents.map((doc: any, i: number) => (
                            <div key={i} className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                    <FileText size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">{doc.title}</h4>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-[10px] text-slate-500 font-medium">{doc.date}</span>
                                        <span className="text-[8px] font-bold text-slate-300">•</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-1.5 rounded border border-slate-100">{doc.file_type || 'PDF'}</span>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group-hover:text-indigo-500">
                                    <Download size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
