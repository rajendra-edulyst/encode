import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

import { useMentorPerformance } from "@/hooks/data/create/useMentor";

export default function PerformanceCard({ timeFilter }: { timeFilter?: string }) {
    const { data, isLoading } = useMentorPerformance(timeFilter);

    if (isLoading || !data) {
        return (
            <Card className="bg-neutral-900 border-neutral-800 h-full flex items-center justify-center">
                <span className="text-sm text-neutral-400">Loading performance...</span>
            </Card>
        );
    }

    return (
        <Card className="bg-neutral-900 border-neutral-800 h-full">
            <CardHeader>
                <CardTitle className="text-white text-lg">
                    Performance
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                <Metric
                    label="Completion Rate"
                    value={`${data.completion_rate}%`}
                    progress={data.completion_rate}
                    color="#00C950"
                />

                <Metric
                    label="Response Time"
                    value={data.response_time}
                    progress={80} // visual-only (string based in API)
                    color="#2B7FFF"
                />

                <Metric
                    label="Mentee Retention"
                    value={`${data.mentee_retention}%`}
                    progress={data.mentee_retention}
                    color="#AD46FF"
                />

                <div className="flex items-center gap-3 bg-neutral-800 rounded-lg p-4">
                    <TrendingUp className="text-yellow-400" size={20} />
                    <div>
                        <p className="text-white font-medium">
                            Top 5% Mentor
                        </p>
                        <p className="text-xs text-neutral-400">
                            Platform-wide ranking
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function Metric({
    label,
    value,
    progress,
    color,
}: {
    label: string;
    value: string;
    progress: number;
    color: string;
}) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-white">{label}</span>
                <span style={{ color }}>{value}</span>
            </div>

            <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: color }}
                />
            </div>
        </div>
    );
}
