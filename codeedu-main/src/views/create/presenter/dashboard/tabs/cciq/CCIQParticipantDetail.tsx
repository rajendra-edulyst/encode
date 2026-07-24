import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, XCircle, Eye, Star, ChevronDown, ChevronUp, CheckSquare, Square, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCCIStage1Status } from '@/services/getting-started';
import { fetchCCIStage2Status, fetchCCIStage3Status, fetchCCIConsumptionLogDetails } from '@/services/learner/CCIService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import CCIScoreModal from '../Assignments/components/CCIScoreModal';
import { toast } from 'sonner';

interface CCIQParticipantDetailProps {
    participant: any;
    onBack: () => void;
}

const CCIQParticipantDetail = ({ participant, onBack }: CCIQParticipantDetailProps) => {
    const queryClient = useQueryClient();
    const [expandedStage, setExpandedStage] = useState<number | null>(2);
    const [viewFileUrl, setViewFileUrl] = useState<string | null>(null);
    const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
    const [gradingItem, setGradingItem] = useState<{ name: string; fileUrl?: string; cciStage: number; contentType: string; contentId?: string | number } | null>(null);

    const userId = participant?.user_id;

    const { data: stage1Res, isLoading: stage1Loading } = useQuery({
        queryKey: ['cci-stage-1-status', userId],
        queryFn: () => fetchCCIStage1Status(userId),
        enabled: !!userId,
    });

    const { data: stage2Res, isLoading: stage2Loading } = useQuery({
        queryKey: ['cci-stage-2-status', userId],
        queryFn: () => fetchCCIStage2Status(userId),
        enabled: !!userId,
    });

    const { data: stage3Res, isLoading: stage3Loading } = useQuery({
        queryKey: ['cci-stage-3-status', userId],
        queryFn: () => fetchCCIStage3Status(userId),
        enabled: !!userId,
    });

    const isLoading = stage1Loading || stage2Loading || stage3Loading;

    const stage1Data: any = stage1Res?.data;
    const stage2Data: any = stage2Res?.data;
    const stage3Data: any = stage3Res?.data;

    const stage1Done = stage1Data?.final === 1;
    const stage2Done = stage2Data?.final === 1;
    const stage3Done = stage3Data?.final === 1;

    const s2CourseDone = stage2Data?.course === 1;
    const s2CommunityDone = stage2Data?.community === 1;
    const s2BuzzDone = stage2Data?.buzz === 1;
    const stage2SubCount = (s2CourseDone ? 1 : 0) + (s2CommunityDone ? 1 : 0) + (s2BuzzDone ? 1 : 0);

    const s3VideoDone = stage3Data?.video === 1;
    const s3GraphicsDone = stage3Data?.graphics === 1;
    const s3WrittenDone = stage3Data?.Written === 1;
    const stage3SubCount = (s3VideoDone ? 1 : 0) + (s3GraphicsDone ? 1 : 0) + (s3WrittenDone ? 1 : 0);

    // Fetch consumption logs for accurate content_id and score
    const { data: stage2LogsRes } = useQuery({
        queryKey: ['cci-logs', userId, 2],
        queryFn: () => fetchCCIConsumptionLogDetails({ user_id: userId, cci_stage: 2 }),
        enabled: !!userId && expandedStage === 2,
    });

    const { data: stage3LogsRes } = useQuery({
        queryKey: ['cci-logs', userId, 3],
        queryFn: () => fetchCCIConsumptionLogDetails({ user_id: userId, cci_stage: 3 }),
        enabled: !!userId && expandedStage === 3,
    });

    const stage2Logs = stage2LogsRes?.data || [];
    const stage3Logs = stage3LogsRes?.data || [];

    const communityLog = stage2Logs.find((l) => l.content_type === 'community');
    const buzzLog = stage2Logs.find((l) => l.content_type === 'buzz');

    const videoLog = stage3Logs.find((l) => l.content_type === 'video');
    const graphicLog = stage3Logs.find((l) => l.content_type === 'graphic');
    const writtenLog = stage3Logs.find((l) => l.content_type === 'written');

    return (
        <div className="space-y-6">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-white hover:text-neutral-300 font-medium text-sm transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Participants
            </button>

            {/* Profile Summary Card */}
            <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex gap-4 items-start">
                    <div className="w-14 h-14 rounded-full bg-neutral-600 flex items-center justify-center text-white font-bold text-xl shrink-0 uppercase">
                        {participant.user_name?.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-xl">{participant.user_name}</h2>
                        <p className="text-neutral-400 text-sm mt-1">{participant.user_email} • STU-{participant.user_id}</p>

                        <div className="flex flex-wrap items-center gap-3 mt-4">
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${stage1Done ? 'bg-[#4ade80]/10 border border-[#4ade80]/20 text-[#4ade80]' : 'bg-white/5 border border-white/10 text-neutral-300'}`}>
                                {stage1Done ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 opacity-50" />}
                                Stage 1
                                {stage1Done && <CheckCircle2 className="w-3 h-3 ml-1" />}
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${stage2Done ? 'bg-[#4ade80]/10 border border-[#4ade80]/20 text-[#4ade80]' : 'bg-white/5 border border-white/10 text-neutral-300'}`}>
                                {stage2Done ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 opacity-50" />}
                                Stage 2
                                {stage2Done && <CheckCircle2 className="w-3 h-3 ml-1" />}
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${stage3Done ? 'bg-[#4ade80]/10 border border-[#4ade80]/20 text-[#4ade80]' : 'bg-white/5 border border-white/10 text-neutral-300'}`}>
                                {stage3Done ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5 opacity-50" />}
                                Stage 3
                                {stage3Done && <CheckCircle2 className="w-3 h-3 ml-1" />}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-[#4ade80] font-bold text-3xl">{participant.overall_progress}%</div>
                    <div className="text-neutral-400 text-xs font-medium mt-1">Overall Progress</div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-white/50" />
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Stages Accordion */}
                    {/* Stage 1 */}
                    <div className="bg-[#2a2a2a] rounded-2xl p-5 border border-white/5 space-y-4">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => setExpandedStage(expandedStage === 1 ? null : 1)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`${stage1Done ? 'bg-[#4ade80]/20' : 'bg-yellow-500/20'} p-1.5 rounded-lg`}>
                                    {stage1Done ? <CheckCircle2 className="w-4 h-4 text-[#4ade80]" /> : <Clock className="w-4 h-4 text-yellow-500" />}
                                </div>
                                <div>
                                    <span className="text-white font-bold text-sm block">Stage 1 – CCIQ Ignite</span>
                                    <span className="text-neutral-400 text-xs mt-0.5 block">{stage1Done ? '1/1' : '0/1'} sub-stages done</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-neutral-400">
                                {stage1Done ? <CheckSquare className="w-5 h-5 text-[#4ade80]" /> : <Square className="w-5 h-5" />}
                                {expandedStage === 1 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </div>

                        {expandedStage === 1 && (
                            <div className="space-y-3 pt-2">
                                <div className="bg-[#383838] rounded-xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-3 w-full">
                                        <div className={`flex items-center gap-2 ${stage1Data?.final_details ? 'text-white' : 'text-neutral-400'} font-semibold text-xs`}>
                                            {stage1Data?.final_details ? <CheckSquare className="w-4 h-4 text-[#4ade80]" /> : <Square className="w-4 h-4" />} Stage 1 (Assessment)
                                        </div>
                                        <div className="flex flex-wrap items-center justify-between bg-white/5 rounded-lg p-3 w-full gap-3">
                                            <span className="text-neutral-300 text-xs">
                                                {stage1Data?.final_details ? 'Assessment Completed' : 'Not Submitted'}
                                            </span>
                                            {stage1Data?.final_details && (
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-[#4ade80]/20 text-[#4ade80] px-3 py-1 rounded-full text-xs font-bold border border-[#4ade80]/30">
                                                        Score: {stage1Data.final_details.score}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${stage1Data.final_details.is_passed === 1 ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-pink-500/20 text-pink-400 border-pink-500/30'}`}>
                                                        {stage1Data.final_details.is_passed === 1 ? 'Passed' : 'Failed'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stage 2 */}
                    <div className="bg-[#2a2a2a] rounded-2xl p-5 border border-white/5 space-y-4">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => setExpandedStage(expandedStage === 2 ? null : 2)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`${stage2Done ? 'bg-[#4ade80]/20' : 'bg-yellow-500/20'} p-1.5 rounded-lg`}>
                                    {stage2Done ? <CheckCircle2 className="w-4 h-4 text-[#4ade80]" /> : <Clock className="w-4 h-4 text-yellow-500" />}
                                </div>
                                <div>
                                    <span className="text-white font-bold text-sm block">Stage 2 – CCIQ Engage</span>
                                    <span className="text-neutral-400 text-xs mt-0.5 block">{stage2SubCount}/3 sub-stages done</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-neutral-400">
                                {stage2Done ? <CheckSquare className="w-5 h-5 text-[#4ade80]" /> : <Square className="w-5 h-5" />}
                                {expandedStage === 2 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </div>

                        {expandedStage === 2 && (
                            <div className="space-y-3 pt-2">
                                {/* Sub-stage 1 */}
                                <div className="bg-[#383838] rounded-xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-3 w-full">
                                        <div className={`flex items-center gap-2 ${s2CourseDone ? 'text-white' : 'text-neutral-400'} font-semibold text-xs`}>
                                            {s2CourseDone ? <CheckSquare className="w-4 h-4 text-[#4ade80]" /> : <Square className="w-4 h-4" />} Stage 2 (Course Completion)
                                        </div>
                                        <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 w-full">
                                            <span className="text-neutral-300 text-xs">Fundamentals of UI/UX Design</span>
                                            {s2CourseDone && (
                                                <button className="bg-[#0AA3CF] hover:bg-[#0AA3CF]/90 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                                                    <Eye className="w-3.5 h-3.5" /> View Certificate
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Sub-stage 2 */}
                                <div className="bg-[#383838] rounded-xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-3 w-full">
                                        <div className={`flex items-center gap-2 ${s2CommunityDone ? 'text-white' : 'text-neutral-400'} font-semibold text-xs`}>
                                            {s2CommunityDone ? <CheckSquare className="w-4 h-4 text-[#4ade80]" /> : <Square className="w-4 h-4" />} Stage 2 (Community Building)
                                        </div>
                                        <div className="flex flex-wrap items-center justify-between bg-white/5 rounded-lg p-3 w-full gap-3">
                                            <span className="text-neutral-300 text-xs">
                                                {s2CommunityDone ? (stage2Data?.community_details?.title || 'Community Document') : 'Not Submitted'}
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {s2CommunityDone && stage2Data?.community_details?.file && (
                                                    <button
                                                        onClick={() => {
                                                            const fileUrl = stage2Data?.community_details?.file;
                                                            if (fileUrl) setViewFileUrl(fileUrl);
                                                        }}
                                                        className="bg-[#0AA3CF] hover:bg-[#0AA3CF]/90 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> View File
                                                    </button>
                                                )}
                                                {communityLog?.score != null ? (
                                                    <span className="bg-[#4ade80]/20 text-[#4ade80] px-3 py-1 rounded-full text-xs font-bold border border-[#4ade80]/30">
                                                        Grade: {communityLog.score}
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setGradingItem({ name: 'Stage 2 (Community Building)', fileUrl: stage2Data?.community_details?.file, cciStage: 2, contentType: 'community', contentId: communityLog?.content_id || stage2Data?.community_details?.id });
                                                            setIsGradingModalOpen(true);
                                                        }}
                                                        className="bg-[#4ade80] hover:bg-[#4ade80]/90 text-black px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                                                        <Star className="w-3.5 h-3.5" /> Assign Grade
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sub-stage 3 */}
                                <div className="bg-[#383838] rounded-xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-3 w-full">
                                        <div className={`flex items-center gap-2 ${s2BuzzDone ? 'text-white' : 'text-neutral-400'} font-semibold text-xs`}>
                                            {s2BuzzDone ? <CheckSquare className="w-4 h-4 text-[#4ade80]" /> : <Square className="w-4 h-4" />} Stage 2 (Buzz Post)
                                        </div>
                                        <div className="flex flex-col bg-white/5 rounded-lg p-3 w-full gap-3">
                                            <div className="flex items-center justify-between w-full">
                                                <span className="text-neutral-300 text-xs font-semibold">
                                                    {s2BuzzDone ? (stage2Data?.buzz_details?.title || 'Buzz Posted') : 'No Buzz Posted'}
                                                </span>
                                                {buzzLog?.score != null ? (
                                                    <span className="bg-[#4ade80]/20 text-[#4ade80] px-3 py-1 rounded-full text-xs font-bold border border-[#4ade80]/30">
                                                        Grade: {buzzLog.score}
                                                    </span>
                                                ) : s2BuzzDone && (
                                                    <button
                                                        onClick={() => {
                                                            setGradingItem({ name: 'Stage 2 (Buzz Post)', fileUrl: stage2Data?.buzz_details?.video_url || stage2Data?.buzz_details?.resource_path_thumbnail, cciStage: 2, contentType: 'buzz', contentId: buzzLog?.content_id || stage2Data?.buzz_details?.id });
                                                            setIsGradingModalOpen(true);
                                                        }}
                                                        className="bg-[#4ade80] hover:bg-[#4ade80]/90 text-black px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                                                        <Star className="w-3.5 h-3.5" /> Assign Grade
                                                    </button>
                                                )}
                                                {s2BuzzDone && (
                                                    <button className="bg-[#0AA3CF] hover:bg-[#0AA3CF]/90 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                                                        <Eye className="w-3.5 h-3.5" /> View Buzz
                                                    </button>
                                                )}
                                            </div>
                                            {s2BuzzDone && (stage2Data?.buzz_details?.description || stage2Data?.buzz_details?.resource_path_thumbnail) && (
                                                <div className="flex flex-col sm:flex-row gap-4 bg-black/20 p-3 rounded-lg mt-2">
                                                    {stage2Data?.buzz_details?.resource_path_thumbnail && (
                                                        <img
                                                            src={stage2Data.buzz_details.resource_path_thumbnail}
                                                            alt="Buzz Thumbnail"
                                                            className="w-full sm:w-32 h-20 object-cover rounded-md shrink-0 bg-neutral-800"
                                                        />
                                                    )}
                                                    {stage2Data?.buzz_details?.description && (
                                                        <div
                                                            className="text-neutral-300 text-xs prose prose-sm prose-invert max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: stage2Data.buzz_details.description }}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Stage 3 */}
                    <div className="bg-[#2a2a2a] rounded-2xl p-5 border border-white/5 space-y-4">
                        <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => setExpandedStage(expandedStage === 3 ? null : 3)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`${stage3Done ? 'bg-[#4ade80]/20' : stage3SubCount > 0 ? 'bg-yellow-500/20' : 'bg-pink-500/20'} p-1.5 rounded-lg`}>
                                    {stage3Done ? <CheckCircle2 className="w-4 h-4 text-[#4ade80]" /> : stage3SubCount > 0 ? <Clock className="w-4 h-4 text-yellow-500" /> : <XCircle className="w-4 h-4 text-pink-500" />}
                                </div>
                                <div>
                                    <span className="text-white font-bold text-sm block">Stage 3 – CCIQ Present</span>
                                    <span className="text-neutral-400 text-xs mt-0.5 block">{stage3SubCount}/3 sub-stages done</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-neutral-400">
                                {stage3Done ? <CheckSquare className="w-5 h-5 text-[#4ade80]" /> : <Square className="w-5 h-5" />}
                                {expandedStage === 3 ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                        </div>

                        {expandedStage === 3 && (
                            <div className="space-y-3 pt-2">
                                {/* Video Sub-stage */}
                                <div className="bg-[#383838] rounded-xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-3 w-full">
                                        <div className={`flex items-center gap-2 ${s3VideoDone ? 'text-white' : 'text-neutral-400'} font-semibold text-xs`}>
                                            {s3VideoDone ? <CheckSquare className="w-4 h-4 text-[#4ade80]" /> : <Square className="w-4 h-4" />} Stage 3 (Video)
                                        </div>
                                        <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 w-full">
                                            <span className="text-neutral-300 text-xs">
                                                {s3VideoDone ? 'Video Assessment Completed' : 'Not Completed'}
                                            </span>
                                            {videoLog?.score != null ? (
                                                <span className="bg-[#4ade80]/20 text-[#4ade80] px-3 py-1 rounded-full text-xs font-bold border border-[#4ade80]/30">
                                                    Grade: {videoLog.score}
                                                </span>
                                            ) : s3VideoDone && (
                                                <button
                                                    onClick={() => {
                                                        setGradingItem({ name: 'Stage 3 (Video)', cciStage: 3, contentType: 'video', contentId: videoLog?.content_id || stage3Data?.video_details?.id });
                                                        setIsGradingModalOpen(true);
                                                    }}
                                                    className="bg-[#4ade80] hover:bg-[#4ade80]/90 text-black px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                                                    <Star className="w-3.5 h-3.5" /> Assign Grade
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Graphics Sub-stage */}
                                <div className="bg-[#383838] rounded-xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-3 w-full">
                                        <div className={`flex items-center gap-2 ${s3GraphicsDone ? 'text-white' : 'text-neutral-400'} font-semibold text-xs`}>
                                            {s3GraphicsDone ? <CheckSquare className="w-4 h-4 text-[#4ade80]" /> : <Square className="w-4 h-4" />} Stage 3 (Graphics)
                                        </div>
                                        <div className="flex flex-wrap items-center justify-between bg-white/5 rounded-lg p-3 w-full gap-3">
                                            <span className="text-neutral-300 text-xs line-clamp-1">
                                                {s3GraphicsDone ? (stage3Data?.graphics_details?.user_notes || 'Graphics Submitted') : 'Not Submitted'}
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {s3GraphicsDone && stage3Data?.graphics_details?.file && (
                                                    <button
                                                        onClick={() => {
                                                            const fileUrl = stage3Data?.graphics_details?.file;
                                                            if (fileUrl) setViewFileUrl(fileUrl);
                                                        }}
                                                        className="bg-[#0AA3CF] hover:bg-[#0AA3CF]/90 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> View File
                                                    </button>
                                                )}
                                                {graphicLog?.score != null ? (
                                                    <span className="bg-[#4ade80]/20 text-[#4ade80] px-3 py-1 rounded-full text-xs font-bold border border-[#4ade80]/30">
                                                        Grade: {graphicLog.score}
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setGradingItem({ name: 'Stage 3 (Graphic)', fileUrl: stage3Data?.graphics_details?.file, cciStage: 3, contentType: 'graphic', contentId: graphicLog?.content_id || stage3Data?.graphics_details?.id });
                                                            setIsGradingModalOpen(true);
                                                        }}
                                                        className="bg-[#4ade80] hover:bg-[#4ade80]/90 text-black px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                                                        <Star className="w-3.5 h-3.5" /> Assign Grade
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Written Sub-stage */}
                                <div className="bg-[#383838] rounded-xl p-4 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-3 w-full">
                                        <div className={`flex items-center gap-2 ${s3WrittenDone ? 'text-white' : 'text-neutral-400'} font-semibold text-xs`}>
                                            {s3WrittenDone ? <CheckSquare className="w-4 h-4 text-[#4ade80]" /> : <Square className="w-4 h-4" />} Stage 3 (Written)
                                        </div>
                                        <div className="flex flex-col bg-white/5 rounded-lg p-3 w-full gap-3">
                                            <div className="flex items-center justify-between w-full">
                                                <span className="text-neutral-300 text-xs font-semibold">
                                                    {s3WrittenDone ? 'Written Response Submitted' : 'Not Submitted'}
                                                </span>
                                                <div className="flex gap-2">
                                                    {s3WrittenDone && stage3Data?.written_details?.file && (
                                                        <button
                                                            onClick={() => {
                                                                const fileUrl = stage3Data?.written_details?.file;
                                                                if (fileUrl) setViewFileUrl(fileUrl);
                                                            }}
                                                            className="bg-[#0AA3CF] hover:bg-[#0AA3CF]/90 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                                                            <Eye className="w-3.5 h-3.5" /> View Response
                                                        </button>
                                                    )}
                                                    {writtenLog?.score != null ? (
                                                        <span className="bg-[#4ade80]/20 text-[#4ade80] px-3 py-1 rounded-full text-xs font-bold border border-[#4ade80]/30">
                                                            Grade: {writtenLog.score}
                                                        </span>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setGradingItem({ name: 'Stage 3 (Written)', fileUrl: stage3Data?.written_details?.file, cciStage: 3, contentType: 'written', contentId: writtenLog?.content_id || stage3Data?.written_details?.id });
                                                                setIsGradingModalOpen(true);
                                                            }}
                                                            className="bg-[#4ade80] hover:bg-[#4ade80]/90 text-black px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                                                            <Star className="w-3.5 h-3.5" /> Assign Grade
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            {s3WrittenDone && stage3Data?.written_details?.user_notes && (
                                                <div className="text-neutral-300 text-xs bg-black/20 p-3 rounded-lg mt-2 prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: stage3Data.written_details.user_notes }} />
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Dialog open={!!viewFileUrl} onOpenChange={(open) => !open && setViewFileUrl(null)}>
                <DialogContent className="max-w-4xl h-[80vh] bg-[#1a1a1a] border-white/10 p-0 overflow-hidden flex flex-col sm:rounded-2xl">
                    <DialogHeader className="p-4 border-b border-white/10">
                        <DialogTitle className="text-white">File Viewer</DialogTitle>
                        <DialogDescription className="sr-only">Document preview</DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 bg-black">
                        {viewFileUrl && (
                            <iframe
                                src={viewFileUrl}
                                className="w-full h-full border-0"
                                title="File Viewer"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <CCIScoreModal
                open={isGradingModalOpen}
                onClose={() => setIsGradingModalOpen(false)}
                userId={userId}
                cciStage={gradingItem?.cciStage ?? 2}
                contentType={gradingItem?.contentType ?? 'assessment'}
                contentId={gradingItem?.contentId ?? ''}
                studentName={participant?.user_name}
                studentEmail={participant?.user_email}
                onSuccess={() => {
                    toast.success(`CCI score submitted for ${gradingItem?.name}`);
                    queryClient.invalidateQueries({ queryKey: ['cci-stage-2-status', userId] });
                    queryClient.invalidateQueries({ queryKey: ['cci-stage-3-status', userId] });
                    queryClient.invalidateQueries({ queryKey: ['cci-logs', userId] });
                }}
            />
        </div>
    );
};

export default CCIQParticipantDetail;
