import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/ShadcnButton';
import { WifiOff, SignalHigh, Globe, X } from 'lucide-react';

const InternetSpeedMonitor: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [statusType, setStatusType] = useState<'offline' | 'slow'>('offline');
    const [connectionType, setConnectionType] = useState<string>('');
    const [isTesting, setIsTesting] = useState(false);
    const [speedResult, setSpeedResult] = useState<number | null>(null);

    const checkConnection = () => {
        const isOffline = !navigator.onLine;
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

        if (isOffline) {
            setStatusType('offline');
            setIsOpen(true);
            return;
        }

        if (connection) {
            if (['slow-2g', '2g', '3g'].includes(connection.effectiveType)) {
                setConnectionType(connection.effectiveType.toUpperCase());
                setStatusType('slow');
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        }
    };

    useEffect(() => {
        const handleOnline = () => setIsOpen(false);
        const handleOffline = () => {
            setStatusType('offline');
            setIsOpen(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (connection) {
            connection.addEventListener('change', checkConnection);
        }

        // Initial check
        checkConnection();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            if (connection) {
                connection.removeEventListener('change', checkConnection);
            }
        };
    }, []);

    const handleCheckSpeed = async () => {
        setIsTesting(true);
        setSpeedResult(null);

        const startTime = performance.now();
        const imageUrl = `/img/logo/imageai.png?cacheburst=${Math.random()}`; // ~1.4 MB
        const fileSizeInBytes = 1487700;

        try {
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            await response.blob();

            const endTime = performance.now();
            const durationInSeconds = (endTime - startTime) / 1000;
            const bitsLoaded = fileSizeInBytes * 8;
            const speedBps = bitsLoaded / durationInSeconds;
            const speedMbps = speedBps / (1024 * 1024);

            setSpeedResult(parseFloat(speedMbps.toFixed(2)));
        } catch (error) {
            console.error('Speed test failed:', error);
            // Fallback to connection downlink if testing fails
            const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
            if (connection?.downlink) {
                setSpeedResult(connection.downlink);
            }
        } finally {
            setIsTesting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full z-[9999] bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.1)] p-4 flex flex-col md:flex-row items-center justify-between gap-4 transition-transform duration-300">
            {/* Icon and Message */}
            <div className="flex items-center gap-4 flex-1">
                <div className={`p-3 rounded-full ${statusType === 'offline' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    {statusType === 'offline' ? <WifiOff className="w-6 h-6" /> : <SignalHigh className="w-6 h-6" />}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        {statusType === 'offline' ? 'No Internet Connection' : 'Weak Internet Connection'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {statusType === 'offline'
                            ? 'You are currently offline. Please check your Wi-Fi or mobile data connection to continue.'
                            : `Current connection type is ${connectionType}. For the best experience, a faster connection is recommended.`}
                    </p>
                </div>
            </div>

            {/* Speed result if tested */}
            {speedResult !== null && (
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 uppercase font-semibold">Speed:</span>
                    <span className="text-lg font-bold text-primary">{speedResult} <span className="text-sm font-normal">Mbps</span></span>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
                <Button
                    onClick={handleCheckSpeed}
                    className={`bg-primary text-black hover:bg-primary/90 flex items-center ${isTesting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isTesting}
                >
                    {isTesting ? (
                        <>
                            <div className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            Testing...
                        </>
                    ) : (
                        <>
                            <Globe className="w-4 h-4 mr-2 text-black" />
                            {speedResult !== null ? 'Test Again' : 'Check Speed'}
                        </>
                    )}
                </Button>
                <button
                    onClick={() => {
                        setIsOpen(false);
                        setSpeedResult(null);
                    }}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    title="Dismiss"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default InternetSpeedMonitor;
