import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/ShadcnButton";

interface TrandingCommunityCardProps {
  logo: string;
  title: string;
  category: string;
  members: number;
  isLast?: boolean;
  id: number;
  user_joined_id?: number | null;
  
  joinThisCommunity: (id: number) => void;
  leaveThisCommunity: (id: number) => void;
}

const TrandingCommunityCard: React.FC<TrandingCommunityCardProps> = ({
  logo, title, category, members, isLast, id,
   user_joined_id,
  joinThisCommunity,
  leaveThisCommunity
}) => {
  return (
    <Link to={`/community/mycommunities/${id}`} className={`flex items-center gap-3 ${!isLast ? 'border-b-[0.5px] border-[#b6b6b6]/40 pb-3 mb-3' : ''}`}>
      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center border">
        <img src={logo} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-gray-500">{category}</p>
        <p className="text-xs text-gray-500">{members} {members === 1 ? 'Member' : 'Members'}</p>
      </div>
      
        <div>
          
        {!user_joined_id ? (
          <Button
            type="button"
            size={"sm"}
            variant="ghost"
            className="text-cblue !rounded-button whitespace-nowrap hover:bg-[#009bd8]/10 hover:text-cblue hover:scale-95 transition-all duration-200"
            onClick={(e) => {
              e.preventDefault(); 
              joinThisCommunity(id);
            }}
          >
            Join Now
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-red-500 !rounded-button whitespace-nowrap hover:bg-[#e60086]/10 hover:text-red-600 hover:scale-95 transition-all duration-200"
            onClick={(e) => {
              e.preventDefault();
              leaveThisCommunity(id);
            }}
          >
            Leave
          </Button>
        )}
      </div>
      {/* <ChevronRight className="text-gray-400 hover:text-gray-600 cursor-pointer" size={16} /> */}

   
    </Link>
  );
};

export default TrandingCommunityCard;