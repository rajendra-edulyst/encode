import React, { useState } from 'react'

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from '@/components/ui/ShadcnButton';
import { type Activity as ExperienceActivity } from '@/@types/learner/portfolio';
import { Trash } from 'lucide-react';
import AddExperience from './add';

export interface ExperienceProps {
    experiences: ExperienceActivity[];
    fetchUserPortfolio: () => void;
    deleteActivityHandler: (id?: number) => void;
}

const Experiences = ({ experiences = [], fetchUserPortfolio, deleteActivityHandler }: ExperienceProps) => {
    const [showExperienceDialog, setShowExperienceDialog] = useState<boolean>(false);
    return (
        <>
            <Card>
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <h2 className='text-lg font-semibold'>Experience</h2>
                        <Button className='text-white' variant='default' onClick={() => setShowExperienceDialog(true)}>Add</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        {
                            experiences?.map((experience, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <div className='flex justify-between items-center'>
                                            <div className='flex items-center'>
                                                <img src={`https://ui-avatars.com/api/?name=${experience.title}&background=random`} alt={experience.title} className='w-12 h-12 object-cover rounded-full' />
                                                <div className='ml-3'>
                                                    <h6>{experience.title}</h6>
                                                    <p>{experience.institute}</p>
                                                </div>
                                            </div>
                                            <Button variant='destructive' onClick={() => deleteActivityHandler(experience?.id)}>
                                                <Trash />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{experience.description}</p>
                                        <p className='text-gray-400'>{experience.start_date} - {experience.end_date || 'Present'}</p>
                                    </CardContent>
                                </Card>
                            ))
                        }
                        {
                            experiences?.length === 0 && <p>No experience found</p>
                        }
                    </div>
                </CardContent>
            </Card>
            <AddExperience show={showExperienceDialog} onClose={setShowExperienceDialog} onSuccess={fetchUserPortfolio} />
        </>
    )
}

export default Experiences