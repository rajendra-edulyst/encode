import { Button } from '@/components/ui/ShadcnButton';
import IndustryCard from '@/views/common/community/components/IndustryCard';
import { formatApiDate } from '@/views/common/community/utils/dateFormat';
import React from 'react'
import { Link } from 'react-router-dom';
import { useIndustryLatestPosts } from '../../../@hooks/usePost';

const Industries = () => {

    const { data: industryPosts = [] } = useIndustryLatestPosts();


    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border glowConnectCard">
            <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold text-cblack">Emerging&nbsp;<span className="text-cgreen font-bold text-2xl">Industries</span> to watch</h2>
            </div>
            <div className="space-y-4">
                {
                    Array.isArray(industryPosts) && industryPosts.slice(0,3)?.map((post, index) => (
                        <Link key={post.id} to={`/community/wall/post/${post.id}`}>
                        <IndustryCard
                            key={post.id}
                            logo={post.resource_path_thumbnail || `https://ui-avatars.com/api/?name=${post?.org_name}&background=random&size=60`}
                            title={post.title || 'No Title'}
                            company={post.org_name}
                            date={formatApiDate(post?.created_at?.toString()) || 'N/A'}
                            isLast={index === industryPosts.length - 1}
                            org_logo={post?.org_logo}
                        />
                        </Link>
                    ))
                }
                <div className="text-right">
                    <Button variant="link" className="text-blue-500 p-0 h-auto !rounded-button whitespace-nowrap">
                        <Link to={'/community/wall/industries'} className="text-blue-500 hover:underline">
                            View All
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}




export default Industries