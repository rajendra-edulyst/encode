interface AlertCardProps {
    title: string;
    value: number;
}

const AlertCard = ({ title, value }: AlertCardProps) => (
    <div className="rounded-xl p-4 bg-slate-900 border border-white/10">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
);

export default AlertCard;
