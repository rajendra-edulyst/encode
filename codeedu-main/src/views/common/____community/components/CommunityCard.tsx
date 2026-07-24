import { Button } from "@/components/ui/ShadcnButton";
import { stripHtmlTags } from "@/utils/stripHtmlTags";
import { Trash } from "lucide-react";
import Swal from "sweetalert2";
import { deleteCommunity } from "../services/CommunityService";
import { Link } from "react-router-dom";

interface CommunityCardProps {
  logo: string;
  title: string;
  description: string;
  members: number;
  isLast?: boolean;
  id: number;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  logo, title, description, members, isLast, id
}) => {


  const deleteCommunityHandle = (communityId: number) => {
    // Implement the logic to delete the community
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCommunity(communityId)
          .then(() => {
            Swal.fire(
              'Deleted!',
              'Your community has been deleted.',
              'success'
            );
          })
          .catch((error) => {
            Swal.fire(
              'Error!',
              `There was an error deleting the community: ${error.message}`,
              'error'
            );
          });
      }
    });
  };


  return (
    <div className={`flex items-center justify-between gap-3 ${!isLast ? 'border-b-[0.5px] border-[#b6b6b6]/40 pb-3 mb-3' : ''}`}>
      <Link to={`/community/mycommunities/${id}`}>
        <div className="flex items-start gap-3 w-full">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center border">
            <img src={logo || `https://ui-avatars.com/api/?name=${title}`} alt={title} className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null; // Prevent infinite loop
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${title}`; // Fallback image
              }}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-gray-500 line-clamp-1">{stripHtmlTags(description)}</p>
            <p className="text-xs text-gray-500">{members} {members === 1 ? 'Member' : 'Members'}</p>
          </div>
        </div>
      </Link>
      <div className="flex items-center justify-between">
        <Button variant="link" className="text-red-500 p-0 h-auto !rounded-button whitespace-nowrap" onClick={() => deleteCommunityHandle(id)}>
          <Trash strokeWidth={1.5} size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CommunityCard;