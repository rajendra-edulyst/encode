import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Alert } from "@/components/ui";
import { useCourseCategories, useCourses, useCourseDeliveryMode } from "@/hooks/data/create/useCourses";
import Heading from "@/components/heading";
import { Input } from "@/components/ui/ShadcnInput";
import { RefreshCcw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/ShadcnButton";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import CourseCard from "@/components/CourseCard";
import { Course } from "@/@types/learner/Courses";
import { CoursesPagination } from "@/components/CoursesPagination";
import LoadingSection from "@/components/LoadingSection";
import { debounce } from "@tanstack/pacer";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/breadcrumb";

const PER_PAGE = 32;

function RecommendedCourses() {
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
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
    }, [selectedCategory, selectedMode, searchQuery]);

    const params = useMemo(() => {
        const p: Record<string, string> = {
            page: page.toString(),
            items: PER_PAGE.toString(),
            cat_id: selectedCategory && selectedCategory !== "all" ? selectedCategory : "",
            query: searchQuery,
            type: "open",
        };
        if (selectedMode && selectedMode !== "all") p.mode = selectedMode;
        return new URLSearchParams(p);
    }, [page, selectedCategory, searchQuery, selectedMode]);

    const { data: courseData, isLoading, isError, refetch } = useCourses(params);
    const { data: categories = [], isError: isErrorCategories, isLoading: isLoadingCategories } = useCourseCategories();
    const { data: deliveryModesResponse, isError: isErrorModes, isLoading: isLoadingModes } = useCourseDeliveryMode();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const courses = courseData?.data || [];
    const pagination = courseData?.pagination;

    courses.sort((a: Course, b: Course) => a.name.localeCompare(b.name));

    const deliveryModes = useMemo(() => {
        if (!deliveryModesResponse?.data) return {};
        return deliveryModesResponse.data;
    }, [deliveryModesResponse]);

    const normalizeDeliveryMode = (mode: string | undefined): string => {
        if (!mode) return "";
        
        // Convert to lowercase and replace spaces with underscores
        const normalizedMode = mode.toLowerCase().replace(/\s+/g, "_");
        
        // Map variations to consistent values
        const modeMap: Record<string, string> = {
            self_paced: "self_peased",
            "self-paced": "self_peased",
            selfpaced: "self_peased",
            self_peased: "self_peased",
            online_interactive: "online_interactive",
            "online-interactive": "online_interactive",
            onlineinteractive: "online_interactive",
            hybrid: "hybrid",
        };
        
        return modeMap[normalizedMode] || normalizedMode;
    };

    const filteredCourses = useMemo(() => {
        if (!selectedMode || selectedMode === "all") return courses;
        
        return courses.filter((course) => {
            const courseMode = course.course_meta_data?.mode_of_delivery;
            const normalizedCourseMode = normalizeDeliveryMode(courseMode);
            const normalizedSelectedMode = normalizeDeliveryMode(selectedMode);
            
            return normalizedCourseMode === normalizedSelectedMode;
        });
    }, [courses, selectedMode]);

    const refreshData = () => {
        if (isLoading) return;
        setPage(1);
        setInputValue("");
        setSearchQuery("");
        setSelectedCategory("");
        setSelectedMode("");
        refetch();
    };

    const getActiveFilters = () => {
        const filters: string[] = [];
        if (searchQuery) filters.push(`"${searchQuery}"`);
        if (selectedCategory && selectedCategory !== "all") {
            const cat = categories.find((c) => c.id.toString() === selectedCategory);
            if (cat) filters.push(`Domain: ${cat.name}`);
        }
        if (selectedMode && selectedMode !== "all") {
            const modeLabel = Object.entries(deliveryModes).find(([key]) => key === selectedMode)?.[1] || selectedMode;
            filters.push(`Mode: ${modeLabel}`);
        }
        return filters;
    };

    const activeFilters = getActiveFilters();

    if (isError) {
        return <Alert type="danger" title={isError} />;
    }

    const breadcrumbItems = [
        { label: "Courses", path: "/courses/explore" },
        { label: "Recommended Courses" },
    ];

    return (
        <section>
            <Breadcrumb items={breadcrumbItems} />
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <Heading title="Recommended Courses" description="List of courses you can explore" className="mb-3" />
                    <div className="flex items-center gap-2">
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
                                        {categories?.map((category) => (
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
                        <Button size="icon" variant="outline" className="ml-2" onClick={refreshData}>
                            <RefreshCcw className={`${isLoading ? "animate-spin" : ""}`} />
                        </Button>
                    </div>
                </div>
                <LoadingSection isLoading={isLoading} />
                <div className="flex flex-wrap gap-2 justify-end">
                    {activeFilters.map((filter, index) => (
                        <Badge key={index} variant="secondary"  className="text-white bg-primary hover:bg-primary">
                            {filter}
                            <X
                                className="ml-2 cursor-pointer"
                                size={12}
                                onClick={() => {
                                    if (filter.startsWith('"')) {
                                        setSearchQuery("");
                                        setInputValue("");
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 gap-7">
                    {filteredCourses.map((course) => (
                        <Link key={`course-${course.id}`} to={`/courses/${course?.id}`}>
                            <CourseCard course={course} />
                        </Link>
                    ))}
                </div>
                {pagination && pagination.total > PER_PAGE && (
                    <div className="py-20">
                        <CoursesPagination
                            setPage={setPage}
                            current_page={pagination.current_page}
                            last_page={pagination.last_page}
                            total={pagination.total}
                            per_page={PER_PAGE}
                        />
                    </div>
                )}
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

export default RecommendedCourses;