import { SearchUser } from '@/@types/faculty/userSearch'
import StatusIndicator from '@/components/StatusIndicator';
import { Button } from '@/components/ui/ShadcnButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSearchUserAssignmentStore } from '@/store/faculty/SearchUserStore';
import { Eye } from 'lucide-react';
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';

interface UserAssignmentsProps {
    user: SearchUser
}

const UserAssignments = ({ user }: UserAssignmentsProps) => {
    const { fetchAssignments, assignments, loading, error } = useSearchUserAssignmentStore();

    useEffect(() => {
        if (user?.id) {
            fetchAssignments(user.id);
        }
    }, [user?.id, fetchAssignments]);

    return (
        <div className="p-4">
            <div className="flex items-center justify-between border-b pb-2">
                <div>
                    <h2 className="text-lg font-bold">User Assignment</h2>
                    <p className="text-sm text-gray-500">Here you can view user assignments.</p>
                </div>
                <StatusIndicator loading={loading} error={error} />
            </div>
            <div className="mt-4">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead>#</TableHead>
                            <TableHead>Program Name</TableHead>
                            <TableHead>Module Name</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Attempts</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            assignments?.length > 0 ? (
                                assignments.map((assignment, index) => (
                                    <TableRow key={index} className="border-b">
                                        <TableCell className="p-4">{index + 1}</TableCell>
                                        <TableCell className="p-4">{assignment.program_name || 'N/A'}</TableCell>
                                        <TableCell className="p-4">{assignment.module_name || 'N/A'}</TableCell>
                                        <TableCell className="p-4">{assignment.title || 'N/A'}</TableCell>
                                        <TableCell className="p-4">{assignment.total_attempts ?? 0}</TableCell>
                                        <TableCell className="p-4">
                                            <Link to={`/assignments/${assignment.content_id}`}>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    aria-label={`View assignment ${assignment.title || 'details'}`}
                                                >
                                                    <Eye />
                                                </Button>
                                            </Link>
                                        </TableCell>
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

export default UserAssignments