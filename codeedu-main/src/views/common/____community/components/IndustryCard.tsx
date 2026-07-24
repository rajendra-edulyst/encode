import { Calendar } from "lucide-react";

interface IndustryCardProps {
  logo: string;
  title: string;
  company: string;
  date: string;
  isLast?: boolean;
  org_logo?: string; // Optional prop for organization logo
}

const IndustryCard: React.FC<IndustryCardProps> = ({
  logo, title, company, date, isLast, org_logo
}) => {
  return (
    <div className={`flex items-center gap-3 ${!isLast ? 'border-b-[0.5px] border-[#b6b6b6]/40 pb-3 mb-3' : ''}`}>
      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center border">
        {/* <img src={logo} alt={title} className="w-full h-full object-cover" /> */}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-sm text-cblack">{title}</h3>
        <div className="flex items-center">{org_logo && <img src={org_logo} alt={company} className="w-10 rounded-full" />}<p className="text-xs text-cblack">{company}</p></div>
        <div className="flex items-center text-xs text-cblack mt-1">
          <Calendar strokeWidth={1.5} size={14} className="mr-1" />
          <span>{date}</span>
        </div>
      </div>
    </div>

  );
};

export default IndustryCard;