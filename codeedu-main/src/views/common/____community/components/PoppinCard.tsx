import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface PoppinCardProps {
  tag: string;
  index: number;
  posts: string;
  isLast?: boolean;
}

const PoppinCard: React.FC<PoppinCardProps> = ({
  tag, index, posts, isLast
}) => {
  return (
    <Link to={`/community/search/${tag}`} className={`flex items-start gap-3 ${!isLast ? 'border-b-[0.5px] border-[#b6b6b6]/40 pb-3 mb-3' : ''}`}>
      <div className="flex-1">
        <h3 className="font-semibold text-sm text-cblack">#{tag}</h3>
        <p className="text-xs text-cblack">Trending <span className="text-cblue font-semibold">#{index}</span></p>
        <p className="text-xs text-cblack mt-1">{posts} Posts</p>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <ChevronRight className="w-4 h-4" />
      </button>
    </Link>
  )
};

export default PoppinCard;