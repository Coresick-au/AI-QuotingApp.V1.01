import React from 'react';
import { Briefcase, Calendar, Settings, FileText } from 'lucide-react';
import clsx from 'clsx';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    status: string;
    totalCost: number;
}

export default function Layout({ children, activeTab, setActiveTab, status, totalCost }: LayoutProps) {
    const formatMoney = (amount: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);

    const getStatusBadge = () => {
        switch (status) {
            case 'draft': return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">DRAFT QUOTE</span>;
            case 'quoted': return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">QUOTE SAVED</span>;
            case 'invoice': return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-bold">DRAFT INVOICE</span>;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <header className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-10">
                <div className="max-w-[95%] mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Briefcase size={24} /> Accurate Industries Service Quoter
                        </h1>
                        {getStatusBadge()}
                    </div>
                    <div className="text-right">
                        <div className="text-xs opacity-80">ESTIMATED TOTAL</div>
                        <div className="text-2xl font-bold">{formatMoney(totalCost)}</div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b border-slate-200">
                <div className="max-w-[95%] mx-auto flex gap-6 p-4 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('quote')}
                        className={clsx(
                            "flex items-center gap-2 pb-2 border-b-2 transition-colors",
                            activeTab === 'quote' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-slate-500'
                        )}
                    >
                        <Calendar size={18} /> {status === 'invoice' ? 'Invoice Builder' : 'Quote Builder'}
                    </button>
                    <button
                        onClick={() => setActiveTab('summary')}
                        className={clsx(
                            "flex items-center gap-2 pb-2 border-b-2 transition-colors",
                            activeTab === 'summary' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-slate-500'
                        )}
                    >
                        <FileText size={18} /> Summary
                    </button>
                    <button
                        onClick={() => setActiveTab('rates')}
                        className={clsx(
                            "flex items-center gap-2 pb-2 border-b-2 transition-colors",
                            activeTab === 'rates' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-slate-500'
                        )}
                    >
                        <Settings size={18} /> Rates Configuration
                    </button>
                </div>
            </nav>

            <main className="max-w-[95%] mx-auto p-4 md:p-6 space-y-6">
                {children}
            </main>
        </div>
    );
}
