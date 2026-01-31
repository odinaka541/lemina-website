import { ShieldCheck, FileText, Users, Briefcase, Download } from 'lucide-react';

export default function TeamLegalTab({ founders, legal }: { founders: any[], legal: any }) {
    return (
        <div className="space-y-10 max-w-5xl animate-in fade-in duration-500">

            {/* Founders */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                        <Users size={16} /> Key People
                    </h3>
                    <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {founders.map((founder: any, i: number) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xl shrink-0 overflow-hidden shadow-inner group-hover:border-indigo-200 transition-colors">
                                    {founder.photo_url ? (
                                        <img src={founder.photo_url} alt={founder.name} className="w-full h-full object-cover" />
                                    ) : (
                                        founder.name.charAt(0)
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors truncate">{founder.name}</h4>
                                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide mb-2 bg-indigo-50 inline-block px-1.5 py-0.5 rounded border border-indigo-100 mt-1">{founder.title}</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed mt-4 line-clamp-3 font-medium group-hover:text-slate-600 transition-colors">
                                {founder.background}
                            </p>
                        </div>
                    ))}
                    {founders.length === 0 && <div className="text-slate-500 text-sm italic">No founder information available.</div>}
                </div>
            </section>

            {/* Legal */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                        <ShieldCheck size={16} /> Legal & Compliance
                    </h3>
                    <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Incorporation */}
                    <div className="bg-white px-6 py-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-emerald-200 hover:shadow-md transition-all">
                        <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Incorporation</span>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-900 text-lg">CAC Nigeria</span>
                                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wide">
                                    <ShieldCheck size={10} /> Verified
                                </span>
                            </div>
                            <span className="text-xs font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded inline-block">Reg: <span className="text-slate-700 font-bold">{legal.registration_number}</span></span>
                        </div>
                        <div className="text-right">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</span>
                            <span className="font-bold text-emerald-600 text-lg flex items-center justify-end gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                {legal.registration_status}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium uppercase mt-1 block">Since {legal.registration_date}</span>
                        </div>
                    </div>

                    {/* License (Mock) */}
                    <div className="bg-slate-50/50 px-6 py-5 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between opacity-70">
                        <div>
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Operating License</span>
                            <span className="font-bold text-slate-400 text-lg">N/A</span>
                        </div>
                        <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Not Applicable</div>
                    </div>
                </div>
            </section>

            {/* Documents */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Corporate Filings</h3>
                    <div className="h-px bg-slate-100 flex-1 ml-4"></div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 shadow-sm overflow-hidden">
                    {['Certificate of Incorporation', 'Shareholder Agreement', 'Memorandum of Association'].map((doc, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-indigo-50/30 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <FileText size={16} />
                                </div>
                                <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-900 transition-colors">{doc}</span>
                            </div>
                            <button className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1">
                                <Download size={12} /> DOWNLOAD
                            </button>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
