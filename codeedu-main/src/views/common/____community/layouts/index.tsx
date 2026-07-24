import { Button } from '@/components/ui/ShadcnButton';
import { Link } from 'react-router-dom';
import CommunitySearch from '../components/Search';


interface Props {
    active?: 'mywall' | 'myposts' | 'mycommunities' | 'discover';
    children: React.ReactNode;
}

const CommunityLayout = ({ active, children }: Props) => {

    const activeTabClass = 'relative before:absolute before:-bottom-1 before:left-0 before:h-[2px] before:w-full before:bg-primary text-cblue';

    return (
        <div>
            <div className='hidden md:flex justify-between items-center border-b pr-5 pb-1 sticky top-20 bg-[#f8f8f8] z-10 p-2'>
                <div className='flex justify-between items-center gap-9'>
                    <Button asChild variant="ghost" className={`font-semibold text-lg hover:bg-transparent ${active === 'mywall' ? activeTabClass : 'text-[#273454]/70'}`}>
                        <Link to='/community'>Encode</Link>
                    </Button>
                    <Button asChild variant="ghost" className={`font-semibold text-lg hover:bg-transparent ${active === 'mycommunities' ? activeTabClass : 'text-[#273454]/70'}`}>
                        <Link to='/community/mycommunities'>My Communities</Link>
                    </Button>
                    <Button asChild variant="ghost" className={`font-semibold text-lg hover:bg-transparent ${active === 'discover' ? activeTabClass : 'text-[#273454]/70'}`}>
                        <Link to='/community/discover'>Discover</Link>
                    </Button>
                </div>
                <CommunitySearch />
            </div>
            <div className='p-4'>
                {children}
            </div>
        </div>
    )
}

export default CommunityLayout;