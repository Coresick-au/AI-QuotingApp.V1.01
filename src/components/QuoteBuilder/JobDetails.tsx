
import { MapPin, Users, FileText, Briefcase, Plus, X } from 'lucide-react';
import type { JobDetails as JobDetailsType, Customer, Rates } from '../../types';

interface JobDetailsProps {
    jobDetails: JobDetailsType;
    setJobDetails: (details: JobDetailsType) => void;
    isLocked: boolean;
    savedCustomers: Customer[];
    setRates: (rates: Rates) => void;
    savedTechnicians: string[];
    status: 'draft' | 'quoted' | 'invoice';
}

export default function JobDetails({
    jobDetails, setJobDetails, isLocked, savedCustomers, setRates, savedTechnicians, status
}: JobDetailsProps) {

    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setJobDetails({ ...jobDetails, customer: value });

        // Check if it matches a saved customer
        const customer = savedCustomers.find(c => c.name === value);
        if (customer) {
            setRates(customer.rates);
        }
    };

    const addTechnician = () => {
        if (isLocked) return;
        // Always use Tech N pattern for new technicians
        const newTechName = `Tech ${jobDetails.technicians.length + 1}`;
        setJobDetails({ ...jobDetails, technicians: [...jobDetails.technicians, newTechName] });
    };

    const removeTechnician = (index: number) => {
        if (isLocked || jobDetails.technicians.length <= 1) return;
        const newTechs = jobDetails.technicians.filter((_, i) => i !== index);
        setJobDetails({ ...jobDetails, technicians: newTechs });
    };

    const updateTechnician = (index: number, value: string) => {
        if (isLocked) return;
        const newTechs = [...jobDetails.technicians];
        newTechs[index] = value;
        setJobDetails({ ...jobDetails, technicians: newTechs });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-700">Job Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Customer with Datalist */}
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1 flex items-center gap-2">
                        <Briefcase size={16} /> Customer
                    </label>
                    <input
                        type="text"
                        list="customer-list"
                        disabled={isLocked}
                        value={jobDetails.customer}
                        onChange={handleCustomerChange}
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                        placeholder="Select or type customer..."
                    />
                    <datalist id="customer-list">
                        {savedCustomers.map(c => (
                            <option key={c.id} value={c.name} />
                        ))}
                    </datalist>
                </div>

                {status === 'invoice' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1 flex items-center gap-2">
                            <FileText size={16} /> Job Number
                        </label>
                        <input
                            type="text"
                            disabled={isLocked}
                            value={jobDetails.jobNo}
                            onChange={(e) => setJobDetails({ ...jobDetails, jobNo: e.target.value })}
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                            placeholder="e.g. J123456"
                        />
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1 flex items-center gap-2">
                        <MapPin size={16} /> Location
                    </label>
                    <input
                        type="text"
                        disabled={isLocked}
                        value={jobDetails.location}
                        onChange={(e) => setJobDetails({ ...jobDetails, location: e.target.value })}
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                        placeholder="Site Location"
                    />
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-2 flex items-center gap-2">
                    <Users size={16} /> Technicians
                </label>
                <div className="flex flex-wrap gap-3">
                    {jobDetails.technicians.map((tech, index) => (
                        <div key={index} className="flex items-center gap-1">
                            <input
                                type="text"
                                list="tech-list"
                                disabled={isLocked}
                                value={tech}
                                onChange={(e) => updateTechnician(index, e.target.value)}
                                className={`p-2 border rounded w-48 focus:ring-2 focus:ring-blue-500 outline-none ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                                placeholder={`Tech ${index + 1}`}
                            />
                            {!isLocked && jobDetails.technicians.length > 1 && (
                                <button
                                    onClick={() => removeTechnician(index)}
                                    className="text-slate-400 hover:text-red-500"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                    {!isLocked && (
                        <button
                            onClick={addTechnician}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50"
                        >
                            <Plus size={16} /> Add Tech
                        </button>
                    )}
                </div>
                <datalist id="tech-list">
                    {savedTechnicians.map(t => (
                        <option key={t} value={t} />
                    ))}
                </datalist>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Reporting Time (Hours)</label>
                    <input
                        type="number"
                        step="0.5"
                        disabled={isLocked}
                        value={jobDetails.reportingTime || 0}
                        onChange={(e) => setJobDetails({ ...jobDetails, reportingTime: parseFloat(e.target.value) || 0 })}
                        className={`p-2 border rounded w-full ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                    />
                </div>

                <div className="flex items-end gap-4">
                    <div className="flex items-center h-10 gap-2">
                        <input
                            type="checkbox"
                            id="includeTravelCharge"
                            disabled={isLocked}
                            checked={jobDetails.includeTravelCharge}
                            onChange={(e) => setJobDetails({ ...jobDetails, includeTravelCharge: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="includeTravelCharge" className="text-sm font-medium text-slate-700 select-none cursor-pointer">
                            Include Travel Charge?
                        </label>
                    </div>

                    {jobDetails.includeTravelCharge && (
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-600 mb-1">Travel Distance (km)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    step="1"
                                    disabled={isLocked}
                                    value={jobDetails.travelDistance || 0}
                                    onChange={(e) => setJobDetails({ ...jobDetails, travelDistance: parseFloat(e.target.value) || 0 })}
                                    className={`p-2 border rounded w-full ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                                />
                                <span className="text-slate-500">km</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Description / Scope of Works</label>
                <textarea
                    disabled={isLocked}
                    value={jobDetails.description}
                    onChange={(e) => setJobDetails({ ...jobDetails, description: e.target.value })}
                    className={`w-full p-3 border rounded h-24 focus:ring-2 focus:ring-blue-500 outline-none ${isLocked ? 'bg-slate-100 text-slate-500' : ''}`}
                    placeholder="Enter job description..."
                />
            </div>
        </div>
    );
}
