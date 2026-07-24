import { useEffect, useState } from 'react';
import { useResumes } from "../../hooks/useResumes";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/shadcnTooltip';
import { DatabaseZap, Download, Eye, FileUser, Handshake, Mail, Phone, RefreshCcw, Search, Send } from 'lucide-react';
import { Button } from '@/components/ui/ShadcnButton';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Input } from '@/components/ui/ShadcnInput';
import StatCard from '../../components/StatCard';
import StatusIndicator from '@/components/StatusIndicator';
import { useQueryClient } from '@tanstack/react-query';

const TalentPool = () => {
    const [filters, setFilters] = useState(new URLSearchParams());
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterExperience, setFilterExperience] = useState<string | null>("all");
    const [filterSkills, setFilterSkills] = useState<string | null>("all");
    const [filterLocation, setFilterLocation] = useState<string | null>("all");
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);


    const queryClient = useQueryClient();

    useEffect(() => {
        const newFilters = new URLSearchParams();

        if (searchTerm) {
            newFilters.set('search', searchTerm);
        }

        if (filterStatus !== "all") {
            newFilters.set('job_status', filterStatus);
        }

        if (filterExperience && filterExperience !== "all") {
            newFilters.set('experience', filterExperience);
        }

        if (filterSkills && filterSkills !== "all") {
            newFilters.set('skills', filterSkills);
        }

        if (filterLocation && filterLocation !== "all") {
            newFilters.set('location', filterLocation);
        }

        setFilters(newFilters);

    }, [searchTerm, filterStatus, filterExperience, filterSkills, filterLocation]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };


    const { data, isLoading, error } = useResumes(filters);

    const reloadData = () => {
        setLoading(true);
        queryClient.invalidateQueries({ queryKey: ['resumes'] });
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return (
        <div>
            <header className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Talent Pool</h1>
                        <p className="text-muted-foreground mt-1">Manage and view resumes of candidates in your talent pool.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {!isLoading && !error && !loading && <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={reloadData}><RefreshCcw className="h-4 w-4" /></Button>}
                        {(isLoading || loading) && <StatusIndicator loading={isLoading || loading} />}
                    </div>
                </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-4 2xl:grid-cols-4 mb-8 gap-4">
                <StatCard loading={false} title={"In Pool"} value={data?.length?.toString() ?? ''} icon={DatabaseZap} color="blue" />
                <StatCard loading={false} title={"Hired"} value={`0`} icon={Handshake} color="red" />
                <StatCard loading={false} title={"Total Applied"} value={'0'} icon={FileUser} color="purple" />
                <StatCard loading={false} title={"In Process"} value={`0`} icon={FileUser} color="teal" />
            </div>
            <main>
                <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="relative w-full">
                        <Input type="text" placeholder="Search resumes..." className="pl-10 pr-4 py-2" onChange={handleSearchChange} />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger>
                                {filterStatus === "all" ? <span>Status</span> : <span>{filterStatus === "hired" ? "Hired" : filterStatus === "in_process" ? "In Process" : filterStatus}</span>}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="hired">Hired</SelectItem>
                                <SelectItem value="in_process">In Process</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterExperience || "all"} onValueChange={setFilterExperience}>
                            <SelectTrigger>
                                {
                                    filterExperience === "all" || !filterExperience ? <span>Experience</span> : <span>{filterExperience ? filterExperience + (filterExperience === "1" ? ' Year' : ' Years') : ''}</span>
                                }
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="0-1">0-1 years</SelectItem>
                                <SelectItem value="1-3">1-3 years</SelectItem>
                                <SelectItem value="3-5">3-5 years</SelectItem>
                                <SelectItem value="5-10">5-10 years</SelectItem>
                                <SelectItem value="10-100">10+ years</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterSkills || "all"} onValueChange={setFilterSkills}>
                            <SelectTrigger>
                                {filterSkills === "all" ? <span>Skills</span> : <span>{filterSkills}</span>}
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="javascript">JavaScript</SelectItem>
                                <SelectItem value="react">React</SelectItem>
                                <SelectItem value="node">Node.js</SelectItem>
                                <SelectItem value="python">Python</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterLocation || "all"} onValueChange={setFilterLocation}>
                            <SelectTrigger>
                                <span>Location</span>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="remote">Remote</SelectItem>
                                <SelectItem value="new-york">New York</SelectItem>
                                <SelectItem value="san-francisco">San Francisco</SelectItem>
                                <SelectItem value="london">London</SelectItem>
                                <SelectItem value="bangalore">Bangalore</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                {data?.length === 0 && <div>No resumes found.</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data && data?.map((resume) => (
                        <Card key={resume.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex gap-4 justify-between w-full">
                                    <div>
                                        <CardTitle className="text-lg font-semibold">{resume.name}</CardTitle>
                                        <CardDescription>{resume.job_role}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Send />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Notify</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 pb-2">
                                <div className="space-y-3">
                                    {resume.email && <div className="flex items-center text-sm">
                                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="truncate">{resume.email}</span>
                                    </div>}

                                    {resume.mobile && <div className="flex items-center text-sm">
                                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{resume.mobile}</span>
                                    </div>}

                                    {resume?.skills && <div className="line-clamp-3">
                                        <p className="text-sm font-medium mb-1">Skills:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {resume?.skills?.split(",").slice(0, 8).map((skill, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">{skill.trim()}</Badge>
                                            ))}
                                            {resume?.skills?.split(",").length > 8 && (
                                                <span className="text-sm text-muted-foreground">+{resume.skills.split(",").length - 8} more</span>
                                            )}
                                        </div>
                                    </div>}

                                    {resume.experience !== null && resume.experience !== undefined && (
                                        <div className="flex items-center text-sm">
                                            <span className="text-muted-foreground mr-2">Experience:</span>
                                            <span className="font-medium">{resume.experience} Years</span>
                                        </div>
                                    )}

                                    {resume.education && <div className="flex items-center text-sm">
                                        <span className="text-muted-foreground mr-2">Education:</span>
                                        <span className="font-medium">{resume.education}</span>
                                    </div>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t pt-4">
                                <div className="flex gap-1">
                                    <Link to={`/industry/talent-pool/talent/${resume.user_id}#matches`}>
                                        <Button size="sm" variant="outline">Explore Matches</Button>
                                    </Link>
                                    <a href={resume.path} target="_blank" rel="noopener noreferrer">
                                        <Button size="sm" variant="outline"><Download className="h-4 w-4" /></Button>
                                    </a>
                                    <Link to={`/industry/talent-pool/talent/${resume.user_id}`}>
                                        <Button size="sm" variant="outline"><Eye className="h-4 w-4" /></Button>
                                    </Link>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {resume.status === "hired" ? (
                                        <span className="text-green-800">Hired</span>
                                    ) : resume.status === "verified" ? (
                                        <span className="text-green-500">Verified</span>
                                    ) : resume.status === "processing" ? (
                                        <span className="text-green-500">Verified</span>
                                    ) : ""}
                                </Badge>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default TalentPool;
