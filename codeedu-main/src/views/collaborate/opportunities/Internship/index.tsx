import { Button } from "@/components/ui/ShadcnButton";
import React from "react";
import { usePublishedJobs } from "@learner/@hooks/useJobs";
import { Card, CardContent } from "@/components/ui/card";
import Breadcrumb from "@/components/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Bookmark, Briefcase, MapPin } from "lucide-react";
import { formatDate } from "@/utils/commonDateFormat";
import { useNavigate } from "react-router-dom";


const Internships: React.FC = () => {

    const { data: opportunities = [] } = usePublishedJobs();

    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: 'Jobs/Internships', path: '' },
    ];


    const jobs = opportunities.filter(opportunity => opportunity.is_job === 1);
    const internships = opportunities.filter(opportunity => opportunity.is_job !== 1);


    return (
        <div>
            <div>
                <div>
                    <Breadcrumb items={breadcrumbItems} />
                    <p className="mb-4 dark:text-white">From learning to earning — take the leap.</p>
                </div>
                <Tabs defaultValue="jobs">
                    <TabsList className='bg-[#5A5A5A] rounded-xl overflow-hidden p-0 h-auto mb-6'>
                        <TabsTrigger className='rounded-none text-white py-3 px-5' value="jobs">Jobs</TabsTrigger>
                        <TabsTrigger className='rounded-none text-white py-3 px-5' value="internships">Internships</TabsTrigger>
                    </TabsList>
                    {/* Overview Tab */}
                    <TabsContent value="jobs" className='flex flex-col gap-6'>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-4">
                            {jobs && jobs.map((job) => (
                                job?.is_published == 1 &&
                                <Card key={job.id}>
                                    <CardContent>
                                        <div className="flex items-center mb-2 gap-2">
                                            <div className="min-w-[96px] max-w-[96px] h-[96px] flex items-center justify-center rounded-lg overflow-hidden border">
                                                <img src={job?.job_in_org_logo} className="w-full" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <h1 className="text-xl font-semibold text-primary">{job?.name}</h1>
                                                <p className="text-sm dark:text-white">{job?.job_in_org_name}</p>
                                                {
                                                    job?.location && <div className="flex items-center gap-2">
                                                        <MapPin size={20} />
                                                        <span className="text-sm dark:text-white capitalize">{job?.location}</span>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-start mt-3">
                                            <div className="flex flex-col gap-2">
                                                {job?.experience && <p className="flex gap-2">
                                                    <Briefcase size={20} className="text-[#7A7A7A]" />
                                                    <span className="text-sm dark:text-white capitalize">{job?.experience} Years</span>
                                                </p>}
                                                {job?.job_type && <p className="flex gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                                                        <path d="M4.425 6.55L8.15 0.475C8.25 0.308333 8.375 0.1875 8.525 0.1125C8.675 0.0375 8.83333 0 9 0C9.16667 0 9.325 0.0375 9.475 0.1125C9.625 0.1875 9.75 0.308333 9.85 0.475L13.575 6.55C13.675 6.71667 13.725 6.89167 13.725 7.075C13.725 7.25833 13.6833 7.425 13.6 7.575C13.5167 7.725 13.4 7.84583 13.25 7.9375C13.1 8.02917 12.925 8.075 12.725 8.075H5.275C5.075 8.075 4.9 8.02917 4.75 7.9375C4.6 7.84583 4.48333 7.725 4.4 7.575C4.31667 7.425 4.275 7.25833 4.275 7.075C4.275 6.89167 4.325 6.71667 4.425 6.55ZM14.5 19.075C13.25 19.075 12.1875 18.6375 11.3125 17.7625C10.4375 16.8875 10 15.825 10 14.575C10 13.325 10.4375 12.2625 11.3125 11.3875C12.1875 10.5125 13.25 10.075 14.5 10.075C15.75 10.075 16.8125 10.5125 17.6875 11.3875C18.5625 12.2625 19 13.325 19 14.575C19 15.825 18.5625 16.8875 17.6875 17.7625C16.8125 18.6375 15.75 19.075 14.5 19.075ZM0 17.575V11.575C0 11.2917 0.0958333 11.0542 0.2875 10.8625C0.479167 10.6708 0.716667 10.575 1 10.575H7C7.28333 10.575 7.52083 10.6708 7.7125 10.8625C7.90417 11.0542 8 11.2917 8 11.575V17.575C8 17.8583 7.90417 18.0958 7.7125 18.2875C7.52083 18.4792 7.28333 18.575 7 18.575H1C0.716667 18.575 0.479167 18.4792 0.2875 18.2875C0.0958333 18.0958 0 17.8583 0 17.575Z" fill="#7A7A7A" />
                                                    </svg>
                                                    <span className="text-sm dark:text-white capitalize">{job?.job_type}</span>
                                                </p>}
                                                <p className="dark:text-white">Posted On: {formatDate(job?.created_at, 'MMM DD, YYYY')}</p>
                                            </div>
                                            <div className="flex flex-col justify-end items-end">
                                                <Button size="icon" className="dark:bg-[#5A5A5A] text-primary">
                                                    <Bookmark size={16} />
                                                </Button>
                                                <div className="w-[125px] h-[102px] bg-primary rounded-lg flex flex-col justify-center items-center mt-4 text-black gap-2 cursor-pointer"
                                                    onClick={() => navigate(`/internship/${job.id}`)}
                                                >
                                                    <ArrowRight size={20} />
                                                    <p className="text-center">Apply<br />Now</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="internships" className='flex flex-col gap-4'>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-4">
                            {internships && internships.map((internship) => (
                                internship?.is_published == 1 &&
                                <Card key={internship.id}>
                                    <CardContent>
                                        <div className="flex items-center mb-2 gap-2">
                                            <div className="min-w-[96px] max-w-[96px] h-[96px] flex items-center justify-center rounded-lg overflow-hidden border">
                                                <img src={internship?.job_in_org_logo} className="w-full" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <h1 className="text-xl font-semibold text-primary">{internship?.name}</h1>
                                                <p className="text-sm dark:text-white">{internship?.job_in_org_name}</p>
                                                {
                                                    internship?.location && <div className="flex items-center gap-2">
                                                        <MapPin size={20} />
                                                        <span className="text-sm dark:text-white capitalize">{internship?.location}</span>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-start mt-3">
                                            <div>
                                                {internship?.experience && <p className="flex gap-2">
                                                    <Briefcase size={20} className="text-[#7A7A7A]" />
                                                    <span className="text-sm dark:text-white capitalize">{internship?.experience} Years</span>
                                                </p>}
                                                {internship?.job_type && <p className="flex gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                                                        <path d="M4.425 6.55L8.15 0.475C8.25 0.308333 8.375 0.1875 8.525 0.1125C8.675 0.0375 8.83333 0 9 0C9.16667 0 9.325 0.0375 9.475 0.1125C9.625 0.1875 9.75 0.308333 9.85 0.475L13.575 6.55C13.675 6.71667 13.725 6.89167 13.725 7.075C13.725 7.25833 13.6833 7.425 13.6 7.575C13.5167 7.725 13.4 7.84583 13.25 7.9375C13.1 8.02917 12.925 8.075 12.725 8.075H5.275C5.075 8.075 4.9 8.02917 4.75 7.9375C4.6 7.84583 4.48333 7.725 4.4 7.575C4.31667 7.425 4.275 7.25833 4.275 7.075C4.275 6.89167 4.325 6.71667 4.425 6.55ZM14.5 19.075C13.25 19.075 12.1875 18.6375 11.3125 17.7625C10.4375 16.8875 10 15.825 10 14.575C10 13.325 10.4375 12.2625 11.3125 11.3875C12.1875 10.5125 13.25 10.075 14.5 10.075C15.75 10.075 16.8125 10.5125 17.6875 11.3875C18.5625 12.2625 19 13.325 19 14.575C19 15.825 18.5625 16.8875 17.6875 17.7625C16.8125 18.6375 15.75 19.075 14.5 19.075ZM0 17.575V11.575C0 11.2917 0.0958333 11.0542 0.2875 10.8625C0.479167 10.6708 0.716667 10.575 1 10.575H7C7.28333 10.575 7.52083 10.6708 7.7125 10.8625C7.90417 11.0542 8 11.2917 8 11.575V17.575C8 17.8583 7.90417 18.0958 7.7125 18.2875C7.52083 18.4792 7.28333 18.575 7 18.575H1C0.716667 18.575 0.479167 18.4792 0.2875 18.2875C0.0958333 18.0958 0 17.8583 0 17.575Z" fill="#7A7A7A" />
                                                    </svg>
                                                    <span className="text-sm dark:text-white capitalize">{internship?.job_type}</span>
                                                </p>}
                                                <p className="dark:text-white">Posted On: {formatDate(internship?.created_at, 'MMM DD, YYYY')}</p>
                                            </div>
                                            <div className="flex flex-col justify-end items-end">
                                                <Button size="icon" className="dark:bg-[#5A5A5A] text-primary">
                                                    <Bookmark size={16} />
                                                </Button>
                                                <div className="w-[125px] h-[102px] bg-primary rounded-lg flex flex-col justify-center items-center mt-4 text-black gap-2 cursor-pointer"
                                                    onClick={() => navigate(`/internship/${internship.id}`)}
                                                >
                                                    <ArrowRight size={20} />
                                                    <p className="text-center">Apply<br />Now</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        {
                            internships.length === 0 && <p className="dark:text-white">No internships available at the moment.</p>
                        }
                    </TabsContent>
                </Tabs>
            </div>
        </div >
        // <section className="flex flex-col gap-4">
        //     <div className="flex justify-between items-center">
        //         <Heading title="Jobs/Internships" description="Explore jobs/internship opportunities" className="mb-0" />
        //     </div>
        //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        //         {jobs && jobs.map((job) => (
        //             job?.is_published == 1 && <Card key={job.id} className="p-3">
        //                 <CardContent className="dark:bg-black rounded-md p-2">
        //                     <div className="flex justify-between items-center mb-2">
        //                         <div className="flex items-center gap-2 mb-2">
        //                             <img src={job?.job_in_org_logo} className="w-20" />
        //                             <p className="text-sm font-semibold">{job?.job_in_org_name}</p>
        //                         </div>
        //                         <div className="bg-white dark:bg-gray-800 p-2 rounded-full">
        //                             <Bookmark size={20} />
        //                         </div>
        //                     </div>
        //                     <div>
        //                         <h1 className="text-lg font-semibold text-cblack line-clamp-1 dark:text-white">{job?.name}</h1>
        //                         {/* <p className="text-cblack mb-2">{job?.domain_name}</p> */}
        //                         <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2"
        //                             dangerouslySetInnerHTML={{ __html: job?.description }}
        //                         />
        //                     </div>
        //                     <div className="flex items-center gap-2 mt-2">
        //                         <MapPin />
        //                         <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">{job?.location}</p>
        //                     </div>
        //                     <div className="mt-4">
        //                         <Badge variant="outline" className="p-2 px-5 border-gray-500">{job?.experience} Years</Badge>
        //                     </div>
        //                 </CardContent>
        //                 <CardFooter className="pt-4 flex justify-end items-center pb-0 px-0">
        //                     <Button asChild className="bg-primary text-white hover:bg-primary/70 transition-colors duration-300 !rounded-full whitespace-nowrap">
        //                         <Link to={`/internship/${job.id}`}>View Details</Link>
        //                     </Button>
        //                 </CardFooter>
        //             </Card>
        //         ))}
        //     </div>
        // </section>
    );
};

export default Internships;