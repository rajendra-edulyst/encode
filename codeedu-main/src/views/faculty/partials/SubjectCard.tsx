import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { AssignedProgram } from '@/@types/faculty/program';
import { Button } from '@/components/ui/ShadcnButton';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';


interface SubjectCardProps {
    subject: AssignedProgram
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
    return (
        <Card className="gap-0 bg-[#5A5A5A]">
            <CardHeader className='gap-0 pb-1'>
                <h2 className="text-lg mt-0 text-primary">
                    <Link to={`/subjects/${subject.id}`} className='flex gap-2 items-center'>
                        {subject?.name}
                    </Link>
                </h2>

            </CardHeader>
            <CardContent className='min-h-20 mt-1'>
                <div>
                    <div className="flex items-center gap-2">
                        <ChevronRight className="text-gray-500 dark:text-white" size={16} />
                        <p className="text-sm text-gray-500 dark:text-white mb-0">Batch Name - {subject?.batch_names ?? 'N/A'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ChevronRight className="text-gray-500 dark:text-white" size={16} />
                        <p className="text-sm text-gray-500 dark:text-white mb-0">Course Name - {subject?.course_name ?? 'N/A'}</p>
                    </div>
                    {subject?.start_date && <div className="flex items-center gap-2">
                        <ChevronRight className="text-gray-500 dark:text-white" size={16} />
                        <p className="text-sm text-gray-500 dark:text-white mb-0">Duration - {new Date(subject?.start_date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: '2-digit',
                            year: 'numeric',
                        })} to {new Date(subject?.end_date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: '2-digit',
                            year: 'numeric',
                        })}</p>
                    </div>
                    }
                </div>
            </CardContent>
            <CardFooter className='border-t p-3 flex justify-end gap-2'>
                <Button asChild className="text-white" size="sm">
                    <Link to={`/courses/${subject.id}`} className='flex gap-2 items-center'>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default SubjectCard