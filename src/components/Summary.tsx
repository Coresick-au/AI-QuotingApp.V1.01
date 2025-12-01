
import { Copy, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import { useQuote } from '../hooks/useQuote';

interface SummaryProps {
    quote: ReturnType<typeof useQuote>;
}

export default function Summary({ quote }: SummaryProps) {
    const {
        shifts, extras, rates, calculateShiftBreakdown, totalCost, jobDetails, status,
        reportingCost, travelChargeCost
    } = quote;

    const formatMoney = (amount: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);

    const generateXeroString = () => {
        const typeLabel = status === 'invoice' ? 'INVOICE' : 'QUOTE';
        const techCount = jobDetails.technicians.length;
        const techLabel = techCount === 1 ? 'Service Technician' : 'Service Technicians';

        const formatDateWithDay = (dateStr: string) => {
            const date = new Date(dateStr + 'T00:00:00');
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayName = days[date.getDay()];

            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);

            return `${dayName} ${day}-${month}-${year}`;
        };

        const lines = shifts.map(s => {
            const { breakdown } = calculateShiftBreakdown(s);
            const travelIn = s.travelIn.toFixed(2);
            const travelOut = s.travelOut.toFixed(2);
            const siteTotal = (breakdown.siteNT + breakdown.siteOT).toFixed(2);
            const techName = s.tech || 'Tech 1';
            return `${formatDateWithDay(s.date)} (${techName}): ${s.startTime}-${s.finishTime} | Travel In: ${travelIn}h | Site: ${siteTotal}h | Travel Out: ${travelOut}h (${breakdown.siteNT.toFixed(2)} NT / ${breakdown.siteOT.toFixed(2)} OT)`;
        }).join('\n');

        const totalHours = shifts.reduce((acc, shift) => acc + calculateShiftBreakdown(shift).breakdown.totalHours, 0);

        let extraLines = '';
        if (reportingCost > 0) extraLines += `\nReporting Time: ${jobDetails.reportingTime}h`;
        if (travelChargeCost > 0) extraLines += `\nTravel Charge: ${formatMoney(travelChargeCost)}`;

        return `*** ${typeLabel} ***\nJob: ${jobDetails.jobNo} - ${jobDetails.customer}\n${techCount}x ${techLabel} to attend\n\n${jobDetails.description}\n\nBreakdown:\n${lines}${extraLines}\n\nTotal Hours: ${totalHours.toFixed(2)}\nIncludes Vehicle & Per Diems where applicable.`;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateXeroString());
        alert("Copied to clipboard!");
    };

    const exportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text(`Service ${status === 'invoice' ? 'Invoice' : 'Quote'}`, 20, 20);

        doc.setFontSize(12);
        doc.text(`Customer: ${jobDetails.customer}`, 20, 35);
        doc.text(`Job No: ${jobDetails.jobNo}`, 20, 42);
        doc.text(`Technician: ${jobDetails.techName}`, 20, 49);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 35);

        let y = 65;
        doc.setFontSize(14);
        doc.text("Shift Breakdown", 20, y);
        y += 10;

        doc.setFontSize(10);
        shifts.forEach(s => {
            const { breakdown } = calculateShiftBreakdown(s);
            const line = `${s.date} | ${s.startTime}-${s.finishTime} | Site: ${breakdown.siteHours.toFixed(2)}h | Travel: ${(s.travelIn + s.travelOut).toFixed(2)}h`;
            doc.text(line, 20, y);
            y += 7;
        });

        y += 10;
        doc.setFontSize(14);
        doc.text("Financials", 20, y);
        y += 10;

        doc.setFontSize(10);
        doc.text(`Total Cost: ${formatMoney(totalCost)}`, 20, y);

        doc.save(`${jobDetails.jobNo}_${status}.pdf`);
    };

    // Calculate individual allowances
    const vehicleCount = shifts.filter(s => s.vehicle).length;
    const perDiemCount = shifts.filter(s => s.perDiem).length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 h-fit">
                <h2 className="text-lg font-semibold mb-4 text-slate-700">Financial Summary</h2>

                <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Site Labor (Normal)</span>
                        <span className="font-mono">
                            {formatMoney(shifts.reduce((acc, s) => acc + (calculateShiftBreakdown(s).breakdown.siteNT * rates.siteNormal), 0))}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Site Labor (Overtime)</span>
                        <span className="font-mono">
                            {formatMoney(shifts.reduce((acc, s) => {
                                const { breakdown } = calculateShiftBreakdown(s);
                                const rate = s.dayType === 'publicHoliday' ? rates.publicHoliday : (s.dayType === 'weekend' ? rates.weekend : rates.siteOvertime);
                                return acc + (breakdown.siteOT * rate);
                            }, 0))}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Travel Labor (NT)</span>
                        <span className="font-mono">
                            {formatMoney(shifts.reduce((acc, s) => {
                                const { breakdown } = calculateShiftBreakdown(s);
                                return acc + (breakdown.travelInNT * rates.travel) + (breakdown.travelOutNT * rates.travel);
                            }, 0))}
                        </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                        <span className="text-slate-600">Travel Labor (OT)</span>
                        <span className="font-mono">
                            {formatMoney(shifts.reduce((acc, s) => {
                                const { breakdown } = calculateShiftBreakdown(s);
                                return acc + (breakdown.travelInOT * rates.travelOvertime) + (breakdown.travelOutOT * rates.travelOvertime);
                            }, 0))}
                        </span>
                    </div>

                    {vehicleCount > 0 && (
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-600">Vehicle Allowance ({vehicleCount}x)</span>
                            <span className="font-mono">
                                {formatMoney(vehicleCount * rates.vehicle)}
                            </span>
                        </div>
                    )}

                    {perDiemCount > 0 && (
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-600">Per Diem ({perDiemCount}x)</span>
                            <span className="font-mono">
                                {formatMoney(perDiemCount * rates.perDiem)}
                            </span>
                        </div>
                    )}

                    {reportingCost > 0 && (
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-600">Reporting Time ({jobDetails.reportingTime}h)</span>
                            <span className="font-mono">
                                {formatMoney(reportingCost)}
                            </span>
                        </div>
                    )}

                    {travelChargeCost > 0 && (
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-600">Travel Charge</span>
                            <span className="font-mono">
                                {formatMoney(travelChargeCost)}
                            </span>
                        </div>
                    )}

                    {extras.filter(e => e.cost > 0).map((extra) => (
                        <div key={extra.id} className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-600">{extra.description || 'Extra Item'}</span>
                            <span className="font-mono">
                                {formatMoney(parseFloat(extra.cost as any) || 0)}
                            </span>
                        </div>
                    ))}

                    <div className="flex justify-between pt-4 text-xl font-bold">
                        <span>Grand Total</span>
                        <span>{formatMoney(totalCost)}</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-slate-700">Xero / Invoice Copy</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={exportPDF}
                            className="bg-slate-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2 hover:bg-slate-700"
                        >
                            <FileDown size={16} /> PDF
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2 hover:bg-blue-700"
                        >
                            <Copy size={16} /> Copy Text
                        </button>
                    </div>
                </div>
                <p className="text-sm text-slate-500 mb-2">
                    Copy this block and paste it directly into your accounting software description field.
                </p>
                <textarea
                    readOnly
                    className="w-full h-64 p-3 font-mono text-sm bg-slate-50 border rounded focus:outline-none"
                    value={generateXeroString()}
                />
            </div>

        </div>
    );
}
