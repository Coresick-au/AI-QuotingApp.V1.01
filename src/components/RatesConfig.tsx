
import type { Rates } from '../types';
import { Lock, Unlock, Calculator, PlusCircle, Save, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface RatesConfigProps {
    rates: Rates;
    setRates: (rates: Rates) => void;
    saveAsDefaults?: (rates: Rates) => void;
    resetToDefaults?: () => void;
}

export default function RatesConfig({ rates, setRates, saveAsDefaults, resetToDefaults }: RatesConfigProps) {
    const [isLocked, setIsLocked] = useState(true);
    const [calcKm, setCalcKm] = useState<number>(0);
    const [calcHours, setCalcHours] = useState<number>(0);

    const handleUnlock = () => {
        if (confirm("Are you sure you want to edit rates? These are typically fixed once set up for a customer.")) {
            setIsLocked(false);
        }
    };

    const handleLock = () => {
        setIsLocked(true);
    };

    const calculateTotal = () => {
        return (calcHours * rates.travel) + (calcKm * rates.travelCharge);
    };

    const addToExBrisbane = () => {
        const amountToAdd = calculateTotal();
        if (amountToAdd > 0) {
            setRates({
                ...rates,
                travelChargeExBrisbane: parseFloat((rates.travelChargeExBrisbane + amountToAdd).toFixed(2))
            });
            // Reset calculator inputs
            setCalcKm(0);
            setCalcHours(0);
        }
    };

    const handleSaveDefaults = () => {
        if (saveAsDefaults && confirm("Are you sure you want to set these rates as the new SYSTEM DEFAULTS? All new quotes will use these rates.")) {
            saveAsDefaults(rates);
            alert("New default rates saved.");
        }
    };

    const handleResetDefaults = () => {
        if (resetToDefaults && confirm("Are you sure you want to reset these rates to the SYSTEM DEFAULTS? This will overwrite current changes.")) {
            resetToDefaults();
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-700">Service Technician Rates</h2>
                    <p className="text-sm text-slate-500 mt-1">Configure hourly rates and allowances for this customer</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Default Management Buttons */}
                    {!isLocked && (saveAsDefaults || resetToDefaults) && (
                        <div className="flex items-center gap-2 mr-4 border-r pr-4 border-slate-200">
                            {resetToDefaults && (
                                <button
                                    onClick={handleResetDefaults}
                                    className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded text-sm font-medium flex items-center gap-1 hover:bg-slate-50"
                                    title="Load system default rates"
                                >
                                    <RotateCcw size={16} /> Load Defaults
                                </button>
                            )}
                            {saveAsDefaults && (
                                <button
                                    onClick={handleSaveDefaults}
                                    className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded text-sm font-medium flex items-center gap-1 hover:bg-slate-50"
                                    title="Save current rates as system defaults"
                                >
                                    <Save size={16} /> Set as Defaults
                                </button>
                            )}
                        </div>
                    )}

                    {isLocked ? (
                        <button
                            onClick={handleUnlock}
                            className="bg-amber-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-amber-700 font-medium"
                        >
                            <Unlock size={18} /> Unlock to Edit
                        </button>
                    ) : (
                        <button
                            onClick={handleLock}
                            className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700 font-medium"
                        >
                            <Lock size={18} /> Lock Rates
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Labor Rates */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide border-b pb-2">Labor Rates</h3>

                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Site Normal Working Hours - First 7.5hrs</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">$</span>
                            <input
                                disabled={isLocked}
                                type="number"
                                step="1"
                                value={rates.siteNormal}
                                onChange={(e) => setRates({ ...rates, siteNormal: parseFloat(e.target.value) || 0 })}
                                className={`border rounded p-2 w-full ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                            />
                            <span className="text-slate-500">/hr</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Site Overtime Rate - After 7.5 Normal Working Hours</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">$</span>
                            <input
                                disabled={isLocked}
                                type="number"
                                step="1"
                                value={rates.siteOvertime}
                                onChange={(e) => setRates({ ...rates, siteOvertime: parseFloat(e.target.value) || 0 })}
                                className={`border rounded p-2 w-full ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                            />
                            <span className="text-slate-500">/hr</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Saturday/Sunday</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">$</span>
                            <input
                                disabled={isLocked}
                                type="number"
                                step="1"
                                value={rates.weekend}
                                onChange={(e) => setRates({ ...rates, weekend: parseFloat(e.target.value) || 0 })}
                                className={`border rounded p-2 w-full ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                            />
                            <span className="text-slate-500">/hr</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Public Holidays</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">$</span>
                            <input
                                disabled={isLocked}
                                type="number"
                                step="1"
                                value={rates.publicHoliday}
                                onChange={(e) => setRates({ ...rates, publicHoliday: parseFloat(e.target.value) || 0 })}
                                className={`border rounded p-2 w-full ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                            />
                            <span className="text-slate-500">/hr</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Office Reporting Time</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">$</span>
                            <input
                                disabled={isLocked}
                                type="number"
                                step="1"
                                value={rates.officeReporting}
                                onChange={(e) => setRates({ ...rates, officeReporting: parseFloat(e.target.value) || 0 })}
                                className={`border rounded p-2 w-full ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                            />
                            <span className="text-slate-500">/hr</span>
                        </div>
                    </div>
                </div>

                {/* Travel & Allowances */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide border-b pb-2">Allowances & Other</h3>

                    {/* Moved Travel Rate and Travel Charge to Calculator section below */}

                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Travel Charge ex Brisbane</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">$</span>
                            <input
                                disabled={isLocked}
                                type="number"
                                step="0.01"
                                value={rates.travelChargeExBrisbane}
                                onChange={(e) => setRates({ ...rates, travelChargeExBrisbane: parseFloat(e.target.value) || 0 })}
                                className={`border rounded p-2 w-full ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                                placeholder="Input Value"
                            />
                            <span className="text-slate-500">/tech</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Site Vehicle</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">$</span>
                            <input
                                disabled={isLocked}
                                type="number"
                                step="1"
                                value={rates.vehicle}
                                onChange={(e) => setRates({ ...rates, vehicle: parseFloat(e.target.value) || 0 })}
                                className={`border rounded p-2 w-full ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                            />
                            <span className="text-slate-500">/day</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Technician Overnight Allowance</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">$</span>
                            <input
                                disabled={isLocked}
                                type="number"
                                step="1"
                                value={rates.perDiem}
                                onChange={(e) => setRates({ ...rates, perDiem: parseFloat(e.target.value) || 0 })}
                                className={`border rounded p-2 w-full ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                            />
                            <span className="text-slate-500">/night</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Standard Day Rate (12hrs)</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">$</span>
                            <input
                                disabled
                                type="number"
                                value={(rates.siteNormal * 7.5) + (rates.siteOvertime * 4.5)}
                                className="border rounded p-2 w-full bg-slate-100 text-slate-600 font-medium cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Calculated: (7.5h × Normal) + (4.5h × OT)</p>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Weekend Day Rate (12hrs)</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">$</span>
                            <input
                                disabled
                                type="number"
                                value={rates.weekend * 12}
                                className="border rounded p-2 w-full bg-slate-100 text-slate-600 font-medium cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Calculated: 12h × Weekend Rate</p>
                    </div>
                </div>
            </div>

            {/* Travel Calculator */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-semibold text-slate-700 text-sm mb-4 flex items-center gap-2">
                    <Calculator size={16} /> Travel Rates & Calculator
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Travel Rate - Normal Time</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">$</span>
                            <input
                                disabled={isLocked}
                                type="number"
                                step="1"
                                value={rates.travel}
                                onChange={(e) => setRates({ ...rates, travel: parseFloat(e.target.value) || 0 })}
                                className={`border rounded p-2 w-full ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                            />
                            <span className="text-slate-500">/hr</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-600 mb-1">Travel Charge</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">$</span>
                            <input
                                disabled={isLocked}
                                type="number"
                                step="0.01"
                                value={rates.travelCharge}
                                onChange={(e) => setRates({ ...rates, travelCharge: parseFloat(e.target.value) || 0 })}
                                className={`border rounded p-2 w-full ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                            />
                            <span className="text-slate-500">/km</span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Calculate Trip Cost</h4>
                    <div className="flex flex-wrap items-end gap-4">
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Hours</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={calcHours || ''}
                                    className="w-20 p-2 border rounded"
                                    onChange={(e) => setCalcHours(parseFloat(e.target.value) || 0)}
                                />
                                <span className="text-slate-500 text-sm">hrs</span>
                            </div>
                        </div>
                        <div className="pb-2 text-slate-400">+</div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Distance</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={calcKm || ''}
                                    className="w-24 p-2 border rounded"
                                    onChange={(e) => setCalcKm(parseFloat(e.target.value) || 0)}
                                />
                                <span className="text-slate-500 text-sm">km</span>
                            </div>
                        </div>
                        <div className="pb-2 text-slate-400">=</div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Total</label>
                            <div className="py-2 px-3 bg-white rounded border border-slate-300 text-slate-800 font-bold min-w-[100px]">
                                {new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(calculateTotal())}
                            </div>
                        </div>

                        <button
                            onClick={addToExBrisbane}
                            disabled={isLocked || (calcKm <= 0 && calcHours <= 0)}
                            className="mb-0.5 bg-blue-600 text-white px-4 py-2 rounded shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium"
                        >
                            <PlusCircle size={16} /> Add to Ex-Brisbane
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Calculates (Hours × Travel Rate) + (Distance × Travel Charge) and adds it to the "Travel Charge ex Brisbane" field.
                    </p>
                </div>
            </div>
        </div>
    );
}
