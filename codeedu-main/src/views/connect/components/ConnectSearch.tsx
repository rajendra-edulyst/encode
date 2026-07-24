import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useFetchSuggestions } from '@/hooks/data/connect/usePosts';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { debounce } from 'lodash';
import { ChevronRight, Search } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Custom hook for debounced value
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ConnectSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: suggestions = [], isFetching } = useFetchSuggestions(
    debouncedSearchTerm,
    !!debouncedSearchTerm
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const showDropdown = isFocused && searchTerm.length > 0;

  return (
    <div className="relative w-full md:w-96">
      <InputGroup className="!bg-background py-5 rounded-2xl">
        <InputGroupInput
          placeholder="Search anything... or anyone"
          className="!bg-transparent placeholder:text-black placeholder:dark:text-white"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      {/* Dropdown Suggestions */}
      <div
        className={`absolute top-full left-0 w-full bg-white dark:bg-[#2A2A2A] shadow-lg mt-2 rounded-lg z-50 max-h-[500px] overflow-y-auto ${showDropdown ? 'block' : 'hidden'
          }`}
      >
        <div className="p-3 text-sm">
          {isFetching ? (
            <div className="py-3 px-4 text-gray-500 dark:text-gray-400">
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.map((suggestion, index) => (
                <div key={index} className="mb-4">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h5
                      className={`font-bold text-sm uppercase ${suggestion.type === 'person'
                        ? 'text-codeblue'
                        : suggestion.type === 'community'
                          ? 'text-codegreen'
                          : suggestion.type === 'post'
                            ? 'text-codepink'
                            : 'text-codeyellow'
                        }`}
                    >
                      {suggestion.type} ({suggestion.total})
                    </h5>
                    <Link to={`/connect/search/${searchTerm}?type=${suggestion.type}`} className='text-primary underline'>View All</Link>
                  </div>

                  {/* Person Results */}
                  {suggestion.type === 'person' && (
                    <div className="space-y-1">
                      {suggestion.hits?.slice(0, 3).map((hit, hitIndex) =>
                        hit?.name ? (
                          <Link
                            key={hitIndex}
                            to={`/portfolio/codeedu-dae124fa/${hit.id}`}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-[#3A3A3A] rounded-lg transition-colors"
                          >
                            <img
                              src={hit?.profile_image ?? ''}
                              alt={hit.name}
                              className="w-10 h-10 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  hit.name || 'User'
                                )}`;
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                {hit.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                @{hit.username || 'user'}
                              </p>
                            </div>
                          </Link>
                        ) : null
                      )}
                    </div>
                  )}

                  {/* Community Results */}
                  {suggestion.type === 'community' && (
                    <div className="space-y-1">
                      {suggestion.hits?.slice(0, 3).map((hit, hitIndex) => (
                        <Link
                          key={hitIndex}
                          to={`/connect/communities/${hit.id}`}
                          className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-[#3A3A3A] rounded-lg transition-colors"
                        >
                          <img
                            src={hit?.image ?? ''}
                            alt={hit?.title}
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                hit?.title || 'Community'
                              )}`;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {hit?.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {stripHtmlTags(hit?.description ?? '')}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Post Results */}
                  {suggestion.type === 'post' && (
                    <div className="space-y-2">
                      {suggestion.hits?.slice(0, 3).map((hit, hitIndex) => (
                        <Link
                          key={hitIndex}
                          to={`/connect/post/${hit.id}`}
                          className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-[#3A3A3A] rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
                        >
                          <img
                            src={hit?.thumbnail_url ?? ''}
                            alt={hit?.post_name}
                            className="w-16 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/img/default.png';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                              {hit?.post_name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {stripHtmlTags(hit?.description ?? '')}
                            </p>
                          </div>
                          <ChevronRight className="text-gray-400 w-4 h-4 flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Industry/Organization Results */}
                  {suggestion.type === 'industry' && (
                    <div className="space-y-2">
                      {suggestion.hits?.slice(0, 3).map((hit, hitIndex) => (
                        <Link
                          key={hitIndex}
                          to={`/collaborate/infocus/profile/${hit.id}`}
                          className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-[#3A3A3A] rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
                        >
                          <img
                            src={hit?.logo ?? ''}
                            alt={hit?.name}
                            className="w-16 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                hit?.name || 'Industry'
                              )}`;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                              {hit?.name}
                            </p>
                          </div>
                          <ChevronRight className="text-gray-400 w-4 h-4 flex-shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* See All Results Link */}
              <Link
                to={`/connect/search/${encodeURIComponent(searchTerm)}`}
                className="flex items-center gap-2 p-3 mt-2 hover:bg-gray-100 dark:hover:bg-[#3A3A3A] rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <Search size={16} className="text-gray-500 dark:text-gray-400" />
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  See all results for &ldquo;{searchTerm}&rdquo;
                </p>
              </Link>
            </>
          ) : (
            <div className="py-3 px-4 text-gray-500 dark:text-gray-400">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectSearch;
