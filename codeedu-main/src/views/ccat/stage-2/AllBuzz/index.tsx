import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import StageDetails from '../components/StageDetails';
import Footer from '../components/Footer';
import { usePosts } from '@/hooks/data/connect/usePosts';
import PostCard from '@/views/connect/components/post-card';
import SubmitResponseModal from '@/views/cci/components/SubmitResponseModal';
import { toast } from 'sonner';
import { useSessionUser } from '@/store/authStore';

const PAGE_SIZE = 5;

const AllBuzz: React.FC = () => {
    const navigate = useNavigate();
    const [modalStep, setModalStep] = useState<'confirm' | 'submitting' | 'success' | null>(null);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const currentUserId = useSessionUser(state => state.user?.id);

    const params = useMemo(() => new URLSearchParams(), []);
    const { data: posts, isLoading } = usePosts(params);
    const allPosts = posts ?? [];
    const visiblePosts = allPosts.slice(0, visibleCount);
    const hasMore = visibleCount < allPosts.length;

    // Check if the current user has submitted at least one buzz
    const userHasBuzz = allPosts.some(post => {
        const createdBy = post.created_by;
        const postUserId = typeof createdBy === 'object' && createdBy !== null
            ? (createdBy as any).id
            : createdBy;
        return Number(postUserId) === Number(currentUserId);
    });

    const handleConfirmSubmit = async () => {
        setModalStep('submitting');
        // Simulate an API call delay
        setTimeout(() => {
            setModalStep('success');
            toast.success('Response submitted successfully');
        }, 1000);
    };

    const handleSubmitResponseClick = () => {
        if (!userHasBuzz) {
            toast.error('Please create at least one Buzz before submitting your response.', {
                duration: 4000,
            });
            return;
        }
        setModalStep('confirm');
    };

    const handleModalContinue = () => {
        setModalStep(null);
        navigate('/cci-stage-2');
    };

    return (
        <div className="min-h-screen bg-[#000000] text-white font-jacques-pro pb-20">
            {/* Using a custom container to match the Stage 2 layout width */}
            <div className="max-w-[1100px] mx-auto px-4 md:px-8 pt-6">

                {/* Top Stage Details - matching CCI screens */}
                <div className="mb-6">
                    <StageDetails />
                </div>

                {/* Back Button Row - full width */}
                <button
                    onClick={() => navigate('/cci-stage-2')}
                    className="w-full bg-[#1c1c1c] hover:bg-[#2a2a2a] transition-colors rounded-[10px] py-3 px-5 flex items-center gap-4 text-[14px] font-medium mb-6 text-white"
                >
                    <ArrowLeft size={16} />
                    Create the Buzz, Capture the Pulse
                </button>

                {/* Main Content Area — feed + buttons side by side, same width as header */}
                <div className="flex flex-row gap-4 items-start w-full">

                    {/* Feed Column - takes all remaining width */}
                    <div className="flex-1 min-w-0 flex flex-col gap-6">
                        {isLoading ? (
                            <div className="text-center py-12 text-gray-400">Loading Buzz feed...</div>
                        ) : (
                            visiblePosts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))
                        )}
                        {!isLoading && allPosts.length === 0 && (
                            <div className="text-center py-12 text-gray-400">No Buzz posts found. Be the first to add one!</div>
                        )}
                        {/* Load More */}
                        {!isLoading && hasMore && (
                            <div className="flex justify-center pt-2 pb-4">
                                <button
                                    onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                                    className="bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-[#3a3a3a] text-white text-[13px] font-medium px-8 py-2.5 rounded-[10px] transition-colors"
                                >
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Action Buttons - fixed width, sticky */}
                    <div className="flex flex-col gap-3 sticky top-6 shrink-0 w-[90px]">
                        <button
                            onClick={() => navigate('/connect/add-buzz?is_cci=1')}
                            className="bg-[#f9038d] hover:bg-[#e0027a] text-black text-[11px] font-semibold rounded-[10px] flex flex-col items-center justify-center gap-1 w-[90px] h-[90px] shadow-lg transition-all"
                        >
                            <Plus size={18} strokeWidth={2.5} />
                            <span>Add Buzz</span>
                        </button>

                        <button
                            onClick={handleSubmitResponseClick}
                            title={!userHasBuzz ? 'Create at least one Buzz first' : ''}
                            className={`text-black text-[11px] font-semibold rounded-[10px] flex flex-col items-center justify-center w-[90px] h-[90px] shadow-lg transition-all leading-snug
                                ${userHasBuzz
                                    ? 'bg-[#fcee0a] hover:bg-[#e6d60a] cursor-pointer'
                                    : 'bg-[#7a7408] cursor-not-allowed opacity-60'
                                }`}
                        >
                            <span>Submit</span>
                            <span>Response</span>
                        </button>
                    </div>

                </div>
            </div>

            <Footer />

            <SubmitResponseModal
                isOpen={modalStep !== null}
                onClose={() => setModalStep(null)}
                onConfirm={handleConfirmSubmit}
                step={modalStep || 'confirm'}
                onContinue={handleModalContinue}
                confirmText={
                    <>
                        You have successfully created a Buzz for your Problem Statement.<br />
                        Now you are unable to edit your Composer. You will not able to change further
                    </>
                }
                cancelText="Review Buzz"
            />
        </div>
    );
};

export default AllBuzz;
