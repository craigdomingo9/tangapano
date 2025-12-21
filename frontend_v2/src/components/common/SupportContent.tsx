"use client";

import { MessageCircle, Phone } from "lucide-react";
import { SUPPORT_TEAM } from "@/constants/support";

export default function SupportContent() {
    const handleWhatsApp = (phone: string) => {
        const cleanPhone = phone.replace(/[\s+]/g, "");
        window.open(`https://wa.me/${cleanPhone}`, "_blank");
    };

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 flex flex-col items-center mb-10">
            {/* Hero Text */}
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    Need help? <br />
                    Contact our{" "}
                    <span className="text-slate-900 dark:text-white">support team.</span>
                </h1>
                <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                    Our team is here to assist you with any questions or issues you may
                    have.
                </p>
            </div>

            {/* Team Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {SUPPORT_TEAM.map((member, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div
                            className={`w-24 h-24 rounded-full ${member.color} text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-slate-200/50 dark:shadow-none`}
                        >
                            {member.initials}
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                            {member.name}
                        </h3>
                        <p className="text-xs text-lapis dark:text-sky-400 font-semibold uppercase tracking-wide mb-6 h-8 flex items-center justify-center leading-tight">
                            {member.role}
                        </p>

                        <div className="mt-auto space-y-4 w-full">
                            <a
                                href={`tel:${member.phone}`}
                                className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold underline decoration-slate-300 dark:decoration-slate-600 underline-offset-4"
                            >
                                <Phone className="w-4 h-4" />
                                {member.phone}
                            </a>

                            <button
                                onClick={() => handleWhatsApp(member.message || member.phone)}
                                className="w-full text-sm py-2.5 px-4 rounded-lg border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:border-emerald-500 dark:hover:border-emerald-500 font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Contact on WhatsApp
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
