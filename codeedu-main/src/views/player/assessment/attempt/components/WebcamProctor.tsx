import React, { useEffect, useRef, useState } from 'react';
import { VideoOff, ShieldAlert } from 'lucide-react';

const WebcamProctor: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let stream: MediaStream | null = null;
        
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera access denied or not available:", err);
                setHasError(true);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <div className="fixed bottom-24 right-8 z-[80] bg-gray-900/90 backdrop-blur-md border border-gray-700/50 p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] overflow-hidden w-56 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3 px-1">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Under Invigilation</span>
            </div>
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-gray-800">
                {hasError ? (
                    <div className="flex flex-col items-center justify-center p-4">
                        <VideoOff className="w-8 h-8 text-red-500 mb-2" />
                        <span className="text-[10px] text-red-400 text-center font-medium">Camera access required</span>
                    </div>
                ) : (
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover transform -scale-x-100"
                    />
                )}
            </div>
            <div className="mt-2 text-[10px] text-gray-400 text-center leading-tight">
                Your instructor can see you during the exam.
            </div>
        </div>
    );
};

export default WebcamProctor;
