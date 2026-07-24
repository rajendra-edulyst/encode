
import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin, Briefcase } from "lucide-react";
import { toast } from "sonner";
import Breadcrumb from "@/components/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/ShadcnButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient } from "@tanstack/react-query";

import { formatDate } from "@/utils/commonDateFormat";
import { useEventById } from "@/hooks/data/collaborate/useEvents";
import DOMPurify from "dompurify";
import ApplyNowButton from "./components/ApplyNowButton";
import AddResume from "@/views/common/profile/builder/AddResume";

function WorkModeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
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

const OpportunityDetailsPage: React.FC = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();

    const { data: opportunitieDetails, isLoading: loading } = useEventById(id);

    const details = opportunitieDetails;
    const program = details?.competitions_details?.program;
    const [isApplied, setIsApplied] = useState(details?.is_assigned === 1);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [persistedResumeUrl, setPersistedResumeUrl] = useState<string | null>(null);
    const skills = opportunitieDetails?.skills;
    const isExpired = program?.end_date ? new Date(program.end_date) < new Date() : false;
    const isDisabled = isApplied || isExpired;

    const sanitizeDescriptionHtml = (html?: string) => {
        if (!html) return "<p>No description available.</p>";

        // Remove inline style/class attributes so pasted HTML cannot force white blocks/text.
        const stripped = html
            .replace(/\sstyle=(["']).*?\1/gi, "")
            .replace(/\sclass=(["']).*?\1/gi, "");

        return DOMPurify.sanitize(stripped, {
            USE_PROFILES: { html: true },
        });
    };

    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { from?: string; breadcrumbLabel?: string; type?: string; reopenApply?: boolean } | null;
    const shouldReopenFromQuery = new URLSearchParams(location.search).get('reopenApply') === '1';

    useEffect(() => {
        setIsApplied(details?.is_assigned === 1);
    }, [details?.is_assigned]);

    useEffect(() => {
        if (state?.reopenApply) {
            const pending = sessionStorage.getItem('pendingJobApplication');
            if (pending) {
                try {
                    const parsed = JSON.parse(pending) as { jobId?: string; resumeUrl?: string | null };
                    if (String(parsed?.jobId) === String(id)) {
                        setPersistedResumeUrl(parsed.resumeUrl || null);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            setIsApplyModalOpen(true);
        }
    }, [id, state?.reopenApply]);

    useEffect(() => {
        if (shouldReopenFromQuery) {
            setIsApplyModalOpen(true);
        }
    }, [shouldReopenFromQuery]);

    useEffect(() => {
        const pending = sessionStorage.getItem('pendingJobApplication');
        if (!pending || !id) return;
        try {
            const parsed = JSON.parse(pending) as { jobId?: string; resumeUrl?: string | null };
            if (String(parsed?.jobId) === String(id)) {
                setPersistedResumeUrl(parsed.resumeUrl || null);
                setIsApplyModalOpen(true);
                sessionStorage.removeItem('pendingJobApplication');
            }
        } catch (error) {
            console.error(error);
        }
    }, [id]);

    const breadcrumbItems = state?.from ? [
        ...(state.type === 'must-attend' ? [{ label: "Must Attend", path: "/collaborate/must-attend" }] : []),
        ...(state.type === 'industry' ? [{ label: "Industries", path: "/collaborate/industries" }] : []),
        { label: state.breadcrumbLabel || "Back", path: state.from },
        { label: program?.name ?? "Details", path: "" }
    ] : [
        { label: "Jobs/Internships", path: "/opportunities" },
        { label: program?.name ?? "Details", path: "" },
    ];

    const handleApplyModalOpen = () => {
        if (!id || isApplied) return;
        setIsApplyModalOpen(true);
    };

    const handleAppliedSuccess = () => {
        if (!id) return;
        setIsApplied(true);
        toast.success("Application submitted successfully!");
        sessionStorage.removeItem('pendingJobApplication');
        queryClient.invalidateQueries({ queryKey: ['event', id] });
        queryClient.invalidateQueries({ queryKey: ['event-jobs'] });
        queryClient.invalidateQueries({ queryKey: ['events'] });
    };

    const handleCompleteProfile = () => {
        if (!id) return;
        sessionStorage.setItem(
            'pendingJobApplication',
            JSON.stringify({
                jobId: id,
                resumeUrl: persistedResumeUrl || null,
                returnUrl: window.location.pathname,
            }),
        );
        setIsApplyModalOpen(false);
        navigate(`/profile?highlight=incomplete&returnJobId=${id}`);
    };

    return (
        <div className="w-full space-y-5">
            <Breadcrumb items={breadcrumbItems} className="mb-4" />
            <Card className="py-0 bg-[#262626] border-[#3a3a3a] shadow-none">
                <CardContent className="px-6 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-start gap-4">
                                {program?.image && program.image !== "null" && program.image !== "" ? (
                                    <div
                                        className="min-w-[96px] max-w-[96px] h-[96px] rounded-xl overflow-hidden border border-[#3a3a3a] bg-[#323232] flex items-center justify-center bg-center bg-cover"
                                        style={{ backgroundImage: `url('${program.image}')` }}
                                    />
                                ) : (
                                    <div className="min-w-[96px] max-w-[96px] h-[96px] rounded-xl overflow-hidden border border-[#3a3a3a] bg-[#323232] flex items-center justify-center">
                                        <Briefcase size={32} className="text-[#8cc63f]" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-2xl md:text-3xl font-semibold text-primary leading-tight line-clamp-1">{program?.name ?? ""}</h1>
                                    <p className="text-white/80 mt-1">
                                        {program?.job_details?.company_name ?? ""}
                                    </p>
                                    {program?.job_details?.location ? (
                                        <div className="flex items-center gap-2 text-white/70 mt-2">
                                            <MapPin size={18} />
                                            <span className="text-sm capitalize line-clamp-1">
                                                {program.job_details?.location}
                                            </span>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap items-center gap-4 text-white/80">
                                {program?.job_details?.max_experience ? (
                                    <div className="flex items-center gap-2 dark:text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <mask id="mask0_5741_708" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                                <rect width="24" height="24" fill="#7A7A7A" />
                                            </mask>
                                            <g mask="url(#mask0_5741_708)">
                                                <path d="M4 21C3.45 21 2.97917 20.8042 2.5875 20.4125C2.19583 20.0208 2 19.55 2 19V8C2 7.45 2.19583 6.97917 2.5875 6.5875C2.97917 6.19583 3.45 6 4 6H8V4C8 3.45 8.19583 2.97917 8.5875 2.5875C8.97917 2.19583 9.45 2 10 2H14C14.55 2 15.0208 2.19583 15.4125 2.5875C15.8042 2.97917 16 3.45 16 4V6H20C20.55 6 21.0208 6.19583 21.4125 6.5875C21.8042 6.97917 22 7.45 22 8V19C22 19.55 21.8042 20.0208 21.4125 20.4125C21.0208 20.8042 20.55 21 20 21H4ZM10 6H14V4H10V6Z" fill="#7A7A7A" />
                                            </g>
                                        </svg>
                                        <span className="text-sm capitalize">{program.job_details?.min_experience} - {program.job_details?.max_experience} Years</span>
                                    </div>
                                ) : null}

                                {program?.job_details?.work_mode ? (
                                    <div className="flex items-center gap-2 dark:text-white">
                                        <WorkModeIcon />
                                        <span className="text-sm capitalize">{program.job_details?.work_mode}</span>
                                    </div>
                                ) : null}

                                {program?.start_date ? (
                                    <div className="flex items-center gap-2 dark:text-white">
                                        <CalendarDays size={18} className="text-[#7A7A7A]" />
                                        <span className="text-sm">Posted On: {formatDate(program.start_date)}</span>
                                    </div>
                                ) : null}

                                {
                                    program?.job_details?.min_ctc && program?.job_details?.max_ctc ? (
                                        <div className="flex items-center gap-2 dark:text-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <mask id="mask0_5741_716" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                                    <rect width="24" height="24" fill="#D9D9D9" />
                                                </mask>
                                                <g mask="url(#mask0_5741_716)">
                                                    <path d="M13.425 20.7L7.275 14.3C7.19167 14.2167 7.125 14.1125 7.075 13.9875C7.025 13.8625 7 13.7333 7 13.6V13C7 12.7167 7.09583 12.4792 7.2875 12.2875C7.47917 12.0958 7.71667 12 8 12H10.5C11.3833 12 12.1458 11.7125 12.7875 11.1375C13.4292 10.5625 13.8167 9.85 13.95 9H7C6.71667 9 6.47917 8.90417 6.2875 8.7125C6.09583 8.52083 6 8.28333 6 8C6 7.71667 6.09583 7.47917 6.2875 7.2875C6.47917 7.09583 6.71667 7 7 7H13.65C13.3667 6.41667 12.9458 5.9375 12.3875 5.5625C11.8292 5.1875 11.2 5 10.5 5H7C6.71667 5 6.47917 4.90417 6.2875 4.7125C6.09583 4.52083 6 4.28333 6 4C6 3.71667 6.09583 3.47917 6.2875 3.2875C6.47917 3.09583 6.71667 3 7 3H17C17.2833 3 17.5208 3.09583 17.7125 3.2875C17.9042 3.47917 18 3.71667 18 4C18 4.28333 17.9042 4.52083 17.7125 4.7125C17.5208 4.90417 17.2833 5 17 5H14.75C14.9833 5.28333 15.1917 5.59167 15.375 5.925C15.5583 6.25833 15.7 6.61667 15.8 7H17C17.2833 7 17.5208 7.09583 17.7125 7.2875C17.9042 7.47917 18 7.71667 18 8C18 8.28333 17.9042 8.52083 17.7125 8.7125C17.5208 8.90417 17.2833 9 17 9H15.975C15.8417 10.4167 15.2583 11.6042 14.225 12.5625C13.1917 13.5208 11.95 14 10.5 14H9.775L14.875 19.3C15.175 19.6167 15.2375 19.9792 15.0625 20.3875C14.8875 20.7958 14.5833 21 14.15 21C14.0167 21 13.8875 20.975 13.7625 20.925C13.6375 20.875 13.525 20.8 13.425 20.7Z" fill="#7A7A7A" />
                                                </g>
                                            </svg>
                                            <span className="text-sm">
                                                {program.job_details?.min_ctc} - ₹ {program.job_details?.max_ctc} per annum
                                            </span>
                                        </div>
                                    ) : null
                                }
                            </div>

                            {skills?.length ? (
                                <div className="mt-5 flex flex-wrap gap-2">
                                    {skills?.slice(0, 6).map((skill) => (
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

                        <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between lg:justify-start gap-4">
                            <Button
                                asChild
                                variant="secondary"
                                className="bg-[#5A5A5A] text-primary hover:bg-[#6a6a6a] h-[50px] w-[50px] rounded-lg flex items-center justify-center"
                                type="button"
                                aria-label="Save"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="26" viewBox="0 0 22 26" fill="none">
                                    <path d="M11 22.9704L4.4 25.7268C3.35238 26.1607 2.35714 26.0777 1.41429 25.478C0.471429 24.8782 0 24.0296 0 22.9321V3.06272C0 2.22047 0.307738 1.49945 0.923214 0.899673C1.53869 0.299891 2.27857 0 3.14286 0H18.8571C19.7214 0 20.4613 0.299891 21.0768 0.899673C21.6923 1.49945 22 2.22047 22 3.06272V22.9321C22 24.0296 21.5286 24.8782 20.5857 25.478C19.6429 26.0777 18.6476 26.1607 17.6 25.7268L11 22.9704ZM11 19.6014L18.8571 22.8938V3.06272H3.14286V22.8938L11 19.6014Z" fill="#7FBC42" />
                                </svg>
                            </Button>

                            <ApplyNowButton
                                disabled={isDisabled}
                                applied={isApplied}
                                expired={isExpired}
                                loading={false}
                                onClick={handleApplyModalOpen}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="bg-[#5A5A5A] rounded-xl overflow-hidden p-0 h-auto">
                            <TabsTrigger className="rounded-none text-white data-[state=active]:text-[#000000] py-3 px-6" value="overview">
                                Overview
                            </TabsTrigger>
                            <TabsTrigger className="rounded-none text-white data-[state=active]:text-[#000000] py-3 px-6" value="activities">
                                Activities
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="mt-6">
                            {loading ? (
                                <p className="text-white/80">Loading…</p>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    <Card className="py-0 bg-[#323232] border-[#3a3a3a] shadow-none">
                                        <CardHeader className="px-6 py-5">
                                            <CardTitle className="text-white text-xl">Skills Required</CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-6 pb-6">
                                            <div className="flex flex-wrap gap-3">
                                                {skills?.slice(0, 8).map((skill) => (
                                                    <Button
                                                        key={skill}
                                                        type="button"
                                                        variant="secondary"
                                                        className="bg-[#5A5A5A] text-white hover:bg-[#6a6a6a] rounded-lg h-auto px-5 py-3"
                                                    >
                                                        {skill}
                                                    </Button>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="gap-0 bg-[#323232]">
                                        <CardHeader className="px-6 py-5">
                                            <CardTitle className="text-white text-xl">Job Description</CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-6 pb-6 text-white/80">
                                            <div
                                                className="prose prose-invert max-w-none [&_*]:!bg-transparent"
                                                dangerouslySetInnerHTML={{
                                                    __html: sanitizeDescriptionHtml(program?.description),
                                                }}
                                            />
                                            <div
                                                className="prose prose-invert max-w-none ml-10 [&_*]:!bg-transparent"
                                                dangerouslySetInnerHTML={{
                                                    __html: sanitizeDescriptionHtml(
                                                        opportunitieDetails?.competition_instructions.whats_in
                                                    ),
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                    {opportunitieDetails?.competition_instructions.instructions && <Card className="gap-0 bg-[#323232]">
                                        <CardHeader className="px-6 py-5">
                                            <CardTitle className="text-white text-xl">Instructions</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-white">
                                            <div
                                                className="prose prose-invert max-w-none ml-10 [&_*]:!bg-transparent"
                                                dangerouslySetInnerHTML={{
                                                    __html: sanitizeDescriptionHtml(
                                                        opportunitieDetails?.competition_instructions.instructions
                                                    ),
                                                }}
                                            />
                                        </CardContent>
                                    </Card>}

                                    {opportunitieDetails?.competition_instructions.faq && <Card className="gap-0 bg-[#323232]">
                                        <CardHeader className="px-6 py-5">
                                            <CardTitle className="text-white text-xl">FaQ</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-white">
                                            <div
                                                className="prose prose-invert max-w-none ml-10 [&_*]:!bg-transparent"
                                                dangerouslySetInnerHTML={{
                                                    __html: sanitizeDescriptionHtml(
                                                        opportunitieDetails?.competition_instructions.faq
                                                    ),
                                                }}
                                            />
                                        </CardContent>
                                    </Card>}

                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="activities" className="mt-6">
                            {!isApplied ? (
                                <Card className="py-0 bg-[#3a3a3a] border-[#3a3a3a] shadow-none">
                                    <CardContent className="px-6 py-6 text-white/80">
                                        Apply to unlock activities for this opportunity.
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {(program?.contents ?? []).map((task) => (
                                        <Card
                                            key={task.id}
                                            className="py-0 bg-[#3a3a3a] border-[#3a3a3a] shadow-none"
                                        >
                                            <CardContent className="px-6 py-6 flex flex-col justify-between gap-6 min-h-[220px]">
                                                <div className="flex flex-col gap-2">
                                                    <h3 className="text-primary text-xl font-semibold line-clamp-2">
                                                        {task.title ?? "Task"}
                                                    </h3>
                                                    {task.description ? (
                                                        <p className="text-white/75 line-clamp-3">
                                                            {task.description}
                                                        </p>
                                                    ) : null}
                                                    {task.start_date ? (
                                                        <div className="flex items-center gap-2 text-white/70 mt-2">
                                                            <CalendarDays size={18} className="text-[#7A7A7A]" />
                                                            <span className="text-sm">
                                                                {formatDate(task.start_date, "DD MMM, YYYY")}
                                                            </span>
                                                        </div>
                                                    ) : null}
                                                </div>

                                                <div className="flex justify-end">
                                                    {/* <Link to={`/event-activity/${id}/content/${task.id}`}> */}
                                                    <Link to={`/details/${id}/event-activity/${task.id}`}>
                                                        <button
                                                            type="button"
                                                            className="w-[120px] h-[95px] bg-primary rounded-xl text-black font-semibold flex flex-col items-center justify-center gap-2 hover:brightness-95"
                                                        >
                                                            <ArrowRight size={20} />
                                                            {task.content_type === 'zoomclass' ? (
                                                                <span className="leading-snug text-center">
                                                                    Join
                                                                    <br />
                                                                    Now
                                                                </span>
                                                            ) : (
                                                                <span className="leading-snug text-center">
                                                                    Start
                                                                    <br />
                                                                    Now
                                                                </span>
                                                            )}
                                                        </button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                    {(program?.contents ?? []).length === 0 ? (
                                        <Card className="py-0 bg-[#3a3a3a] border-[#3a3a3a] shadow-none md:col-span-2">
                                            <CardContent className="px-6 py-6 text-white/80">
                                                No activities available yet.
                                            </CardContent>
                                        </Card>
                                    ) : null}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            {id && (
                <AddResume
                    mode="job-application"
                    jobId={id}
                    show={isApplyModalOpen}
                    onClose={(open) => setIsApplyModalOpen(open)}
                    onApplied={handleAppliedSuccess}
                    onCompleteProfile={handleCompleteProfile}
                    initialResumeUrl={persistedResumeUrl}
                />
            )}
        </div>
    );
};

export default OpportunityDetailsPage;

