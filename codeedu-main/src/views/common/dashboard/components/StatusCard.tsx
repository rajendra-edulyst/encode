interface StatusCardProps {
    title: string;
    value: number;
    percent: string;
    total?: number | string;
}

const StatusCard = ({ title, value, percent, total = "3,200" }: StatusCardProps) => (
    <div className="rounded-xl p-4 bg-slate-900 border border-white/10">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-xl font-semibold">
            {value} <span className="text-sm text-gray-400">of {total}</span>
        </p>
        <div className="h-2 bg-white/10 rounded-full mt-2">
            <div className="h-2 bg-cyan-400 rounded-full" style={{ width: percent }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">{percent} of total</p>
    </div>
);

export default StatusCard;
