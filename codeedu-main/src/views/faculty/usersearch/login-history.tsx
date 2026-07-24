import { SearchUser } from '@/@types/faculty/userSearch'
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import StatusIndicator from '@/components/StatusIndicator'
import { useSearchUserLoginHistoryStore } from '@/store/faculty/SearchUserStore'

interface UserLoginHistoryProps {
    user: SearchUser
}

const LoginHistory: React.FC<UserLoginHistoryProps> = ({ user }) => {

    const { fetchLoginHistory, loginHistory, loading, error } = useSearchUserLoginHistoryStore();

    React.useEffect(() => {
        if (user) {
            fetchLoginHistory(user.id);
        }
    }, [user, fetchLoginHistory]);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between border-b pb-2">
                <div>
                    <h2 className="text-lg font-bold">User Login History</h2>
                    <p className="text-sm text-gray-500">Here you can view user login history.</p>
                </div>
                <StatusIndicator loading={loading} error={error} />
            </div>
            <div className="mt-4">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead>#</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date & Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            loginHistory?.length > 0 ? (
                                loginHistory.map((history, index) => (
                                    <TableRow key={index} className="border-b">
                                        <TableCell className="p-4">{index + 1}</TableCell>
                                        <TableCell className="p-4">{history.activity_type || 'N/A'}</TableCell>
                                        <TableCell className="p-4">{new Date(history.activity_time).toLocaleString() || 'N/A'}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="p-4 text-center text-gray-500">
                                        No assignments found
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default LoginHistory