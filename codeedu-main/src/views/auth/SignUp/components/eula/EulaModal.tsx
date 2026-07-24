import React, { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Download, Maximize, Minimize } from 'lucide-react'
import { EulaContent } from './content'
import html2pdf from 'html2pdf.js'

interface EulaModalProps {
    isOpen: boolean
    onClose: () => void
    onAgree: () => void
}

const EulaModal: React.FC<EulaModalProps> = ({ isOpen, onClose, onAgree }) => {
    const [isFullscreen, setIsFullscreen] = useState(false)

    const handleDownload = () => {
        const element = document.getElementById('eula-modal-content')
        if (!element) return

        const opt = {
            margin: 0.5,
            filename: 'CODEEDU_EULA.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, backgroundColor: '#1D1D1D', useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }

        html2pdf().set(opt).from(element).save()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className={`
                    ${isFullscreen
                        ? 'w-screen h-screen max-w-none !rounded-none'
                        : 'max-w-3xl max-h-[90vh] rounded-2xl'
                    }
                    overflow-y-auto bg-[#1D1D1D] text-white border-none p-0 transition-all duration-200
                `}
            >
                {/* Action Buttons — top-right */}
                <div className="sticky top-0 z-10 flex items-center justify-end gap-3 bg-[#1D1D1D]/90 backdrop-blur-sm px-6 py-3 border-b border-white/10">
                    <button
                        type="button"
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-white/10"
                        title="Download as PDF"
                    >
                        <Download size={16} />
                        <span>Download PDF</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-white/10"
                        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    >
                        {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                        <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="px-6 pb-6" id="eula-modal-content">
                    <EulaContent />

                    {/* Agree Button */}
                    <div className="mt-8 flex justify-center">
                        <button
                            type="button"
                            onClick={() => {
                                onAgree()
                                onClose()
                            }}
                            className="bg-codeblue text-white text-lg px-12 py-4 rounded-xl hover:bg-codeblue/90 transition-colors text-center font-semibold shadow-lg shadow-codeblue/30"
                        >
                            Yes, I agree
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default EulaModal
