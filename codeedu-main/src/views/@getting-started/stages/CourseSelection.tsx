import { useMemo, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/shadcnAlert'
import { Button } from '@/components/ui/ShadcnButton'
import { Loader, RefreshCcw, Search, ChevronRight, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/ShadcnInput'
import { toast } from 'sonner'
import { useCourseCategories, useCourses } from '@/hooks/data/create/useCourses'
import { useQueryClient } from '@tanstack/react-query'
import {
    Select, SelectContent, SelectGroup, SelectItem,
    SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { PreAssignCourse } from '@/@types/learner/Courses'
import search from "@/assets/images/search.png";
import CourseCard from '@/components/CourseListingCard'
import { DomainType, PlanType } from '../CreativeStages';

interface CourseSelectionProps {
    selectedDomains: DomainType[];
    selectedCourses: PreAssignCourse[];
    onSelect: (courses: PreAssignCourse[]) => void;
    onContinue: () => void;
    onBack: () => void;
    selectedPlan: PlanType
}

const normalizeParameterKey = (value: unknown) =>
    String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[_\s]+/g, '-')
        .replace(/-+/g, '-');

const getCourseMode = (course: any) =>
    course?.course_meta_data?.mode_of_delivery ?? course?.course_meta?.mode_of_delivery;

const mapParameters = (selectedPlan?: PlanType) => {
    return selectedPlan?.parameters?.map((param: any) => ({
        key: normalizeParameterKey(param?.master?.key),
        value: Number(param?.value || 0),
    })) ?? [];
};

function CourseSelection({ selectedCourses, onSelect, onContinue, selectedPlan }: CourseSelectionProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [fakeLoading, setFakeLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedMode, setSelectedMode] = useState<string>('');
    const [selectedCourseIds, setSelectedCourseIds] = useState<Set<number | string>>(
        new Set(selectedCourses.map((course) => course.id))
    );
    const [viewAllGroup, setViewAllGroup] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const { data: courses = { data: [] }, isLoading, isError } = useCourses();

    const {
        data: categories = [],
        isError: isErrorCategories,
        isLoading: isLoadingCategories
    } = useCourseCategories();

    const uniqueModes = Array.from(
        new Set(
            courses?.data?.map((c: any) => getCourseMode(c)).filter(Boolean)
        )
    );

    const permissionLimits = useMemo(() => {
        return mapParameters(selectedPlan).reduce((limits: Record<string, number>, param: any) => {
            if (param.key) {
                limits[param.key] = Number(param.value || 0);
            }

            return limits;
        }, {});
    }, [selectedPlan]);

    const isCourseAllowedByPlan = (course: any) => {
        const courseModeKey = normalizeParameterKey(getCourseMode(course));
        const allowedLimit = permissionLimits[courseModeKey] ?? 0;

        return Boolean(courseModeKey) && allowedLimit > 0;
    };

    const filteredCourses = courses?.data?.filter((course: any) => {
        const courseCategoryId = course.category_id ?? course["category_id"];
        const matchesSearch = searchQuery
            ? course.name.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        const matchesCategory =
            !selectedCategory || selectedCategory === "all"
                ? true
                : String(courseCategoryId) === String(selectedCategory);
        const matchesMode =
            !selectedMode || selectedMode === "all"
                ? true
                : normalizeParameterKey(getCourseMode(course)) === normalizeParameterKey(selectedMode);

        return matchesSearch && matchesCategory && matchesMode;
    });

    const availableCourses = filteredCourses?.filter((course: any) => isCourseAllowedByPlan(course)) || [];

    // Group courses by category name
    // const groupedCourses: Record<string, any[]> = {};
    // availableCourses.forEach((course: any) => {
    //     const categoryId = course.category_id ?? course["category_id"];
    //     const category = categories?.find((cat: any) => String(cat.id) === String(categoryId));
    //     const categoryName = category?.name ?? 'Other';
    //     console.log(course, "course");
    //     if (!groupedCourses[categoryName]) {
    //         groupedCourses[categoryName] = [];
    //     }
    //     groupedCourses[categoryName].push(course);
    // });

    const groupedCourses: Record<string, any[]> = {
        'Self Paced': [],
        'Live Online': [],
    };

    availableCourses.forEach((course: any) => {
        const mode = normalizeParameterKey(
            course?.course_meta?.mode_of_delivery ||
            course?.course_meta_data?.mode_of_delivery
        );

        if (mode === 'self-paced') {
            groupedCourses['Self Paced'].push(course);
        } else if (mode === 'live-online') {
            groupedCourses['Live Online'].push(course);
        }
    });

    // Remove empty groups and sort selected courses first
    Object.keys(groupedCourses).forEach((key) => {
        if (groupedCourses[key].length === 0) {
            delete groupedCourses[key];
        } else {
            groupedCourses[key].sort((a: any, b: any) => {
                const aSelected = selectedCourseIds.has(a.id);
                const bSelected = selectedCourseIds.has(b.id);
                if (aSelected && !bSelected) return -1;
                if (!aSelected && bSelected) return 1;
                return 0;
            });
        }
    });

    const hasActiveFilters =
        searchQuery ||
        (selectedCategory && selectedCategory !== 'all') ||
        (selectedMode && selectedMode !== 'all');

    const isEmptyState = !filteredCourses || filteredCourses.length === 0;
    const hasNoAvailableCourses = !isEmptyState && availableCourses.length === 0;

    const refreshData = () => {
        queryClient.invalidateQueries({ queryKey: ['mycourses'] });
        setFakeLoading(true);
        setTimeout(() => setFakeLoading(false), 1000);
        toast.success('Courses refreshed successfully!');
    };

    const getSelectedCountForMode = (mode: unknown, selectedIds: Set<number | string>) => {
        const normalizedMode = normalizeParameterKey(mode);

        return courses.data.filter((course: any) =>
            selectedIds.has(course.id) &&
            normalizeParameterKey(getCourseMode(course)) === normalizedMode
        ).length;
    };

    const toggleCourseSelection = (course: any) => {
        const courseId = course.id;
        setSelectedCourseIds(prev => {
            const next = new Set(prev);
            if (next.has(courseId)) {
                next.delete(courseId);
            } else {
                const courseModeKey = normalizeParameterKey(getCourseMode(course));
                const allowedLimit = permissionLimits[courseModeKey] ?? 0;
                const currentCount = getSelectedCountForMode(getCourseMode(course), next);

                if (!courseModeKey || allowedLimit <= 0) {
                    toast.error('This course type is not available under your current plan.');
                    return prev;
                }

                if (currentCount >= allowedLimit) {
                    toast.error(`You can select up to ${allowedLimit} ${getCourseMode(course)} course${allowedLimit === 1 ? '' : 's'} with this plan.`);
                    return prev;
                }

                next.add(courseId);
            }

            onSelect(courses.data.filter((course: any) => next.has(course.id)) as unknown as PreAssignCourse[]);
            return next;
        });
    };

    const validateCourseSelection = () => {
        const requiredModes = ['live-online', 'self-paced'];

        const missingSelections: string[] = [];

        requiredModes.forEach((modeKey) => {
            const limit = permissionLimits[modeKey] ?? 0;

            if (limit > 0) {
                const selectedCount = getSelectedCountForMode(modeKey, selectedCourseIds);

                if (selectedCount < limit) {
                    missingSelections.push(
                        `${limit - selectedCount} more ${modeKey.replace(/-/g, ' ')}`
                    );
                }
            }
        });

        if (missingSelections.length > 0) {
            toast.info(
                `You must select courses until the package limit is reached. Please select ${missingSelections.join(', ')}.`
            );
            return false;
        }

        return true;
    };

    return (
        <section className="text-white relative w-full pb-24 max-w-[1440px] mx-auto px-4 md:px-8">
            {/* Sticky Header Area */}
            <div className="sticky top-0 z-30 pb-6 pt-2" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)' }}>
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-[48px] font-bold text-white">Select Course for <span className='font-creative dark:text-[#00A8E9] text-creativeblue font-[400]'>Yourself</span></h1>
                    <p className="text-white text-2xl mt-2 font-normal flex gap-1 items-center justify-center">
                        Choose from our curated catalog of courses.
                    </p>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center justify-end gap-3 mb-2">
                    {/* Search + Domain filter side by side (mimicking screenshot) */}
                    <div className="flex items-center gap-2 flex-1 max-w-md">
                        <div className="relative flex-1">
                            <img src={search} alt="search" className='w-4 h-4 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400' />
                            <Input
                                placeholder="Search Course..."
                                className="pl-9 bg-[#1D1D1D] border-none rounded-[10px] text-white placeholder:text-[#818181] focus-visible:ring-0"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Select
                            disabled={isLoadingCategories || isErrorCategories}
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger className="w-36 bg-[#1D1D1D] text-white focus:ring-0 rounded-[10px] border-none">
                                <SelectValue placeholder="All Domains" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1D1D1D] text-white">
                                <SelectGroup>
                                    <SelectLabel className="text-gray-400">Domain</SelectLabel>
                                    <SelectItem value="all">All</SelectItem>
                                    {categories?.map((category: any) => (
                                        <SelectItem key={category.id} value={category?.id?.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2 hidden">
                        <Select value={selectedMode} onValueChange={setSelectedMode}>
                            <SelectTrigger className="w-40 bg-[#1D1D1D] border-none text-white focus:ring-0 rounded-[10px]">
                                <SelectValue placeholder="Delivery Mode" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1D1D1D] border-none text-white">
                                <SelectGroup>
                                    <SelectLabel className="text-gray-400">Mode of Delivery</SelectLabel>
                                    <SelectItem value="all">All</SelectItem>
                                    {uniqueModes.map((mode: any) => (
                                        <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button
                            size="icon"
                            variant="outline"
                            className="border-[#2e2e2e] bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
                            onClick={refreshData}
                        >
                            <RefreshCcw className={fakeLoading ? 'animate-spin' : ''} size={16} />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Course List grouped by domain */}
            {!isLoading && !isError && Object.keys(groupedCourses).length > 0 && (
                <div className="flex flex-col gap-8">
                    {Object.entries(groupedCourses)
                        .filter(([groupName]) => viewAllGroup === null || viewAllGroup === groupName)
                        .map(([groupName, categoryCourses]) => {
                            const isViewAll = viewAllGroup === groupName;
                            const displayCourses = isViewAll ? categoryCourses : categoryCourses.slice(0, 4);

                            return (
                                <div key={groupName} className="bg-[#1D1D1D] rounded-[20px]">
                                    {/* Category heading */}
                                    <div className="rounded-[20px] px-4 pb-3 pt-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {isViewAll && (
                                                <button
                                                    onClick={() => setViewAllGroup(null)}
                                                    className="bg-[#2A2A2A] hover:bg-[#3A3A3A] p-2 rounded-lg transition"
                                                >
                                                    <ArrowLeft size={20} className="text-white" />
                                                </button>
                                            )}
                                            <h2 className="text-white font-bold text-[32px]">{groupName}</h2>
                                        </div>
                                        {!isViewAll && categoryCourses.length > 4 && (
                                            <button
                                                onClick={() => setViewAllGroup(groupName)}
                                                className="text-[#00A8E9] hover:text-[#00A8E9]/80 font-semibold text-[16px] underline"
                                            >
                                                View All
                                            </button>
                                        )}
                                    </div>
                                    {/* Cards grid */}
                                    <div className="rounded-b-lg px-4 pb-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            <div className="contents">
                                                {displayCourses.map((course) => {
                                                    const isSelected = selectedCourseIds.has(course.id);
                                                    const courseMode = getCourseMode(course);
                                                    const courseModeKey = normalizeParameterKey(courseMode);
                                                    const allowedLimit = permissionLimits[courseModeKey] ?? 0;
                                                    const selectedCount = getSelectedCountForMode(courseMode, selectedCourseIds);
                                                    const isLimitReached = !isSelected && allowedLimit > 0 && selectedCount >= allowedLimit;
                                                    const isDisabled = isLimitReached;

                                                    return (
                                                        <div
                                                            key={`course-${course.id}`}
                                                            onClick={() => toggleCourseSelection(course)}
                                                            title={isDisabled ? 'You have reached the maximum limit available under your current package' : undefined}
                                                            className={`cursor-pointer rounded-[12px] transition-all overflow-hidden duration-200 ${isSelected ? 'ring-4 ring-[#00A8E9]' : 'ring-0'} ${isDisabled ? 'brightness-50' : ''}`}
                                                        >
                                                            <CourseCard course={course} className="border-none rounded-[12px]" />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}

            {hasNoAvailableCourses && !isLoading && !isError && (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-[#2e2e2e] rounded-lg text-center">
                    <Search className="w-14 h-14 text-gray-600 mb-4" />
                    <p className="text-gray-600">No course available</p>
                </div>
            )}

            {/* Empty state */}
            {isEmptyState && !isLoading && !isError && (
                <div className="flex flex-col items-center justify-center p-12 border border-dashed border-[#2e2e2e] rounded-lg text-center">
                    <Search className="w-14 h-14 text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        {hasActiveFilters ? 'No Courses Found' : 'No Courses Yet'}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6">
                        {hasActiveFilters
                            ? 'No courses match your search criteria.'
                            : 'Nothing here yet — check back soon!'}
                    </p>
                </div>
            )}

            {/* Loading state */}
            {isLoading && (
                <div className="flex justify-center items-center flex-col h-40 border border-[#2e2e2e] rounded-lg">
                    <Loader className="animate-spin mb-3 text-[#00A8E9]" size={28} />
                    <p className="text-gray-400 text-sm">Please wait while we load your courses...</p>
                </div>
            )}

            {/* Error state */}
            {isError && (
                <Alert variant="destructive">
                    <AlertTitle>Error loading courses</AlertTitle>
                    <AlertDescription>
                        There was an error loading your courses. Please try again later.
                    </AlertDescription>
                </Alert>
            )}

            {/* Footer Navigation */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[1440px] px-4 md:px-8 z-50 flex justify-end items-center">
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => {
                            if (!validateCourseSelection()) return;
                            onContinue();
                        }}
                        disabled={selectedCourseIds.size === 0}
                        className="bg-[#FFEC00] hover:bg-[#FFEC00]/90 text-[14px] min-w-[84px] h-[76px] font-bold text-black rounded-xl transition-colors disabled:bg-[#FFEC00]/60 disabled:cursor-not-allowed flex items-center justify-center flex-col gap-1"
                    >
                        <ChevronRight size={20} className="text-black" />
                        <span className='text-black'>Next</span>
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default CourseSelection;
