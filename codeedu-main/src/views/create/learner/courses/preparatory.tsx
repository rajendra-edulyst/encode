import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Alert } from "@/components/ui";
import { useCourseCategories, useCourseDeliveryMode, useRecommendedCourses } from "@/hooks/data/create/useCourses";
import Heading from "@/components/heading";
import { Input } from "@/components/ui/ShadcnInput";
import { RefreshCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/ShadcnButton";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import CourseCard from "@/components/CourseCard";
import { Course } from "@/@types/learner/Courses";
import LoadingSection from "@/components/LoadingSection";
import { debounce } from "@tanstack/pacer";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/breadcrumb";

const PER_PAGE = 100;
const PREPARATORY_COURSE_IDS = [9320, 9313, 9327, 9334, 9341];

function PreparatoryCoursesPage() {
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubscription, setSelectedSubscription] = useState<string>("all");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedMode, setSelectedMode] = useState<string>("");
    const [page, setPage] = useState(1);

    const debounced = useMemo(() => debounce((value: string) => {
        setSearchQuery(value);
        setPage(1);
    }, { wait: 1000 }), []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        debounced(e.target.value);
    };

    useEffect(() => {
        setPage(1);
    }, [selectedSubscription, selectedCategory, selectedMode, searchQuery]);

    const params = useMemo(() => {
        const p = new URLSearchParams();
        p.append('page', '1');
        p.append('items', '100'); // fetch a large chunk since we filter locally
        return p;
    }, []);

    const { data: courseData, isLoading, isError, refetch } = useRecommendedCourses(params);
    const { data: categories = [], isError: isErrorCategories, isLoading: isLoadingCategories } = useCourseCategories();
    const { data: deliveryModesResponse, isError: isErrorModes, isLoading: isLoadingModes } = useCourseDeliveryMode();

    // Memoize sorted courses to prevent infinite re-renders
    const courses = useMemo(() => {
        const coursesData = courseData?.data || [];
        return [...coursesData]
            .filter((c: Course) => PREPARATORY_COURSE_IDS.includes(Number(c.id)))
            .sort((a: Course, b: Course) => a.name.localeCompare(b.name));
    }, [courseData?.data]);

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

    const normalizeDeliveryMode = useMemo(() => {
        return (mode: string | undefined): string => {
            if (!mode) return "";
            const lowerMode = mode.toLowerCase().replace(/\s+/g, '_');
            return modeMap[lowerMode] || lowerMode;
        };
    }, [modeMap]);

    const filteredCourses = useMemo(() => {
        let result = [...courses];

        if (searchQuery) {
            result = result.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (selectedCategory && selectedCategory !== "all") {
            result = result.filter(c => c.category_id?.toString() === selectedCategory);
        }

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

        if (selectedMode && selectedMode !== "all") {
            result = result.filter((course) => {
                const courseMode = course.course_meta?.mode_of_delivery || course.course_meta_data?.mode_of_delivery;
                const normalizedCourseMode = normalizeDeliveryMode(courseMode);
                const normalizedSelectedMode = normalizeDeliveryMode(selectedMode);
                return normalizedCourseMode === normalizedSelectedMode;
            });
        }

        return result;
    }, [courses, searchQuery, selectedCategory, selectedSubscription, selectedMode, normalizeDeliveryMode]);

    const refreshData = () => {
        if (isLoading) return;
        setPage(1);
        setInputValue("");
        setSearchQuery("");
        setSelectedSubscription("all");
        setSelectedCategory("");
        setSelectedMode("");
        refetch();
    };

    const activeFilters = useMemo(() => {
        const filters: string[] = [];
        if (searchQuery) filters.push(`"${searchQuery}"`);
        if (selectedSubscription !== "all") {
            const label = selectedSubscription === "starter" ? "Starter" : selectedSubscription === "pro" ? "Pro" : "Max";
            filters.push(`Type: ${label}`);
        }
        if (selectedCategory && selectedCategory !== "all") {
            const cat = categories.find((c) => c.id.toString() === selectedCategory);
            if (cat) filters.push(`Domain: ${cat.name}`);
        }
        if (selectedMode && selectedMode !== "all") {
            const modeLabel = deliveryModes[selectedMode] || selectedMode;
            filters.push(`Mode: ${modeLabel}`);
        }
        return filters;
    }, [searchQuery, selectedSubscription, selectedCategory, selectedMode, categories, deliveryModes]);

    if (isError) {
        return <Alert type="danger" title={isError} />;
    }

    const breadcrumbItems = [
        { label: "Preparatory Courses" },
    ];

    return (
        <section>
            <Breadcrumb items={breadcrumbItems} />
            <div className="flex flex-col gap-2">
                <div className="md:flex justify-between items-center">
                    <Heading title="Preparatory Courses" description={`Curated preparatory courses for your learning journey`} className="mb-3" />
                    <div className="flex flex-wrap items-center gap-2">
                        <div>
                            <Select value={selectedSubscription} onValueChange={setSelectedSubscription}>
                                <SelectTrigger className="w-40">
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
                            <Select
                                disabled={isLoadingCategories || isErrorCategories}
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Filter by Domain" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Domain</SelectLabel>
                                        <SelectItem value="all">All</SelectItem>
                                        {categories?.filter((category) => category?.name !== 'CCI')?.map((category) => (
                                            <SelectItem key={category.id} value={category?.id?.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Select
                                disabled={isLoadingModes || isErrorModes}
                                value={selectedMode}
                                onValueChange={(value) => setSelectedMode(value)}
                            >
                                <SelectTrigger className="w-40">
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
                        <div className="relative">
                            <Input
                                placeholder="Search courses..."
                                className="focus-visible:ring-0 pl-8"
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                            <Search className="absolute top-1/2 left-2 transform -translate-y-1/2 text-gray-500" size={16} />
                        </div>
                        <Button size="icon" variant="outline" className="ml-2" disabled={isLoading} onClick={refreshData}>
                            <RefreshCcw className={`${isLoading ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </div>
                <LoadingSection isLoading={isLoading} />
                <div className="flex flex-wrap gap-2 justify-end">
                    {activeFilters.map((filter, index) => (
                        <Badge key={index} variant="secondary" className="text-white bg-primary hover:bg-primary">
                            {filter}
                            <X
                                className="ml-2 cursor-pointer"
                                size={12}
                                onClick={() => {
                                    if (filter.startsWith('"')) {
                                        setSearchQuery("");
                                        setInputValue("");
                                    } else if (filter.startsWith("Type:")) {
                                        setSelectedSubscription("all");
                                    } else if (filter.startsWith("Domain:")) {
                                        setSelectedCategory("");
                                    } else if (filter.startsWith("Mode:")) {
                                        setSelectedMode("");
                                    }
                                }}
                            />
                        </Badge>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-7">
                    {filteredCourses.map((course) => (
                        <Link
                            key={`course-${course.id}`}
                            to={`/preparatory-courses/details/${course.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'course'}-${course.id}?enroll_disabled=1`}
                            state={{ courseSource: 'preparatory' }}
                        >
                            <CourseCard course={course} />
                        </Link>
                    ))}
                </div>
                {filteredCourses.length === 0 && !isLoading && !isError && (
                    <div className="text-center p-10 border rounded-lg">
                        {activeFilters.length > 0 ? (
                            <p>
                                No courses found for <span className="font-medium">{activeFilters.join(", ")}</span>.
                            </p>
                        ) : (
                            <p>No courses found.</p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default PreparatoryCoursesPage;
