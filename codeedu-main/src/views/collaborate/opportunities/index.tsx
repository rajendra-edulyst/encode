
import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, MapPin, Bookmark, ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/ShadcnButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Program } from "@/@types/learner/Jobs";
import { usePublishedJobs } from "@learner/@hooks/useJobs";
import { formatDate } from "@/utils/commonDateFormat";
import OpportunitiesAcknowledgement from "./components/OpportunitiesAcknowledgement";

function WorkModeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="20"
            viewBox="0 0 19 20"
            fill="none"
            aria-hidden="true"
            {...props}
        >
            <path
                d="M4.425 6.55L8.15 0.475C8.25 0.308333 8.375 0.1875 8.525 0.1125C8.675 0.0375 8.83333 0 9 0C9.16667 0 9.325 0.0375 9.475 0.1125C9.625 0.1875 9.75 0.308333 9.85 0.475L13.575 6.55C13.675 6.71667 13.725 6.89167 13.725 7.075C13.725 7.25833 13.6833 7.425 13.6 7.575C13.5167 7.725 13.4 7.84583 13.25 7.9375C13.1 8.02917 12.925 8.075 12.725 8.075H5.275C5.075 8.075 4.9 8.02917 4.75 7.9375C4.6 7.84583 4.48333 7.725 4.4 7.575C4.31667 7.425 4.275 7.25833 4.275 7.075C4.275 6.89167 4.325 6.71667 4.425 6.55ZM14.5 19.075C13.25 19.075 12.1875 18.6375 11.3125 17.7625C10.4375 16.8875 10 15.825 10 14.575C10 13.325 10.4375 12.2625 11.3125 11.3875C12.1875 10.5125 13.25 10.075 14.5 10.075C15.75 10.075 16.8125 10.5125 17.6875 11.3875C18.5625 12.2625 19 13.325 19 14.575C19 15.825 18.5625 16.8875 17.6875 17.7625C16.8125 18.6375 15.75 19.075 14.5 19.075ZM0 17.575V11.575C0 11.2917 0.0958333 11.0542 0.2875 10.8625C0.479167 10.6708 0.716667 10.575 1 10.575H7C7.28333 10.575 7.52083 10.6708 7.7125 10.8625C7.90417 11.0542 8 11.2917 8 11.575V17.575C8 17.8583 7.90417 18.0958 7.7125 18.2875C7.52083 18.4792 7.28333 18.575 7 18.575H1C0.716667 18.575 0.479167 18.4792 0.2875 18.2875C0.0958333 18.0958 0 17.8583 0 17.575Z"
                fill="#7A7A7A"
            />
        </svg>
    );
}

function getSkills(program: Program): string[] {
    const raw = program.skill_names ?? "";
    return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);
}

function OpportunityCard({ program }: { program: Program }) {
    const navigate = useNavigate();

    const skills = getSkills(program);
    const postedOn = program?.created_at
        ? formatDate(program.created_at, "MMM DD, YYYY")
        : "";

    return (
        <Card className="py-0 bg-[#262626] border-[#3a3a3a] shadow-none h-full flex flex-col">
            <CardContent className="px-6 py-6 flex flex-col flex-1">
                <div
                    className="flex items-start gap-3 cursor-pointer group"
                    onClick={() => navigate(`/internship/${program.id}`)}
                >
                    {program?.image && program.image !== "null" && program.image !== "" ? (
                        <div
                            className="min-w-[96px] max-w-[96px] h-[96px] rounded-xl overflow-hidden border border-[#3a3a3a] bg-[#323232] flex items-center justify-center bg-center bg-cover transition-transform group-hover:scale-[1.02]"
                            style={{ backgroundImage: `url('${program.image}')` }}
                        />
                    ) : (
                        <div className="min-w-[96px] max-w-[96px] h-[96px] rounded-xl overflow-hidden border border-[#3a3a3a] bg-[#323232] flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                            <Briefcase size={32} className="text-[#8cc63f]" />
                        </div>
                    )}
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                        <h3 className="text-xl font-semibold text-primary leading-tight line-clamp-1 group-hover:underline">
                            {program?.name}
                        </h3>
                        <p className="text-sm text-white/90 line-clamp-1">
                            {program?.job_in_org_name}
                        </p>
                        {program?.location ? (
                            <div className="flex items-center gap-2 text-white/80">
                                <MapPin size={18} />
                                <span className="text-sm capitalize line-clamp-1">
                                    {program.location}
                                </span>
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="mt-4 flex justify-between gap-4 flex-1">
                    <div className="flex flex-col gap-2 justify-between min-w-0">
                        <div className="flex flex-col gap-3">
                            {program?.experience ? (
                                <div className="flex items-center gap-2">
                                    <Briefcase size={18} className="text-[#7A7A7A]" />
                                    <span className="text-sm text-white/90 capitalize">
                                        {String(program.experience).replace(/\.00/g, '').replace(/\s*-\s*/g, '-').replace(/\s*y(?:ears?)?/i, '').trim()} year
                                    </span>
                                </div>
                            ) : null}

                            {program?.job_type ? (
                                <div className="flex items-center gap-2">
                                    <WorkModeIcon />
                                    <span className="text-sm text-white/90 capitalize">
                                        {program.job_type}
                                    </span>
                                </div>
                            ) : null}

                            {postedOn ? (
                                <p className="text-sm text-white/80">Posted On: {postedOn}</p>
                            ) : null}

                        </div>
                        <div>
                            {skills.length ? (
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {skills.map((skill) => (
                                        <Badge
                                            key={skill}
                                            variant="outline"
                                            className="border-primary text-white/90 rounded-full px-3 py-1 bg-transparent"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className="flex flex-col items-end justify-between shrink-0 h-full">
                        <div className="w-10 h-10 rounded-lg bg-[#5A5A5A] flex items-center justify-center cursor-pointer hover:bg-[#6a6a6a] transition-colors">
                            <Bookmark className="w-5 h-5 text-primary" />
                        </div>
                        <div
                            className={`w-[110px] md:w-[130px] h-[96px] md:h-[108px] rounded-xl flex flex-col justify-center items-center mt-4 text-black gap-2 select-none transition-all cursor-pointer
                            ${program.job_status_numeric === 1
                                    ? "bg-[#5A5A5A] text-white/90 hover:bg-[#6a6a6a]"
                                    : "bg-primary hover:bg-[#6da538]"}`}
                            role="button"
                            onClick={() => navigate(`/internship/${program.id}`)}
                        >
                            {program.job_status_numeric !== 1 && (
                                <ArrowRight className="h-6 w-6" strokeWidth={2.5} />
                            )}
                            <p className="text-center leading-snug font-bold">
                                {program.job_status_numeric === 1 ? "Applied" : "Apply Now"}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

const Opportunities: React.FC = () => {
    const { data: opportunities = [] } = usePublishedJobs();

    const breadcrumbItems = [{ label: "Jobs/Internships", path: "" }];
    const jobs = opportunities.filter((op) => op.is_job === 1);
    const internships = opportunities.filter((op) => op.is_job !== 1);

    return (
        <div className="w-full">
            <div className="flex flex-col gap-4">
                <Tabs defaultValue="jobs" className="w-full md:w-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-6 w-full justify-between">
                        <div>
                            <Breadcrumb items={breadcrumbItems} />
                            <p className="text-white/90">
                                From learning to earning — take the leap.
                            </p>
                        </div>
                        <TabsList className="bg-[#5A5A5A] rounded-xl overflow-hidden p-0 h-auto w-full md:w-auto">
                            <TabsTrigger className="rounded-none text-white py-3 px-6 flex-1 md:flex-none" value="jobs">
                                Jobs
                            </TabsTrigger>
                            <TabsTrigger
                                className="rounded-none text-white py-3 px-6 flex-1 md:flex-none"
                                value="internships"
                            >
                                Internships
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <div className="mt-6">
                        <OpportunitiesAcknowledgement />
                    </div>
                    <TabsContent value="jobs" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {jobs
                                .filter((j) => j?.is_published === 1)
                                .map((job) => (
                                    <OpportunityCard key={job.id} program={job} />
                                ))}
                        </div>
                        {jobs.filter((j) => j?.is_published === 1).length === 0 ? (
                            <p className="text-white/80 mt-6 text-center">
                                No jobs available at the moment.
                            </p>
                        ) : null}
                    </TabsContent>
                    <TabsContent value="internships" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {internships
                                .filter((i) => i?.is_published === 1)
                                .map((internship) => (
                                    <OpportunityCard
                                        key={internship.id}
                                        program={internship}
                                    />
                                ))}
                        </div>
                        {internships.filter((i) => i?.is_published === 1).length ===
                            0 ? (
                            <p className="text-white/80 mt-6 text-center">
                                No internships available at the moment.
                            </p>
                        ) : null}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Opportunities;

