import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartLine, Users } from 'lucide-react'
import { FaUserTie } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { LiaIndustrySolid } from "react-icons/lia";
import { useDashboardStateStore } from '@industry/store/DashboardStore';
import { fetchDomainCount, fetchJobCount, fetchTalentPool } from '@/views/industry/services/DashboardService';
import { useAuth } from '@/auth';


function StatCard() {

    const { jobsCount, domainCount, talentPool } = useDashboardStateStore();

    const { user } = useAuth();

    const getJobCount = async () => {
        const response = await fetchJobCount(user?.organization_id);
        useDashboardStateStore.getState().setJobsCount(response);
    }

    const getDomainCount = async () => {
        const response = await fetchDomainCount();
        useDashboardStateStore.getState().setDomainCount(response);
    }

    const getTalentPool = async () => {
        const response = await fetchTalentPool();
        useDashboardStateStore.getState().setTalentPool(response);
    }

    useEffect(() => {
        try {
            useDashboardStateStore.getState().setLoading(true);
            useDashboardStateStore.getState().setError(null);
            getJobCount();
            getDomainCount();
            getTalentPool();
        } catch (error) {
            useDashboardStateStore.getState().setError("Failed to fetch data");
            console.error("Error fetching data:", error);
        }
        finally {
            useDashboardStateStore.getState().setLoading(false);
        }
    }, []);

    if (!jobsCount && !domainCount && !talentPool) {
        return null;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {domainCount ?
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 gap-0">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold text-primary">
                                Domains
                            </CardTitle>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                {/* <GitBranch size={20} className="text-blue-600" /> */}
                                <LiaIndustrySolid size={20} className="text-blue-600" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center">
                            <Link to={'/dashboard/domain/industry/'}>
                                <div className="text-center bg-blue-100 p-2 rounded-lg">
                                    <p className="text-xl font-bold text-blue-600">{domainCount?.sector_industry_domain}</p>
                                    <p className="text-gray-600 mb-2 text-xs font-bold">Industry Domain</p>
                                </div>
                            </Link>
                            <div className="flex justify-between w-full mt-4">
                                <Link to={'/dashboard/domain/functional'}>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-blue-600">{domainCount?.functional_domains}</p>
                                        <p className="text-gray-600 font-medium mt-2">Fun. Domain</p>
                                    </div>
                                </Link>
                                <Link to={'/dashboard/domain/JobRoles'}>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-blue-600">{domainCount?.job_roles}</p>
                                        <p className="text-gray-600 font-medium mt-2">
                                            Job Roles
                                        </p>
                                    </div></Link>
                            </div>
                        </div>
                    </CardContent>
                </Card> : (
                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                )}
            {/* Job Card */}
            {jobsCount ?
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 gap-0">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold text-primary">
                                Job
                            </CardTitle>
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <FaUserTie className="text-purple-600 text-lg" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center">
                            <Link to={'/job-roles'}>
                                <div className="text-center bg-purple-100 p-2 rounded-lg">
                                    <p className="text-xl font-bold text-purple-600">{jobsCount?.job_role_count}</p>
                                    <p className="text-gray-600 mb-2 text-xs font-bold">Total Job Role</p>
                                </div>
                            </Link>
                            <div className="flex justify-between w-full mt-4">
                                <Link to={'/jobs?status=open'}>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-purple-600">{jobsCount?.open_vacancy}</p>
                                        <p className="text-gray-600 font-medium mt-2">
                                            Open Position
                                        </p>
                                    </div>
                                </Link>
                                <Link to={'/jobs?status=closed'}>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-purple-600">{jobsCount?.closed_vacancy}</p>
                                        <p className="text-gray-600 font-medium mt-2">
                                            Filled Position
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card> : (
                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                )}
            {/* Talent Pool Card */}
            {talentPool ?
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 gap-0">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold text-primary">
                                Talent Pool
                            </CardTitle>
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Users size={20} className="text-green-600" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center">
                            <Link to="/dashboard/talentpool/profiles">
                                <div className="text-center bg-green-100 p-3 rounded-lg">
                                    <p className="text-xl font-bold text-green-600">{talentPool?.tot_profiles}</p>
                                    <p className="text-gray-600 mb-2 text-xs font-bold">Profiles</p>
                                </div>
                            </Link>
                            <div className="flex justify-between w-full mt-4">
                                <Link to="/dashboard/talentpool/profiles?type=hired">
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-green-600">{talentPool?.tot_hired}</p>
                                        <p className="text-gray-600 font-medium mt-2">Hired</p>
                                    </div>
                                </Link>
                                <Link to="/dashboard/talentpool/profiles?type=in_process">
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-green-600">{talentPool?.in_process}</p>
                                        <p className="text-gray-600 font-medium mt-2">In Process</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card> : (
                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                )}
            {/* Key Metrics Card */}
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 gap-0">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold text-primary">
                            Key Metrics
                        </CardTitle>
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <ChartLine size={20} className="text-amber-600" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center">
                        <div className="text-center bg-amber-100 p-3 rounded-lg">
                            <p className="text-xl font-bold text-amber-600">84%</p>
                            <p className="text-gray-600 mb-2 text-xs font-bold">
                                Competency
                            </p>
                        </div>
                        <div className="flex justify-between w-full mt-4">
                            <div className="text-center">
                                <p className="text-xl font-bold text-amber-600">76%</p>
                                <p className="text-gray-600 font-medium mt-2">
                                    Skill Matching
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xl font-bold text-amber-600">18</p>
                                <p className="text-gray-600 font-medium mt-2">
                                    Avg. Days to Hire
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default StatCard