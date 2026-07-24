import LoadingSection from '@/components/LoadingSection';
import { Button } from '@/components/ui/ShadcnButton'
import { useContinueReadingCourses } from '@/hooks/data/create/useCourses';
import { Lock } from 'lucide-react'
import React from 'react'

interface LockContentProps {
    content_id?: number;
}

const LockContent: React.FC<LockContentProps> = ({ content_id }) => {

    if (!content_id) return null;

    const { data: continueReadingCourses, isLoading } = useContinueReadingCourses(content_id);

    console.log('continueReadingCourses', continueReadingCourses);

    return (
        <div className="rounded-lg overflow-hidden flex justify-center items-center mb-6 bg-gray-100 h-[450px] border">
            {
                !isLoading && <div className="text-center">
                    <div>
                        <Lock className="mx-auto mb-4 text-gray-400" size={48} />
                        <h2 className="text-xl font-semibold mb-4 text-cblack">Content Locked</h2>
                        <p className="text-gray-600">This content is locked. Please complete the previous {continueReadingCourses?.title} content to unlock it.</p>
                    </div>
                    <Button className="mt-4 text-white">Continue to Previous Content</Button>
                </div>
            }
            <LoadingSection isLoading={isLoading} title='Continue Content' />
        </div>
    )
}

export default LockContent