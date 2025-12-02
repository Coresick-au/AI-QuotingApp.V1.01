
import { useState } from 'react';
import { FileText, Plus, Trash2, FolderOpen, Users, Wrench } from 'lucide-react';
import type { Quote, Customer, Rates } from '../types';
import CustomerDashboard from './CustomerDashboard';
import TechnicianDashboard from './TechnicianDashboard';

interface DashboardProps {
    savedQuotes: Quote[];
    createNewQuote: () => void;
    loadQuote: (id: string) => void;
    deleteQuote: (id: string) => void;
    savedCustomers: Customer[];
    saveCustomer: (customer: Customer) => void;
    deleteCustomer: (id: string) => void;
    savedTechnicians: string[];
    saveTechnician: (name: string) => void;
    deleteTechnician: (name: string) => void;
    saveAsDefaults: (rates: Rates) => void;
    resetToDefaults: () => void;
    savedDefaultRates: Rates;
}

export default function Dashboard({
    savedQuotes, createNewQuote, loadQuote, deleteQuote,
    savedCustomers, saveCustomer, deleteCustomer,
    savedTechnicians, saveTechnician, deleteTechnician,
    saveAsDefaults, resetToDefaults, savedDefaultRates
}: DashboardProps) {
    const [view, setView] = useState<'quotes' | 'customers' | 'technicians'>('quotes');
    const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'quoted' | 'invoice'>('all');

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this quote?")) {
            deleteQuote(id);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header & Tabs */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Service Quoter</h1>
                        <p className="text-slate-500 mt-1">Manage quotes, customers, and technicians</p>
                    </div>

                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setView('quotes')}
                            className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors ${view === 'quotes' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <FileText size={18} /> Quotes
                        </button>
                        <button
                            onClick={() => setView('customers')}
                            className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors ${view === 'customers' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Users size={18} /> Customers
                        </button>
                        <button
                            onClick={() => setView('technicians')}
                            className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors ${view === 'technicians' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Wrench size={18} /> Technicians
                        </button>
                    </div>
                </div>

                {view === 'quotes' && (
                    <div className="flex gap-2 mb-6">
                        {(['all', 'draft', 'quoted', 'invoice'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${filterStatus === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                )}

                {view === 'quotes' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* New Quote Card */}
                        <button
                            onClick={createNewQuote}
                            className="flex flex-col items-center justify-center h-48 bg-white border-2 border-dashed border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <span className="font-semibold text-slate-700">Create New Quote</span>
                        </button>

                        {/* Filtered Quotes */}
                        {savedQuotes
                            .filter(q => filterStatus === 'all' || q.status === filterStatus)
                            .sort((a, b) => b.lastModified - a.lastModified)
                            .map((quote) => (
                                <div
                                    key={quote.id}
                                    onClick={() => loadQuote(quote.id)}
                                    className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer relative group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wide ${quote.status === 'draft' ? 'bg-slate-100 text-slate-600' :
                                            quote.status === 'quoted' ? 'bg-amber-100 text-amber-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                            {quote.status}
                                        </div>
                                        <button
                                            onClick={(e) => handleDelete(e, quote.id)}
                                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <h3 className="font-semibold text-lg text-slate-800 mb-1">
                                        {quote.jobDetails.jobNo || 'Untitled Job'}
                                    </h3>
                                    <p className="text-slate-500 text-sm mb-4">
                                        {quote.jobDetails.customer || 'No Customer'}
                                    </p>

                                    <div className="flex items-center gap-2 text-sm text-slate-400 mt-auto">
                                        <FolderOpen size={14} />
                                        <span>Last edited {new Date(quote.lastModified).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : view === 'customers' ? (
                    <CustomerDashboard
                        savedCustomers={savedCustomers}
                        saveCustomer={saveCustomer}
                        deleteCustomer={deleteCustomer}
                        saveAsDefaults={saveAsDefaults}
                        resetToDefaults={resetToDefaults}
                        savedDefaultRates={savedDefaultRates}
                    />
                ) : (
                    <TechnicianDashboard
                        savedTechnicians={savedTechnicians}
                        saveTechnician={saveTechnician}
                        deleteTechnician={deleteTechnician}
                    />
                )}
            </div>
        </div>
    );
}
