import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useFetchSuggestions } from '@/hooks/data/connect/usePosts';
import ConnectLayout from './layouts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { stripHtmlTags } from '@/utils/stripHtmlTags';
import { ChevronRight, Users, MessageSquare, FileText, Building2, Loader, Search as SearchIcon, Hash } from 'lucide-react';
import { Input } from '@/components/ui/ShadcnInput';
import { Button } from '@/components/ui/ShadcnButton';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

const Search = () => {
    const { query } = useParams<{ query: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const searchTerm = query ? decodeURIComponent(query) : '';
    const typeParam = searchParams.get('type');
    const [activeTab, setActiveTab] = useState(typeParam || 'all');
    const [searchInput, setSearchInput] = useState(searchTerm);

    // Update search input when URL changes
    useEffect(() => {
        setSearchInput(searchTerm);
        mixpanelService.track('Connect Search Viewed', {
            search_term: searchTerm,
            page_path: window.location.pathname,
            timestamp: new Date().toISOString()
        })
    }, [searchTerm]);

    // Update active tab when type parameter changes
    useEffect(() => {
        if (typeParam) {
            setActiveTab(typeParam);
        } else {
            setActiveTab('all');
        }
    }, [typeParam]);

    const { data: suggestions = [], isFetching } = useFetchSuggestions(
        searchTerm,
        !!searchTerm
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            navigate(`/connect/search/${encodeURIComponent(searchInput.trim())}`);
        }
    };

    // Get counts for each category
    const getCategoryCount = (type: string) => {
        const category = suggestions.find(s => s.type === type);
        return category?.hits?.length || 0;
    };

    const personCount = getCategoryCount('person');
    const communityCount = getCategoryCount('community');
    const postCount = getCategoryCount('post');
    const industryCount = getCategoryCount('industry');
    const hashtagCount = getCategoryCount('hashtag');
    const totalResults = personCount + communityCount + postCount + industryCount + hashtagCount;

    // Filter results by active tab
    const getFilteredResults = () => {
        if (activeTab === 'all') return suggestions;
        return suggestions.filter(s => s.type === activeTab);
    };

    const filteredResults = getFilteredResults();

    return (
        <ConnectLayout active="discover">
            <div className="">
                {/* Search Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Search Results for &ldquo;{searchTerm}&rdquo;
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isFetching ? (
                            'Searching...'
                        ) : (
                            `Found ${totalResults} result${totalResults !== 1 ? 's' : ''}`
                        )}
                    </p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <form className="flex gap-2" onSubmit={handleSearch}>
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search for people, communities, posts..."
                                value={searchInput}
                                className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="px-6 text-black">
                            Search
                        </Button>
                    </form>
                </div>

                {/* Loading State */}
                {isFetching && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <Loader className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">Searching for results...</p>
                        </div>
                    </div>
                )}

                {/* Results */}
                {!isFetching && suggestions.length > 0 && (
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-6 flex-wrap h-auto gap-2 rounded-xl p-0 overflow-hidden">
                            <TabsTrigger value="all" className="gap-2 rounded-none">
                                All
                                <Badge variant="secondary" className="ml-1">{totalResults}</Badge>
                            </TabsTrigger>
                            {personCount > 0 && (
                                <TabsTrigger value="person" className="gap-2 rounded-none">
                                    <Users size={16} />
                                    People
                                    <Badge variant="secondary" className="ml-1">{personCount}</Badge>
                                </TabsTrigger>
                            )}
                            {communityCount > 0 && (
                                <TabsTrigger value="community" className="gap-2 rounded-none">
                                    <Users size={16} />
                                    Communities
                                    <Badge variant="secondary" className="ml-1">{communityCount}</Badge>
                                </TabsTrigger>
                            )}
                            {postCount > 0 && (
                                <TabsTrigger value="post" className="gap-2 rounded-none">
                                    <MessageSquare size={16} />
                                    Posts
                                    <Badge variant="secondary" className="ml-1">{postCount}</Badge>
                                </TabsTrigger>
                            )}
                            {industryCount > 0 && (
                                <TabsTrigger value="industry" className="gap-2 rounded-none">
                                    <Building2 size={16} />
                                    Industries
                                    <Badge variant="secondary" className="ml-1">{industryCount}</Badge>
                                </TabsTrigger>
                            )}
                            {hashtagCount > 0 && (
                                <TabsTrigger value="hashtag" className="gap-2 rounded-none">
                                    <Hash size={16} />
                                    Hashtags
                                    <Badge variant="secondary" className="ml-1">{hashtagCount}</Badge>
                                </TabsTrigger>
                            )}
                        </TabsList>

                        <TabsContent value={activeTab}>
                            <div className="space-y-6">
                                {filteredResults.map((suggestion, index) => (
                                    <div key={index}>
                                        <Card>
                                            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                                                <CardTitle className="flex items-center gap-2">
                                                    {suggestion.type === 'person' && <Users className="text-primary" size={24} />}
                                                    {suggestion.type === 'community' && <Users className="text-primary" size={24} />}
                                                    {suggestion.type === 'post' && <MessageSquare className="text-primary" size={24} />}
                                                    {suggestion.type === 'industry' && <Building2 className="text-primary" size={24} />}
                                                    {suggestion.type === 'hashtag' && <Hash className="text-primary" size={24} />}
                                                    <span className="capitalize text-xl">{suggestion.type}{suggestion.type !== 'industry' && 's'}</span>
                                                    <Badge variant="outline" className="ml-auto">{suggestion.total} results</Badge>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                {/* Person Results */}
                                                {suggestion.type === 'person' && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {suggestion.hits?.map((hit, hitIndex) =>
                                                            hit?.name ? (
                                                                <Link
                                                                    key={hitIndex}
                                                                    to={`/portfolio/codeedu-dae124fa/${hit.id}`}
                                                                    className="dark:bg-[#323232] flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-codeblue dark:hover:border-codeblue hover:shadow-lg transition-all"
                                                                >
                                                                    <img
                                                                        src={hit?.profile_image ?? ''}
                                                                        alt={hit.name}
                                                                        className="w-16 h-16 rounded-full object-cover"
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
                                                                    <ChevronRight className="text-gray-400 w-5 h-5 flex-shrink-0" />
                                                                </Link>
                                                            ) : null
                                                        )}
                                                    </div>
                                                )}

                                                {/* Community Results */}
                                                {suggestion.type === 'community' && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {suggestion.hits?.map((hit, hitIndex) => (
                                                            <Link
                                                                key={hitIndex}
                                                                to={`/connect/communities/${hit.id}`}
                                                                className="flex dark:bg-[#323232] items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-codegreen dark:hover:border-codegreen hover:shadow-lg transition-all"
                                                            >
                                                                <img
                                                                    src={hit?.image ?? ''}
                                                                    alt={hit?.title}
                                                                    className="w-20 h-20 rounded-lg object-cover"
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                            hit?.title || 'Community'
                                                                        )}`;
                                                                    }}
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-base font-semibold text-gray-900 dark:text-white line-clamp-1 mb-2">
                                                                        {hit?.title}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                                        {stripHtmlTags(hit?.description ?? '')}
                                                                    </p>
                                                                </div>
                                                                <ChevronRight className="text-gray-400 w-5 h-5 flex-shrink-0 mt-1" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Post Results */}
                                                {suggestion.type === 'post' && (
                                                    <div className="space-y-4">
                                                        {suggestion.hits?.map((hit, hitIndex) => (
                                                            <Link
                                                                key={hitIndex}
                                                                to={`/connect/post/${hit.id}`}
                                                                className="flex dark:bg-[#323232] items-start gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-codepink dark:hover:border-codepink hover:shadow-lg transition-all"
                                                            >
                                                                <img
                                                                    src={hit?.thumbnail_url ?? ''}
                                                                    alt={hit?.post_name}
                                                                    className="w-32 h-24 rounded-lg object-cover"
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = '/img/default.png';
                                                                    }}
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                                                                            {hit?.post_name}
                                                                        </h3>
                                                                        <FileText className="text-codepink w-5 h-5 flex-shrink-0" />
                                                                    </div>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                                        {stripHtmlTags(hit?.description ?? '')}
                                                                    </p>
                                                                </div>
                                                                <ChevronRight className="text-gray-400 w-5 h-5 flex-shrink-0 mt-1" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Industry/Organization Results */}
                                                {suggestion.type === 'industry' && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {suggestion.hits?.map((hit, hitIndex) => (
                                                            <Link
                                                                key={hitIndex}
                                                                to={`/collaborate/infocus/profile/${hit.id}`}
                                                                className="flex dark:bg-[#323232] items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-codeyellow dark:hover:border-codeyellow hover:shadow-lg transition-all"
                                                            >
                                                                <img
                                                                    src={hit?.logo ?? ''}
                                                                    alt={hit?.name}
                                                                    className="w-20 h-20 rounded-lg object-cover"
                                                                    onError={(e) => {
                                                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                                            hit?.name || 'Industry'
                                                                        )}`;
                                                                    }}
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">
                                                                        {hit?.name}
                                                                    </p>
                                                                </div>
                                                                <ChevronRight className="text-gray-400 w-5 h-5 flex-shrink-0" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Hashtag Results */}
                                                {suggestion.type === 'hashtag' && (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {suggestion.hits?.map((hit, hitIndex) => (
                                                            <Link
                                                                key={hitIndex}
                                                                to={`/connect/search/${encodeURIComponent(hit?.tag || '')}`}
                                                                className="flex dark:bg-[#323232] items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-codepurple dark:hover:border-codepurple hover:shadow-lg transition-all"
                                                            >
                                                                <div className="w-12 h-12 rounded-full bg-codepurple/10 dark:bg-codepurple/20 flex items-center justify-center flex-shrink-0">
                                                                    <Hash className="text-codepurple w-6 h-6" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                                                        #{hit.tag}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        Hashtag
                                                                    </p>
                                                                </div>
                                                                <ChevronRight className="text-gray-400 w-5 h-5 flex-shrink-0" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}

                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                )}

                {/* No Results */}
                {!isFetching && suggestions.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-20">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-10 w-10 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No results found
                                </h3>
                                <p className="text-muted-foreground dark:text-gray-400 max-w-md">
                                    We couldn&apos;t find any results for &ldquo;{searchTerm}&rdquo;. Try using different keywords or check your spelling.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </ConnectLayout>
    );
};

export default Search;