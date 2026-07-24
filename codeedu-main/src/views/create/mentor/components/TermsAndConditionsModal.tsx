import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/ShadcnButton'
import { X, Download, Maximize, Minimize } from 'lucide-react'
import html2pdf from 'html2pdf.js'

interface TermsAndConditionsModalProps {
    isOpen: boolean
    onClose: () => void
    onAgree: () => void
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({ isOpen, onClose, onAgree }) => {
    const [isFullscreen, setIsFullscreen] = useState(false)

    const handleDownload = () => {
        const element = document.getElementById('tac-content');
        if (!element) return;

        const opt = {
            margin: 1,
            filename: 'Terms_and_Conditions.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, backgroundColor: '#3A3A3A' },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`${isFullscreen ? 'w-screen h-screen max-w-none !rounded-none' : 'max-w-2xl max-h-[90vh] rounded-2xl'} overflow-y-auto bg-[#3A3A3A] text-white border-none p-0 transition-all duration-200`}>
                {/* Header Action buttons */}
                <div className="absolute top-4 right-12 flex items-center gap-3 z-10">
                    <button
                        onClick={handleDownload}
                        className="text-white/70 hover:text-white transition-colors p-1"
                        title="Download"
                    >
                        <Download size={20} />
                    </button>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="text-white/70 hover:text-white transition-colors p-1"
                        title="Toggle Fullscreen"
                    >
                        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                    </button>
                </div>

                <div className="p-8" id="tac-content">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold text-center text-white">
                            Terms &amp; Conditions
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5 text-sm text-white/90 leading-relaxed">
                        <section>
                            <h3 className="font-bold text-white mb-1">1. Engagement</h3>
                            <p>
                                DC Code Edu Private Limited ("Code Edu") engages the Second Party as a Patron, Mentor,
                                Course Leader, or Course Instructor on the EnCODE platform or associated programs.
                            </p>
                            <p className="mt-2">
                                This engagement is independent and non-exclusive and does not constitute employment,
                                partnership, or joint venture between the Parties. The Second Party shall perform
                                services in accordance with Code Edu's academic and professional standards.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-white mb-1">2. Term &amp; Termination</h3>
                            <p>
                                This Agreement shall remain valid for one (1) year from the Effective Date, unless
                                extended by mutual written consent. Either Party may terminate the engagement by
                                providing thirty (30) days' prior written notice.
                            </p>
                            <p className="mt-2">
                                Code Edu may terminate the engagement immediately in cases of misconduct, breach of
                                confidentiality, policy violations, or actions that may harm the reputation or operations
                                of Code Edu.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-white mb-1">3. Compensation &amp; Payments</h3>
                            <p>Any honorarium or compensation shall be mutually agreed in writing between the Parties.</p>
                            <p className="mt-2">Payments are subject to:</p>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                <li>Completion of agreed deliverables</li>
                                <li>Internal review and approval by Code Edu</li>
                                <li>Submission of valid invoices or documentation where applicable</li>
                            </ul>
                            <p className="mt-2">
                                Payments shall typically be processed within thirty (30) days after approval of
                                deliverables.
                            </p>
                            <p className="mt-2">
                                This engagement does not constitute a retainer, salary, or guaranteed payment, unless
                                explicitly agreed in writing.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-white mb-1">4. Intellectual Property</h3>
                            <p>
                                All intellectual property created under this engagement, including curriculum, course
                                materials, recordings, assessments, and learning resources, shall be the exclusive
                                property of Code Edu.
                            </p>
                            <p className="mt-2">
                                Code Edu retains the right to use, edit, publish, digitize, reproduce, or repurpose such
                                content across programs, platforms, institutions, and future initiatives.
                            </p>
                            <p className="mt-2">
                                The Second Party waives any independent ownership or reuse rights outside Code Edu unless
                                approved in writing.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-white mb-1">5. Confidentiality</h3>
                            <p>
                                The Second Party shall maintain strict confidentiality regarding all information received
                                during the engagement, including student data, curriculum, platform processes, and
                                commercial information.
                            </p>
                            <p className="mt-2">
                                This obligation shall survive three (3) years after termination of the engagement.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-white mb-1">6. Professional Conduct</h3>
                            <p>
                                The Second Party shall maintain professional conduct, academic integrity, and respect for
                                diversity and learner safety.
                            </p>
                            <p className="mt-2">
                                Code Edu reserves the right to suspend or terminate engagement and withhold payments in
                                cases of misconduct, plagiarism, discrimination, or unethical behavior.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-bold text-white mb-1">7. Governing Law &amp; Dispute Resolution</h3>
                            <p>This Agreement shall be governed by the laws of India.</p>
                            <p className="mt-2">
                                Any dispute shall first be resolved through mutual discussion within thirty (30) days. If
                                unresolved, the matter shall be referred to arbitration under the Arbitration and
                                Conciliation Act, 1996, with Jaipur, Rajasthan as the seat and venue.
                            </p>
                        </section>
                    </div>

                    <div className="mt-8 p-4 flex justify-center">
                        <button
                            type="button"
                            onClick={() => {
                                onAgree()
                                onClose()
                            }}
                            className="bg-primary text-white text-base px-12 py-4 rounded-xl hover:bg-primary/90 transition-colors text-center"
                        >
                            Yes,<br />I agree
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TermsAndConditionsModal
