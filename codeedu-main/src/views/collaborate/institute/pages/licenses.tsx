import React, { useEffect, useState } from 'react'
import { BookMarked } from 'lucide-react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import LicenseDetails from './LicenseDetails'
import DepartmentCourseCard from './DepartmentCourseCard'

import {
    useInstitutePlanDetails,
    useInstituteDepartmentLicenses,
    useDepartmentCourseStats,
    useInstituteLicensesPlan
} from '@/hooks/data/collaborate/useJobs'

interface PlanCardProps {
    icon: string
    title: string
    stats: {
        totalCourses: number
        mentorSlots: number
        onTheAgenda: number
        peakActions: number
    }
    licensesUsed: {
        used: number
        total: number
    }
}

interface DepartmentLicenseProps {
    name: string
    hod: string
    totalLicenses: number
    distribution: {
        explorer: number
        builder: number
        navigator: number
    }
    onClick?: () => void
}

const CHART_COLORS = {
    explorer: "#00A8E9",
    builder: "#E60086",
    navigator: "#7FBC42",
    certification: "#FFEC00",
}

const PlanCard: React.FC<PlanCardProps> = ({ icon, title, stats, licensesUsed }) => {
    return (
        <Card className="bg-[#323232] rounded-2xl p-6 border border-gray-700">
            <CardHeader>
                <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl`}>
                        <img src={icon} alt={title} className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Courses</span>
                        <span className="text-white font-semibold">{stats.totalCourses}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Mentor Slots</span>
                        <span className="text-white font-semibold">{stats.mentorSlots}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">On The Agenda</span>
                        <span className="text-white font-semibold">{stats.onTheAgenda}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Peak Actions</span>
                        <span className="text-white font-semibold">{stats.peakActions}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="border-t border-gray-700 pt-4 w-full">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Total Licenses Used</span>
                        <span className="text-white font-bold text-lg">
                            {licensesUsed.used}/{licensesUsed.total}
                        </span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

const DepartmentLicenseCard: React.FC<DepartmentLicenseProps> = ({ name, hod, totalLicenses, distribution, onClick }) => {
    const total = distribution.explorer + distribution.builder + distribution.navigator
    const explorerPercent = (distribution.explorer / total) * 100
    const builderPercent = (distribution.builder / total) * 100
    const navigatorPercent = (distribution.navigator / total) * 100

    return (
        <div
            className="h-full w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 cursor-pointer hover:border-lime-400 transition-all flex flex-col"
            onClick={onClick}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                    <BookMarked className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-h-[4.5rem] flex flex-col justify-center">
                    <h3 className="text-lg font-bold line-clamp-2 text-white leading-tight">{name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{hod}</p>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-gray-400 text-sm">Total Licenses: <span className="text-white font-semibold">{totalLicenses}</span></p>
            </div>

            {/* Stacked Bar */}
            <div className="mt-auto mb-4">
                <div className="flex h-8 rounded-lg overflow-hidden">
                    <div
                        className="flex items-center justify-center text-black text-xs font-bold"
                        style={{
                            width: `${explorerPercent}%`,
                            backgroundColor: CHART_COLORS.explorer
                        }}
                    >
                        {distribution.explorer > 0 && distribution.explorer}
                    </div>
                    <div
                        className="flex items-center justify-center text-white text-xs font-bold"
                        style={{
                            width: `${builderPercent}%`,
                            backgroundColor: CHART_COLORS.builder
                        }}
                    >
                        {distribution.builder > 0 && distribution.builder}
                    </div>
                    <div
                        className="flex items-center justify-center text-black text-xs font-bold"
                        style={{
                            width: `${navigatorPercent}%`,
                            backgroundColor: CHART_COLORS.navigator
                        }}
                    >
                        {distribution.navigator > 0 && distribution.navigator}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS.explorer }}
                    ></div>
                    <span className="text-gray-300">Explorer</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS.builder }}
                    ></div>
                    <span className="text-gray-300">Builder</span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: CHART_COLORS.navigator }}
                    ></div>
                    <span className="text-gray-300">Navigator</span>
                </div>
            </div>
        </div>
    )
}



const Licenses = ({ filter }: { filter: string }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedDeptId, setSelectedDeptId] = useState<number>(1);

    // Fetch data from APIs
    const { data: planDetails, isLoading: planDetailsLoading } = useInstitutePlanDetails();

    const { data: departmentLicenses = [], isLoading: departmentLicensesLoading } = useInstituteDepartmentLicenses(filter);
    const { data: departmentCourses = [], isLoading: departmentCoursesLoading } = useDepartmentCourseStats(filter);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const detailsParam = urlParams.get('details');
        const deptIdParam = urlParams.get('deptId');
        setShowDetails(detailsParam === 'true');
        if (deptIdParam) {
            setSelectedDeptId(Number(deptIdParam));
        }
    }, []);

    useEffect(() => {
        const handlePopState = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const detailsParam = urlParams.get('details');
            const deptIdParam = urlParams.get('deptId');
            setShowDetails(detailsParam === 'true');
            if (deptIdParam) {
                setSelectedDeptId(Number(deptIdParam));
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const handleDepartmentClick = (departmentId: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set('details', 'true');
        url.searchParams.set('deptId', String(departmentId));
        window.history.pushState({}, '', url.toString());
        setSelectedDeptId(departmentId);
        setShowDetails(true);
    };

    // Map plan details data to the plans array
    const plans = [
        {
            icon: 'https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/getting-started/travel_explore.png',
            title: 'Explorer Plan',
            color: 'bg-cyan-400',
            stats: {
                totalCourses: planDetails?.explorer?.total_courses || 0,
                mentorSlots: planDetails?.explorer?.mentor_slots || 0,
                onTheAgenda: planDetails?.explorer?.on_the_agenda || 0,
                peakActions: planDetails?.explorer?.peak_actions || 0
            },
            licensesUsed: {
                used: planDetails?.explorer?.licenses_used || 0,
                total: planDetails?.explorer?.total_licenses || 0
            }
        },
        {
            icon: 'https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/getting-started/build.png',
            title: 'Builder Plan',
            color: 'bg-pink-500',
            stats: {
                totalCourses: planDetails?.builder?.total_courses || 0,
                mentorSlots: planDetails?.builder?.mentor_slots || 0,
                onTheAgenda: planDetails?.builder?.on_the_agenda || 0,
                peakActions: planDetails?.builder?.peak_actions || 0
            },
            licensesUsed: {
                used: planDetails?.builder?.licenses_used || 0,
                total: planDetails?.builder?.total_licenses || 0
            }
        },
        {
            icon: 'https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/getting-started/explore.png',
            title: 'Navigator Plan',
            color: 'bg-lime-400',
            stats: {
                totalCourses: planDetails?.navigator?.total_courses || 0,
                mentorSlots: planDetails?.navigator?.mentor_slots || 0,
                onTheAgenda: planDetails?.navigator?.on_the_agenda || 0,
                peakActions: planDetails?.navigator?.peak_actions || 0
            },
            licensesUsed: {
                used: planDetails?.navigator?.licenses_used || 0,
                total: planDetails?.navigator?.total_licenses || 0
            }
        }
    ];

    // Map department licenses data
    const departments = departmentLicenses.map(dept => ({
        department_id: dept.department_id || dept.id,
        name: dept.department || 'Unknown Department',
        hod: `HOD: ${dept.hod || 'N/A'}`,
        totalLicenses: dept.total_licenses || 0,
        distribution: {
            explorer: dept.explorer || 0,
            builder: dept.builder || 0,
            navigator: dept.navigator || 0
        }
    }));

    // Map department courses data
    const departmentCoursesData = departmentCourses.map(dept => ({
        department_id: dept.department_id || dept.id,
        name: dept.department || 'Unknown Department',
        hod: `HOD: ${dept.hod || 'N/A'}`,
        totalCourses: dept.total_courses || 0,
        distribution: {
            selfPaced: dept.self_paced || 0,
            liveOnline: dept.live_online || 0,
            inClass: dept.in_class || 0,
            certifications: dept.certifications || 0
        }
    }));





    return (
        <>
            {!showDetails ? (
                /* list */
                <div className="w-full max-w-full space-y-8">
                    <Card>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {plans.map((plan, index) => (
                                    <PlanCard key={index} {...plan} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Licenses as per Departments */}
                    <div className="w-full max-w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Licenses as per Departments</h2>
                        </div>
                        <Carousel
                            opts={{
                                align: "start",
                                loop: false,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4">
                                {departments.map((dept, index) => (
                                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3 flex">
                                        <DepartmentLicenseCard
                                            {...dept}
                                            onClick={() => handleDepartmentClick(dept.department_id)}
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="-left-4 bg-lime-400 hover:bg-lime-500 text-black border-lime-400" />
                            <CarouselNext className="-right-4 bg-lime-400 hover:bg-lime-500 text-black border-lime-400" />
                        </Carousel>
                    </div>

                    {/* Courses as per Departments */}
                    <div className="w-full max-w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Courses as per Departments</h2>
                        </div>
                        <div className='w-[91vw] overflow-none'>
                            <Carousel
                                opts={{
                                    align: "start",
                                    loop: false,
                                }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-4">
                                    {departmentCoursesData.map((dept, index) => (
                                        <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3 flex">
                                            <DepartmentCourseCard
                                                {...dept}
                                                onClick={() => handleDepartmentClick(dept.department_id)}
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="-left-4 bg-lime-400 hover:bg-lime-500 text-black border-lime-400" />
                                <CarouselNext className="-right-4 bg-lime-400 hover:bg-lime-500 text-black border-lime-400" />
                            </Carousel>
                        </div>
                    </div>
                </div>
            ) : (

                <LicenseDetails department_id={selectedDeptId} />
            )}
        </>
    )
}

export default Licenses

