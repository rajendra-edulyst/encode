import OpinionPoll from '../components/OpinionPoll'
import Pined from '../components/pined'
import CommunityFeatured from "@/views/common/components/communityFeatured";

const RightSidePanel = () => {
    return (
        <div className='space-y-5'>
            <CommunityFeatured />
            <OpinionPoll />
            <Pined />
        </div>
    )
}

export default RightSidePanel