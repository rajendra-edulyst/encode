interface DonutChartProps {
    percentage?: number;
    size?: number;
    strokeWidth?: number;
    progressColor?: string;
    trackColor?: string;
    showText?: boolean;
}

export const DonutChart = ({
    percentage = 15,
    size = 120,
    strokeWidth = 12,
    progressColor = "#FFEC00",
    trackColor = "#5A5A5A",
    showText = true,
}: DonutChartProps) => {
    const value = Math.min(100, Math.max(0, percentage));

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset =
        circumference - (value / 100) * circumference;

    return (
        <div
            className="relative flex items-center justify-center"
            style={{
                width: size,
                height: size,
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="-rotate-90"
            >
                {/* Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={trackColor}
                    strokeWidth={strokeWidth}
                />

                {/* Progress */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={progressColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-500"
                />
            </svg>

            {showText && (
                <div
                    className="absolute text-white font-medium"
                    style={{
                        fontSize: size * 0.22,
                    }}
                >
                    {value}%
                </div>
            )}
        </div>
    );
};