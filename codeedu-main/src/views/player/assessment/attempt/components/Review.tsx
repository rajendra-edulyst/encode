import React, { useEffect, useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { fetchAssessmentReview } from "@/services/learner/AssesmentService";
import { AssessmentReview } from "@/@types/learner/assessment";
import { Button } from "@/components/ui/ShadcnButton";
import { Link } from "react-router-dom";
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface ReviewProps {
    show: boolean;
    onClose: (value: boolean) => void;
    assessment_id: string | null;
    courseId: string | null;
}

const Review: React.FC<ReviewProps> = ({ show, onClose, assessment_id, courseId }) => {
    const [reviewDetails, setReviewDetails] = useState<AssessmentReview | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const printRef = useRef<HTMLDivElement>(null); // Reference to the printable content

    useEffect(() => {
        if (!assessment_id) {
            toast.error("Something went wrong. Please try again later.");
            return;
        }

        setLoading(true);
        fetchAssessmentReview(assessment_id)
            .then((response) => {
                setReviewDetails(response);
            })
            .catch((error) => {
                toast.error(error?.message || "Failed to fetch review details.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [assessment_id]);

    const exportToPDF = async () => {
        setLoading(true);
        if (!printRef.current) return;
        const canvas = await html2canvas(printRef.current, {
            scale: 2, // Higher quality
            useCORS: true, // Prevent CORS issues
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('resume.pdf');
        toast.success('Data exported successfully');
        setLoading(false);
    };


    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assessment Review</DialogTitle>
                    <DialogDescription>
                        Here is the summary of your assessment performance.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : reviewDetails ? (
                    <div>
                        {/* Printable Section */}
                        <div ref={printRef} id="printable-content" className="space-y-3">
                            <p>
                                <strong>Reference Number:</strong> {reviewDetails.attempt_id}
                            </p>
                            <p>
                                <strong>Assessment Name:</strong> {reviewDetails.assessment_name}
                            </p>
                            <p>
                                <strong>Score:</strong> {reviewDetails.score}
                            </p>
                            <p>
                                <strong>Total Questions:</strong> {reviewDetails.question_count}
                            </p>
                            <p>
                                <strong>Questions Attempted:</strong> {reviewDetails.question_attempted}
                            </p>
                            <p>
                                <strong>Questions Skipped:</strong> {reviewDetails.question_skipped}
                            </p>
                            <p>
                                <strong>Time Taken:</strong> {reviewDetails.time_taken} minutes
                            </p>
                            <p>
                                <strong>Assessment Duration:</strong> {reviewDetails.duration_in_minutes} minutes
                            </p>
                        </div>

                        {/* Print Button */}
                        <div className="flex justify-end pt-4">
                            <Button className="bg-blue-600 text-white" onClick={exportToPDF} >
                                Print
                            </Button>
                            {/* Done */}
                            <Link to={`/courses/${courseId}`}>
                                <Button className="bg-blue-600 text-white ml-2">
                                    Done
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <p className="text-red-500 text-center">No review details available.</p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Review;