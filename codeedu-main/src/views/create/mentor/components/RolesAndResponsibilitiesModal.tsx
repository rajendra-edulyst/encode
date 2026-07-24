import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/ShadcnButton'
import { X, Download, Maximize, Minimize } from 'lucide-react'
import html2pdf from 'html2pdf.js'

interface RolesAndResponsibilitiesModalProps {
    isOpen: boolean
    onClose: () => void
    onAgree: () => void
}

const RolesAndResponsibilitiesModal: React.FC<RolesAndResponsibilitiesModalProps> = ({
    isOpen,
    onClose,
    onAgree,
}) => {
    const [isFullscreen, setIsFullscreen] = useState(false)

    const handleDownload = () => {
        const element = document.getElementById('roles-content');
        if (!element) return;

        const opt = {
            margin: 1,
            filename: 'Roles_and_Responsibilities.pdf',
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

                <div className="p-8" id="roles-content">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold text-center text-white">
                            Roles and Responsibilities
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5 text-sm text-white/90 leading-relaxed">
                        <section>
                            <h3 className="font-black text-white mb-1 uppercase tracking-wide">1. PATRON</h3>
                            <p>
                                Provides strategic guidance, thought leadership, and institutional credibility, and may
                                support partnerships or high-level initiatives.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-black text-white mb-1 uppercase tracking-wide">2. MENTOR</h3>
                            <p>
                                Guides learners through mentorship sessions, portfolio reviews, career advice, and
                                professional skill development.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-black text-white mb-1 uppercase tracking-wide">3. COURSE LEADER</h3>
                            <p>
                                Designs course curriculum, defines learning outcomes, and ensures academic rigor and
                                industry relevance across the program.
                            </p>
                        </section>

                        <section>
                            <h3 className="font-black text-white mb-1 uppercase tracking-wide">4. COURSE INSTRUCTOR</h3>
                            <p>
                                Delivers course sessions, facilitates learner engagement, conducts assessments, and
                                provides feedback aligned with the curriculum.
                            </p>
                        </section>

                        <p className="text-white/70 text-xs mt-4">
                            <span className="font-bold text-white/90">Note:</span> Code Edu shall provide the necessary
                            platform access, academic resources, coordination support, and operational assistance to
                            enable the effective delivery of these roles.
                        </p>
                    </div>

                    <div className="mt-8 flex justify-center">
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

export default RolesAndResponsibilitiesModal
