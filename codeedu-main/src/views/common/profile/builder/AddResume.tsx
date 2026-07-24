import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { addResume } from "@/services/learner/PortfolioService";
import { Button } from "@/components/ui/ShadcnButton";
import { uploadResume } from "../../profile-view/services/profileService";
import { Input } from "@/components/ui/ShadcnInput";
import { CircleCheck, X } from 'lucide-react';
import { fetchApplicationProfile, getProfileCompleteness, uploadApplicationResume } from '@/views/collaborate/opportunities/services/jobApplicationService';
import { fetchInternshipApply } from '@/services/collaborate/EventService';

// Validation Schema
const ResumeSchema = z.object({
    title: z.string().min(1, "Resume title is required"),
    resume: z
        .any()
        .refine((files) => files && files.length > 0, "Resume file is required"),
});

type ResumeFormData = z.infer<typeof ResumeSchema>;

interface AddResumeProps {
    show: boolean;
    onClose: (show: boolean) => void;
    onSuccess?: () => void;
    mode?: 'profile' | 'job-application';
    jobId?: string;
    initialResumeUrl?: string | null;
    onApplied?: () => void;
    onCompleteProfile?: () => void;
}

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

const getFileNameFromUrl = (url?: string | null) => {
    if (!url) return 'Resume';
    try {
        const pathname = new URL(url).pathname;
        return decodeURIComponent(pathname.split('/').pop() || 'Resume');
    } catch {
        return decodeURIComponent(url.split('/').pop() || 'Resume');
    }
};

const truncateName = (name: string) => (name.length > 30 ? `${name.slice(0, 27)}...` : name);

const AddResume: React.FC<AddResumeProps> = ({
    show,
    onClose,
    onSuccess,
    mode = 'profile',
    jobId,
    initialResumeUrl,
    onApplied,
    onCompleteProfile,
}) => {

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        trigger,
        formState: { errors },
    } = useForm<ResumeFormData>({
        resolver: zodResolver(ResumeSchema),
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const resumeFile = watch("resume");
    const isJobApplicationMode = mode === 'job-application';

    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [profileComplete, setProfileComplete] = useState(false);
    const [resumeUrl, setResumeUrl] = useState<string>(initialResumeUrl || '');
    const [resumeName, setResumeName] = useState<string>(getFileNameFromUrl(initialResumeUrl));
    const [uploadError, setUploadError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alreadyApplied, setAlreadyApplied] = useState(false);
    const [lastSelectedFile, setLastSelectedFile] = useState<File | null>(null);
    const [applicationResumeTitle, setApplicationResumeTitle] = useState('');

    useEffect(() => {
        if (isJobApplicationMode) return;
        if (resumeFile && resumeFile.length > 0) {
            const file = resumeFile[0];
            if (file.type === "application/pdf") {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                return () => URL.revokeObjectURL(url);
            } else {
                setPreviewUrl(null);
            }
        } else {
            setPreviewUrl(null);
        }
    }, [isJobApplicationMode, resumeFile]);

    // Cleanup on close
    useEffect(() => {
        if (!show) {
            setPreviewUrl(null);
        }
    }, [show]);

    useEffect(() => {
        if (!show || !isJobApplicationMode) return;
        if (initialResumeUrl) {
            setResumeUrl(initialResumeUrl);
            setResumeName(getFileNameFromUrl(initialResumeUrl));
        }
    }, [initialResumeUrl, isJobApplicationMode, show]);

    const loadProfileState = async () => {
        if (!isJobApplicationMode) return;
        setIsProfileLoading(true);
        setProfileError('');
        try {
            const response = await fetchApplicationProfile();
            const profileSection = response?.data?.portfolio?.profileSection;
            const completeness = getProfileCompleteness(profileSection);
            setProfileComplete(completeness.profileComplete);

            const profileResume = profileSection?.basic_info?.[0]?.resume || '';
            if (!resumeUrl && profileResume) {
                setResumeUrl(profileResume);
                setResumeName(getFileNameFromUrl(profileResume));
            }
        } catch (error: any) {
            if (error?.response?.status === 401) {
                const redirect = encodeURIComponent(
                    `${window.location.pathname}?reopenApply=1`,
                );
                window.location.href = `/login?redirect=${redirect}`;
                return;
            }
            setProfileError('Unable to load profile. Please try again.');
        } finally {
            setIsProfileLoading(false);
        }
    };

    useEffect(() => {
        if (!show || !isJobApplicationMode) return;
        loadProfileState();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, isJobApplicationMode]);

    const onSubmit = async (data: ResumeFormData) => {
        const loading = toast.loading("Uploading resume...");
        try {
            // Use the API requested by the user
            await uploadResume(data.resume[0], data.title);

            reset();
            toast.success("Resume added successfully", { id: loading });
            onSuccess && onSuccess();
            onClose(false);
        } catch (error) {
            toast.error('Failed to add resume', { id: loading });
            console.log(error);
        }
    };

    const resumeUploaded = Boolean(resumeUrl);
    const showOnlyIncompleteProfileMessage =
        isJobApplicationMode &&
        !profileError &&
        !isProfileLoading &&
        !profileComplete;
    const canApply =
        resumeUploaded &&
        profileComplete &&
        applicationResumeTitle.trim().length > 0 &&
        !alreadyApplied;

    const uploadForApplication = async (file: File) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            setUploadError(
                'Unsupported file format. Please upload PDF, DOC, or DOCX.',
            );
            return;
        }
        if (file.size > MAX_SIZE) {
            setUploadError('File size exceeds 10 MB limit');
            return;
        }

        setUploadError('');
        setSubmitError('');
        setIsUploading(true);
        setLastSelectedFile(file);
        try {
            const url = await uploadApplicationResume(file);
            if (!url) {
                setUploadError('Upload failed. Please try again.');
                return;
            }
            setResumeUrl(url);
            setResumeName(file.name);
        } catch (error: any) {
            if (error?.response?.status === 401) {
                const redirect = encodeURIComponent(
                    `${window.location.pathname}?reopenApply=1`,
                );
                window.location.href = `/login?redirect=${redirect}`;
                return;
            }
            setUploadError('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleApplicationFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;
        await uploadForApplication(file);
        event.target.value = '';
    };

    const handleApplySubmit = async () => {
        if (!resumeUrl && !lastSelectedFile) return;
        if (isJobApplicationMode && !jobId) return;
        if (isJobApplicationMode && !profileComplete) {
            onCompleteProfile?.();
            return;
        }
        if (!applicationResumeTitle.trim()) {
            setSubmitError('Please enter resume title');
            return;
        }
        setIsSubmitting(true);
        setAlreadyApplied(false);
        setSubmitError('');
        try {
            if (lastSelectedFile) {
                await uploadResume(lastSelectedFile, applicationResumeTitle);
            }
            if (isJobApplicationMode && jobId && resumeUrl) {
                await fetchInternshipApply(jobId, resumeUrl);
                onApplied?.();
            } else {
                toast.success("Resume uploaded successfully!");
                onSuccess?.();
            }
            onClose(false);
        } catch (error: any) {
            if (error?.response?.status === 401) {
                const redirect = encodeURIComponent(
                    `${window.location.pathname}?reopenApply=1`,
                );
                window.location.href = `/login?redirect=${redirect}`;
                return;
            }
            const code = String(error?.response?.data?.code || '').toLowerCase();
            const message = String(
                error?.response?.data?.message || error?.message || '',
            ).toLowerCase();
            if (code.includes('already') || message.includes('already applied')) {
                setAlreadyApplied(true);
                return;
            }
            setSubmitError(
                'Submission failed. Please check your connection and try again.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent className="bg-[#1A1A1A] border-gray-800 text-white sm:max-w-md p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold flex justify-between items-center w-full">
                        <span>{isJobApplicationMode ? 'Apply for Job' : 'Upload Resume'}</span>
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-1">
                        {isJobApplicationMode ? 'Upload your resume to complete your application' : 'Upload your resume to find suitable Jobs or Internships'}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleApplySubmit();
                        }}
                        className="space-y-6 mt-4"
                    >
                        {profileError && isJobApplicationMode && (
                            <div className="rounded-lg border border-error bg-error-subtle p-3 text-sm text-error">
                                <p>{profileError}</p>
                                <button
                                    type="button"
                                    className="mt-1 text-primary underline"
                                    onClick={loadProfileState}
                                >
                                    Retry
                                </button>
                            </div>
                        )}
                        {showOnlyIncompleteProfileMessage ? (
                            <div className="rounded-lg border border-border bg-card/60 p-4 text-sm space-y-3">
                                <p className="border-l-2 border-codeblue pl-3 text-codeblue font-semibold leading-relaxed">
                                    Your profile is incomplete.
                                </p>
                                <p className="border-l-2 border-codepink pl-3 text-muted-foreground leading-relaxed">
                                    Complete your profile to apply for this
                                    job.
                                </p>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1 border-b border-codegreen text-codegreen font-semibold hover:opacity-90 transition-opacity"
                                    onClick={onCompleteProfile}
                                >
                                    Complete your profile →
                                </button>
                                <div className="pt-4 flex justify-center">
                                    <div className="rounded-2xl border border-codeblue/30 bg-codeblue/10 p-4 shadow-sm">
                                        <img
                                            src="/img/missing_docs.png"
                                            alt="Missing profile documents"
                                            className="mx-auto h-32 w-32 object-contain opacity-90"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => document.getElementById('app-resume-upload')?.click()}
                            >
                                <Input
                                    type="file"
                                    id="app-resume-upload"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                    onChange={handleApplicationFileChange}
                                />
                                {(!resumeUploaded && !isUploading) && (
                                    <div className="space-y-2">
                                        <p className="text-gray-400">
                                            Click to select or drag and drop your PDF/DOC/DOCX file
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            PDF, DOC, DOCX • Max 10 MB
                                        </p>
                                    </div>
                                )}
                                {isUploading && (
                                    <div className="flex items-center justify-center gap-2 py-1">
                                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                                        <p className="text-sm">Uploading...</p>
                                    </div>
                                )}
                                {(!isUploading && resumeUploaded) && (
                                    <div className="flex items-center justify-center gap-2">
                                        <CircleCheck size={18} className="text-success text-green-500" />
                                        <p className="text-sm">{truncateName(resumeName || 'Resume')}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!showOnlyIncompleteProfileMessage && (
                            <div className="space-y-2 text-left">
                                <label className="text-sm font-medium text-gray-300">
                                    Resume Title <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Enter resume title"
                                    value={applicationResumeTitle}
                                    onChange={(event) => setApplicationResumeTitle(event.target.value)}
                                    className="bg-transparent border-gray-700 focus:border-red-500 rounded-lg h-12"
                                />
                            </div>
                        )}
                        {isJobApplicationMode && uploadError && (
                            <div className="rounded-lg border border-error bg-error-subtle p-3 text-sm">
                                <p>{uploadError}</p>
                                {uploadError === 'Upload failed. Please try again.' && (
                                    <button
                                        type="button"
                                        className="mt-1 text-primary underline"
                                        onClick={async () => {
                                            if (!lastSelectedFile) return;
                                            await uploadForApplication(lastSelectedFile);
                                        }}
                                    >
                                        Retry
                                    </button>
                                )}
                            </div>
                        )}
                        {isJobApplicationMode && alreadyApplied && (
                            <div className="rounded-lg border border-info bg-info-subtle p-3 text-sm">
                                You have already applied for this opportunity.
                            </div>
                        )}
                        {submitError && (
                            <div className="rounded-lg border border-error bg-error-subtle p-3 text-sm">
                                {submitError}
                            </div>
                        )}

                        {!showOnlyIncompleteProfileMessage && (
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onClose(false)}
                                    className="flex-1 border-gray-700 hover:bg-gray-800"
                                    disabled={isUploading || isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                                    disabled={!resumeUploaded || !applicationResumeTitle || isSubmitting || isUploading || (isJobApplicationMode && !profileComplete)}
                                >
                                    {isSubmitting ? 'Uploading...' : (isJobApplicationMode ? 'Apply Now' : 'Upload Resume')}
                                </Button>
                            </div>
                        )}
                        {isJobApplicationMode && isProfileLoading && (
                            <p className="text-xs text-muted-foreground">
                                Checking profile completeness...
                            </p>
                        )}
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddResume