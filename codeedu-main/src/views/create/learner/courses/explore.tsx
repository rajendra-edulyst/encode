import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Alert } from "@/components/ui";
import { useCourseCategories, useCourses, useCourseDeliveryMode } from "@/hooks/data/create/useCourses";
import Heading from "@/components/heading";
import { Input } from "@/components/ui/ShadcnInput";
import { Search, X, ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import CourseCard from "@/components/CourseCard";
import { CoursesPagination } from "@/components/CoursesPagination";
import LoadingSection from "@/components/LoadingSection";
import { debounce } from "@tanstack/pacer";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/breadcrumb";
import { useCCITimer } from "@/context/CCIContext";
import { useAuth } from "@/auth";
import SEO from "@/components/SEO/SEO";
import { mixpanelService } from "@/services/mixpanel/MixpanelService";

const PER_PAGE = 100;

function ExploreCourses() {
    const { authenticated } = useAuth();
    const [searchParams] = useSearchParams();
    const cci = searchParams.get('cci');
    const navigate = useNavigate();
    const { timeLeft } = useCCITimer();
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedSubscription, setSelectedSubscription] = useState<string>("all");
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedMode, setSelectedMode] = useState<string>('');
    const [page, setPage] = useState(1);
    const [isEnrolled, setIsEnrolled] = useState(false);

    const { data: categories = [], isError: isErrorCategories, isLoading: isLoadingCategories } = useCourseCategories();
    const { data: deliveryModesResponse, isError: isErrorModes, isLoading: isLoadingModes } = useCourseDeliveryMode();

    const debounced = useMemo(() => debounce((value: string) => {
        setSearchQuery(value);
        setPage(1);
    }, { wait: 500 }), []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        debounced(e.target.value);
    };

    useEffect(() => {
        mixpanelService.track('Explore Courses Viewed', {
            page_path: window.location.pathname,
            timestamp: new Date().toISOString()
        })
    }, []);

    useEffect(() => {
        setPage(1);
    }, [selectedSubscription, selectedCategory, searchQuery, selectedMode]);

    useEffect(() => {
        if (searchQuery) {
            mixpanelService.track('Search Performed', {
                search_term: searchQuery,
                page_path: window.location.pathname,
                timestamp: new Date().toISOString()
            })
        }
    }, [searchQuery]);

    useEffect(() => {
        if (selectedCategory && selectedCategory !== 'all') {
            const cat = categories.find(c => c.id.toString() === selectedCategory);
            mixpanelService.track('Category Selected', {
                category: cat?.name || selectedCategory,
                page_path: window.location.pathname,
                timestamp: new Date().toISOString()
            })
        }
    }, [selectedCategory, categories]);

    useEffect(() => {
        if (selectedSubscription !== 'all') {
            mixpanelService.track('Filter Applied', {
                filter_type: 'Subscription Type',
                filter_value: selectedSubscription,
                page_path: window.location.pathname,
                timestamp: new Date().toISOString()
            })
        }
    }, [selectedSubscription]);

    useEffect(() => {
        if (selectedMode !== 'all' && selectedMode !== '') {
            mixpanelService.track('Filter Applied', {
                filter_type: 'Delivery Mode',
                filter_value: selectedMode,
                page_path: window.location.pathname,
                timestamp: new Date().toISOString()
            })
        }
    }, [selectedMode]);

    useEffect(() => {
        if (page > 1) {
            mixpanelService.track('Pagination Used', {
                page_number: page,
                page_path: window.location.pathname,
                timestamp: new Date().toISOString()
            })
        }
    }, [page]);

    const params = useMemo(() => {
        const p: Record<string, string> = {
            page: page.toString(),
            items: PER_PAGE.toString(),
            cat_id: selectedCategory && selectedCategory !== "all" ? selectedCategory : '',
            query: searchQuery,
        };
        if (selectedMode && selectedMode !== "all") p.mode = selectedMode;
        if (searchParams.get('cci') === '1') p.type = 'cci';

        return new URLSearchParams(p);
    }, [page, selectedCategory, searchQuery, selectedMode, searchParams]);

    const { data: courseData, isLoading, isError } = useCourses(params);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const courses = courseData?.data ?? [];
    const pagination = courseData?.pagination;

    const deliveryModes = useMemo(() => {
        if (!deliveryModesResponse?.data) return {};
        const modes: Record<string, string> = { ...deliveryModesResponse.data };
        delete modes['in_campus'];
        return modes;
    }, [deliveryModesResponse]) as Record<string, string>;

    const modeMap = useMemo(() => {
        const map: Record<string, string> = {};

        if (deliveryModes) {
            Object.keys(deliveryModes).forEach(apiKey => {
                map[apiKey] = apiKey;

                const variations = [
                    apiKey.toLowerCase(),
                    apiKey.replace(/_/g, '-'),
                    apiKey.replace(/_/g, ''),
                    apiKey.split('_').join(' ').toLowerCase(),
                    apiKey.split('_').join('-').toLowerCase()
                ];

                variations.forEach(variation => {
                    if (variation !== apiKey) {
                        map[variation] = apiKey;
                    }
                });

                if (apiKey === 'self_peased') {
                    map['self_paced'] = apiKey;
                    map['self-paced'] = apiKey;
                    map['selfpaced'] = apiKey;
                } else if (apiKey === 'online_interactive') {
                    map['live_online'] = apiKey;
                    map['live-online'] = apiKey;
                    map['online'] = apiKey;
                }

                // Map the human readable value back to the apiKey (e.g. "In-Class" -> "hybrid")
                const val = deliveryModes[apiKey];
                if (val) {
                    const valLower = val.toLowerCase();
                    map[valLower] = apiKey;
                    map[valLower.replace(/\s+/g, '_')] = apiKey;
                    map[valLower.replace(/-/g, '_')] = apiKey;
                    map[valLower.replace(/[\s-]/g, '')] = apiKey;
                }
            });
        }

        return map;
    }, [deliveryModes]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const normalizeDeliveryMode = React.useCallback((mode: string | undefined): string => {
        if (!mode) return '';
        const lowerMode = mode.toLowerCase().replace(/\s+/g, '_');
        return modeMap[lowerMode] || lowerMode;
    }, [modeMap]);

    const filteredCourses = useMemo(() => {
        let result = [...courses].filter(course => course.status !== 'deleted');

        if (selectedSubscription !== "all") {
            result = result.filter((course) => {
                const courseMode = course.course_meta?.mode_of_delivery || course.course_meta_data?.mode_of_delivery;
                const normalizedCourseMode = normalizeDeliveryMode(courseMode);
                const rawMode = String(courseMode || "").toLowerCase().replace(/[-\s]+/g, '_');

                if (selectedSubscription === "starter") {
                    return normalizedCourseMode === normalizeDeliveryMode("Self Paced") ||
                        normalizedCourseMode === normalizeDeliveryMode("Self-Paced") ||
                        rawMode === "self_paced";
                }
                if (selectedSubscription === "pro") {
                    return normalizedCourseMode === normalizeDeliveryMode("Live Online") ||
                        normalizedCourseMode === normalizeDeliveryMode("Live-Online") ||
                        rawMode === "live_online";
                }
                if (selectedSubscription === "max") {
                    return normalizedCourseMode === normalizeDeliveryMode("In Class") ||
                        normalizedCourseMode === normalizeDeliveryMode("In-Class") ||
                        rawMode === "in_class";
                }
                return false;
            });
        }

        // Apply client-side search filter to ensure partial matches like "visual" show "Visual Communication"
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            result = result.filter(course =>
                course.name.toLowerCase().includes(lowerQuery) ||
                (course.category_name || '').toLowerCase().includes(lowerQuery)
            );
        }

        // Apply mode filter
        if (selectedMode && selectedMode !== "all") {
            const normalizedSelectedMode = normalizeDeliveryMode(selectedMode);
            result = result.filter(course => {
                const courseMode = course.course_meta?.mode_of_delivery || course.course_meta_data?.mode_of_delivery;
                return normalizeDeliveryMode(courseMode) === normalizedSelectedMode;
            });
        }

        // Advanced sorting:
        // 1. Matches starting with the query
        // 2. Alphabetical
        result.sort((a, b) => {
            if (searchQuery) {
                const lowerQuery = searchQuery.toLowerCase();
                const aStarts = a.name.toLowerCase().startsWith(lowerQuery);
                const bStarts = b.name.toLowerCase().startsWith(lowerQuery);

                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
            }
            return a.name.localeCompare(b.name);
        });

        if (result && result.length > 0) {
            const enrolled = result.some(course => course.is_assigned === 1);
            setIsEnrolled(enrolled);
        }
        return result;
    }, [courses, selectedSubscription, selectedMode, searchQuery, normalizeDeliveryMode]);

    const getActiveFilters = () => {
        const filters: string[] = [];

        if (searchQuery) filters.push(`"${searchQuery}"`);
        if (selectedCategory && selectedCategory !== "all") {
            const cat = categories.find(c => c.id.toString() === selectedCategory);
            if (cat) filters.push(`Domain: ${cat.name}`);
        }
        if (selectedMode && selectedMode !== "all") {
            const modeLabel = deliveryModes[selectedMode] || selectedMode;
            filters.push(`Mode: ${modeLabel}`);
        }
        if (selectedSubscription !== "all") {
            const label = selectedSubscription === "starter" ? "Starter" : selectedSubscription === "pro" ? "Pro" : "Max";
            filters.push(`Type: ${label}`);
        }

        return filters;
    };

    const activeFilters = getActiveFilters();

    if (isError) {
        return <Alert type="danger" title={isError} />;
    }

    const breadcrumbItems = [
        { label: 'Explore Courses' },
    ];

    return (
        <section className={cci === '1' ? 'max-w-[1260px] mx-auto w-full' : ''}>
            <SEO
                title="Explore Courses | enCODE"
                description="Browse our curated collection of courses across technology, design, business, and more. Self-paced, live online, and in-class options available."
                aeoType="WebPage"
                breadcrumbs={[{ name: "Explore Courses", path: "/courses/all" }]}
            />
            {cci === '1' && (
                <div className="bg-[#1c1c1c] p-5 rounded-2xl text-white mb-4">
                    <div className="text-gray-400 text-sm mb-2 font-c">Stage 02</div>
                    <div className="flex justify-between items-center">
                        <h2 className="text-3xl font-bold font-c">CCIQ Engage: Ecosystem Simulation</h2>
                        <div className="text-yellow-400 font-bold font-c">Time Left: {timeLeft}</div>
                    </div>
                </div>
            )}
            <section>
                {authenticated && cci !== '1' && <Breadcrumb items={breadcrumbItems} />}
                {cci === '1' && (
                    <div className="mb-4">
                        <button
                            onClick={() => navigate('/cci-stage-2')}
                            className="bg-[#1c1c1c] p-5 rounded-2xl text-white w-full flex items-center gap-3 text-lg font-bold font-c hover:bg-[#252525] transition-colors cursor-pointer"
                        >
                            <ArrowLeft size={20} />
                            Learn, Apply, & Showcase Your Outcomes
                        </button>
                    </div>
                )}
                <div className='flex flex-col gap-2'>
                    <div className='md:flex justify-between items-center'>
                        {cci !== '1' ? (
                            !authenticated ? (
                                <div className="mb-6">
                                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight dark:text-white capitalize mb-2">Courses</h2>
                                    <p className="text-muted-foreground text-lg">Explore our collection of {pagination?.total} curated courses</p>
                                </div>
                            ) : (
                                <Heading title="Explore Courses" description={`Explore our collection of ${pagination?.total} curated courses `} className='mb-3' />
                            )
                        ) : <div></div>}
                        {cci !== '1' && (
                            <div className='flex flex-wrap items-center gap-2'>
                                <div>
                                    <Select value={selectedSubscription} onValueChange={setSelectedSubscription}>
                                        <SelectTrigger className='w-40'>
                                            <SelectValue placeholder="All / Starter / Pro / Max" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Type</SelectLabel>
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="starter">Starter</SelectItem>
                                                <SelectItem value="pro">Pro</SelectItem>
                                                <SelectItem value="max">Max</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Select disabled={isLoadingCategories || isErrorCategories} value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className='w-40'>
                                            <SelectValue placeholder="Filter by Domain" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Domain</SelectLabel>
                                                <SelectItem value="all">All</SelectItem>
                                                {
                                                    categories?.filter((category) => category?.name !== 'CCI')?.map((category) => (
                                                        <SelectItem key={category.id} value={category?.id?.toString()}>{category.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Select
                                        value={selectedMode}
                                        disabled={isLoadingModes || isErrorModes}
                                        onValueChange={(value) => setSelectedMode(value)}
                                    >
                                        <SelectTrigger className='w-40'>
                                            <SelectValue placeholder="Delivery Mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Mode</SelectLabel>
                                                <SelectItem value="all">All</SelectItem>
                                                {Object.entries(deliveryModes).map(([key, value]) => (
                                                    <SelectItem key={key} value={key}>
                                                        {String(value)}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='relative'>
                                    <Input
                                        placeholder="Search courses..."
                                        className='focus-visible:ring-0 pl-8'
                                        value={inputValue}
                                        onChange={handleInputChange}
                                    />
                                    <Search className='absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500' size={16} />
                                </div>
                            </div>
                        )}
                    </div>

                    <LoadingSection isLoading={isLoading} />

                    <div className="flex flex-wrap gap-2 justify-end">
                        {activeFilters.map((filter, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="text-white bg-primary hover:bg-primary"
                            >
                                {filter}
                                <X
                                    className="ml-2 cursor-pointer"
                                    size={12}
                                    onClick={() => {
                                        if (filter.startsWith('"')) {
                                            setSearchQuery('');
                                            setInputValue('');
                                        } else if (filter.startsWith('Domain:')) {
                                            setSelectedCategory('');
                                        } else if (filter.startsWith('Mode:')) {
                                            setSelectedMode('');
                                        } else if (filter.startsWith('Type:')) {
                                            setSelectedSubscription('all');
                                        }
                                    }}
                                />
                            </Badge>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        {filteredCourses.map((course, index) => (
                            <Link
                                key={`course-${course.id}`}
                                to={`/explore-courses/details/${course.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'course'}-${course.id}${cci ? `?cci=${cci}` : ''}${isEnrolled ? (cci ? `&enroll_disabled=1` : `?enroll_disabled=1`) : ''}`}
                                state={{ courseSource: 'explore' }}
                            >
                                <CourseCard course={course} index={index} />
                            </Link>
                        ))}
                    </div>

                    {filteredCourses.length > 0 && pagination && pagination.total > PER_PAGE && (
                        <div className="py-20">
                            <CoursesPagination
                                setPage={setPage}
                                current_page={pagination.current_page}
                                last_page={pagination.last_page}
                                total={pagination.total}
                            />
                        </div>
                    )}

                    {filteredCourses.length === 0 && !isLoading && !isError && (
                        <div className="text-center p-10 border rounded-lg">
                            {activeFilters.length > 0 ? (
                                <p>
                                    No courses found for{" "}
                                    <span className="font-medium">{activeFilters.join(", ")}</span>.
                                </p>
                            ) : (
                                <p>No courses found.</p>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </section>
    );
}

export default ExploreCourses;