import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import {
    fetchMyCompetitionLeaderboard,
    fetchLeaderboard,
    fecthMyScoreContentDetail,

} from '@/services/learner/ScoreboardService'
import { LeaderboardUser, learnerCompetitionDetail } from '@/@types/learner/leaderboard'
import { preAssignedCourses } from '@/services/learner/CourseService'
import { PreAssignCourse } from '@/@types/learner/Courses'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/auth'

const LeaderboardPage = () => {
    const [myleaderboard, setMyLeaderboard] = useState<LeaderboardUser>({} as LeaderboardUser)
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
    const [content, setContent] = useState<learnerCompetitionDetail[]>([])
    const [myrank, setMyRank] = useState<number>(0)
    const [programs, setPrograms] = useState<PreAssignCourse[]>()
    const [subject, setSubject] = useState<string>('all')

    const [search, setSearch] = useState<string>('')
    const [page, setPage] = useState<number>(1)
    const pageSize = 8

    const { user } = useAuth()

    // Filter and paginate content
    const filteredContent = content.filter(item =>
        item?.title?.toLowerCase().includes(search.toLowerCase()) ||
        item?.content_type?.toLowerCase().includes(search.toLowerCase())
    )

    const paginatedContent = filteredContent.slice((page - 1) * pageSize, page * pageSize)
    const totalPages = Math.ceil(filteredContent.length / pageSize)

    useEffect(() => {
        fetchMyCompetitionLeaderboard().then((data) => {
            if (data) setMyLeaderboard(data)
        })
        fetchLeaderboard().then((data) => {
            if (data) {
                setLeaderboard(data)
            }
        })
    }, [])

    useEffect(() => {
        fecthMyScoreContentDetail(subject).then((data) => {
            if (data) setContent(data)
        })
    }, [subject])

    const getfillterData = async () => {
        const data = await preAssignedCourses()
        if (data) {
            setPrograms(data)
        }

    }

    useEffect(
        () => {
            getfillterData()

        }, [])

    useEffect(() => {
        if (leaderboard.length > 0 && myleaderboard?.user_id) {
            const index = leaderboard.findIndex(
                (user) => user.user_id === myleaderboard.user_id
            )
            if (index !== -1) {
                setMyRank(index + 1)
            } else {
                setMyRank(0) // Not ranked
            }
        }
    }, [leaderboard, myleaderboard])

    return (
        <div className="space-y-6">
            {/* Filters */}


            <div className="grid gap-6 md:grid-cols-3">
                {/* Left side - Activity Table */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Summary</CardTitle>
                        </CardHeader>
                        <CardContent>




                            <div className="flex w-full mb-4 justify-between items-center gap-4">

                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="Search activity..."
                                        value={search}
                                        className="w-full bg-transparent !py-1 border border-gray-200"
                                        onChange={e => {
                                            setSearch(e.target.value)
                                            setPage(1)
                                        }}
                                    />
                                </div>
                                <Select onValueChange={(value) => setSubject((value))}>
                                    <SelectTrigger className="w-full sm:w-[180px]">
                                        <SelectValue placeholder="Select Subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {programs?.map((subject) => (
                                            <SelectItem key={subject.id} value={`${subject.id}`}>
                                                {subject.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>


                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Activity Name</TableHead>
                                        <TableHead>Type of Activity</TableHead>
                                        <TableHead>Max Credit</TableHead>
                                        <TableHead>Credit Earned</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedContent.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item?.title}</TableCell>
                                            <TableCell className='capitalize'>{item?.content_type}</TableCell>
                                            <TableCell>{item?.total_g_score || "Not defined"}</TableCell>
                                            <TableCell>
                                                {item?.user_g_score === null ? 0 : item?.user_g_score || 0}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {paginatedContent.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground">
                                                No activities found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <div className="flex justify-between items-center mt-4">
                                <Button
                                    variant="default"
                                    size="sm"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm">
                                    Page {page} of {totalPages || 1}
                                </span>
                                <Button
                                    variant="default"
                                    size="sm"
                                    disabled={page === totalPages || totalPages === 0}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right side - User Rank + Leaderboard */}
                <div className="space-y-6">
                    {/* User Rank */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Rank</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <div className="w-16 h-16 flex items-center justify-center">
                                <img
                                    className='w-full h-full object-cover rounded-full'
                                    src={user?.profile_image || 'https://via.placeholder.com/150'}
                                    alt={myleaderboard.name || 'User'}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">{myleaderboard.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Rank: {myrank > 0 ? `#${myrank}` : 'Not ranked'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Score: {myleaderboard.g_score}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Leaderboard */}
                    <Card className="max-h-[500px] overflow-y-auto">
                        <CardHeader>
                            <CardTitle>Leaderboard</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 px-4 pb-4">
                            {leaderboard.map((user, idx) => (

                                <div
                                    key={user.user_id}
                                    className={`flex items-center justify-between rounded-md px-4 py-3 shadow-sm ${idx + 1 === myrank ? 'bg-green-100' : 'bg-muted'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 flex items-center justify-center">
                                            <img
                                                className='w-full h-full object-cover rounded-full'
                                                // src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                                                src={user.profile_image || 'https://via.placeholder.com/150'}
                                                alt={user.name}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Score: {user.g_score}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm font-bold text-foreground">#{idx + 1}</div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default LeaderboardPage
