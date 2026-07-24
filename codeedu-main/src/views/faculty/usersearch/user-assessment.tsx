import { SearchUser } from '@/@types/faculty/userSearch'
import StatusIndicator from '@/components/StatusIndicator';
import { Button } from '@/components/ui/ShadcnButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSearchUserAssessmentStore } from '@/store/faculty/SearchUserStore';
import { Eye } from 'lucide-react';
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';

interface UserAssessmentProps {
    user: SearchUser
}

const UserAssessment = ({ user }: UserAssessmentProps) => {
    const { fetchAssessments, assessments, loading, error } = useSearchUserAssessmentStore();

    useEffect(() => {
        if (user?.id) {
            fetchAssessments(user.id);
        }
    }, [user?.id, fetchAssessments]);

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
                            assessments?.length > 0 ? (
                                assessments.map((assessment, index) => (
                                    <TableRow key={index} className="border-b">
                                        <TableCell className="p-4">{index + 1}</TableCell>
                                        <TableCell className="p-4">{assessment.program_name || 'N/A'}</TableCell>
                                        <TableCell className="p-4">{assessment.module_name || 'N/A'}</TableCell>
                                        <TableCell className="p-4">{assessment.title || 'N/A'}</TableCell>
                                        <TableCell className="p-4">{assessment.attempt_count ?? 0}</TableCell>
                                        <TableCell className="p-4">
                                            <Link to={`/assessments/${assessment.content_id}`}>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                aria-label={`View assessment ${assessment.title || 'details'}`}
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

export default UserAssessment