import React, { useEffect, useState } from "react";
import { useJobStore } from '@/store/learner/useOpportunitieStore';
import { fetchJobs } from '@/services/learner/OpportunitieService';
import { BsCalendar, BsMap, BsPinMap, BsSearch } from "react-icons/bs";

const App: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const { jobs, setJobs, loading, setLoading, error, setError } = useJobStore();
    useEffect(() => {
        const getJobs = async () => {
            setLoading(true);
            try {
                const response = await fetchJobs();
                setJobs(response.data);
            } catch (err) {
                setError(err as string);
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

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job?.organized_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    return (
        <div className="">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Listings</h1>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BsSearch className="fas fa-search text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Search for jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs && filteredJobs?.map((job) => (
                    <div
                        key={job?.id}
                        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105"
                    >
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <img src={`https://ui-avatars.com/api/?name=${job?.name}&background=random`}
                                    alt={`${job?.name} logo`}
                                    className="w-12 h-12 rounded-full object-cover border"
                                />
                                <div className="ml-4">
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        {job?.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">{job.organized_by}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <BsPinMap className="mr-2" />
                                    {job?.location}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <BsCalendar className="mr-2" />
                                    Posted {formatDate(job?.start_date)}
                                </div>
                            </div>

                            <div className="text-gray-600 mb-6 line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: job?.description }}
                            >

                            </div>

                            <button className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/70 transition-colors duration-300 !rounded-button whitespace-nowrap">
                                Apply Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;