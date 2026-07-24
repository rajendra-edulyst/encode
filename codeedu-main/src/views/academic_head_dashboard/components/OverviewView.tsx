import React from 'react';
import {
    GraduationCap
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Sector
} from 'recharts';
import type { DashboardData, ProgressSegment } from '../types';

interface OverviewViewProps {
    currentData: DashboardData;
}

// Premium Coin Medal SVG components for top ranks
const GoldMedal = () => (
    <svg width="42" height="42" viewBox="0 0 40 40" fill="none" className="drop-shadow-md">
        <circle cx="20" cy="20" r="18" fill="url(#gold_outer)" stroke="#FFD700" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="14" fill="url(#gold_inner)" />
        <path d="M20 10 L22.5 15.5 L28.5 16 L24 20 L25.5 26 L20 22.8 L14.5 26 L16 20 L11.5 16 L17.5 15.5 Z" fill="#FFE875" opacity="0.4" />
        <text x="20" y="25" fontFamily="'Inter', sans-serif" fontSize="15" fontWeight="800" fill="#5C4000" textAnchor="middle">1</text>
        <defs>
            <linearGradient id="gold_outer" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stopColor="#FFE875" />
                <stop offset="50%" stopColor="#F7B500" />
                <stop offset="100%" stopColor="#A87300" />
            </linearGradient>
            <linearGradient id="gold_inner" x1="6" y1="6" x2="34" y2="34">
                <stop offset="0%" stopColor="#FFF5BF" />
                <stop offset="100%" stopColor="#D49200" />
            </linearGradient>
        </defs>
    </svg>
);

const SilverMedal = () => (
    <svg width="42" height="42" viewBox="0 0 40 40" fill="none" className="drop-shadow-md">
        <circle cx="20" cy="20" r="18" fill="url(#silver_outer)" stroke="#E6E6E6" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="14" fill="url(#silver_inner)" />
        <text x="20" y="25" fontFamily="'Inter', sans-serif" fontSize="15" fontWeight="800" fill="#424242" textAnchor="middle">2</text>
        <defs>
            <linearGradient id="silver_outer" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#CCCCCC" />
                <stop offset="100%" stopColor="#808080" />
            </linearGradient>
            <linearGradient id="silver_inner" x1="6" y1="6" x2="34" y2="34">
                <stop offset="0%" stopColor="#F5F5F5" />
                <stop offset="100%" stopColor="#A6A6A6" />
            </linearGradient>
        </defs>
    </svg>
);

const BronzeMedal = () => (
    <svg width="42" height="42" viewBox="0 0 40 40" fill="none" className="drop-shadow-md">
        <circle cx="20" cy="20" r="18" fill="url(#bronze_outer)" stroke="#CD7F32" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="14" fill="url(#bronze_inner)" />
        <text x="20" y="25" fontFamily="'Inter', sans-serif" fontSize="15" fontWeight="800" fill="#4A2500" textAnchor="middle">3</text>
        <defs>
            <linearGradient id="bronze_outer" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stopColor="#ECC49F" />
                <stop offset="50%" stopColor="#B87333" />
                <stop offset="100%" stopColor="#6E3A07" />
            </linearGradient>
            <linearGradient id="bronze_inner" x1="6" y1="6" x2="34" y2="34">
                <stop offset="0%" stopColor="#F3D3B6" />
                <stop offset="100%" stopColor="#9C5213" />
            </linearGradient>
        </defs>
    </svg>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, value, name, payload }: any) => {
    const RADIAN = Math.PI / 180;
    const displayValue = payload?.value !== undefined ? payload.value : value;

    // Suppress label if actual percentage is 0%
    if (displayValue === 0) {
        return null;
    }

    const labelRadius = outerRadius + 12;

    const x = cx + labelRadius * Math.cos(-midAngle * RADIAN);
    const y = cy + labelRadius * Math.sin(-midAngle * RADIAN);

    let textAnchor = x > cx ? 'start' : 'end';
    if (Math.abs(x - cx) < 5) {
        textAnchor = 'middle';
    }

    return (
        <text
            x={x}
            y={y}
            fill="#ffffff"
            textAnchor={textAnchor}
            dominantBaseline="central"
            className="text-sm font-bold font-sans"
        >
            {`${displayValue}%`}
        </text>
    );
};

const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
        x: cx + r * Math.cos(angleInRadians),
        y: cy - r * Math.sin(angleInRadians),
    };
};

const OverviewView: React.FC<OverviewViewProps> = ({ currentData }) => {
    const progressData = [
        currentData.progressDistribution.find(x => x.name === 'Completed'),
        currentData.progressDistribution.find(x => x.name === 'In Progress'),
        currentData.progressDistribution.find(x => x.name === 'Not Started'),
        currentData.progressDistribution.find(x => x.name === 'Not Assigned'),
    ].filter(Boolean) as ProgressSegment[];

    const totalActualValue = progressData.reduce((sum, x) => sum + x.value, 0) || 100;
    const minRenderPercent = 6;
    const nonZeroSegments = progressData.filter(x => x.value > 0);
    const N = nonZeroSegments.length;

    const chartData = progressData.map(segment => {
        if (segment.value === 0) {
            return { ...segment, renderValue: 0 };
        }
        const remainingBudget = 100 - (N * minRenderPercent);
        const renderValue = minRenderPercent + (segment.value / totalActualValue) * remainingBudget;
        return {
            ...segment,
            renderValue,
        };
    });

    const renderOverlappingSector = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, name } = props;

        const r = (innerRadius + outerRadius) / 2;
        const strokeWidth = outerRadius - innerRadius;

        const start = polarToCartesian(cx, cy, r, startAngle);
        const end = polarToCartesian(cx, cy, r, endAngle);

        const deltaAngle = Math.abs(endAngle - startAngle);
        const largeArcFlag = deltaAngle > 180 ? 1 : 0;
        const sweepFlag = startAngle > endAngle ? 1 : 0;

        const pathData = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;

        let showOverlapCap = false;
        let capX = 0;
        let capY = 0;
        let capColor = fill;

        const currentName = name || props.payload?.name;

        // Dynamic overlap cap calculation using active segments clockwise
        const segmentsOrder = ['Completed', 'In Progress', 'Not Started', 'Not Assigned'];
        const activeSegments = segmentsOrder.filter(segName => {
            const seg = chartData.find(x => x.name === segName);
            return seg && seg.value > 0;
        });

        if (activeSegments.length > 1) {
            const currentIdx = activeSegments.indexOf(currentName);
            if (currentIdx !== -1) {
                const precedingIdx = (currentIdx - 1 + activeSegments.length) % activeSegments.length;
                const precedingName = activeSegments[precedingIdx];
                const precedingSeg = chartData.find(x => x.name === precedingName);
                if (precedingSeg) {
                    const capCenter = polarToCartesian(cx, cy, r, startAngle);
                    capX = capCenter.x;
                    capY = capCenter.y;
                    capColor = precedingSeg.color;
                    showOverlapCap = true;
                }
            }
        }

        return (
            <g>
                {/* Main colored capsule segment */}
                <path
                    d={pathData}
                    fill="none"
                    stroke={fill}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Overlap cap circle to create layered overlap effect at the top boundary */}
                {showOverlapCap && (
                    <circle
                        cx={capX}
                        cy={capY}
                        r={strokeWidth / 2}
                        fill={capColor}
                        style={{ pointerEvents: 'none' }}
                    />
                )}
            </g>
        );
    };

    const maxEnrolled = Math.max(...(currentData.growthTrends?.map(x => x.enrolled) || []), 6000);
    const step = maxEnrolled > 10000 ? 5000 : maxEnrolled > 5000 ? 2000 : 1500;
    const yDomainMax = Math.ceil(maxEnrolled / step) * step;
    const yTicks = [0, Math.round(yDomainMax * 0.25), Math.round(yDomainMax * 0.5), Math.round(yDomainMax * 0.75), yDomainMax];

    return (
        <>
            {/* Middle Graphs Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                {/* Growth Trends */}
                <div className="lg:col-span-3 bg-[#121212] border border-zinc-800/70 p-6 rounded-2xl flex flex-col hover:border-zinc-800 transition-all duration-200">
                    <div className="mb-4">
                        <h3 className="text-lg sm:text-xl font-bold">Growth Trends</h3>
                        <p className="text-zinc-500 text-xs sm:text-sm">Students Enrollment Report</p>
                    </div>
                    <div className="w-full h-[280px] sm:h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={currentData.growthTrends}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="month"
                                    stroke="#3f3f46"
                                    tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }}
                                    tickLine={false}
                                    axisLine={{ stroke: '#27272a' }}
                                />
                                <YAxis
                                    stroke="#3f3f46"
                                    domain={[0, yDomainMax]}
                                    ticks={yTicks}
                                    tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }}
                                    tickLine={false}
                                    axisLine={{ stroke: '#27272a' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        border: '1px solid #27272a',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontSize: '12px',
                                    }}
                                    labelStyle={{ fontWeight: 'bold', color: '#a1a1aa' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="enrolled"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#growthGradient)"
                                    activeDot={{ r: 6, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Students Progress Distribution */}
                <div className="lg:col-span-2 bg-[#121212] border border-zinc-800/70 p-6 rounded-2xl flex flex-col hover:border-zinc-800 transition-all duration-200">
                    <div className="mb-2">
                        <h3 className="text-lg sm:text-xl font-bold">Students Progress Distribution</h3>
                        <p className="text-zinc-500 text-xs sm:text-sm">
                            Total Students = {typeof currentData.stats[2]?.value === 'number' ? currentData.stats[2].value.toLocaleString() : (currentData.stats[2]?.value || '0')}
                        </p>
                    </div>

                     {/* Donut Chart */}
                    <div className="relative flex-1 flex flex-col items-center justify-center min-h-[260px]">
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Tooltip
                                    formatter={(value: any, name: any, props: any) => {
                                        const percent = props.payload?.value !== undefined ? props.payload.value : value;
                                        const count = props.payload?.count !== undefined ? props.payload.count : 0;
                                        return [`${percent}% (${count.toLocaleString()} students)`, name];
                                    }}
                                    contentStyle={{
                                        backgroundColor: '#18181b',
                                        border: '1px solid #27272a',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                    }}
                                    itemStyle={{
                                        color: '#fff',
                                    }}
                                />
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={95}
                                    paddingAngle={0}
                                    dataKey="renderValue"
                                    startAngle={90}
                                    endAngle={-270}
                                    stroke="none"
                                    strokeWidth={0}
                                    label={renderCustomizedLabel}
                                    labelLine={false}
                                    activeShape={renderOverlappingSector}
                                    inactiveShape={renderOverlappingSector}
                                    activeIndex={chartData.map((_, index) => index)}
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {chartData.map((entry: ProgressSegment, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={65}
                                    outerRadius={95}
                                    paddingAngle={0}
                                    dataKey="renderValue"
                                    startAngle={79.3}
                                    endAngle={-280.7}
                                    stroke="none"
                                    strokeWidth={0}
                                    label={false}
                                    labelLine={false}
                                    style={{ opacity: 0, cursor: 'pointer' }}
                                >
                                    {chartData.map((entry: ProgressSegment, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Graduation cap */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <GraduationCap className="w-14 h-14 text-white" />
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center items-center gap-6 mt-4">
                        {currentData.progressDistribution.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-zinc-200 text-xs sm:text-sm font-semibold">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Performing List */}
            <div className="bg-[#121212] border border-zinc-800/70 rounded-2xl p-6 hover:border-zinc-800 transition-all duration-200">
                <div className="mb-6">
                    <h3 className="text-lg sm:text-xl font-bold">Top Performing Institutions</h3>
                    <p className="text-zinc-500 text-xs sm:text-sm">Highest completion rates</p>
                </div>

                <div className="flex flex-col gap-4">
                    {currentData.topInstitutions.map((inst) => (
                        <div
                            key={inst.rank}
                            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950/80 transition-all duration-150"
                        >
                            {/* Rank info & details */}
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12">
                                    {inst.rank === 1 && <GoldMedal />}
                                    {inst.rank === 2 && <SilverMedal />}
                                    {inst.rank === 3 && <BronzeMedal />}
                                    {inst.rank > 3 && (
                                        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400">
                                            {inst.rank}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-white text-base sm:text-lg font-bold tracking-tight">
                                        {inst.name}
                                    </h4>
                                    <p className="text-zinc-500 text-xs sm:text-sm font-medium">
                                        {inst.location}
                                    </p>
                                </div>
                            </div>

                            {/* Stat counts columns */}
                            <div className="grid grid-cols-3 gap-6 sm:gap-12 w-full md:w-auto text-left md:text-right border-t md:border-t-0 border-zinc-900 pt-3 md:pt-0">
                                <div className="flex flex-col">
                                    <span className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                        Students Enrolled
                                    </span>
                                    <span className="text-white text-sm sm:text-base font-extrabold mt-1">
                                        {inst.studentsEnrolled.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                        Internal Faculty
                                    </span>
                                    <span className="text-white text-sm sm:text-base font-extrabold mt-1">
                                        {inst.internalFaculty.toLocaleString()}
                                    </span>
                                </div>

                                <div className="flex flex-col items-start md:items-end">
                                    <span className="text-zinc-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                                        Completion
                                    </span>
                                    <span className="text-sm sm:text-base font-black mt-1 text-[#7FBC42]">
                                        {inst.completionRate.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default OverviewView;
