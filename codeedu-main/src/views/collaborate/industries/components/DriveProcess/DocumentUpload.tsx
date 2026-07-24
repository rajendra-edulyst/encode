import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Video, Download, Eye, Trash2, Loader2, Camera } from 'lucide-react';
import { uploadFile, parseResume } from '@/services/resume/ResumeService';
import { uploadVideoResume, listVideoResume, deletePortfolioItem } from '@/services/learner/PortfolioService';
import { getprofile, deleteResumeById } from '@/views/common/profile-view/services/profileService';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/Spinner';
import { VideoResume } from '@/@types/learner/portfolio';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import VideoRecorder from './VideoRecorder';
import AddResume from '@/views/common/profile/builder/AddResume';

const DocumentUpload = () => {
    const [isAddResumeOpen, setIsAddResumeOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isVideoUploading, setIsVideoUploading] = useState(false);
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [videoOption, setVideoOption] = useState<'upload' | 'record' | null>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [previewDocument, setPreviewDocument] = useState<any | null>(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [docToDelete, setDocToDelete] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const getCleanFilename = (url: string) => {
        if (!url) return '';
        try {
            const decodedUrl = decodeURIComponent(url);
            let filename = decodedUrl.split('/').pop() || '';

            // Remove leading timestamp (numbers followed by underscore)
            filename = filename.replace(/^\d+_/, '');

            // Remove file extension
            filename = filename.replace(/\.(pdf|mp4|webm|mov|avi)$/i, '');

            // Replace underscores and hyphens with spaces
            filename = filename.replace(/[_-]/g, ' ');

            // Capitalize each word (Title Case)
            return filename
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        } catch (e) {
            return 'Document';
        }
    };

    const fetchDocuments = async () => {
        setIsLoadingList(true);
        try {
            const data = await listVideoResume();
            const allDocs: any[] = [];

            // Add PDF resumes
            let pdfResumes: any[] = [];
            if (data.resume) {
                if (Array.isArray(data.resume)) {
                    pdfResumes = data.resume;
                } else if (typeof data.resume === 'object') {
                    pdfResumes = Object.values(data.resume);
                }
            }

            const flatPdfResumes: any[] = [];
            pdfResumes.forEach((item: any) => {
                if (item && typeof item === 'object' && !item.url && !item.resume && Object.keys(item).some(k => !isNaN(Number(k)))) {
                    Object.keys(item).forEach(key => {
                        if (!isNaN(Number(key)) && item[key]) {
                            flatPdfResumes.push(item[key]);
                        }
                    });
                } else if (item) {
                    flatPdfResumes.push(item);
                }
            });

            flatPdfResumes.forEach((res: any) => {
                const resumeUrl = res.url || res.resume;
                if (resumeUrl && res.isLatest) {
                    allDocs.push({
                        ...res,
                        url: resumeUrl,
                        type: 'pdf',
                        title: res.title || getCleanFilename(resumeUrl) || 'Resume',
                        date: '', // Date not available for PDF in current response
                        isLatest: res.isLatest
                    });
                }
            });

            // Add Video resumes
            if (data.video_resume && Array.isArray(data.video_resume)) {
                data.video_resume.forEach((vid: any, index: number) => {
                    allDocs.push({
                        ...vid,
                        type: 'video',
                        title: vid.video_title || getCleanFilename(vid.url || vid.webm_url) || 'Video Resume',
                        date: vid.created_date,
                        itemIndex: vid.resume_index // Use the index from the API response
                    });
                });
            }

            // Fetch profile resume
            try {
                const profileData = await getprofile();
                const profileResumes = profileData?.portfolio?.profileSection?.resumes || [];

                if (Array.isArray(profileResumes)) {
                    profileResumes.forEach((resumeObj: any) => {
                        if (resumeObj.resume && resumeObj.isLatest) {
                            // Check if this resume is already in the list
                            const isDuplicate = allDocs.some(doc => doc.url === resumeObj.resume);
                            if (!isDuplicate) {
                                allDocs.push({
                                    url: resumeObj.resume,
                                    type: 'pdf',
                                    title: resumeObj.title || getCleanFilename(resumeObj.resume) || 'Profile Resume',
                                    date: '',
                                    id: 'profile_resume', // Marker for profile resume
                                    profile_id: resumeObj.id,
                                    isLatest: resumeObj.isLatest
                                });
                            }
                        }
                    });
                }
            } catch (profileError) {
                console.error('Error fetching profile resume:', profileError);
            }

            setDocuments(allDocs);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setIsLoadingList(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handlePreview = (doc: any) => {
        setPreviewDocument(doc);
        setShowPreviewModal(true);
    };

    const handleDownload = async (doc: any) => {
        try {
            const response = await fetch(doc.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${doc.title}.${doc.type === 'video' ? 'mp4' : 'pdf'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Download started!');
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download document');
        }
    };

    // Filter documents based on search query
    const filteredDocuments = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUploadClick = () => {
        setIsAddResumeOpen(true);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error('Please upload a PDF file');
            return;
        }

        // Check file size (10MB = 10 * 1024 * 1024 bytes)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error('PDF file size must be less than 10MB');
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading('Uploading resume...');

        try {
            const parseRes = await parseResume(file);

            if (parseRes.status) {
                toast.success('Resume uploaded and parsed successfully!', { id: toastId });
                fetchDocuments();
            } else {
                toast.error('Resume upload or parsing failed.', { id: toastId });
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('An error occurred during upload.', { id: toastId });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleVideoUploadClick = () => {
        setVideoOption(videoOption === null ? 'upload' : null);
    };

    const handleRecordComplete = async (file: File) => {
        setShowRecordModal(false);

        // Check file size (50MB = 50 * 1024 * 1024 bytes)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            toast.error('Recorded video size must be less than 50MB. Please record a shorter video.');
            return;
        }

        await processVideoUpload(file);
    };

    const processVideoUpload = async (file: File) => {
        setIsVideoUploading(true);
        const toastId = toast.loading('Uploading video resume...');

        try {
            const formData = new FormData();
            formData.append('video', file);

            await uploadVideoResume(formData);
            toast.success('Video resume uploaded successfully!', { id: toastId });
            fetchDocuments();
        } catch (error) {
            console.error('Video upload error:', error);
            toast.error('Failed to upload video resume.', { id: toastId });
        } finally {
            setIsVideoUploading(false);
        }
    };

    const handleVideoFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            toast.error('Please upload a video file');
            return;
        }

        // Check file size (50MB = 50 * 1024 * 1024 bytes)
        const maxSize = 50 * 1024 * 1024; // 50MB
        if (file.size > maxSize) {
            toast.error('Video file size must be less than 50MB');
            return;
        }

        await processVideoUpload(file);

        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    };
    const handleDeleteClick = (doc: any) => {
        setDocToDelete(doc);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!docToDelete) return;

        setIsDeleting(true);
        const toastId = toast.loading(`Deleting ${docToDelete.type === 'video' ? 'video resume' : 'resume'}...`);
        try {
            if (docToDelete.profile_id) {
                await deleteResumeById(docToDelete.profile_id);
            } else {
                const payload: any = {
                    type: docToDelete.type === 'video' ? 'video_resume' : 'resume'
                };

                if (docToDelete.type === 'video') {
                    payload.resume_index = docToDelete.resume_index !== undefined ? docToDelete.resume_index : docToDelete.itemIndex;
                } else {
                    payload.id = docToDelete.id;
                }

                await deletePortfolioItem(payload);
            }
            toast.success(`${docToDelete.type === 'video' ? 'Video resume' : 'Resume'} deleted successfully!`, { id: toastId });
            fetchDocuments();
            setShowDeleteDialog(false);
            setDocToDelete(null);
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(`Failed to delete ${docToDelete.type === 'video' ? 'video resume' : 'resume'}.`, { id: toastId });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-4">
            <input
                type="file"
                ref={videoInputRef}
                onChange={handleVideoFileChange}
                className="hidden"
                accept="video/*"
            />

            {/* Upload Resume */}
            <Card
                className={`bg-[#2A2A2A] border-none rounded-2xl cursor-pointer hover:bg-[#323232] transition-colors border-dashed border-2 border-[#88C057]/20 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={handleUploadClick}
            >
                <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-[#3A3A3A] flex items-center justify-center mb-4">
                        {isUploading ? <Loader2 className="text-[#88C057] animate-spin" size={24} /> : <FileText className="text-gray-400" size={24} />}
                    </div>
                    <h3 className="text-[#88C057] font-bold text-lg mb-1 underline">
                        {isUploading ? 'Processing...' : 'Upload Resume'}
                    </h3>
                    <p className="text-gray-400 text-sm">Upload your Resume to find suitable Jobs or Internships</p>
                    <p className="text-gray-500 text-xs mt-1">Max file size: 10MB</p>
                </CardContent>
            </Card>

            {/* Upload Video Resume */}
            <div className="relative">
                <Card
                    className={`bg-[#2A2A2A] border-none rounded-2xl cursor-pointer hover:bg-[#323232] transition-colors ${isVideoUploading ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={handleVideoUploadClick}
                >
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-xl bg-[#3A3A3A] flex items-center justify-center mb-4">
                            {isVideoUploading ? <Loader2 className="text-[#88C057] animate-spin" size={24} /> : <Video className="text-gray-400" size={24} />}
                        </div>
                        <h3 className="text-[#88C057] font-bold text-lg mb-1 underline">
                            {isVideoUploading ? 'Uploading...' : 'Upload Video Resume'}
                        </h3>
                        <p className="text-gray-400 text-sm">Showcase your personality to potential employers</p>
                        <p className="text-gray-500 text-xs mt-1">Max file size: 50MB</p>
                    </CardContent>
                </Card>

                {videoOption && !isVideoUploading && (
                    <div className="absolute top-0 left-0 w-full h-full bg-[#1A1A1A]/95 rounded-2xl p-4 flex flex-col gap-3 items-center justify-center z-10 border border-[#88C057]/30">
                        <h4 className="text-white font-bold mb-1">Choose Method</h4>
                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => {
                                    videoInputRef.current?.click();
                                    setVideoOption(null);
                                }}
                                className="flex-1 bg-white text-black py-2 rounded-xl font-bold text-sm hover:bg-gray-200"
                            >
                                Upload File
                            </button>
                            <button
                                onClick={() => {
                                    setShowRecordModal(true);
                                    setVideoOption(null);
                                }}
                                className="flex-1 bg-[#88C057] text-black py-2 rounded-xl font-bold text-sm hover:bg-[#78b047]"
                            >
                                Record Video
                            </button>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setVideoOption(null);
                            }}
                            className="text-gray-400 text-xs mt-2 underline"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <Dialog open={showRecordModal} onOpenChange={setShowRecordModal}>
                <DialogContent className="bg-[#1A1A1A] border-gray-800 sm:max-w-[600px] p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                            <Camera className="text-[#88C057]" />
                            Record Video Resume
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Look into the camera and introduce yourself.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6">
                        <VideoRecorder
                            onRecordingComplete={handleRecordComplete}
                            onClose={() => setShowRecordModal(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Your Documents */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">Your Documents</h3>
                    {documents.length > 0 && (
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-3 py-2 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#88C057] w-64"
                            />
                        </div>
                    )}
                </div>
                <div className="space-y-3">
                    {isLoadingList ? (
                        <div className="flex justify-center py-8">
                            <Spinner size={30} />
                        </div>
                    ) : (
                        filteredDocuments.length > 0 ? (
                            filteredDocuments.map((doc, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 bg-[#2A2A2A] hover:bg-[#333333] rounded-xl transition-all border border-transparent hover:border-[#88C057]/20 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[#3A3A3A] flex items-center justify-center group-hover:bg-[#2A2A2A] transition-colors">
                                            {doc.type === 'video' ? (
                                                <Video className="text-[#88C057]" size={20} />
                                            ) : (
                                                <FileText className="text-[#88C057]" size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-white font-medium text-sm transition-colors group-hover:text-[#88C057]" title={doc.title}>
                                                    {doc.title.length > 25 ? `${doc.title.substring(0, 25)}...` : doc.title}
                                                </h4>
                                                {doc.isLatest && (
                                                    <span className="bg-[#8cc63f] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase">LATEST</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 text-[10px] mt-0.5">
                                                {doc.date && <span>{doc.date}</span>}
                                                {doc.date && <span>•</span>}
                                                <span>{doc.type === 'video' ? 'Video Resume' : 'PDF Resume'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleDownload(doc)}
                                            className="p-2 rounded-lg hover:bg-[#3A3A3A] text-gray-400 hover:text-white transition-all"
                                            title="Download"
                                        >
                                            <Download size={18} />
                                        </button>
                                        <button
                                            onClick={() => handlePreview(doc)}
                                            className="p-2 rounded-lg hover:bg-[#3A3A3A] text-gray-400 hover:text-white transition-all"
                                            title="Preview"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(doc)}
                                            className="p-2 rounded-lg hover:bg-[#3A3A3A] text-[#FF5A5A]/70 hover:text-[#FF5A5A] transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm text-center py-4">
                                {searchQuery ? 'No documents found matching your search.' : 'No documents found.'}
                            </p>
                        )
                    )}
                </div>
            </div>

            {/* Preview Modal */}
            <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
                <DialogContent className="bg-[#1A1A1A] border-gray-800 sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] p-0 overflow-hidden">
                    <DialogHeader className="p-6 pb-4 border-b border-gray-800">
                        <DialogTitle className="text-xl font-bold text-white flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                {previewDocument?.type === 'video' ? (
                                    <Video className="text-[#88C057]" size={24} />
                                ) : (
                                    <FileText className="text-[#88C057]" size={24} />
                                )}
                                {previewDocument?.title}
                            </span>
                            <button
                                onClick={() => handleDownload(previewDocument)}
                                className="p-2 rounded-lg hover:bg-[#2A2A2A] text-[#88C057] transition-colors"
                                title="Download"
                            >
                                <Download size={20} />
                            </button>
                        </DialogTitle>
                        <DialogDescription className="text-gray-400 text-sm">
                            {previewDocument?.type === 'video' ? 'Video Resume' : 'PDF Resume'} • {previewDocument?.date}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
                        {previewDocument?.type === 'video' ? (
                            <div className="relative bg-black rounded-lg overflow-hidden">
                                <video
                                    src={previewDocument?.url}
                                    controls
                                    controlsList="nodownload"
                                    className="w-full rounded-lg"
                                    style={{ maxHeight: 'calc(90vh - 200px)' }}
                                    preload="metadata"
                                    playsInline
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ) : (
                            <div className="relative w-full rounded-lg overflow-hidden">
                                <embed
                                    src={`${previewDocument?.url}#toolbar=0&navpanes=0&scrollbar=1`}
                                    type="application/pdf"
                                    className="w-full rounded-lg"
                                    style={{ height: 'calc(90vh - 200px)', minHeight: '600px' }}
                                />
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="bg-[#1A1A1A] border-gray-800 sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-white">Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-gray-400 py-4">
                            Are you sure you want to delete this {docToDelete?.type === 'video' ? 'video resume' : 'resume'}?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="plain"
                            onClick={() => setShowDeleteDialog(false)}
                            className="text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="plain"
                            onClick={confirmDelete}
                            className="bg-[#FF5A5A] hover:bg-[#FF4040] text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <AddResume
                show={isAddResumeOpen}
                onClose={(open) => setIsAddResumeOpen(open)}
                onSuccess={() => fetchDocuments()}
                mode="profile"
            />
        </div>
    );
};

export default DocumentUpload;
