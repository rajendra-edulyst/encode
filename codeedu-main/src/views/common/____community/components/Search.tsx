import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/ShadcnInput';
import { ChevronRight, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';
import { Suggestion } from '../types/community';
import { stripHtmlTags } from '@/utils/stripHtmlTags';

// Custom hook for debounced value
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  React.useEffect(() => {
    const handler = debounce((newValue: T) => {
      setDebouncedValue(newValue);
    }, delay);

    handler(value);

    return () => {
      handler.cancel();
    };
  }, [value, delay]);

  return debouncedValue;
};

const fetchSuggestions = async (query: string): Promise<Suggestion[]> => {
  if (!query) return [];
  const response = await fetch(
    `https://elastic.edulystventures.com/search?org_key=1345643162&query=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data?.suggestions || [];
};

const CommunitySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: suggestions = [], isFetching } = useQuery({
    queryKey: ['suggestions', debouncedSearchTerm],
    queryFn: () => fetchSuggestions(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Garbage collect after 10 minutes
    retry: 1,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute top-1/2 left-2 -translate-y-1/2 text-[#273454]/70"
      />
      <Input
        placeholder="Search anything..."
        className="w-[500px] pl-10 focus-visible:ring-0 focus-visible:outline-none"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-lg mt-1 rounded-md z-10 ${
          searchTerm.length > 0 ? 'block' : 'hidden'
        }`}
      >
        <div className="p-2 text-sm text-gray-600">
          {isFetching ? (
            <div className="py-2 px-4 text-gray-500">Loading...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div key={index} className="py-1 px-2">
                <h5
                  className={`font-semibold capitalize ${
                    suggestion.type === 'person'
                      ? 'text-cblue'
                      : suggestion.type === 'community'
                      ? 'text-cgreen'
                      : 'text-cpink'
                  }`}
                >
                  {suggestion.type}
                </h5>
                {suggestion.type === 'person' && (
                  <div>
                    {suggestion.hits?.slice(0, 3).map((hit, hitIndex) => (
                      hit?.name && (
                        <Link
                          key={hitIndex}
                          to={`/portfolio/codeedu-dae124fa/${hit.id}`}
                          className="py-1 px-2 hover:bg-gray-100 cursor-pointer flex justify-start gap-2 rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={hit?.profile_image ?? ''}
                              alt={hit.name}
                              className="w-8 h-8 rounded-full"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${hit.name}`;
                              }}
                            />
                          </div>
                          <div className="text-cblack">
                            <p className="text-sm font-semibold">{hit.name}</p>
                            <p className="text-xs text-gray-500">{hit.username}</p>
                          </div>
                        </Link>
                      )
                    ))}
                  </div>
                )}
                {suggestion.type === 'community' && (
                  <div>
                    {suggestion.hits?.slice(0, 3).map((hit, hitIndex) => (
                      <Link
                        key={hitIndex}
                        to={`/community/mycommunities/${hit.id}`}
                        className="py-1 px-2 hover:bg-gray-100 cursor-pointer flex justify-start gap-2 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={hit?.image ?? ''}
                            alt={hit?.title}
                            className="w-8 h-8 rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${hit?.title}`;
                            }}
                          />
                        </div>
                        <div className="text-cblack">
                          <p className="text-sm font-semibold">{hit?.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {stripHtmlTags(hit?.description ?? '')}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {suggestion.type === 'post' && (
                  <div className="flex flex-col gap-1 mt-2">
                    {suggestion.hits?.map((hit, hitIndex) => (
                      <div
                        key={hitIndex}
                        className="rounded-md border hover:bg-gray-100 cursor-pointer py-1 px-2 flex justify-between items-center"
                      >
                        <Link
                          to={`/community/wall/post/${hit.id}`}
                          className="grid grid-cols-5 gap-2"
                        >
                          <div className="flex items-center gap-2 col-span-1">
                            <img
                              src={hit?.thumbnail_url ?? ''}
                              alt={hit?.post_name}
                              className="w-full h-12 rounded-md"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${hit?.post_name}`;
                              }}
                            />
                          </div>
                          <div className="text-cblack col-span-4">
                            <p className="text-sm font-semibold line-clamp-2">
                              {hit?.post_name}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {stripHtmlTags(hit?.description ?? '')}
                            </p>
                          </div>
                        </Link>
                        <ChevronRight className="text-gray-400 w-4 h-4 mt-1" />
                      </div>
                    ))}
                  </div>
                )}
                {suggestion.type === 'industry' && (
                  <div className="flex flex-col gap-1 mt-2">
                    {suggestion.hits?.map((hit, hitIndex) => (
                      <div
                        key={hitIndex}
                        className="rounded-md border hover:bg-gray-100 cursor-pointer py-1 px-2 flex justify-between items-center"
                      >
                        <Link
                          to={`/collaborate/infocus/profile/${hit.id}`}
                          
                          className="grid grid-cols-5 gap-2"
                        >
                          <div className="flex items-center gap-2 col-span-1">
                            <img
                              src={hit?.logo ?? ''}
                              alt={hit?.name}
                              className="w-full h-12 rounded-md"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${hit?.name}`;
                              }}
                            />
                          </div>
                          <div className="text-cblack col-span-4">
                            <p className="text-sm font-semibold line-clamp-2">
                              {hit?.name}
                            </p>
                          </div>
                        </Link>
                        <ChevronRight className="text-gray-400 w-4 h-4 mt-1" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="py-2 px-4 text-gray-500">No suggestions found</div>
          )}
          {suggestions.length > 0 && (
            <Link
              to={`/community/search/${searchTerm}`}
              className="px-2 hover:bg-gray-100 cursor-pointer flex justify-start gap-2 rounded-md mt-5 py-3"
            >
              <div className="flex items-center gap-2">
                <Search size={16} className="text-gray-500" />
              </div>
              <div className="text-cblack">
                <p className="text-sm font-semibold">
                  See all results for {`"${searchTerm}"`}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunitySearch;

// import { Input } from '@/components/ui/ShadcnInput'
// import { ChevronRight, Search } from 'lucide-react'
// import React from 'react'
// import { Suggestion } from '../types/community'
// import { stripHtmlTags } from '@/utils/stripHtmlTags'
// import { Link } from 'react-router-dom'

// const CommunitySearch = () => {

//     const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
//     const [searchTerm, setSearchTerm] = React.useState('');

//     const search = async (query: string) => {
//         try {
//             const response = await fetch(`https://elastic.edulystventures.com/search?org_key=1345643162&query=${encodeURIComponent(query)}`);
//             const data = await response.json();
//             if (data && data.suggestions) {
//                 setSuggestions(data.suggestions);
//             }
//         } catch (error) {
//             console.error('Error fetching search suggestions:', error);
//             return [];
//         }
//     };

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setSearchTerm(value);
//         if (value.length > 0) {
//             search(value);
//         }
//     };

//     return (
//         <div className='relative'>
//             <Search size={18} className='absolute top-1/2 left-2 -translate-y-1/2 text-[#273454]/70' />
//             <Input placeholder='Search anything...' className='w-[500px] pl-10 focus-visible:ring-0 focus-visible:outline-none' value={searchTerm} onChange={handleSearchChange} />
//             {/* search suggestion dropdown */}
//             <div className={`absolute top-full left-0 w-full bg-white shadow-lg mt-1 rounded-md z-10 ${searchTerm?.length > 0 ? 'block' : 'hidden'}`}>
//                 {/* Suggestions will be rendered here */}
//                 <div className='p-2 text-sm text-gray-600'>
//                     {
//                         suggestions.length > 0 ? (
//                             suggestions.map((suggestion, index) => (
//                                 <div key={index} className='py-1 px-2'>
//                                     <h5 className={`font-semibold capitalize ${suggestion.type === 'person' ? 'text-cblue' : suggestion.type === 'community' ? 'text-cgreen' : 'text-cpink'}`}>{suggestion.type}</h5>
//                                     {
//                                         suggestion.type === 'person' &&
//                                         <div>
//                                             {
//                                                 suggestion?.hits && suggestion.hits.length > 0 && suggestion?.hits?.slice(0, 3)?.map((hit, hitIndex) => (
//                                                     hit?.name && <Link key={hitIndex} to={`/portfolio/${hit.id}`} className='py-1 px-2 hover:bg-gray-100 cursor-pointer flex justify-start gap-2 rounded-md'>
//                                                         <div className='flex items-center gap-2'>
//                                                             <img src={hit?.profile_image ?? ''} alt={hit.name} className='w-8 h-8 rounded-full' />
//                                                         </div>
//                                                         <div className='text-cblack'>
//                                                             <p className='text-sm font-semibold'>{hit.name}</p>
//                                                             <p className='text-xs text-gray-500'>{hit.username}</p>
//                                                         </div>
//                                                     </Link>
//                                                 ))
//                                             }
//                                         </div>
//                                     }
//                                     {
//                                         suggestion.type === 'community' &&
//                                         <div>
//                                             {
//                                                 suggestion?.hits && suggestion.hits.length > 0 && suggestion?.hits?.slice(0, 3)?.map((hit, hitIndex) => (
//                                                     <Link key={hitIndex} to={`/community/mycommunities/${hit.id}`} className='py-1 px-2 hover:bg-gray-100 cursor-pointer flex justify-start gap-2 rounded-md'>
//                                                         <div className='flex items-center gap-2'>
//                                                             <img src={hit?.image ?? ''} alt={hit?.title} className='w-8 h-8 rounded-md'
//                                                                 onError={(e) => {
//                                                                     e.currentTarget.src = `https://ui-avatars.com/api/?name=${hit?.title}`;
//                                                                 }}
//                                                             />
//                                                         </div>
//                                                         <div className='text-cblack'>
//                                                             <p className='text-sm font-semibold'>{hit?.title}</p>
//                                                             <p className='text-xs text-gray-500 line-clamp-1'>{stripHtmlTags(hit?.description ?? '')}</p>
//                                                         </div>
//                                                     </Link>
//                                                 ))
//                                             }
//                                         </div>
//                                     }
//                                     {
//                                         suggestion.type === 'post' &&
//                                         <div className='flex flex-col gap-1 mt-2'>
//                                             {
//                                                 suggestion?.hits && suggestion.hits.length > 0 && suggestion?.hits?.map((hit, hitIndex) => (
//                                                     <div key={hitIndex} className='rounded-md border hover:bg-gray-100 cursor-pointer py-1 px-2 flex justify-between items-center'>
//                                                         <Link key={hitIndex} to={`/community/wall/post/${hit.id}`} className='grid grid-cols-5 gap-2'>
//                                                             <div className='flex items-center gap-2 col-span-1'>
//                                                                 <img src={hit?.thumbnail_url ?? ''} alt={hit?.post_name} className='w-full h-12 rounded-md'
//                                                                     onError={(e) => {
//                                                                         e.currentTarget.src = `https://ui-avatars.com/api/?name=${hit?.post_name}`;
//                                                                     }}
//                                                                 />
//                                                             </div>
//                                                             <div className='text-cblack col-span-4'>
//                                                                 <p className='text-sm font-semibold line-clamp-2'>{hit?.post_name}</p>
//                                                                 <p className='text-xs text-gray-500 line-clamp-1'>{stripHtmlTags(hit?.description ?? '')}</p>
//                                                             </div>
//                                                         </Link>
//                                                         <ChevronRight className='text-gray-400 w-4 h-4 mt-1' />
//                                                     </div>
//                                                 ))
//                                             }
//                                         </div>
//                                     }
//                                 </div>
//                             ))
//                         ) : (
//                             <div className='py-2 px-4 text-gray-500'>No suggestions found</div>
//                         )
//                     }
//                     {
//                         suggestions?.length > 0 && <Link to={`/community/search/${searchTerm}`} className='px-2 hover:bg-gray-100 cursor-pointer flex justify-start gap-2 rounded-md mt-5 py-3'>
//                             <div className='flex items-center gap-2'>
//                                 <Search size={16} className='text-gray-500' />
//                             </div>
//                             <div className='text-cblack'>
//                                 <p className='text-sm font-semibold'>See all results for {`"${searchTerm}"`}</p>
//                             </div>
//                         </Link>
//                     }
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CommunitySearch