import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Video, Upload, Plus, StopCircle, RotateCcw, Play, X } from 'lucide-react';
import { toast } from 'sonner';
import { fetchVideoInterviewDetails, submitVideoInterview } from '@/services/learner/VideoInterviewService';
import { uploadFile } from '@/services/resume/ResumeService';

import { useCCITimer } from '@/context/CCIContext';

const NarrativeShowcase: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const contentId = searchParams.get('content_id');

    const { timeLeft } = useCCITimer();
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [contentData, setContentData] = useState<any>(null);
    const [recordingTimeLeft, setRecordingTimeLeft] = useState<number>(180);
    const isAttempted = !!contentData?.attempt_id;


    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const loadInitialData = async () => {
            if (!contentId) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetchVideoInterviewDetails(contentId);
                if (response.status === 1 && response.data && response.data.length > 0) {
                    const data = response.data[0];

                    if (!data.user_file && data.attempt_options && data.attempt_options.length > 0) {
                        data.user_file = data.attempt_options[0].user_file;
                    }

                    setContentData(data);
                    if (data.user_file) {
                        setVideoUrl(data.user_file);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch interview details:", error);
                toast.error("Failed to load interview details");
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();

        return () => {
            if (stream) stopStream(stream);
        };
    }, [contentId]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isRecording && recordingTimeLeft > 0) {
            timer = setInterval(() => {
                setRecordingTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isRecording && recordingTimeLeft === 0) {
            stopRecording();
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [isRecording, recordingTimeLeft]);


    const activateCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setStream(mediaStream);
            setIsCameraActive(true);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (err) {
            console.error("Error accessing media devices.", err);
            toast.error("Could not access camera or microphone");
        }
    };

    const getSupportedMimeType = () => {
        const types = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm',
            'video/mp4',
            'video/quicktime'
        ];
        return types.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';
    };

    const startRecording = () => {
        if (!stream) return;
        setRecordingTimeLeft(180);

        const mimeType = getSupportedMimeType();
        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];
        let accumulatedSize = 0;

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data);
                accumulatedSize += e.data.size;

                // Automatically stop recording if it hits 30MB
                if (accumulatedSize >= 30 * 1024 * 1024) {
                    if (mediaRecorder.state === 'recording') {
                        mediaRecorder.stop();
                        toast.warning("You have reached the 30MB video limit. Recording stopped automatically.");
                        setIsRecording(false);
                    }
                }
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: mimeType });

            const url = URL.createObjectURL(blob);
            const file = new File([blob], `recorded_video.${mimeType.split('/')[1].split(';')[0]}`, { type: mimeType });
            setVideoUrl(url);
            setVideoFile(file);
            stopStream(stream);
            setIsCameraActive(false);
        };

        mediaRecorder.start(1000);
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const stopStream = (s: MediaStream | null) => {
        if (s) {
            s.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 30 * 1024 * 1024) { // 30MB limit
                toast.error("Video size exceeds the 30MB limit. Please upload a smaller video.");
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                return;
            }
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
            setVideoFile(file);
        }
    };

    const handleRetake = () => {
        if (videoUrl && !videoUrl.startsWith('http')) {
            URL.revokeObjectURL(videoUrl);
        }
        setVideoUrl(null);
        setVideoFile(null);
        setIsRecording(false);
        setIsCameraActive(false);
        stopStream(stream);
    };

    const handleSubmit = async () => {
        if (!videoFile && !videoUrl) {
            toast.error("Please record or upload a video first");
            return;
        }

        setIsSubmitting(true);
        try {
            let finalVideoUrl = videoUrl;

            // Only upload if it's a new file (blob or local file)
            if (videoFile) {
                const uploadResponse = await uploadFile(videoFile, 'video-interview');
                finalVideoUrl = uploadResponse.file.url;
                // finalVideoUrl = "https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/UEiiUG7epC6rWvp8H8NRIgO0pUgGzgDBfehHnPyR.webm";

            }

            if (!finalVideoUrl) {
                throw new Error("Failed to get video URL");
            }

            await submitVideoInterview({
                content_id: contentId!,
                question_id: contentData?.question_id?.toString() || "",
                durationSec: "", // As per user's curl example
                user_file: finalVideoUrl,
                option_id: "",
                mark_review: ""
            });

            toast.success(contentData?.user_file ? 'Response updated successfully!' : 'Narrative Showcase submitted successfully!');
            navigate('/cci-stage-3');
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error("Submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-10 flex flex-col items-center gap-4 font-jacques-pro" style={{ fontFamily: "'Jacques Pro', sans-serif" }}>
            <style>{`
                .header-banner {
                    background: #121212;
                    border-radius: 20px;
                    padding: 30px 40px;
                    width: 100%;
                    max-width: 1100px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .back-nav-bar {
                    background: #1a1a1a;
                    border-radius: 15px;
                    padding: 20px 30px;
                    width: 100%;
                    max-width: 1100px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                
                .back-nav-bar:hover {
                    background: #222;
                }
                
                .main-content-card {
                    background: #121212;
                    border-radius: 25px;
                    padding: 40px;
                    width: 100%;
                    max-width: 900px;
                    min-height: 500px;
                    display: flex;
                    flex-direction: column;
                }
                
                .upload-action-card {
                    background: #262626;
                    border-radius: 25px;
                    width: 220px;
                    height: 250px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                
                .upload-action-card:hover {
                    transform: scale(1.02);
                    background: #2d2d2d;
                }
                
                .submit-response-btn {
                    background: #FFEC00;
                    color: black;
                    border-radius: 15px;
                    width: 130px;
                    height: 100px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 18px;
                    line-height: 1.2;
                    cursor: pointer;
                    border: none;
                    transition: background 0.2s;
                }
                
                .submit-response-btn:hover:not(:disabled) {
                    background: #FFEC00;
                    opacity: 0.9;
                }

                .submit-response-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .video-container {
                    width: 100%;
                    height: 400px;
                    background: #000;
                    border-radius: 20px;
                    overflow: hidden;
                    position: relative;
                }

                .video-preview {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .recording-overlay {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: rgba(255, 0, 0, 0.4);
                    padding: 5px 15px;
                    border-radius: 10px;
                    color: white;
                    font-weight: bold;
                    backdrop-filter: blur(4px);
                    z-index: 10;
                }

                .dot {
                    width: 12px;
                    height: 12px;
                    background: #ff4444;
                    border-radius: 50%;
                    animation: blink 1s infinite;
                }

                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0.3; }
                    100% { opacity: 1; }
                }

                .loader {
                    border: 4px solid rgba(255, 255, 255, 0.1);
                    border-left-color: #fcee0a;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="video/mp4"
                onChange={handleFileUpload}
            />

            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <div className="loader"></div>
                    <span className="text-gray-400 font-bold">Loading Narrative Showcase...</span>
                </div>
            ) : (
                <>
                    {/* Stage Header */}
                    <div className="header-banner">
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-400 text-sm font-medium">Stage 03</span>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                {contentData?.title || 'CCIQ Present: Narrative Showcase'}
                            </h1>
                        </div>
                        <div className="text-[#fcee0a] text-xl font-bold">
                            Time Left: {timeLeft}
                        </div>
                    </div>

                    {/* Back Nav Bar */}
                    <div className="back-nav-bar" onClick={() => navigate(-1)}>
                        <ArrowLeft size={20} className="text-white" />
                        <span className="text-lg font-bold">Let Your Voice Be Seen</span>
                    </div>

                    {/* Content Section */}
                    <div className="flex items-start gap-8 mt-4 w-full max-w-[1100px] justify-center">
                        <div className="main-content-card gap-12">
                            <h2 className="text-xl md:text-2xl font-extrabold text-white">
                                {contentData?.que_statement || 'Tell Us About Yourself, Your Skills, and What Makes You Unique'}
                            </h2>

                            {!videoUrl && !isCameraActive && !isAttempted ? (
                                <div className="flex justify-center gap-10 flex-1 items-center">
                                    <div className="upload-action-card" onClick={activateCamera}>
                                        <img
                                            src="/cci/stage-3/video-btn-icon.png"
                                            alt="Record Video"
                                            style={{ width: "60px", height: "60px", objectFit: "contain" }}
                                        />
                                        <span className="text-lg font-bold text-center">
                                            Record Video
                                            <div className="text-xs font-normal text-gray-400 mt-2">Format: MP4 • Max 30 MB</div>
                                        </span>
                                    </div>

                                    <div className="upload-action-card" onClick={() => fileInputRef.current?.click()}>
                                        <img
                                            src="/cci/stage-3/video-btn-icon.png"
                                            alt="Upload Video"
                                            style={{ width: "60px", height: "60px", objectFit: "contain" }}
                                        />
                                        <span className="text-lg font-bold text-center">
                                            Upload Video
                                            <div className="text-xs font-normal text-gray-400 mt-2">Format: MP4 • Max 30 MB</div>
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6 flex-1">
                                    <div className="video-container shadow-2xl border border-white/5">
                                        {isCameraActive || isRecording ? (
                                            <>
                                                <video ref={videoRef} autoPlay muted className="video-preview" />
                                                {isRecording && (
                                                    <div className="recording-overlay">
                                                        <div className="dot" />
                                                        RECORDING - {formatTime(recordingTimeLeft)}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <video 
                                                key={videoUrl} 
                                                src={videoUrl!} 
                                                controls 
                                                className="video-preview" 
                                                onLoadedMetadata={(e) => {
                                                    const video = e.currentTarget;
                                                    if (video.duration === Infinity || isNaN(video.duration)) {
                                                        video.currentTime = 1e101;
                                                        const onTimeUpdate = () => {
                                                            video.removeEventListener('timeupdate', onTimeUpdate);
                                                            video.currentTime = 0;
                                                        };
                                                        video.addEventListener('timeupdate', onTimeUpdate);
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>

                                    <div className="flex justify-center gap-6">
                                        {isCameraActive && !isRecording && (
                                            <button
                                                onClick={startRecording}
                                                className="flex items-center gap-3 bg-green-600 hover:bg-green-500 px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
                                            >
                                                <Play size={20} />
                                                Start Recording
                                            </button>
                                        )}
                                        {isRecording && (
                                            <button
                                                onClick={stopRecording}
                                                className="flex items-center gap-3 bg-red-600 hover:bg-red-500 px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
                                            >
                                                <StopCircle size={20} />
                                                Stop Recording
                                            </button>
                                        )}
                                        {!isRecording && (videoUrl || isCameraActive) && !isAttempted && (
                                            <button
                                                onClick={handleRetake}
                                                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl font-bold transition-all border border-white/10"
                                            >
                                                <RotateCcw size={20} />
                                                {videoUrl ? 'Retake Video' : 'Cancel'}
                                            </button>
                                        )}
                                        {videoFile && (
                                            <div className="flex items-center text-gray-300 font-mono text-sm bg-white/5 px-6 py-3 rounded-xl border border-white/10 shadow-lg">
                                                Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => {
                                if (!videoFile && !videoUrl) {
                                    toast.error("Please record or upload a video first");
                                    return;
                                }
                                setShowSubmitModal(true);
                            }}
                            className="submit-response-btn"
                            disabled={isSubmitting || (!videoFile && !videoUrl) || isAttempted}
                        >
                            {isSubmitting ? (
                                <div className="loader !w-6 !h-6"></div>
                            ) : (
                                <>
                                    <span>{isAttempted ? 'Submitted' : (contentData?.user_file ? 'Update' : 'Submit')}</span>
                                    <span>Response</span>
                                </>
                            )}
                        </button>
                    </div>

                    {showSubmitModal && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.75)',
                            backdropFilter: 'blur(5px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                            fontFamily: "'Jacques Pro', sans-serif"
                        }}>
                            <div style={{
                                backgroundColor: '#2e2e2e',
                                border: '1px solid rgba(255, 255, 255, 0.4)',
                                borderRadius: '16px',
                                padding: '40px 24px',
                                width: '90%',
                                maxWidth: '580px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '20px',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
                                position: 'relative'
                            }}>
                                {/* Close Button */}
                                <button
                                    onClick={() => setShowSubmitModal(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '24px',
                                        background: 'none',
                                        border: 'none',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        padding: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: 0.8,
                                        transition: 'opacity 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                                >
                                    <X size={24} />
                                </button>

                                <h3 style={{
                                    fontSize: '26px',
                                    fontWeight: 700,
                                    color: '#fff',
                                    margin: 0,
                                    textAlign: 'center'
                                }}>
                                    Submit Response
                                </h3>

                                <p style={{
                                    fontSize: '16px',
                                    color: '#eee',
                                    margin: '10px 0 20px 0',
                                    textAlign: 'center',
                                    fontWeight: 400
                                }}>
                                    Are you sure you want to Upload the Video.
                                </p>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '24px',
                                    width: '100%'
                                }}>
                                    <button
                                        onClick={() => setShowSubmitModal(false)}
                                        style={{
                                            width: '110px',
                                            height: '90px',
                                            backgroundColor: '#737373',
                                            color: '#000',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            lineHeight: '1.2',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'transform 0.2s, background-color 0.2s',
                                            fontFamily: "'Jacques Pro', sans-serif"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            e.currentTarget.style.backgroundColor = '#808080';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.backgroundColor = '#737373';
                                        }}
                                    >
                                        <span>Review</span>
                                        <span>Video</span>
                                    </button>

                                    <button
                                        onClick={async () => {
                                            setShowSubmitModal(false);
                                            await handleSubmit();
                                        }}
                                        style={{
                                            width: '110px',
                                            height: '90px',
                                            backgroundColor: '#FFEC00',
                                            color: '#000',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            fontWeight: 700,
                                            lineHeight: '1.2',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'transform 0.2s, opacity 0.2s',
                                            fontFamily: "'Jacques Pro', sans-serif"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            e.currentTarget.style.opacity = '0.9';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.opacity = '1';
                                        }}
                                    >
                                        <span>Submit</span>
                                        <span>Response</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default NarrativeShowcase;
