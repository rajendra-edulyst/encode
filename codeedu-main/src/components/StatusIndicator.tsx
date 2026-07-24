import { RefreshCw, CloudAlert } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/shadcnTooltip";

type StatusIndicatorProps = {
    loading?: boolean;
    error?: string | null | undefined;
    loadingMessage?: string;
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
    loading = false,
    error = null,
    loadingMessage = "Syncing ...",
}) => {
    if (!loading && !error) return null;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="border p-[8px] rounded-md">
                    {loading && <RefreshCw size={16} className="animate-spin" />}
                    {error && <CloudAlert size={16} className="text-red-700" />}
                </TooltipTrigger>
                <TooltipContent>{error ?? loadingMessage}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default StatusIndicator;
