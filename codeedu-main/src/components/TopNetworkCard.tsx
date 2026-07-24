import React from 'react'
import { Button } from './ui/ShadcnButton';
import { Check } from 'lucide-react';


interface User {
    id: number;
    name: string;
    profile_image: string;
    number_of_post: number;
    number_of_comments: number;
    number_of_likes: number;
    description?: string;
    heading?: string;
    image?: string;
}


const TopNetworkCard: React.FC<{ user: User, idx: number, type: 'weekly' | 'monthly' }> = ({ user }) => {

    return (
        <div className="p-4 bg-white rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div>
                        <img src={user.profile_image} alt={user.name} className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.name}`; // Fallback image
                            }}
                        />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-bold my-0 py-0 text-[var(--IndexBlack)]">{user.name}</h3>
                        {/* <p className="text-sm text-gray-600 my-0 py-0">{user.role}</p> */}
                        {/* user?.image ||  */}
                        <p className="text-xs flex gap-2 items-center my-0 py-0 text-[var(--IndexBlack)]">{user?.heading || 'Top Collaborator'} <img src={"https://community.edulystventures.com/images/icons/win.png"} className="w-3 h-3" /></p>
                    </div>
                </div>
                <Button asChild variant={"outline"} className="border-[#00A8E9] dark:border-[#00A8E9] dark:bg-white hover:bg-white hover:text-[#00A8E9]">
                    <a href={`https://https://encode.codeedu.co/portfolio/${user.id}`} className="text-[#00A8E9] bg-white hover:bg-white">
                        Follow
                    </a>
                </Button>
            </div>
            <div>
                <p className="text-sm text-[var(--IndexBlack)] mt-4 font-normal">{user?.description || 'No description available'}</p>
            </div>
            <div className="mt-3 text-sm text-left gap-1 flex flex-col">
                <h3 className="text-sm font-medium text-[var(--IndexBlack)] mb-1">Contributions:</h3>
                <p className="flex gap-2 font-normal text-[var(--IndexBlack)] items-center"><Check className="text-green-500" size={16} /> {user.number_of_post} posts shared</p>
                <p className="flex gap-2 font-normal text-[var(--IndexBlack)] items-center"><Check className="text-green-500" size={16} /> {user.number_of_comments}+ comments</p>
                <p className="flex gap-2 font-normal text-[var(--IndexBlack)] items-center"><Check className="text-green-500" size={16} /> {user.number_of_likes}+ likes</p>
            </div>
        </div>
    )
}

export default TopNetworkCard