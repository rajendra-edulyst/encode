import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, StopCircle, RefreshCw, Check, X, Play, Pause } from 'lucide-react';
import { toast } from 'sonner';

interface VideoRecorderProps {
    onRecordingComplete: (file: File) => void;
    onClose: () => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ onRecordingComplete, onClose }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const previewRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' }, 
                audio: true 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            toast.error('Could not access camera. Please check permissions.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const startRecording = () => {
        if (!stream) return;
        
        chunksRef.current = [];
        
        // Priority Mime Types
        const types = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm',
            'video/mp4',
            'video/quicktime'
        ];

        const mimeType = types.find(type => MediaRecorder.isTypeSupported(type)) || '';
        console.log('Selected MimeType:', mimeType);

        try {
            const recorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });
                const url = URL.createObjectURL(blob);
                console.log('Recorded Blob created:', blob.size, blob.type);
                setRecordedBlob(blob);
                setPreviewUrl(url);
                stopCamera();
            };

            recorder.start(100); // Collect data every 100ms
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recorder:', err);
            toast.error('Failed to start recording. Please try again.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleSave = () => {
        if (recordedBlob) {
            const extension = recordedBlob.type.includes('mp4') ? 'mp4' : 'webm';
            const file = new File([recordedBlob], `video_resume.${extension}`, { type: recordedBlob.type });
            onRecordingComplete(file);
        }
    };

    const handleReset = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setRecordedBlob(null);
        setPreviewUrl(null);
        setIsPlaying(false);
        chunksRef.current = [];
        startCamera();
    };

    const togglePlayPreview = async () => {
        if (!previewRef.current) return;

        try {
            if (isPlaying) {
                previewRef.current.pause();
                setIsPlaying(false);
            } else {
                await previewRef.current.play();
                setIsPlaying(true);
            }
        } catch (err) {
            console.error('Preview play error:', err);
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        if (previewUrl && previewRef.current) {
            console.log('Preview URL updated, loading video:', previewUrl);
            previewRef.current.load();
        }
    }, [previewUrl]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-2 border-gray-800">
                {!recordedBlob ? (
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <video 
                        key={previewUrl}
                        ref={previewRef} 
                        src={previewUrl || ''} 
                        onEnded={() => setIsPlaying(false)}
                        playsInline
                        preload="auto"
                        controls
                        className="w-full h-full object-cover"
                    />
                )}

                {isRecording && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/80 px-3 py-1 rounded-full animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full" />
                        <span className="text-white text-xs font-bold uppercase">Recording</span>
                    </div>
                )}
            </div>

            <div className="flex justify-center items-center gap-4 py-2">
                {!recordedBlob ? (
                    <>
                        {!isRecording ? (
                            <Button 
                                onClick={startRecording}
                                className="bg-red-500 hover:bg-red-600 rounded-full w-16 h-16 p-0 flex items-center justify-center border-4 border-white/20"
                            >
                                <div className="w-6 h-6 bg-white rounded-full" />
                            </Button>
                        ) : (
                            <Button 
                                onClick={stopRecording}
                                className="bg-white hover:bg-gray-100 text-black rounded-full w-16 h-16 p-0 flex items-center justify-center border-4 border-red-500/20"
                            >
                                <StopCircle className="w-8 h-8 text-red-500 fill-red-500" />
                            </Button>
                        )}
                    </>
                ) : (
                    <div className="flex flex-wrap justify-center gap-3">
                        <Button 
                            variant="default"
                            onClick={handleReset}
                            className="bg-gray-800 text-white hover:bg-gray-700 rounded-xl px-5 py-2 h-auto flex items-center gap-2 border-none"
                        >
                            <RefreshCw className="h-4 w-4" /> 
                            <span className="font-semibold">Retake</span>
                        </Button>
                        <Button 
                            onClick={togglePlayPreview}
                            className="bg-[#88C057] text-black hover:bg-[#78b047] rounded-xl px-5 py-2 h-auto flex items-center gap-2 border-none"
                        >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                            <span className="font-semibold">{isPlaying ? 'Pause' : 'Preview'}</span>
                        </Button>
                        <Button 
                            onClick={handleSave}
                            className="bg-primary text-black hover:bg-primary/90 rounded-xl px-6 py-2 h-auto flex items-center gap-2 border-none"
                        >
                            <Check className="h-4 w-4 font-bold" /> 
                            <span className="font-bold">Save & Upload</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoRecorder;
