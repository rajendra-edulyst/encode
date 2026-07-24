import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/ShadcnButton";
import { CheckCircle, XCircle } from "lucide-react";

interface Requirement {
    browser: boolean;
    screen: boolean;
    internet: boolean;
}

interface SystemCheckDialogProps {
    show: boolean;
    onClose: (value: boolean) => void;
    requirements: Requirement;
    setRequirements: (value: Requirement | ((prev: Requirement) => Requirement)) => void;
}

const SystemCheckDialog: React.FC<SystemCheckDialogProps> = ({ show, onClose, requirements, setRequirements }) => {
    const [checks, setChecks] = useState({
        browser: false,
        internet: navigator.onLine,
        screen: false,
        speed: null as number | null,
    });

    useEffect(() => {
        const browserCheck = () => /Chrome|Firefox|Safari|Edge/.test(navigator.userAgent);
        const screenCheck = () => window.innerWidth >= 900;

        const checkInternetSpeed = async () => {
            const fileSizeInBytes = 1000000; // 1MB
            const testUrl = "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg";

            const startTime = performance.now();
            try {
                await fetch(testUrl, { method: "GET", cache: "no-cache" });
                const endTime = performance.now();
                const durationInSeconds = (endTime - startTime) / 1000;
                const speedMbps = (fileSizeInBytes * 8) / (durationInSeconds * 1e6);
                setChecks(prev => ({ ...prev, speed: parseFloat(speedMbps.toFixed(2)) }));
            } catch {
                setChecks(prev => ({ ...prev, speed: 0 }));
            }
        };

        setChecks({
            browser: browserCheck(),
            screen: screenCheck(),
            internet: navigator.onLine,
            speed: null,
        });

        // ✅ FIXED: Correctly updating requirements using functional update
        setRequirements((prev: Requirement) => ({
            ...prev,
            browser: browserCheck(),
            screen: screenCheck(),
            internet: navigator.onLine,
        }));

        checkInternetSpeed();

        // Listen for internet status changes
        const updateOnlineStatus = () => {
            setChecks(prev => ({ ...prev, internet: navigator.onLine }));
            setRequirements((prev: Requirement) => ({
                ...prev,
                internet: navigator.onLine,
            }));
        };

        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);

        return () => {
            window.removeEventListener("online", updateOnlineStatus);
            window.removeEventListener("offline", updateOnlineStatus);
        };
    }, [setRequirements]);

    const checkItems = [
        { label: "Browser Compatibility", key: "browser" },
        { label: "Internet Connection", key: "internet" },
        { label: "Screen Resolution", key: "screen" },
    ];

    return (
        <Dialog open={show} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>System Compatibility Check</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    {checkItems.map(({ label, key }) => (
                        <div key={key} className="flex items-center justify-between">
                            <span>{label}</span>
                            {requirements?.[key as keyof Requirement] ? (
                                <CheckCircle className="text-green-500" size={20} />
                            ) : (
                                <XCircle className="text-red-500" size={20} />
                            )}
                        </div>
                    ))}
                    <div className="flex items-center justify-between">
                        <span>Internet Speed</span>
                        {checks.speed !== null ? (
                            <span className="text-blue-500 font-semibold">{checks.speed} Mbps</span>
                        ) : (
                            <span className="text-gray-500">Checking...</span>
                        )}
                    </div>
                    <Button className="w-full text-white" onClick={() => onClose(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SystemCheckDialog;
