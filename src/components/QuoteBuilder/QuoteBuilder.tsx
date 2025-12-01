
import { Save, Lock, FileCheck, Unlock, ArrowLeft } from 'lucide-react';
import JobDetails from './JobDetails';
import Timesheet from './Timesheet';
import Extras from './Extras';
import type { useQuote } from '../../hooks/useQuote';

interface QuoteBuilderProps {
    quote: ReturnType<typeof useQuote>;
}

export default function QuoteBuilder({ quote }: QuoteBuilderProps) {
    const {
        status, setStatus,
        jobDetails, setJobDetails,
        shifts, addShift, updateShift, removeShift, calculateShiftBreakdown,
        extras, addExtra, updateExtra, removeExtra,
        isLocked, exitQuote, savedQuotes, loadQuote, activeQuoteId,
        savedCustomers, setRates, savedTechnicians
    } = quote;

    const saveQuoteToSystem = () => {
        if (!jobDetails.customer || !jobDetails.jobNo) {
            alert("Please enter Customer Name and Job Number before saving.");
            return;
        }
        setStatus('quoted');
        alert("Quote saved to system! It is now locked. Convert to Invoice to edit actuals.");
    };

    const convertToDraftInvoice = () => {
        setStatus('invoice');
    };

    const unlockQuote = () => {
        if (confirm("Are you sure you want to unlock this quote? It will revert to draft status.")) {
            setStatus('draft');
        }
    };

    const formatMoney = (amount: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);

    return (
        <div className="space-y-6">
            {/* Workflow Controls */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button
                        onClick={exitQuote}
                        className="text-slate-500 hover:text-slate-700 flex items-center gap-1 text-sm font-medium"
                    >
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>

                    {savedQuotes.length > 1 && (
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-slate-600">Switch Quote:</label>
                            <select
                                value={activeQuoteId || ''}
                                onChange={(e) => loadQuote(e.target.value)}
                                className="border border-slate-300 rounded px-3 py-1.5 text-sm bg-white hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                            >
                                {savedQuotes.map((q) => (
                                    <option key={q.id} value={q.id}>
                                        {q.jobDetails.customer || 'Untitled'} - {q.jobDetails.jobNo || 'No Job #'} ({q.status})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    {status === 'draft' && (
                        <button
                            onClick={saveQuoteToSystem}
                            className="bg-green-600 text-white px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-green-700 font-medium"
                        >
                            <Save size={18} /> Add Quote to System
                        </button>
                    )}
                    {status === 'quoted' && (
                        <div className="flex items-center gap-3">
                            <span className="text-slate-500 text-sm flex items-center gap-1"><Lock size={14} /> Quote is Locked</span>
                            <button
                                onClick={unlockQuote}
                                className="bg-amber-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2 hover:bg-amber-700 font-medium"
                            >
                                <Unlock size={16} /> Unlock to Edit
                            </button>
                            <button
                                onClick={convertToDraftInvoice}
                                className="bg-purple-600 text-white px-4 py-2 rounded shadow flex items-center gap-2 hover:bg-purple-700 font-medium"
                            >
                                <FileCheck size={18} /> Convert to Draft Invoice
                            </button>
                        </div>
                    )}
                    {status === 'invoice' && (
                        <div className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded border border-purple-200 text-purple-800">
                            <Unlock size={14} />
                            <span className="text-sm font-medium">Invoice Mode: Adjust hours to actuals</span>
                        </div>
                    )}
                </div>
            </div>

            <JobDetails
                jobDetails={jobDetails}
                setJobDetails={setJobDetails}
                isLocked={isLocked}
                savedCustomers={savedCustomers}
                setRates={setRates}
                savedTechnicians={savedTechnicians}
            />

            <Timesheet
                shifts={shifts}
                technicians={jobDetails.technicians}
                isLocked={isLocked}
                addShift={addShift}
                updateShift={updateShift}
                removeShift={removeShift}
                calculateShiftBreakdown={calculateShiftBreakdown}
                formatMoney={formatMoney}
            />

            <Extras
                extras={extras}
                isLocked={isLocked}
                addExtra={addExtra}
                updateExtra={updateExtra}
                removeExtra={removeExtra}
            />
        </div>
    );
}
