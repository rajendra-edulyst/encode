import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Plus, Search, Users, BadgeCheck, UserCheck, HandPlatter } from "lucide-react";
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from "@/components/ui/ShadcnInput";
import { useSearchParams, Link } from "react-router-dom";
import debounce from "lodash/debounce";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { formatDateToIN } from "@/utils/timestampToDate";
import StatusIndicator from "@/components/StatusIndicator";
import { useJobStore } from "../../store/jobStore";
import { fetchJobs } from "../../services/JobService";
import StatCard from "../../components/StatCard";
import { formatApiDate } from "@/utils/dateFormat";
import { useJobOpportunityDashboardStats } from "@/hooks/data/collaborate/useJobs";

const Jobs: React.FC = () => {


    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>(searchParams.get("status") || "all");
    const [experienceFilter, setExperienceFilter] = useState<string>("all");
    const [locationTypeFilter, setLocationTypeFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { jobs, loading, error, pagination, setJobs, setPagination, setLoading, setError } = useJobStore();

    const { data: jobStats } = useJobOpportunityDashboardStats();

    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                setSearchTerm(value);
            }, 300),
        []
    );

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            debouncedSearch(e.target.value);
        },
        [debouncedSearch]
    );

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        // setPagination({ currentPage: 1, totalPages: 0, totalItems: 0 });

        try {
            console.log("fethc filter", statusFilter)
            const params = new URLSearchParams();
            if (searchTerm) params.append("search", searchTerm);

            if (statusFilter !== "all") {
                params.append("status", statusFilter);
                searchParams.set("status", statusFilter);
                setSearchParams(searchParams, { replace: true });
            };

            if (experienceFilter !== "all") params.append("experience", experienceFilter);
            if (locationTypeFilter !== "all") params.append("locationType", locationTypeFilter);

            params.append("page", currentPage.toString());
            const response = await fetchJobs(params);
            if (response) {
                setJobs([]);
                setJobs(response.data || []);
                setPagination(response.pagination);
            } else {
                setError("No jobs data received from the server.");
            }
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Failed to fetch jobs. Please try again later.";
            setError(errorMessage);
            console.error("Error fetching jobs:", err);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, statusFilter, experienceFilter, locationTypeFilter, currentPage, setJobs, setPagination, setLoading, setError,]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        return () => { debouncedSearch.cancel(); };
    }, [debouncedSearch]);

    const filteredJobs = useMemo(() => jobs?.filter((job) => job.designation?.toLowerCase().includes(searchTerm?.toLowerCase())), [jobs, searchTerm]);

    const clearFilters = useCallback(() => { setSearchTerm(""); setStatusFilter("all"); setExperienceFilter("all"); setLocationTypeFilter("all"); setCurrentPage(1); }, []);


    const getPaginationRange = useCallback((current: number, last: number) => {
        const delta = 2;
        const range: (number | string)[] = [];
        const left = Math.max(2, current - delta);
        const right = Math.min(last - 1, current + delta);
        range.push(1);
        if (left > 2) range.push("...");
        for (let i = left; i <= right; i++) range.push(i);
        if (right < last - 1) range.push("...");
        if (last > 1) range.push(last);
        return range;
    }, []);


    return (
        <div className="min-h-screen">
            <header className="mb-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Jobs Management</h1>
                        <p className="text-sm text-muted-foreground">Manage your job postings and applications from this page.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button asChild size="sm" className="flex flex-col items-center gap-2 h-[118px] w-[125px] text-black">
                            <Link to="/industry/jobs/add">
                                <Plus className="h-4 w-4" /> <br /> Add Job
                            </Link>
                        </Button>
                        <StatusIndicator loading={loading} error={error} />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-5 mb-8 gap-4">
                    <StatCard title={"Jobs"} value={filteredJobs?.length.toString() ?? "0"} icon={Users} color="blue" />
                    <StatCard title={"Vacancies"} value={jobStats?.tot_vacancies?.toString() ?? "0"} icon={HandPlatter} color="amber" />
                    <StatCard title={"In Pool"} value={jobStats?.in_pool?.toString() ?? "0"} icon={Users} color="purple" />
                    <StatCard title={"Verified"} value={jobStats?.Verified?.toString() ?? "0"} icon={BadgeCheck} color="green" />
                    <StatCard title={"Resume Matched"} value={jobStats?.resume_matches?.toString() ?? "0"} icon={UserCheck} color="red" />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                        <Input type="text" placeholder="Search jobs by title or description..." className="pl-10 text-sm" onChange={handleSearchChange} />
                    </div>

                    <div className="flex flex-wrap gap-2 md:gap-4">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="open">Active</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Experience" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="entry">Entry</SelectItem>
                                <SelectItem value="mid">Mid</SelectItem>
                                <SelectItem value="senior">Senior</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={locationTypeFilter} onValueChange={setLocationTypeFilter}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                <SelectItem value="remote">Remote</SelectItem>
                                <SelectItem value="on-site">On-site</SelectItem>
                                <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </header>

            {filteredJobs && filteredJobs.length > 0 ? (
                <div className={`relative bg-card rounded-lg border shadow-sm overflow-auto`}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">Sr. no.</TableHead>
                                <TableHead className="">Job Title</TableHead>
                                <TableHead className="text-center">Posted Date</TableHead>
                                <TableHead className="text-center">Location</TableHead>
                                <TableHead className="text-center">Resume Match</TableHead>
                                <TableHead className="text-center">Vacancies</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredJobs.map((job, index) => (
                                <TableRow key={index} className="hover:bg-muted/50">
                                    <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                                    <TableCell className=" font-medium">{job?.name}</TableCell>
                                    <TableCell className="text-center font-medium">{formatApiDate(job?.created_at) ?? "-"}</TableCell>
                                    <TableCell className="text-center font-medium">{job.location ?? "-"}</TableCell>
                                    <TableCell className="text-center font-medium">{job.resume_matches ?? 0}</TableCell>
                                    <TableCell className="text-center font-medium">{job.no_of_vacancies ?? 0}</TableCell>
                                    <TableCell className="text-center flex justify-center gap-1">
                                        <Link to={`/industry/jobs/${job.gulfjob_id}`}>
                                            <Button variant="outline" size="sm"><Eye className="h-4 w-4" /></Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="py-20 text-center">
                    <Search className="text-muted-foreground text-5xl mb-4 mx-auto" />
                    <h3 className="text-xl font-medium text-foreground mb-2">No jobs found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                    <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear all filters</Button>
                </div>
            )}

            {filteredJobs && filteredJobs.length > 0 && pagination && (
                <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" disabled={pagination.current_page === 1} className="flex items-center gap-1" onClick={() => setCurrentPage(pagination.current_page - 1)}><ChevronLeft className="h-4 w-4" /> Previous</Button>
                        {getPaginationRange(pagination.current_page, pagination.last_page).map((item, idx) => item === "..." ? (<span key={idx} className="px-2">...</span>) : (<Button key={idx} variant="outline" size="sm" className={`${item === pagination.current_page ? "bg-primary/10" : ""}`} onClick={() => setCurrentPage(Number(item))}>{item}</Button>))}
                        <Button variant="outline" size="sm" disabled={pagination.current_page === pagination.last_page} className="flex items-center gap-1" onClick={() => setCurrentPage(pagination.current_page + 1)}>Next <ChevronRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jobs;