interface AllocationCardProps {
    title: string;
    purchased: string;
    allocated: string;
    available: string;
    percent: string;
}

const AllocationCard = ({ title, purchased, allocated, available, percent }: AllocationCardProps) => (
    <div className="rounded-xl p-4 bg-slate-900 border border-white/10">
        <h3 className="font-semibold mb-3">{title}</h3>
        <div className="text-sm text-gray-400 space-y-1">
            <p>Purchased: <span className="text-white">{purchased}</span></p>
            <p>Allocated: <span className="text-white">{allocated}</span></p>
            <p>Available: <span className="text-white">{available}</span></p>
        </div>
        <div className="h-2 bg-white/10 rounded-full mt-4">
            <div className="h-2 bg-cyan-400 rounded-full" style={{ width: percent }} />
        </div>
        <p className="text-right text-sm mt-1">{percent}</p>
    </div>
);

export default AllocationCard;
