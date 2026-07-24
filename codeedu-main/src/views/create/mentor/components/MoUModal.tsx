import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/ShadcnButton'
import { Download, Printer, X, Check } from 'lucide-react'
import React, { useRef } from 'react'
// @ts-ignore
import html2pdf from 'html2pdf.js'

interface MoUModalProps {
    isOpen: boolean
    onClose: () => void
    userName: string
}

const MoUModal: React.FC<MoUModalProps> = ({ isOpen, onClose, userName }) => {
    const contentRef = useRef<HTMLDivElement>(null)

    const downloadPDF = () => {
        const element = contentRef.current
        if (!element) return
        const opt = {
            margin: 0.5,
            filename: `MoU_${userName.replace(/\s+/g, '_') || 'Member'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }
        html2pdf().set(opt).from(element).save()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-white text-black p-0 border-none">
                <div className="sticky top-0 bg-neutral-50 border-b p-4 flex justify-between items-center z-50">
                    <div className="flex flex-col">
                        <DialogTitle className="text-xl font-bold text-black">MOU Content Preview</DialogTitle>
                        <p className="text-xs text-neutral-500 font-medium italic">Memorandum of Understanding (Template)</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 border-neutral-300 text-neutral-700 bg-white hover:bg-neutral-100 rounded-lg h-9"
                            onClick={() => window.print()}
                        >
                            <Printer size={16} /> <span className='font-bold'>Print</span>
                        </Button>
                        <Button
                            size="sm"
                            className="flex items-center gap-2 bg-primary text-black hover:bg-primary/90 font-bold px-4 rounded-lg h-9 shadow-sm"
                            onClick={downloadPDF}
                        >
                            <Download size={16} /> Download
                        </Button>
                        <div className="w-[1px] h-6 bg-neutral-200 mx-1"></div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-neutral-400 hover:text-neutral-600 rounded-full"
                            onClick={onClose}
                        >
                            <X size={20} />
                        </Button>
                    </div>
                </div>

                <div
                    ref={contentRef}
                    className="p-16 text-[13px] leading-relaxed font-serif bg-white text-black print:p-8"
                    style={{ color: '#111' }}
                >
                    <div className="text-center mb-12">
                        <h1 className="text-xl font-black uppercase underline tracking-wider mb-2">MEMORANDUM OF UNDERSTANDING (MoU)</h1>
                    </div>

                    <p className="mb-8">
                        This Memorandum of Understanding (“MoU”) is executed on this <span className="border-b border-black inline-block w-10 text-center mx-1">___</span> day of <span className="border-b border-black inline-block w-24 text-center mx-1">__________</span> 2026 (“Effective Date”),
                    </p>

                    <p className="font-black mb-4 italic underline text-xs">BY AND BETWEEN</p>

                    <div className="mb-8 pl-6 border-l-[3px] border-neutral-100">
                        <p className="font-black text-sm mb-1 uppercase tracking-tight">DC Code Edu Private Limited</p>
                        <p className="text-neutral-700">a company incorporated under the Companies Act, 2013, having its registered office at Horizon Tower, 10th Floor, Jewel of India, Jaipur – 302018 (hereinafter referred to as “Code Edu”);</p>
                    </div>

                    <p className="font-black mb-4 italic underline text-xs">AND</p>

                    <div className="mb-10 pl-6 border-l-[3px] border-neutral-100">
                        <p className="font-black text-sm mb-1 uppercase tracking-tight">{userName || 'Individual Name'}</p>
                        <p className="text-neutral-700">holding valid identification and residing at <span className="border-b border-neutral-300 inline-block w-64 text-center italic text-neutral-400 font-normal mx-1 underline underline-offset-4">______________________</span>, engaged as selected from below (hereinafter referred to as the “Second Party”).</p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-12 mb-10 pl-8 max-w-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border border-black flex items-center justify-center text-[10px] font-bold"></div>
                            <span className="font-medium italic">Patron</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border border-blue-600 bg-blue-50/50 flex items-center justify-center text-[10px] font-bold text-blue-600">✓</div>
                            <span className="font-black italic underline underline-offset-2">Mentor</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border border-black flex items-center justify-center text-[10px] font-bold"></div>
                            <span className="font-medium italic">Course Leader</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border border-black flex items-center justify-center text-[10px] font-bold"></div>
                            <span className="font-medium italic">Course Instructor</span>
                        </div>
                    </div>

                    <p className="mb-10 leading-relaxed italic text-neutral-600">
                        The First Party and the Second Party are hereinafter individually referred to as a “Party” and collectively as the “Parties.”
                    </p>

                    <div className="space-y-8">
                        <section className='page-break-inside-avoid'>
                            <h2 className="font-black text-[14px] border-b-2 border-neutral-100 pb-1 mb-3 uppercase tracking-wide">1. PURPOSE</h2>
                            <p className="text-neutral-800">The purpose of this MoU is to engage the Second Party on the EnCODE platform operated by Code Edu.</p>
                        </section>

                        <section className='page-break-inside-avoid'>
                            <h2 className="font-black text-[14px] border-b-2 border-neutral-100 pb-1 mb-3 uppercase tracking-wide">2. SCOPE OF ENGAGEMENT</h2>
                            <p className="text-neutral-800">The Specific deliverables shall be governed by Annexure 1 (Roles & Responsibilities) as per the selected role/roles.</p>
                        </section>

                        <section className='page-break-inside-avoid'>
                            <h2 className="font-black text-[14px] border-b-2 border-neutral-100 pb-1 mb-3 uppercase tracking-wide">3. TERM & TERMINATION</h2>
                            <p className="text-neutral-800">This MoU shall be valid for a period of one (1) year from the Effective Date, unless extended by mutual written consent. Either Party may terminate this MoU by providing thirty (30) days’ prior written notice to the other Party.</p>
                        </section>

                        <section className='page-break-inside-avoid'>
                            <h2 className="font-black text-[14px] border-b-2 border-neutral-100 pb-1 mb-3 uppercase tracking-wide">4. COMMERCIAL TERMS</h2>
                            <p className="text-neutral-800">Commercial terms, including honorarium and payment schedules, shall be governed by Annexure 2 (Commercial Terms). This MoU does not, by itself, create any guaranteed financial obligation or retainer arrangement.</p>
                        </section>

                        <section className='page-break-inside-avoid'>
                            <h2 className="font-black text-[14px] border-b-2 border-neutral-100 pb-1 mb-3 uppercase tracking-wide">5. INTELLECTUAL PROPERTY & CONTENT OWNERSHIP</h2>
                            <p className="mb-3 text-neutral-800">Each Party shall maintain strict confidentiality of academic, technical, commercial, and student-related information exchanged under this MoU. All content, curriculum, recordings, assessments, tools, and derivative works created shall be the exclusive intellectual property of Code Edu.</p>
                            <p className="mb-3 text-neutral-800">The Second Party waives any ownership, resale, or reuse rights outside Code Edu.</p>
                            <p className="text-neutral-800">Code Edu may edit, adapt, digitize, localize, repurpose, or reuse such content across platforms, institutions, cohorts, and future programs.</p>
                        </section>

                        <section className='page-break-inside-avoid'>
                            <h2 className="font-black text-[14px] border-b-2 border-neutral-100 pb-1 mb-3 uppercase tracking-wide">6. CONFIDENTIALITY & DATA PROTECTION</h2>
                            <p className="mb-3 text-xs italic font-bold text-neutral-600">The Second Party shall maintain strict confidentiality of the following which shall survive three (3) years post-termination:</p>
                            <ul className="grid grid-cols-2 gap-y-2 list-none pl-4 text-neutral-800">
                                <li className="flex items-center gap-2"><Check size={12} className='text-primary' /> Student data</li>
                                <li className="flex items-center gap-2"><Check size={12} className='text-primary' /> Curriculum and assessments</li>
                                <li className="flex items-center gap-2"><Check size={12} className='text-primary' /> Platform workflows and processes</li>
                                <li className="flex items-center gap-2"><Check size={12} className='text-primary' /> Commercial information</li>
                            </ul>
                        </section>

                        <section className='page-break-inside-avoid'>
                            <h2 className="font-black text-[14px] border-b-2 border-neutral-100 pb-1 mb-3 uppercase tracking-wide">7. QUALITY, CONDUCT & COMPLIANCE</h2>
                            <p className="mb-3 text-neutral-800">The Second Party shall:</p>
                            <ul className="list-disc pl-8 space-y-1.5 text-neutral-800">
                                <li>Maintain professional conduct, punctuality, and academic rigor</li>
                                <li>Respect Code Edu’s institutional values, DEI principles, and learner safety</li>
                                <li>Avoid plagiarism, discriminatory language, or unethical practices.</li>
                            </ul>
                            <p className="mt-4 text-neutral-600 italic">Code Edu reserves the right to suspend or terminate engagement and withhold payments for misconduct or quality deviations.</p>
                        </section>

                        <section className='page-break-inside-avoid'>
                            <h2 className="font-black text-[14px] border-b-2 border-neutral-100 pb-1 mb-3 uppercase tracking-wide">8. ANNEXURES AND INCORPORATION</h2>
                            <p className="mb-3 italic font-semibold text-neutral-600">The following annexures shall form an integral and legally binding part of this MoU:</p>
                            <ul className="list-none pl-4 space-y-2 font-bold text-[13px]">
                                <li className='flex items-center gap-3'><div className='w-4 h-4 bg-primary/10 rounded-sm flex items-center justify-center text-[10px] text-primary'>●</div> Annexure 1 : Roles & Responsibilities</li>
                                <li className='flex items-center gap-3'><div className='w-4 h-4 bg-primary/10 rounded-sm flex items-center justify-center text-[10px] text-primary'>●</div> Annexure 2 : Commercial Terms</li>
                            </ul>
                        </section>

                        <section className='page-break-inside-avoid'>
                            <h2 className="font-black text-[14px] border-b-2 border-neutral-100 pb-1 mb-3 uppercase tracking-wide">9. GOVERNING LAW & DISPUTE RESOLUTION</h2>
                            <p className="text-neutral-800 italic leading-relaxed">Any dispute, controversy, or claim arising out of or relating to this MoU shall, as far as possible, be resolved amicably through mutual discussions between the Parties within thirty (30) days. If the dispute is not resolved within such a period, it shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996. The seat and venue of arbitration shall be Jaipur, Rajasthan. This MoU shall be governed by and construed in accordance with the laws of India.</p>
                        </section>
                    </div>

                    <div className="mt-16 pt-10 border-t border-neutral-100">
                        <p className="mb-12 font-black italic underline underline-offset-4 tracking-tighter text-[15px] opacity-90">IN WITNESS WHEREOF, the Parties have executed this MoU on the date first written above.</p>

                        <div className="grid grid-cols-2 gap-24">
                            <div>
                                <p className="font-black text-[13px] border-b-2 border-neutral-800 pb-2 mb-6 uppercase">For DC Code Edu Private Limited</p>
                                <div className="space-y-4 text-neutral-700">
                                    <p className="flex justify-between items-end border-b border-neutral-200 pb-1">Name: <span className="flex-1 ml-4 h-5"></span></p>
                                    <p className="flex justify-between items-end border-b border-neutral-200 pb-1">Designation: <span className="flex-1 ml-4 h-5"></span></p>
                                    <p className="flex justify-between items-end border-b border-neutral-200 pb-1">Signature: <span className="flex-1 ml-4 h-5"></span></p>
                                    <p className="flex justify-between items-end border-b border-neutral-200 pb-1">Date: <span className="flex-1 ml-4 h-5"></span></p>
                                    <p className="mt-6 font-bold text-[10px] italic">Company Seal / Stamp:</p>
                                    <div className="w-20 h-20 border-2 border-dashed border-neutral-200 rounded-full mt-2"></div>
                                </div>
                            </div>
                            <div>
                                <p className="font-black text-[13px] border-b-2 border-neutral-800 pb-2 mb-6 uppercase">For Second Party</p>
                                <div className="space-y-4 text-neutral-700">
                                    <p className="flex justify-between items-end border-b border-neutral-200 pb-1 font-bold">Name: <span className="flex-1 ml-4 h-5 text-black uppercase">{userName}</span></p>
                                    <p className="flex justify-between items-end border-b border-neutral-200 pb-1">Signature: <span className="flex-1 ml-4 h-5"></span></p>
                                    <p className="flex justify-between items-end border-b border-neutral-200 pb-1">Date: <span className="flex-1 ml-4 h-5"></span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ANNEXURE 1 */}
                    <div className="mt-32 pt-16 border-t-2 border-neutral-900 page-break-before">
                        <div className="text-center mb-12">
                            <h2 className="text-lg font-black underline uppercase tracking-[0.2em] mb-4">ANNEXURE 1: APPLICABLE ROLES & RESPONSIBILITIES</h2>
                        </div>

                        <div className="overflow-hidden border border-neutral-900 rounded-sm">
                            <table className="w-full border-collapse text-[11px] leading-tight">
                                <thead>
                                    <tr className="bg-neutral-50 text-neutral-900">
                                        <th className="border border-neutral-900 p-3 text-left font-black uppercase">Role</th>
                                        <th className="border border-neutral-900 p-3 text-left font-black uppercase">Code Edu Responsibilities</th>
                                        <th className="border border-neutral-900 p-3 text-left font-black uppercase">Second Party Responsibilities</th>
                                        <th className="border border-neutral-900 p-3 text-left font-black uppercase">Frequency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className='text-neutral-500'>
                                        <td className="border border-neutral-900 p-3 font-bold">Patron</td>
                                        <td className="border border-neutral-900 p-3">Structured engagement, visibility, implementation support, strategic recognition</td>
                                        <td className="border border-neutral-900 p-3">Academic & industry guidance, curriculum review, partnerships, panels & outreach</td>
                                        <td className="border border-neutral-900 p-3 italic">Quarterly / Bi-annual strategic engagement</td>
                                    </tr>
                                    <tr className="bg-blue-50/20 text-black">
                                        <td className="border border-neutral-900 p-3 font-black text-[12px] underline">Mentor</td>
                                        <td className="border border-neutral-900 p-3 italic">Platform access, profile visibility, scheduling & coordination, operational support</td>
                                        <td className="border border-neutral-900 p-3 font-bold">Mentorship sessions, portfolio & skill guidance, career insights, reviews & evaluations</td>
                                        <td className="border border-neutral-900 p-3 font-semibold underline">Flexible – Based on booked sessions</td>
                                    </tr>
                                    <tr className='text-neutral-500'>
                                        <td className="border border-neutral-900 p-3 font-bold">Course Leader</td>
                                        <td className="border border-neutral-900 p-3">Course guidelines, resources, industry inputs, academic & admin support</td>
                                        <td className="border border-neutral-900 p-3">Course design, curriculum structuring, industry relevance, feedback incorporation</td>
                                        <td className="border border-neutral-900 p-3 italic">Per course cycle</td>
                                    </tr>
                                    <tr className='text-neutral-500'>
                                        <td className="border border-neutral-900 p-3 font-bold">Course Instructor</td>
                                        <td className="border border-neutral-900 p-3">Syllabus, platform & tech support, learner coordination, academic support</td>
                                        <td className="border border-neutral-900 p-3">Course delivery, learner engagement, assessments & feedback, real-world integration</td>
                                        <td className="border border-neutral-900 p-3 italic">As per course schedule</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ANNEXURE 2 */}
                    <div className="mt-20 pt-16 border-t border-neutral-100 page-break-before">
                        <div className="text-center mb-12">
                            <h2 className="text-lg font-black underline uppercase tracking-[0.2em] mb-4">ANNEXURE 2 – COMMERCIAL TERMS</h2>
                        </div>

                        <div className="space-y-10">
                            <div>
                                <h3 className="font-black italic underline uppercase text-[15px] mb-6 tracking-tight">A. General Payment Conditions</h3>
                                <ol className="space-y-4 text-neutral-800 list-decimal pl-6">
                                    <li className='pl-2'>Payment amounts shall be mutually agreed between Code Edu and the Second Party.</li>
                                    <li className='pl-2'>All payments are subject to: Completion of agreed deliverables, Internal review and approval by the Code Edu academic/operations team, Submission of valid invoices and supporting documentation.</li>
                                    <li className='pl-2'>Payments shall be released one (1) month after completion and formal approval of the agreed deliverables by the Code Edu team.</li>
                                    <li className='pl-2'>This engagement does not constitute a retainer or guaranteed payment, unless expressly stated in writing.</li>
                                </ol>
                            </div>

                            <div className='mt-12'>
                                <h3 className="font-black italic underline uppercase text-[15px] mb-6 tracking-tight">B. Payment Details (To Be Filled by Code Edu Team)</h3>
                                <div className="border-[3px] border-double border-neutral-200 bg-neutral-50/50 p-10 space-y-8 rounded-sm">
                                    <p className="flex justify-between items-end italic text-neutral-500 uppercase text-[13px] tracking-widest font-bold">
                                        Role / Engagement Type:
                                        <span className="flex-1 ml-10 border-b-2 border-neutral-800 h-8 font-black text-black text-lg underline underline-offset-8 decoration-primary decoration-4 pl-4 uppercase">MENTOR</span>
                                    </p>
                                    <p className="flex justify-between items-end italic text-neutral-500 uppercase text-[13px] tracking-widest font-bold">
                                        Agreed Amount (₹):
                                        <span className="flex-1 ml-10 border-b-2 border-neutral-800 h-8 pl-4"></span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MoUModal
