import StatusIndicator from "@/components/StatusIndicator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenu } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/shadcnAvatar";
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from "@/components/ui/ShadcnInput";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSessionUsersStore } from "@/store/faculty/SessionStore";
import { Cog, FileDown, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as echarts from "echarts";
import { Checkbox } from "@/components/ui/checkbox";
import exportToExcel from "@/utils/excelExport";

/** Converts API duration (seconds as string or number) to HH:mm:ss */
function formatDurationSecondsToHms(
    value: string | number | null | undefined,
): string {
    if (value === null || value === undefined || value === "") return "-";
    const n = typeof value === "string" ? parseInt(value, 10) : value;
    if (!Number.isFinite(n) || n < 0) return "-";
    const h = Math.floor(n / 3600);
    const m = Math.floor((n % 3600) / 60);
    const s = n % 60;
    const pad = (x: number) => String(x).padStart(2, "0");
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/** Formats API datetime string (e.g. "2026-04-06 14:05:07") to HH:mm:ss (24h) */
function formatJoinLeaveToHms(value: string | null | undefined): string {
    if (!value) return "-";
    const d = new Date(value.includes("T") ? value : value.replace(" ", "T"));
    if (Number.isNaN(d.getTime())) return "-";
    const pad = (x: number) => String(x).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

interface AttendanceProps {
    sessionId: number;
}

const Attendance: React.FC<AttendanceProps> = ({ sessionId }) => {


    const { users, error, loading, session, fetchSessionUsers, changeAttendanceStatus, bulkChangeAttendanceStatus } = useSessionUsersStore();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);




    useEffect(() => {
        if (!sessionId) {
            toast.error("Something went wrong, Please try again later.");
            return;
        }
        fetchSessionUsers(sessionId)
    }, [fetchSessionUsers, sessionId]);

    const totalLearners = users?.length || 0;
    const attendedCount = users?.filter((learner) => learner.status === "attended").length || 0;
    const absentCount = users?.filter((learner) => learner.status === "absent").length || 0;
    const invitedCount = users?.filter((learner) => learner.status === "Invited").length || 0;
    const attendancePercentage = totalLearners > 0 ? Math.round((attendedCount / totalLearners) * 100) : 0;
    const lastSyncTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    useEffect(() => {
        const chartDom = document.getElementById("attendance-chart");
        if (chartDom) {
            // eslint-disable-next-line import/namespace
            const myChart = echarts.init(chartDom);
            const attendedCount = users.filter(
                (learner) => learner.status === "attended",
            ).length;
            const absentCount = users.filter(
                (learner) => learner.status === "absent",
            ).length;
            const invitedCount = users.filter(
                (learner) => learner.status === "Invited",
            ).length;
            const chartData =
                totalLearners === 0
                    ? [
                        {
                            value: 0,
                            name: "Absent",
                            itemStyle: { color: "#ef4444" },
                        },
                    ]
                    : [
                        {
                            value: attendedCount,
                            name: "Attended",
                            itemStyle: { color: "#10b981" },
                        },
                        {
                            value: absentCount,
                            name: "Absent",
                            itemStyle: { color: "#ef4444" },
                        },
                        {
                            value: invitedCount,
                            name: "Invited",
                            itemStyle: { color: "#3b82f6" },
                        },
                    ];
            const option = {
                animation: true,
                tooltip: {
                    trigger: "item",
                },
                legend: {
                    top: "5%",
                    left: "left",
                },
                series: [
                    {
                        name: "Attendance Status",
                        type: "pie",
                        radius: ["40%", "70%"],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: "#fff",
                            borderWidth: 2,
                        },
                        label: {
                            show: false,
                            position: "center",
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 16,
                                fontWeight: "bold",
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: chartData,
                    },
                ],
            };
            option && myChart.setOption(option);
            return () => {
                myChart.dispose();
            };
        }
    }, [users, totalLearners]);


    const handleExport = () => {
        const isAllSelected = selectedUsers.length === 0;

        const filteredUsers = isAllSelected
            ? users
            : users.filter(user => selectedUsers.includes(user.user_id));

        const data = filteredUsers.map((user, index) => ({
            "#": index + 1,
            "User Id": user.user_id,
            "Name": user.name,
            "Email": user.email,
            "Join Time": formatJoinLeaveToHms(user.join_time ?? null),
            "Leave Time": formatJoinLeaveToHms(user.leave_time ?? null),
            "Duration": formatDurationSecondsToHms(user.duration),
            "Status": user.status,
        }));

        const date = new Date().toLocaleDateString().replace(/\//g, '-'); // for safe filenames
        const fileName = `Attendance_${session?.title || 'Session'}_${date}`;

        exportToExcel(data, fileName);
        toast.success("Excel exported successfully");
    };

    // filter learners based on search and filters
    const filteredLearners = users.filter((learner) => {
        const matchesSearch = learner.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const selectAllUsers = (checked: boolean) => {
        if (checked) {
            setSelectedUsers(users.map((user) => user.user_id));
        } else {
            setSelectedUsers([]);
        }
    }

    const selectUser = (userId: number) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers((prev) => prev.filter((id) => id !== userId));
        } else {
            setSelectedUsers((prev) => [...prev, userId]);
        }
    }

    const updateStatusForSelectedUsers = (status: 'attended' | 'absent' | 'Invited') => {
        if (selectedUsers.length === 0) {
            toast.error("Please select at least one learner.");
            return;
        }
        changeAttendanceStatus(selectedUsers, status);
        setSelectedUsers([]);
    }

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-3">
                        <div className='relative'>
                            <Input type="text" placeholder="Search ..." className='pl-8' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" size={16} />
                        </div>
                        <div className="flex gap-4 justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="!rounded-button whitespace-nowrap"
                                    >
                                        <FileDown /> Export
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={handleExport}
                                    >
                                        Export as Excel {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ""}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="!rounded-button whitespace-nowrap"
                                    >
                                        <Cog /> Bulk Actions
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => bulkChangeAttendanceStatus("attended")}
                                    >
                                        Mark All Present
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => bulkChangeAttendanceStatus("absent")}
                                    >
                                        Mark All Absent
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onClick={() => bulkChangeAttendanceStatus("Invited")}
                                    >
                                        Reset All
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <StatusIndicator error={error} loading={loading} loadingMessage={"Syncing Live Sessions Data"} />
                        </div>
                    </div>
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="overflow-hidden">
                                        {selectedUsers && selectedUsers.length > 0 && <TableRow>
                                            <TableHead colSpan={4} className="bg-gray-100 rounded-tl-lg rounded-tr-lg">
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-sm font-medium">Selected {selectedUsers.length} Learners</span>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm" onClick={() => updateStatusForSelectedUsers("attended")}>Mark Present</Button>
                                                        <Button variant="outline" size="sm" onClick={() => updateStatusForSelectedUsers("absent")}>Mark Absent</Button>
                                                        <Button variant="outline" size="sm" onClick={() => updateStatusForSelectedUsers("Invited")}>Reset</Button>
                                                    </div>
                                                </div>
                                            </TableHead>
                                        </TableRow>}
                                        <TableRow className="dark:bg-gray-700">
                                            <TableHead className="w-[50px] rounded-tl-lg rounded-tr-lg">
                                                <Checkbox
                                                    checked={selectedUsers.length === users.length}
                                                    className="!text-white"
                                                    onCheckedChange={(checked) => selectAllUsers(checked as boolean)}
                                                />
                                            </TableHead>
                                            <TableHead>#</TableHead>
                                            <TableHead className="w-[250px]">Learner</TableHead>
                                            <TableHead className="text-center">Join Time</TableHead>
                                            <TableHead className="text-center">Leave Time</TableHead>
                                            <TableHead className="text-center">Duration</TableHead>
                                            <TableHead className="text-center">Status</TableHead>

                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredLearners?.map((learner, index) => (
                                            <TableRow
                                                key={learner.user_id}
                                                className="dark:hover:bg-gray-700"
                                            >
                                                <TableCell className="w-[50px]">
                                                    <Checkbox
                                                        checked={selectedUsers.includes(learner.user_id)}
                                                        className="!text-white"
                                                        onCheckedChange={() => selectUser(learner.user_id)}
                                                    />
                                                </TableCell>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage
                                                                src={learner.profile_image}
                                                                alt={learner.name}
                                                            />
                                                            <AvatarFallback>
                                                                {learner.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span>{learner.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">{formatJoinLeaveToHms(learner?.join_time ?? null)}</TableCell>
                                                <TableCell className="text-center">{formatJoinLeaveToHms(learner?.leave_time ?? null)}</TableCell>
                                                <TableCell className="text-center">{formatDurationSecondsToHms(learner?.duration)}</TableCell>
                                                <TableCell className="text-center flex gap-3 justify-center">
                                                    <Button variant="outline" size="sm" className={`rounded-full ${learner.status === "attended" ? "bg-green-100 text-green-800 border-green-900" : ""}`} onClick={() => changeAttendanceStatus([learner.user_id], "attended")} >Present</Button>
                                                    <Button variant="outline" size="sm" className={`rounded-full ${learner.status === "absent" ? "bg-red-100 text-red-800 border-red-900" : ""}`} onClick={() => changeAttendanceStatus([learner.user_id], "absent")} >Absent</Button>
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Attendance Summary
                            </h2>
                            <div className="h-[250px]">
                                <div id="attendance-chart" className="h-[250px]"></div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col justify-between items-center">
                                        <p className="text-lg">{users?.length}</p>
                                        <span className="text-gray-600">Learners</span>
                                    </div>
                                    <div className="flex flex-col justify-between items-center">
                                        <p className="text-lg text-green-500 font-bold">{attendedCount}<span className="text-xs font-normal">({totalLearners === 0 ? 0 : Math.round((attendedCount / users?.length) * 100)}%)</span></p>
                                        <span className="text-gray-600">Attended</span>
                                    </div>
                                    <div className="flex flex-col justify-between items-center">
                                        <p className="text-lg text-red-500 font-bold">{absentCount}<span className="text-xs font-normal">({totalLearners === 0 ? 0 : Math.round((absentCount / totalLearners) * 100)}%)</span></p>
                                        <span className="text-gray-600">Absent</span>
                                    </div>
                                    <div className="flex flex-col justify-between items-center">
                                        <p className="text-lg text-blue-400 font-bold">{invitedCount}<span className="text-xs font-normal">({totalLearners === 0 ? 0 : Math.round((invitedCount / totalLearners) * 100)}%)</span></p>
                                        <span className="text-gray-600">Invited</span>
                                    </div>
                                </div>
                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Attendance Rate:</span>
                                        <div className="text-2xl font-bold text-blue-600">
                                            {attendancePercentage}%
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 flex items-center justify-between">
                                    <span>Last synced: {lastSyncTime}</span>
                                    <Badge
                                        variant="outline"
                                        className={loading ? "animate-pulse bg-blue-50" : ""}
                                    >
                                        {loading ? "Syncing..." : "Synced"}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Attendance;