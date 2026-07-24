import React, { useEffect } from "react";
import { BsCalendar, BsPinMap } from "react-icons/bs";
import { useJobStore } from '@/store/learner/useOpportunitieStore';
import { fetchJobs } from '@/services/learner/OpportunitieService';
import Loading from "@/components/shared/Loading";
import { Alert } from "@/components/ui";
import { Link } from "react-router-dom";

const App: React.FC = () => {
    const { jobs, setJobs, loading, setLoading, error, setError } = useJobStore();
    useEffect(() => {
        const getJobs = async () => {
            setError("");
            setLoading(true);
            try {
                const response = await fetchJobs();
                setJobs(response);
            } catch (err) {
                console.log(err);
                setError('Failed to fetch internships');
            } finally {
                setLoading(false);
            }
        };

        getJobs();
    }, [setJobs, setLoading, setError]);


    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading && jobs?.length <= 0) return <div className='h-96 flex items-center justify-center'>
        <Loading loading={loading} /></div>

    if (error) {
        return <Alert type="danger" title={error} />;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-3 mt-5">
            <div>
                <h1 className="text-xl font-bold mb-4 text-primary">
                    Emerging Industries
                </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
                {jobs && jobs?.slice(0,3).map((job) => (
                    <div
                        key={job.id}
                        className="bg-white rounded-lg shadow-md border cursor-pointer border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105"
                    >
                        <Link to={`/internship/${job.id}`}>
                            <div className="p-2">
                                <div className="flex items-center">
                                    <img src={`https://ui-avatars.com/api/?name=${job?.name}&background=random`}
                                        alt={`${job?.name} logo`}
                                        className="w-12 h-12 rounded-full object-cover border"
                                    />
                                    <div className="ml-2">
                                        <h3 className="text-xs font-semibold text-gray-900">
                                            {job?.name}
                                        </h3>
                                        <div className="mb-4">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <BsPinMap className="mr-1" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <BsCalendar className="mr-1" />
                                                Posted {formatDate(job?.start_date)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
                {
                    jobs?.length === 0 && (
                        <div className="">
                            <p className="text-gray-400">No internship Available</p>
                        </div>
                    )
                }
            </div>
        </div >
    );
};

export default App;