import React, { useEffect } from 'react'
import CommunityLayout from '../layouts'
import { Suggestion } from '../types/community';
import { Link, useParams } from 'react-router-dom';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { ChevronRight } from 'lucide-react';
import Poppin from '../components/post/poppin';
import TrendingCommunities from './discover/tranding-communities';

const SearchCommunity = () => {

    const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);

    const { searchTerm } = useParams<{ searchTerm: string }>();

    const search = async (query: string) => {
        if (!query) return;
        try {
            const response = await fetch(`https://elastic.edulystventures.com/search?org_key=1345643162&query=${encodeURIComponent(query)}`);
            const data = await response.json();
            if (data && data.suggestions) {
                setSuggestions(data.suggestions);
            }
        } catch (error) {
            console.error('Error fetching search suggestions:', error);
            return [];
        }
    };

    useEffect(() => {
        if (!searchTerm) return;
        search(searchTerm);
    }, [searchTerm]);

    return (
        <CommunityLayout>
            <div className="w-full flex flex-col md:flex-row py-6 gap-5">
                <div className="w-full md:w-[75%]">
                    <div className='text-sm text-gray-600'>
                        {
                            suggestions.length > 0 ? (
                                suggestions.map((suggestion, index) => (
                                    <div key={index} className='py-1 px-2'>
                                        <h5 className='font-semibold capitalize text-cblack'>{suggestion.type}</h5>
                                        {
                                            suggestion.type === 'person' &&
                                            <div className='flex flex-col gap-1 mt-2'>
                                                {
                                                    suggestion?.hits && suggestion.hits.length > 0 && suggestion?.hits?.map((hit, hitIndex) => (
                                                        hit?.name && <div key={hitIndex} className='rounded-md border hover:bg-gray-100 cursor-pointer py-1 px-2 flex justify-between items-center'>
                                                            <Link to={`/portfolio/${hit.id}`} className='flex justify-start gap-2'>
                                                                <div className='flex items-center gap-2'>
                                                                    <img src={hit?.profile_image ?? ''} alt={hit.name} className='w-8 h-8 rounded-full'
                                                                        onError={(e) => {
                                                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${hit.name}`;
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className='text-cblack'>
                                                                    <p className='text-sm font-semibold'>{hit.name}</p>
                                                                    <p className='text-xs text-gray-500'>{hit.username}</p>
                                                                </div>
                                                            </Link>
                                                            <ChevronRight className='text-gray-400 w-4 h-4 mt-1' />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        }
                                        {
                                            suggestion.type === 'community' &&
                                            <div className='flex flex-col gap-1 mt-2'>
                                                {
                                                    suggestion?.hits && suggestion.hits.length > 0 && suggestion?.hits?.map((hit, hitIndex) => (
                                                        <div key={hitIndex} className='rounded-md border hover:bg-gray-100 cursor-pointer py-1 px-2'>
                                                            <Link key={hitIndex} to={`/community/mycommunities/${hit.id}`} className='justify-start gap-2 grid grid-cols-12 items-center'>
                                                                <div className='flex items-center gap-2 col-span-1'>
                                                                    <img src={hit?.image ?? ''} alt={hit?.title} className='w-full rounded-md'
                                                                        onError={(e) => {
                                                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${hit?.title}`;
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className='text-cblack col-span-10'>
                                                                    <p className='text-sm font-semibold'>{hit?.title}</p>
                                                                    <p className='text-xs text-gray-500 line-clamp-1'>{stripHtmlTags(hit?.description ?? '')}</p>
                                                                    {/* tags */}
                                                                    <div className='flex flex-wrap gap-1 mt-1'>
                                                                        {
                                                                            hit?.tags?.map((tag, tagIndex) => (
                                                                                <span key={tagIndex} className='text-xs bg-gray-200 text-gray-700 px-2 rounded-md'>#{tag}</span>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        }
                                        {
                                            suggestion.type === 'post' &&
                                            <div className='flex flex-col gap-1 mt-2'>
                                                {
                                                    suggestion?.hits && suggestion.hits.length > 0 && suggestion?.hits?.map((hit, hitIndex) => (
                                                        <div key={hitIndex} className='rounded-md border hover:bg-gray-100 cursor-pointer py-1 px-2'>
                                                            <Link key={hitIndex} to={`/community/wall/post/${hit.id}`} className='grid grid-cols-12 gap-2 items-center'>
                                                                <div className='gap-2 col-span-1 flex items-center justify-center'>
                                                                    <img src={hit?.thumbnail_url ?? ''} alt={hit?.post_name} className='w-full h-12 rounded-md'
                                                                        onError={(e) => {
                                                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${hit?.post_name}`;
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className='text-cblack col-span-10'>
                                                                    <p className='text-sm font-semibold line-clamp-2'>{hit?.post_name}</p>
                                                                    <p className='text-xs text-gray-500 line-clamp-1'>{stripHtmlTags(hit?.description ?? '')}</p>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        }
                                        {
                                            suggestion.type === 'industry' &&
                                            <div className='flex flex-col gap-1 mt-2'>
                                                {
                                                    suggestion?.hits && suggestion.hits.length > 0 && suggestion?.hits?.map((hit, hitIndex) => (
                                                        <div key={hitIndex} className='rounded-md border hover:bg-gray-100 cursor-pointer py-1 px-2'>
                                                            <div className='grid grid-cols-12 gap-2 items-center'>
                                                                <div className='gap-2 col-span-1 flex items-center justify-center'>
                                                                    <img src={hit?.logo ?? ''} alt={hit?.name} className='w-full h-12 rounded-md'
                                                                        onError={(e) => {
                                                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${hit?.name}`;
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className='text-cblack col-span-10'>
                                                                    <p className='text-sm font-semibold line-clamp-2'>{hit?.name}</p>
                                                                    <p className='text-xs text-gray-500 line-clamp-1'>{stripHtmlTags(hit?.description ?? '')}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        }
                                    </div>
                                ))
                            ) : (
                                <div className='py-2 px-4 text-gray-500'>No suggestions found</div>
                            )
                        }
                    </div>
                </div>
                <div className="w-full md:w-[30%]">
                    <div className='space-y-5'>
                        {/* Trending Tags */}
                        <Poppin />
                        <TrendingCommunities />
                    </div>
                </div>
            </div>
        </CommunityLayout>
    )
}

export default SearchCommunity