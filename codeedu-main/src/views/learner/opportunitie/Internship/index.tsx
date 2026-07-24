import Heading from "@/components/heading";
import { Button } from "@/components/ui/ShadcnButton";
import React from "react";
import { BsCalendar, BsPinMap } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useMyJobs, usePublishedJobs } from "@learner/@hooks/useJobs";
import { formatApiDate } from "@/utils/dateFormat";
import EmptyState from "@/components/EmptyState";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Bookmark, MapPin, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRefreshQuery } from "@/hooks/useRefreshQuery";


const Internships: React.FC = () => {

    const { data: jobs = [] } = usePublishedJobs();
    // make url parms
    const urlParams = new URLSearchParams();
    urlParams.append("self_created", "1");
    const { data: myJobs = [] } = useMyJobs(urlParams);

    const { refresh, loading } = useRefreshQuery(['publishedJobs']);

    return (
        <section className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <Heading title="Jobs/Internships" description="Explore jobs/internship opportunities" className="mb-0" />
                <div className="flex items-center gap-2">
                    <Button asChild variant="default" className="mt-4 text-white"><Link to={'/internship/add'}>Post a Job</Link></Button>
                    <Button size={'icon'} variant="outline" className="mt-4" disabled={loading} onClick={refresh}><RefreshCw /></Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {jobs && jobs.map((job) => (
                    job?.is_published == 1 &&
                    <Card key={job.id} className="p-3">
                        <CardContent className="dark:bg-black rounded-md p-2">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src={job?.job_in_org_logo} className="w-20" />
                                    <p className="text-sm font-semibold">{job?.job_in_org_name}</p>
                                </div>
                                <div className="bg-white p-2 rounded-full">
                                    <Bookmark />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-cblack line-clamp-1">{job?.name}</h1>
                                {/* <p className="text-cblack mb-2">{job?.domain_name}</p> */}
                                <p className="text-sm text-gray-500 line-clamp-2"
                                    dangerouslySetInnerHTML={{ __html: job?.description }}
                                />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <MapPin />
                                <p className="text-sm text-gray-500 line-clamp-2">{job?.location}</p>
                            </div>
                            <div className="mt-4">
                                <Badge variant="outline" className="p-2 px-5 border-gray-500">{job?.experience} Years</Badge>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-4 flex justify-end items-center pb-0 px-0">
                            <Button asChild className="bg-primary text-white hover:bg-primary/70 transition-colors duration-300 !rounded-full whitespace-nowrap">
                                <Link to={`/internship/${job.id}`}>View Details</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            <div className="flex justify-between items-center mt-4">
                <Heading title="My Jobs/Internships" description="Manage your job and internship postings" className="mb-0" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {myJobs?.length > 0 && myJobs.map((job) => (
                    <div
                        key={job.id}
                        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105"
                    >
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <img src={`https://ui-avatars.com/api/?name=${job?.name}&background=random`} alt={`${job?.name} logo`} className="w-12 h-12 rounded-full object-cover border" />
                                <div className="ml-4">
                                    <h3 className="text-sm font-semibold text-gray-900">{job?.name}</h3>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <BsPinMap className="mr-2" />
                                    {job.location}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <BsCalendar className="mr-2" /> Posted {formatApiDate(job?.job_posted_date_time)}
                                </div>
                            </div>

                            <div
                                className="text-gray-600 mb-6 line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: job?.description }}
                            ></div>

                            <div className="w-full">
                                <Link
                                    to={`/internship/${job.id}`}
                                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/70 transition-colors duration-300 !rounded-button whitespace-nowrap"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
                {
                    myJobs?.length === 0 && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
                            <EmptyState title="No Jobs Found" description="You have not posted any jobs or internships yet.">
                                <Link to="/internship/add" className="mt-4 inline-block bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/70 transition-colors duration-300 !rounded-button whitespace-nowrap">Create Job/Internship</Link>
                            </EmptyState>
                        </div>
                    )
                }
            </div>
        </section>
    );
};

export default Internships;