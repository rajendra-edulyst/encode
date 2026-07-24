
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { getCounties, getCountryStates, Country, State } from '@/services/learner/CountryService';
import { getTaxLabel, getNumericRate } from '../utils/taxData';

interface BillingDetailsProps {
    tuitionFee: string;
    onBack: () => void;
    onConfirm: (billingData: {
        address: string;
        country_id: string;
        state_id: string;
        country_name: string;
        state_name: string;
        selling_price: string;
        total_amount: string;
        sgst: string;
        cgst: string;
        gst_total: string;
        igst: string;
    }) => void;
    isLoading?: boolean;
}



const BillingDetails: React.FC<BillingDetailsProps> = ({ tuitionFee, onBack, onConfirm, isLoading }) => {
    const [address, setAddress] = useState('');
    const [countries, setCountries] = useState<Country[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [selectedCountryId, setSelectedCountryId] = useState('');
    const [selectedStateId, setSelectedStateId] = useState('');
    const [selectedStateName, setSelectedStateName] = useState('');
    const [isFetchingCountries, setIsFetchingCountries] = useState(true);
    const [isFetchingStates, setIsFetchingStates] = useState(false);

    // ── Derived country / state names ──────────────────────────────────────
    const currentCountryName = countries.find(c => String(c.id) === selectedCountryId)?.name || '';
    const currentStateName = states.find(s => String(s.id) === selectedStateId)?.name || '';

    // ── GST split logic ────────────────────────────────────────────────────
    const isIndia = currentCountryName.toLowerCase() === 'india';
    // CGST + SGST only when customer is in the same state as the merchant (Rajasthan)
    const isRajasthan = currentStateName.toLowerCase() === 'rajasthan';
    const isIntraState = isIndia && isRajasthan;

    // ── Tax label & rate (country-specific) ───────────────────────────────
    const taxLabel = isIndia ? getTaxLabel(currentCountryName) : '';
    const taxRate = isIndia ? getNumericRate(currentCountryName) : 0;  // numeric %, e.g. 10 / 19 / 5 / 0

    // ── Financial calculations ─────────────────────────────────────────────
    const totalAmount = parseFloat(tuitionFee.replace(/[^0-9.]/g, '') || '0');
    const sellingPriceValue = taxRate > 0 ? totalAmount / (1 + taxRate / 100) : totalAmount;
    const totalGstValue = totalAmount - sellingPriceValue;
    const basePrice = sellingPriceValue;

    const sgstValue = totalGstValue / 2;    // intra-state India only
    const cgstValue = totalGstValue / 2;

    // ── Confirm handler ────────────────────────────────────────────────────
    const handleConfirm = () => {
        onConfirm({
            address,
            country_id: selectedCountryId,
            state_id: selectedStateId,
            country_name: currentCountryName,
            state_name: currentStateName,
            selling_price: sellingPriceValue.toFixed(2),
            total_amount: totalAmount.toFixed(2),
            sgst: isIntraState ? sgstValue.toFixed(2) : '0.00',
            cgst: isIntraState ? cgstValue.toFixed(2) : '0.00',
            gst_total: totalGstValue.toFixed(2),
            igst: !isIntraState ? totalGstValue.toFixed(2) : '0.00',
        });
    };

    // ── Data fetching ──────────────────────────────────────────────────────
    useEffect(() => {
        const fetchCountries = async () => {
            setIsFetchingCountries(true);
            const data = await getCounties();
            if (data) {
                setCountries(data);
                // Default to India (id 101 usually, but we check name)
                const india = data.find(c => c.name.toLowerCase() === 'india');
                if (india) {
                    setSelectedCountryId(String(india.id));
                }
            }
            setIsFetchingCountries(false);
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchStates = async () => {
            if (!selectedCountryId) return;
            setIsFetchingStates(true);
            const data = await getCountryStates(selectedCountryId);
            if (data) {
                setStates(data);
                setSelectedStateId(''); // Reset state when country changes
            }
            setIsFetchingStates(false);
        };
        fetchStates();
    }, [selectedCountryId]);

    return (
        <div className="w-full space-y-4 bg-[#2a2a2a] p-6 rounded-2xl border border-white/5">
            <h4 className="text-lg font-black text-white mb-2 uppercase tracking-tight">Billing Details</h4>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address</label>
                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete billing address"
                    autoComplete="off"
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ACF0] transition-colors resize-none h-20 placeholder-gray-600"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Country</label>
                    <div className="relative">
                        <select
                            value={selectedCountryId}
                            onChange={(e) => setSelectedCountryId(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ACF0] transition-colors appearance-none cursor-pointer pr-10"
                            disabled={isFetchingCountries}
                        >
                            <option value="" disabled>Select Country</option>
                            {countries.map(country => (
                                <option key={country.id} value={country.id} className="bg-[#1a1a1a]">{country.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">State</label>
                    <div className="relative">
                        <select
                            value={selectedStateId}
                            onChange={(e) => setSelectedStateId(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ACF0] transition-colors appearance-none cursor-pointer pr-10"
                            disabled={isFetchingStates || !selectedCountryId}
                        >
                            <option value="" disabled>{isFetchingStates ? 'Loading...' : 'Select State'}</option>
                            {states.map(state => (
                                <option key={state.id} value={state.id} className="bg-[#1a1a1a]">{state.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="bg-[#1f1f1f] rounded-[24px] p-6 flex flex-col items-center gap-6 border border-white/5 shadow-2xl w-full">
                <div className="w-full space-y-4">
                    {isIndia && (
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                            <span className="text-xs font-bold text-[#00ACF0] uppercase tracking-widest">Base Price</span>
                            <span className="text-xs font-black text-white italic tracking-tighter">₹{sellingPriceValue.toFixed(2)}</span>
                        </div>
                    )}

                    {isIndia && (
                        <>
                            {isIntraState ? (
                                <>
                                    <div className="space-y-1 border-b border-white/5 pb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-[#00ACF0] uppercase tracking-widest">SGST (9%)</span>
                                            <span className="text-xs font-black text-white italic tracking-tighter">₹{sgstValue.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-[#00ACF0] uppercase tracking-widest">CGST (9%)</span>
                                            <span className="text-xs font-black text-white italic tracking-tighter">₹{cgstValue.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-b border-white/5 pb-4">
                                        <span className="text-xs font-bold text-[#00ACF0] uppercase tracking-widest">Total GST (18%)</span>
                                        <span className="text-xs font-black text-white italic tracking-tighter">₹{totalGstValue.toFixed(2)}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-between items-center border-b border-white/5 pb-4 pt-2">
                                    <span className="text-xs font-bold text-[#00ACF0] uppercase tracking-widest">{taxLabel}</span>
                                    <span className="text-xs font-black text-white italic tracking-tighter">₹{totalGstValue.toFixed(2)}</span>
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-bold text-[#00ACF0] uppercase tracking-widest">Total Amount</span>
                        <span className="text-xl font-black text-white italic tracking-tighter">₹{totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex gap-4 pt-4 w-full">
                    <button
                        onClick={onBack}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading || !selectedStateId || !selectedCountryId || !address}
                        className="flex-2 bg-[#00ACF0] hover:bg-[#00ACF0]/90 text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-[#00ACF0]/20 active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : 'Confirm & Pay'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillingDetails;
