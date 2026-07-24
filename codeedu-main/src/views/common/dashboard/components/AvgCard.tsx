interface AvgCardProps {
    title: string;
    value: string;
}

const AvgCard = ({ title, value }: AvgCardProps) => (
    <div className="rounded-xl p-4 bg-slate-900 border border-white/10 flex justify-between items-center">
        <p className="text-sm text-gray-400">{title}</p>
        <div className="w-12 h-12 rounded-full border-2 border-cyan-400 flex items-center justify-center text-sm">
            {value}
        </div>
    </div>
);

export default AvgCard;
