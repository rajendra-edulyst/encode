import React, { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, FileText, Loader2, Upload, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useCCITimer } from '@/context/CCIContext';
import { useCourseModuleDetails, useLearnerSubmittedAssignments } from '@/hooks/data/create/useCourses';
import { uploadeAssignment } from '@/services/learner/assignmentService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Loading from '@/components/shared/Loading';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { stripHtmlTags } from '@/utils/stripHtmlTags';

const GraphicAnalysis: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const contentIdParam = searchParams.get('content_id') || '9587';
    const moduleId = '8760'; // As per old URL reference

    const { timeLeft } = useCCITimer();
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showSubmitPopup, setShowSubmitPopup] = useState(false);
    const [showThankYouPopup, setShowThankYouPopup] = useState(false);

    // Fetch dynamic content
    const { data: moduleDetails, isLoading: isModuleLoading } = useCourseModuleDetails(moduleId);
    const activeContent = moduleDetails?.contents?.find(c => c.program_content_id.toString() === contentIdParam);

    // Fetch submissions
    const { data: assignmentData, isLoading: isAssignmentLoading } = useLearnerSubmittedAssignments(parseInt(contentIdParam));
    const submissions = assignmentData?.submission_details || [];
    const latestSubmission = submissions.length > 0 ? submissions[0] : null;

    const uploadMutation = useMutation({
        mutationFn: uploadeAssignment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['learnerSubmittedAssignments', parseInt(contentIdParam)] });
            setShowSubmitPopup(false);
            setShowThankYouPopup(true);
            setSelectedFile(null);
        },
        onError: () => {
            toast.error('Failed to upload document');
        }
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

            if (!isPDF) {
                toast.error('Only PDF files are allowed');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size exceeds 5MB limit');
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleActualSubmit = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('content_id', contentIdParam);
            formData.append('user_notes', 'Graphic Analysis Submission');
            uploadMutation.mutate(formData);
        }
    };

    if (isModuleLoading || isAssignmentLoading) return <Loading loading={true} />;

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-10 flex flex-col items-center gap-6 font-jacques-pro" style={{ fontFamily: "'Jacques Pro', sans-serif" }}>
            <style>{`
                .glass-card {
                    background: #121212;
                    border-radius: 20px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                
                .header-banner {
                    background: #121212;
                    border-radius: 20px;
                    padding: 25px 40px;
                    width: 100%;
                    max-width: 1100px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                
                .back-nav-bar {
                    background: #1a1a1a;
                    border-radius: 15px;
                    padding: 18px 30px;
                    width: 100%;
                    max-width: 1100px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }
                
                .back-nav-bar:hover {
                    background: #222;
                    transform: translateY(-1px);
                }
                
                .main-layout {
                    display: flex;
                    gap: 30px;
                    width: 100%;
                    max-width: 1100px;
                    align-items: stretch;
                }

                .problem-card {
                    flex: 1;
                    padding: 35px;
                }
                
                .upload-card {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                    padding: 40px 20px;
                }
                
                .upload-card:hover {
                    background: #1a1a1a;
                    transform: translateY(-2px);
                    border-color: rgba(255, 255, 255, 0.1);
                }
                
                .landscape-img {
                    width: 100%;
                    border-radius: 15px;
                    margin-top: 30px;
                    object-fit: cover;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .footer {
                    width: 100%;
                    max-width: 1100px;
                    margin-top: auto;
                    padding-top: 25px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .requirement-list {
                    list-style-type: disc;
                    padding-left: 20px;
                    color: #aaa;
                    font-size: 0.9rem;
                    line-height: 1.6;
                }

                .requirement-list li {
                    margin-bottom: 8px;
                }

                .preview-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.2s;
                    border-radius: 20px;
                }
                
                .upload-card:hover .preview-overlay {
                    opacity: 1;
                }
            `}</style>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf"
                onChange={handleFileUpload}
            />

            {/* Stage Header */}
            <div className="header-banner">
                <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Stage 03</span>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        {activeContent?.title || 'CCIQ Present: Narrative Showcase'}
                    </h1>
                </div>
                <div className="text-[#fcee0a] text-xl font-bold">
                    Time Left: {timeLeft}
                </div>
            </div>

            {/* Back Nav Bar */}
            <div className="back-nav-bar" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} className="text-white" />
                <span className="text-lg font-bold">See Beyond the Design</span>
            </div>

            {/* Main Content Area */}
            <div className="main-layout mt-2">
                {/* Problem Statement Section */}
                <div className="glass-card problem-card">
                    <h2 className="text-xl font-extrabold mb-4">Problem Statement</h2>
                    <div className="text-gray-400 text-sm leading-relaxed mb-6">
                        {activeContent?.description ? (
                            <div dangerouslySetInnerHTML={{ __html: activeContent.description }} />
                        ) : (
                            'Review the attached image (a landscape scenery) and provide a detailed graphic analysis. Focus on visual elements, composition, and UX effectiveness for social media promotion.'
                        )}
                    </div>

                    {/* Key Requirements - Show if available in metadata or hardcoded if missing from API */}
                    <div className="mb-8">
                        <h3 className="text-white font-bold text-sm mb-3">Key Requirements:</h3>
                        <ul className="requirement-list">
                            <li>Analysis Scope: Evaluate color palette usage (e.g., golds/oranges vs. blues), typography hierarchy, Diwali motif integration (diyas, rangoli), mobile layout flow, and accessibility (contrast ratios).</li>
                            <li>Text Elements to Check: Headline impact ("Ignite Your Creativity..."), subtext clarity ("UX Workshops I ... Enroll in a course or book mentorship to complete & certify"), and call-to-action visibility.</li>
                            <li>Deliverables: 300-500 word written analysis (PDF/Google Doc), annotated image screenshot with 5-7 markup notes (arrows/circles in Figma), and 1 redesign suggestion sketch.</li>
                        </ul>
                    </div>

                    <img
                        src={activeContent?.assignment_file || "/landscape_analysis_image_1778485983232.png"}
                        alt="Landscape Analysis"
                        className="landscape-img shadow-2xl hidden"
                    />
                </div>

                {/* Upload/Preview Action Section */}
                <div className="flex flex-col items-center gap-6 w-[250px] shrink-0">
                    <div
                        className="glass-card upload-card relative overflow-hidden"
                        onClick={() => !latestSubmission && !selectedFile && fileInputRef.current?.click()}
                    >
                        {latestSubmission ? (
                            <>
                                <div className="bg-green-500/10 p-6 rounded-2xl border border-green-500/20">
                                    <FileText size={48} className="text-green-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-lg font-bold text-green-500">Document Uploaded</span>
                                    {/*<span className="text-xs text-gray-500">Submitted on {new Date(latestSubmission.updated_at).toLocaleDateString()}</span>*/}
                                </div>
                            </>
                        ) : selectedFile ? (() => {
                            const isPDF = selectedFile.name.toLowerCase().endsWith('.pdf');
                            const ext = selectedFile.name.split('.').pop()?.substring(0, 4).toUpperCase() || 'DOC';
                            return (
                                <>
                                    <div className={`${isPDF ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-500/10 border-blue-500/20'} p-6 rounded-2xl border flex flex-col items-center justify-center relative`}>
                                        <FileText size={48} className={isPDF ? 'text-red-500' : 'text-blue-500'} fill="currentColor" />
                                        <span className={`absolute bottom-6 text-white text-[10px] font-bold ${isPDF ? 'bg-red-600' : 'bg-blue-600'} px-1 rounded uppercase`}>{ext}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 w-full overflow-hidden px-2 text-center">
                                        <span className="text-base font-bold truncate">{selectedFile.name}</span>
                                        <span className="text-xs text-gray-400">
                                            Size: {selectedFile.size < 1024 * 1024 ? `${Math.round(selectedFile.size / 1024)} KB` : `${Math.round(selectedFile.size / (1024 * 1024))} MB`}
                                        </span>
                                    </div>

                                    <div className="mt-2 w-full flex justify-center">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFile(null);
                                                setTimeout(() => fileInputRef.current?.click(), 50);
                                            }}
                                            className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-colors font-semibold text-xs"
                                        >
                                            Change Document
                                        </button>
                                    </div>
                                </>
                            );
                        })() : (
                            <>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <Upload size={48} className="text-gray-500" />
                                </div>
                                <span className="text-lg font-bold">Upload Document</span>
                                <span className="text-xs text-gray-500">Format allowed: PDF (Max 5 MB)</span>
                            </>
                        )}
                    </div>

                    {selectedFile && !latestSubmission && (
                        <button
                            onClick={() => setShowSubmitPopup(true)}
                            className="bg-[#fcee0a] text-black text-xl font-bold rounded-xl px-6 py-4 hover:bg-[#ffe500] transition-colors w-full flex flex-col items-center justify-center"
                        >
                            <span>Submit</span>
                            <span>Response</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="footer flex flex-col gap-6 pb-10">
                <div className="flex justify-between items-center text-sm font-bold">
                    <div className="flex gap-4">
                        <span className="cursor-pointer hover:text-[#fcee0a] transition-colors" onClick={() => navigate('/help-center?cci=1')}>FAQ</span>
                        <span className="text-gray-600">|</span>
                        <span className="cursor-pointer hover:text-[#fcee0a] transition-colors" onClick={() => navigate('/queries?cci=1')}>Support</span>
                    </div>
                    {/* <div>
                        Attempts Left: <span className="text-[#fcee0a]">2/3</span>
                    </div> */}
                </div>
                <div className="text-center text-[20px] text-white font-medium">
                    © Copyrights 2026 All rights reserved by CODE EDU
                </div>
            </div>

            <Dialog open={showSubmitPopup} onOpenChange={setShowSubmitPopup}>
                <DialogContent className="bg-[#383838] border-none sm:max-w-[550px] px-8 py-12 flex flex-col items-center text-center gap-8 rounded-2xl z-[200] font-jacques-pro" style={{ fontFamily: "'Jacques Pro', sans-serif" }}>
                    <h2 className="text-white text-3xl font-bold mt-2 tracking-wide">
                        Submit Response
                    </h2>
                    <div className="flex flex-col text-white text-[19px] tracking-wide font-light gap-1 mb-2">
                        <span>Are you sure you want to Upload the Document.</span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowSubmitPopup(false)}
                            className="bg-[#7A7A7A] hover:bg-[#8A8A8A] text-black text-xl font-bold rounded-xl px-8 py-4 transition-colors flex flex-col items-center justify-center leading-tight"
                        >
                            <span>Review</span>
                            <span>Response</span>
                        </button>
                        <button
                            onClick={handleActualSubmit}
                            disabled={uploadMutation.isPending}
                            className="bg-[#fcee0a] hover:bg-[#ffe500] text-black text-xl font-bold rounded-xl px-8 py-4 transition-colors flex flex-col items-center justify-center leading-tight"
                        >
                            {uploadMutation.isPending ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <>
                                    <span>Submit</span>
                                    <span>Response</span>
                                </>
                            )}
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showThankYouPopup} onOpenChange={setShowThankYouPopup}>
                <DialogContent className="bg-[#383838] border-none sm:max-w-[550px] px-8 py-12 flex flex-col items-center text-center gap-6 rounded-2xl z-[200] font-jacques-pro [&>button.absolute]:hidden" style={{ fontFamily: "'Jacques Pro', sans-serif" }}>
                    <h2 className="text-white text-3xl font-bold mt-2 flex items-center justify-center gap-2 tracking-wide">
                        Thank You <span className="text-[#fcee0a]">✨</span>
                    </h2>
                    <div className="flex flex-col text-white text-[19px] tracking-wide font-light gap-1 mb-4 mt-2">
                        <span>Your response has successfully submitted.</span>
                        <span>Continue attempting the other Modules.</span>
                    </div>
                    <button
                        onClick={() => navigate('/cci-stage-3')}
                        className="bg-[#fcee0a] hover:bg-[#ffe500] text-black text-[16px] font-bold rounded-[12px] w-[110px] h-[90px] flex items-center justify-center transition-colors"
                    >
                        Continue
                    </button>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default GraphicAnalysis;
