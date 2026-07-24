import React, { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { fetchAssessmentInsruction } from '@/services/learner/AssesmentService'
import { AssessmentInstruction } from '@/@types/learner/assessment'
import { Button } from '@/components/ui/ShadcnButton'

interface AssessmentDetailsProps {
    show: boolean
    onClose: (value: boolean) => void
    assessment_id: string
}

const AssessmentDetails: React.FC<AssessmentDetailsProps> = ({ show, onClose, assessment_id }) => {

    const [assessmentInstruction, setAssessmentInstruction] = React.useState<AssessmentInstruction | null>(null);

    useEffect(() => {
        fetchAssessmentInsruction(assessment_id).then((data) => {
            setAssessmentInstruction(data);
        }).catch((error) => {
            console.log(error)
        });
    }, [assessment_id]);

    return (
        <Dialog open={show} onOpenChange={() => onClose(false)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>

                    </DialogDescription>
                </DialogHeader>
                <div className='border-b pb-5'>
                    <h5 className='mb-2'>Instructions</h5>
                    {
                        assessmentInstruction?.statement.map((instruction, index) => {
                            return <p key={index} className='text-xs'
                                dangerouslySetInnerHTML={{ __html: instruction }}
                            />
                        })
                    }
                </div>
                <DialogFooter>
                    <Button className='text-white' onClick={() => onClose(false)}>Start Assessment</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default AssessmentDetails