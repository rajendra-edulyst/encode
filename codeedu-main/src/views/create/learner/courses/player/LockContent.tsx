import LoadingSection from '@/components/LoadingSection';
import { Button } from '@/components/ui/ShadcnButton'
import { useContinueReadingCourses } from '@/hooks/data/create/useCourses';
import { Lock } from 'lucide-react'
import React from 'react'
import { Link, useParams, useLocation } from 'react-router-dom';

interface LockContentProps {
    content_id?: number;
}

const LockContent: React.FC<LockContentProps> = ({ content_id }) => {

    const { courseId } = useParams<{ courseId: string }>();
    const location = useLocation();
    const courseSource = (location.state as any)?.courseSource || 'explore';

    const playerBasePath = courseSource === 'my-courses' ? '/my-courses' :
                           courseSource === 'recommended' ? '/recommended-courses' :
                           courseSource === 'preparatory' ? '/preparatory-courses' :
                           courseSource === 'explore' ? '/explore-courses' : '/courses';

    if (!content_id) return null;

    const { data: continueReadingCourseData, isLoading } = useContinueReadingCourses(content_id);

    const jumpTo = continueReadingCourseData?.jump_to;

    return (
        <div className="rounded-lg overflow-hidden flex justify-center items-center mb-6 bg-gray-100 dark:bg-black h-[450px] border">
            {
                !isLoading && <div className="text-center">
                    <div>
                        <Lock className="mx-auto mb-4 text-gray-400 dark:text-white" size={48} />
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">Content Locked</h2>
                        <p className="text-gray-600 dark:text-white">This content is locked. Please complete the previous <span className='font-bold'>{jumpTo?.title}</span> content to unlock it.</p>
                    </div>
                    {
                        (jumpTo?.module_id && jumpTo?.id) && <Button className="mt-4 text-white">
                            <Link to={`${playerBasePath}/${courseId}/modules/${jumpTo?.module_id}?content_id=${jumpTo?.id}${jumpTo?.title ? `&contentname=${jumpTo.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : ''}`} className='dark:text-white' state={{ courseSource }}>
                                Continue to Previous Content
                            </Link>
                        </Button>
                    }
                </div>
            }
            <LoadingSection isLoading={isLoading} title='Continue Content' className='w-full' />
        </div>
    )
}

export default LockContent