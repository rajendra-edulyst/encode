interface PackageCardProps {
    title: string;
    value: string;
}

const PackageCard = ({ title, value }: PackageCardProps) => (
    <div className="rounded-xl p-4 bg-slate-900 border border-white/10">
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
    </div>
);

export default PackageCard;
