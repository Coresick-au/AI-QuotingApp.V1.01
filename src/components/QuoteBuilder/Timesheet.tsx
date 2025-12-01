
import { Plus, Trash2 } from 'lucide-react';
import type { Shift, CalculatedShift } from '../../types';

interface TimesheetProps {
    shifts: Shift[];
    technicians: string[];
    isLocked: boolean;
    addShift: () => void;
    updateShift: (id: number, field: keyof Shift, value: any) => void;
    removeShift: (id: number) => void;
    calculateShiftBreakdown: (shift: Shift) => CalculatedShift;
    formatMoney: (amount: number) => string;
}

export default function Timesheet({
    shifts,
    technicians,
    isLocked,
    addShift,
    updateShift,
    removeShift,
    calculateShiftBreakdown,
    formatMoney
}: TimesheetProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-700">Timesheet & Hours</h2>
                    <p className="text-xs text-slate-500">Enter Start/Finish + Travel. Site hours are calculated automatically.</p>
                </div>
                {!isLocked && (
                    <button onClick={addShift} className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-1 hover:bg-blue-700">
                        <Plus size={16} /> Add Shift
                    </button>
                )}
            </div>

            <table className="w-full min-w-[1100px] text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                        <th className="p-3 w-32">Date</th>
                        <th className="p-3 w-32">Tech</th>
                        <th className="p-3 w-32">Type</th>
                        <th className="p-3 w-24">Start</th>
                        <th className="p-3 w-24">Finish</th>
                        <th className="p-3 w-20 text-center text-blue-800 bg-blue-50">Trav In</th>
                        <th className="p-3 w-20 text-center text-blue-800 bg-blue-50">Trav Out</th>
                        <th className="p-3 w-20 text-center font-bold">Site Hrs</th>
                        <th className="p-3 w-20 text-center font-bold text-slate-700">Total Hrs</th>
                        <th className="p-3 w-10 text-center">Veh?</th>
                        <th className="p-3 w-10 text-center">P.D?</th>
                        <th className="p-3 text-right">Cost</th>
                        <th className="p-3 w-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {shifts.map((shift) => {
                        const { cost, breakdown } = calculateShiftBreakdown(shift);
                        return (
                            <tr key={shift.id} className="hover:bg-slate-50">
                                <td className="p-3">
                                    <input
                                        disabled={isLocked}
                                        type="date"
                                        value={shift.date}
                                        className={`border rounded p-1 w-full ${isLocked ? 'bg-slate-100' : ''}`}
                                        onChange={(e) => updateShift(shift.id, 'date', e.target.value)}
                                    />
                                </td>
                                <td className="p-3">
                                    <select
                                        disabled={isLocked}
                                        className={`border rounded p-1 w-full ${isLocked ? 'bg-slate-100' : 'bg-white'}`}
                                        value={shift.tech}
                                        onChange={(e) => updateShift(shift.id, 'tech', e.target.value)}
                                    >
                                        {technicians.map((t, i) => (
                                            <option key={i} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-3">
                                    <select
                                        disabled={isLocked}
                                        className={`border rounded p-1 w-full ${isLocked ? 'bg-slate-100' : 'bg-white'}`}
                                        value={shift.dayType}
                                        onChange={(e) => updateShift(shift.id, 'dayType', e.target.value)}
                                    >
                                        <option value="weekday">Weekday</option>
                                        <option value="weekend">Weekend</option>
                                        <option value="publicHoliday">Public Holiday</option>
                                    </select>
                                </td>
                                <td className="p-3">
                                    <input
                                        disabled={isLocked}
                                        type="time"
                                        value={shift.startTime}
                                        className={`border rounded p-1 w-full text-center ${isLocked ? 'bg-slate-100' : ''}`}
                                        onChange={(e) => updateShift(shift.id, 'startTime', e.target.value)}
                                    />
                                </td>
                                <td className="p-3">
                                    <input
                                        disabled={isLocked}
                                        type="time"
                                        value={shift.finishTime}
                                        className={`border rounded p-1 w-full text-center ${isLocked ? 'bg-slate-100' : ''}`}
                                        onChange={(e) => updateShift(shift.id, 'finishTime', e.target.value)}
                                    />
                                </td>
                                <td className="p-3 bg-blue-50">
                                    <input
                                        disabled={isLocked}
                                        type="number" step="0.25"
                                        value={shift.travelIn}
                                        className={`border border-blue-200 rounded p-1 w-full text-center ${isLocked ? 'bg-slate-100' : ''}`}
                                        onChange={(e) => updateShift(shift.id, 'travelIn', parseFloat(e.target.value) || 0)}
                                    />
                                </td>
                                <td className="p-3 bg-blue-50">
                                    <input
                                        disabled={isLocked}
                                        type="number" step="0.25"
                                        value={shift.travelOut}
                                        className={`border border-blue-200 rounded p-1 w-full text-center ${isLocked ? 'bg-slate-100' : ''}`}
                                        onChange={(e) => updateShift(shift.id, 'travelOut', parseFloat(e.target.value) || 0)}
                                    />
                                </td>
                                <td className="p-3 text-center">
                                    <div className="font-bold text-slate-700">{breakdown.siteHours.toFixed(2)}</div>
                                    {breakdown.siteOT > 0 && <div className="text-[10px] text-amber-600">OT: {breakdown.siteOT.toFixed(2)}</div>}
                                </td>
                                <td className="p-3 text-center">
                                    <div className="font-bold text-slate-900 bg-slate-100 rounded px-1">{breakdown.totalHours.toFixed(2)}</div>
                                </td>
                                <td className="p-3 text-center">
                                    <input
                                        disabled={isLocked}
                                        type="checkbox"
                                        checked={shift.vehicle}
                                        onChange={(e) => updateShift(shift.id, 'vehicle', e.target.checked)}
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                </td>
                                <td className="p-3 text-center">
                                    <input
                                        disabled={isLocked}
                                        type="checkbox"
                                        checked={shift.perDiem}
                                        onChange={(e) => updateShift(shift.id, 'perDiem', e.target.checked)}
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                </td>
                                <td className="p-3 text-right font-mono text-xs">
                                    {formatMoney(cost)}
                                </td>
                                <td className="p-3 text-center">
                                    {!isLocked && (
                                        <button onClick={() => removeShift(shift.id)} className="text-slate-400 hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
