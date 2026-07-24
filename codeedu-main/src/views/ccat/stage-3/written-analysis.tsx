import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { useCCITimer } from '@/context/CCIContext';
import { fetchAssignment, uploadeAssignment } from '@/services/learner/assignmentService';
import { Assignment } from '@/@types/learner/assignment';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WrittenAnalysis: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const contentId = searchParams.get('content_id');

    const { timeLeft } = useCCITimer();
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [responseContent, setResponseContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const isAttempted = !!assignment?.submission_details && assignment.submission_details.length > 0;

    useEffect(() => {
        const loadInitialData = async () => {
            if (!contentId) {
                setIsLoading(false);
                return;
            }

            try {
                const data = await fetchAssignment(parseInt(contentId));
                setAssignment(data);
                if (data.submission_details && data.submission_details.length > 0) {
                    setResponseContent(data.submission_details[0].user_notes || '');
                }
            } catch (error) {
                console.error("Failed to fetch assignment details:", error);
                toast.error("Failed to load assignment details");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [contentId]);

    const handlePreSubmit = () => {
        if (!responseContent || responseContent.trim() === '' || responseContent === '<p></p>') {
            toast.error("Please write your response first");
            return;
        }
        setShowConfirmDialog(true);
    };

    const handleConfirmSubmit = async () => {
        setShowConfirmDialog(false);
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('content_id', contentId!);
            formData.append('user_notes', responseContent);

            await uploadeAssignment(formData);

            toast.success(isAttempted ? 'Response updated successfully!' : 'Written Analysis submitted successfully!');
            setShowSuccessDialog(true);
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error("Submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-10 flex flex-col items-center gap-6 font-jacques-pro" style={{ fontFamily: "'Jacques Pro', sans-serif" }}>
            <style>{`
                .header-banner {
                    background: #121212;
                    border-radius: 20px;
                    padding: 25px 40px;
                    width: 100%;
                    max-width: 1100px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border: 1px solid #222;
                }
                
                .back-nav-bar {
                    background: #1a1a1a;
                    border-radius: 15px;
                    padding: 15px 30px;
                    width: 100%;
                    max-width: 1100px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    cursor: pointer;
                    transition: background 0.2s;
                    border: 1px solid #222;
                }
                
                .back-nav-bar:hover {
                    background: #222;
                }
                
                .content-grid {
                    display: grid;
                    grid-template-columns: 1fr 140px;
                    gap: 24px;
                    width: 100%;
                    max-width: 1100px;
                }

                .problem-statement-card {
                    background: #121212;
                    border-radius: 20px;
                    padding: 30px;
                    border: 1px solid #222;
                }
                
                .response-card {
                    background: #121212;
                    border-radius: 20px;
                    padding: 30px;
                    border: 1px solid #222;
                    margin-top: 24px;
                }
                
                .submit-response-btn {
                    background: #FFEC00;
                    color: black;
                    border-radius: 12px;
                    width: 140px;
                    height: 90px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 16px;
                    line-height: 1.2;
                    cursor: pointer;
                    border: none;
                    transition: all 0.2s;
                }
                
                .submit-response-btn:hover:not(:disabled) {
                    background: #FFEC00;
                    opacity: 0.9;
                    transform: translateY(-2px);
                }

                .submit-response-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .loader {
                    border: 3px solid rgba(255, 255, 255, 0.1);
                    border-left-color: #fcee0a;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .footer {
                    width: 100%;
                    max-width: 1100px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: auto;
                    padding: 40px 0 20px;
                    color: #888;
                    font-size: 14px;
                }

                .rich-text-editor-container {
                    width: 100%;
                    max-width: 100%;
                    overflow-x: hidden;
                }

                .rich-text-editor-container .ql-container {
                    min-height: 250px;
                    background: #1a1a1a;
                    color: white;
                    border: 1px solid #333 !important;
                    border-radius: 0 0 12px 12px;
                }
                
                .rich-text-editor-container .ql-editor {
                    word-break: break-word;
                    overflow-wrap: break-word;
                    white-space: pre-wrap;
                }

                .rich-text-editor-container .ql-toolbar {
                    background: #262626;
                    border: 1px solid #333 !important;
                    border-radius: 12px 12px 0 0;
                }
            `}</style>

            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="loader !w-10 !h-10"></div>
                    <span className="text-gray-400 font-bold">Loading Written Analysis...</span>
                </div>
            ) : (
                <>
                    {/* Stage Header */}
                    <div className="header-banner">
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">Stage 03</span>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                {assignment?.title || 'CCI Present: Narrative Showcase'}
                            </h1>
                        </div>
                        <div className="text-[#fcee0a] text-xl font-bold">
                            Time Left: {timeLeft}
                        </div>
                    </div>

                    {/* Back Nav Bar */}
                    <div className="back-nav-bar" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} className="text-white" />
                        <span className="text-lg font-bold">See Beyond the Design</span>
                    </div>

                    {/* Main Content Area */}
                    <div className="content-grid">
                        <div className="flex flex-col w-full min-w-0">
                            {/* Problem Statement Card */}
                            <div className="problem-statement-card">
                                <h2 className="text-xl font-extrabold text-white mb-4">Problem Statement</h2>
                                <div className="text-sm text-gray-300 leading-relaxed space-y-4">
                                    <div dangerouslySetInnerHTML={{ __html: assignment?.description || '' }} />
                                    <div>
                                        <p className="font-bold text-white mb-2">Key Requirements:</p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li><span className="font-semibold text-gray-200">Structure:</span> Introduction (context and thesis), Body (3 sections: Visuals & Theme, Typography & Hierarchy, UX/Accessibility & CTA), Conclusion (overall score 1-10 + 1 redesign priority).</li>
                                            <li><span className="font-semibold text-gray-200">Analysis Focus:</span> Evaluate Diwali motifs (diyas/rangoli integration), color contrast (#FFD700 vs. #1E3ABA per WCAG AA), mobile readability, cultural resonance for Indian students, and subtle completion CTA ("Enroll in a course or book mentorship").</li>
                                            <li><span className="font-semibold text-gray-200">Evidence-Based:</span> Use 3+ specific examples from the poster; reference design principles (e.g., Gestalt theory for grouping, Fitts's Law for CTAs).</li>
                                            <li><span className="font-semibold text-gray-200">Deliverables:</span> Single PDF/Google Doc with word count footer; optional 1-paragraph personal reflection on applying this to EdTech event marketing.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Response Card */}
                            <div className="response-card">
                                <h2 className="text-xl font-extrabold text-white mb-4">Your Response</h2>
                                <div className="rich-text-editor-container">
                                    <RichTextEditor
                                        value={responseContent}
                                        onChange={setResponseContent}
                                        maxLength={5000}
                                        hideUploads={false}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sidebar with Submit Button */}
                        <div className="flex flex-col items-center">
                            <button
                                onClick={handlePreSubmit}
                                className="submit-response-btn"
                                disabled={isSubmitting || isAttempted}
                            >
                                {isSubmitting ? (
                                    <div className="loader"></div>
                                ) : (
                                    <>
                                        <span>{isAttempted ? 'Submitted' : 'Submit'}</span>
                                        <span>Response</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="footer flex flex-col gap-8 pb-10 mt-10 w-full max-w-[1100px] mx-auto">
                        <div className="flex justify-between items-center text-sm font-bold w-full">
                            <div className="flex gap-4">
                                <span className="cursor-pointer hover:text-[#fcee0a] text-white transition-colors" onClick={() => navigate('/help-center?cci=1')}>FAQ</span>
                                <span className="text-white">|</span>
                                <span className="cursor-pointer hover:text-[#fcee0a] text-white transition-colors" onClick={() => navigate('/queries?cci=1')}>Support</span>
                            </div>
                            {/* <div>
                                Attempts Left: <span className="text-[#fcee0a]">2/3</span>
                            </div> */}
                        </div>
                        <div className="text-center text-[18px] text-white font-medium">
                            © Copyrights 2026 All rights reserved by CODE EDU
                        </div>
                    </div>
                </>
            )}

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent className="bg-[#2D2D2D] text-white border border-[#444] rounded-3xl max-w-2xl px-10 py-12 font-jacques-pro">
                    {/* Close 'X' Icon */}
                    <button
                        onClick={() => setShowConfirmDialog(false)}
                        className="absolute top-6 right-6 text-white hover:text-gray-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <AlertDialogHeader className="mb-8">
                        <AlertDialogTitle className="text-center text-3xl font-bold text-white tracking-wide">
                            Submit Response
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-lg text-white mt-4 font-normal">
                            Are you sure you want to Upload the Video.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="flex flex-row justify-center items-center gap-6 sm:justify-center">
                        <AlertDialogCancel
                            className="bg-[#777777] text-black hover:bg-[#666666] hover:text-black font-semibold border-none rounded-[14px] w-36 h-24 flex flex-col items-center justify-center text-base m-0 leading-tight"
                        >
                            <span>Review</span>
                            <span>Response</span>
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmSubmit}
                            className="bg-[#FFEC00] text-black hover:bg-[#E6D500] hover:text-black font-semibold border-none rounded-[14px] w-36 h-24 flex flex-col items-center justify-center text-base m-0 leading-tight"
                        >
                            <span>Submit</span>
                            <span>Response</span>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent className="bg-[#2D2D2D] text-white border border-[#444] rounded-3xl max-w-2xl px-10 py-12 font-jacques-pro">
                    {/* Close 'X' Icon */}
                    <button
                        onClick={() => navigate('/cci-stage-3')}
                        className="absolute top-6 right-6 text-white hover:text-gray-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <AlertDialogHeader className="mb-8">
                        <AlertDialogTitle className="text-center text-3xl font-bold text-white tracking-wide">
                            Thank You✨
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-lg text-white mt-4 font-normal">
                            Your response has successfully submitted.<br />
                            Continue attempting the other Modules.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="flex flex-row justify-center items-center gap-6 sm:justify-center">
                        <AlertDialogAction
                            onClick={() => navigate('/cci-stage-3')}
                            className="bg-[#FFEC00] text-black hover:bg-[#E6D500] hover:text-black font-semibold border-none rounded-[12px] w-[110px] h-[90px] flex items-center justify-center text-[16px] m-0"
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default WrittenAnalysis;
