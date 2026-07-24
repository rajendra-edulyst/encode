import { useAuth } from '@/auth';
import Breadcrumb from '@/components/breadcrumb';
import { useAssessmentReview } from '@/hooks/data/create/useCourses';
import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Printer } from 'lucide-react';
import LoadingSection from '@/components/LoadingSection';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/ShadcnButton';
import Logo from '@/components/template/Logo';
import { useQueryClient } from '@tanstack/react-query';

const ReviewAssessment = () => {

    const { assessment_id, attempt_id } = useParams<{ assessment_id: string, attempt_id: string }>();
    const { data: review, isLoading } = useAssessmentReview(assessment_id, attempt_id);
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (review?.module_id) {
            queryClient.invalidateQueries({
                queryKey: ['courseModule', String(review.module_id)]
            });
        }
    }, [review?.module_id, queryClient]);


    const breadcrumbItems = [
        { label: 'Courses', path: '/courses/explore' },
        { label: review?.program_name || 'Course', path: `/courses/${review?.program_id}` },
        { label: 'Assessment Review' }
    ];

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
    };

    // Format time
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };


    if (isLoading) {
        return <LoadingSection isLoading={isLoading} title="Loading Assessment Review" />;
    }

    if (!review) {
        return (
            <div>
                <div className="print:hidden">
                    <Breadcrumb items={breadcrumbItems} />
                </div>
                <div className="min-h-screen flex items-center justify-center px-4">
                    <div className="text-center">
                        <p className="text-gray-600">Assessment review not found</p>
                    </div>
                </div>
            </div>
        );
    }

    const answeredCount = (review?.questions || []).filter(q => q.attempt_state === 1).length;
    const skippedCount = (review?.questions || []).filter(q => q.attempt_state === 2).length;
    const totalQuestions = review?.questions?.length || 0;
    const totalScore = review?.score || 0;
    const correctAnswers = (review?.questions || []).filter(q => q.is_correct === 1).length;
    const incorrectAnswers = (review?.questions || []).filter(q => q.is_correct === 2).length;


    // Handle close dialog
    const handleCloseDialog = (open: boolean) => {
        if (!open && review) {
            // Navigate back to course page with content_id
            const url = `/courses/${review.program_id}/modules/${review.module_id}?content_id=${review.content_id}`;
            navigate(url);
        }
    };

    // Handle print
    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <div className="print:hidden">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            {/* Centered Card */}
            <Dialog open={true} onOpenChange={handleCloseDialog}>
                <DialogContent className='p-0 sm:max-w-xl max-h-[90vh] flex flex-col overflow-hidden'>
                    <DialogTitle className="sr-only">Assessment Review</DialogTitle>
                    {/* Scrollable Content */}
                    <div className="overflow-y-auto flex-1 max-w-2xl mx-auto w-full" id="assessment-review-content">
                        <div className="p-8 md:p-12 relative">
                            {/* Success Icon */}
                            <div className="flex justify-center mb-6">
                                <Logo mode={'dark'} logoWidth={180} />
                            </div>

                            {/* Pass/Fail Status Badge */}
                            {review.is_passed === 1 ? (
                                <div className="mb-4 py-2 px-4 rounded-md bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500">
                                    <p className="text-center text-green-700 dark:text-green-400 font-semibold text-sm">
                                        ✓ Assessment Passed Successfully
                                    </p>
                                </div>
                            ) : (
                                <div className="mb-4 py-2 px-4 rounded-md bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500">
                                    <p className="text-center text-red-700 dark:text-red-400 font-semibold text-sm">
                                        ✕ Assessment Not Passed - Review and Retry
                                    </p>
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-3">
                                Thank you for your submission!
                            </h1>

                            {/* Subtitle */}
                            <p className="text-center text-gray-600 dark:text-gray-400 mb-2">
                                Please save this snapshot of your assessment&apos;s record for future reference.
                            </p>
                            <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                                Thank you for your cooperation.
                            </p>

                            {/* Divider */}
                            <div className="border-t border-gray-200 dark:border-gray-700 mb-4"></div>

                            {/* User Email */}
                            <div className="text-center mb-3">
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                    {user?.email || 'N/A'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-white">
                                    {user?.name || 'N/A'}
                                </p>
                            </div>

                            {/* Assessment Title */}
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                    {review.assessment_name || 'Assessment'}
                                </h2>
                                <p>Course: <span className='dark:text-white font-bold'>{review?.program_name}</span></p>
                                <p>Module: <span className='dark:text-white font-bold'>{review?.module_name}</span></p>
                            </div>

                            {/* Date & Time Info */}
                            <div className="flex items-center justify-center gap-2 mb-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">{formatDate(review.attempt_started_at)}</span>
                            </div>

                            <div className="flex items-center justify-center gap-8 mb-6 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Start time - {formatTime(review.attempt_started_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>End time - {formatTime(review.attempt_completed_at)}</span>
                                </div>
                            </div>

                            {/* Reference Number */}
                            <div className="text-center mb-8">
                                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                    Your Reference No. - #{review.attempt_id}
                                </p>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200 dark:border-gray-700 mb-8"></div>

                            {/* Statistics Grid */}
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Questions</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{totalQuestions}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Answered</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Questions</p>
                                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{answeredCount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Skipped</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Question</p>
                                    <p className="text-xl font-bold text-red-600 dark:text-red-400">{skippedCount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Score</p>
                                    <p className="text-xl font-bold text-gray-600 dark:text-gray-400">{totalScore}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Correct</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Questions</p>
                                    <p className="text-xl font-bold text-gray-600 dark:text-gray-400">{correctAnswers}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Incorrect</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Questions</p>
                                    <p className="text-xl font-bold text-gray-600 dark:text-gray-400">{incorrectAnswers}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Footer */}
                    <div className="print:hidden border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800 flex items-center justify-center gap-3">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={handlePrint}
                        >
                            <Printer className="w-4 h-4" />
                            Print
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ReviewAssessment