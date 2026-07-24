interface StatCardProps {
    title: string;
    value: number;
    change?: string;
    subtitle?: string;
    color?: string;
}

const StatCard = ({ title, value, change, subtitle }: StatCardProps) => (
    <div className="rounded-xl p-4 bg-slate-900 border border-white/10">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {/*{change && <p className="text-green-400 text-sm mt-1">↑ {change} vs last month</p>}*/}
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
    </div>
);

export default StatCard;
