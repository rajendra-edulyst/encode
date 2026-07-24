import React, { useEffect, useState } from 'react'
import { fetchModuleByCourseId } from '@/services/learner/CourseService'
import { useModuleStore } from '@/store/learner/courseStore'
import { Link, useParams } from 'react-router-dom';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';

function CourseModuleShow() {
    const { courseId, moduleId } = useParams<{ courseId: string, moduleId: string }>();
    const { setModule, module, course, setCourse, content, setContent, error, setError, loading, setLoading } = useModuleStore();
    const [expandedContentIndex, setExpandedContentIndex] = useState<number | null>(null);

    useEffect(() => {
        const getModule = () => {

            if (!courseId || !moduleId) {
                setError('Course ID or Module ID is missing');
                return;
            }

            setLoading(true);
            fetchModuleByCourseId(moduleId)
                .then((data) => {
                    setModule(data?.module_details);
                    setCourse(data?.course_details);
                    setContent(data?.contents);
                    console.log(data);
                })
                .catch((error) => {
                    setError(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        getModule();

    }, [courseId, moduleId, setModule, setError, setLoading, setCourse, setContent]);

    if (loading) return <Loading loading={loading} />
    if (error) return <Alert title={error} type="danger" />


    return (
        <div className="container">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <Link to="/" className="hover:text-primary">
                    Home
                </Link>
                <span>›</span>
                <Link to={'/courses/enrolled'} className="hover:text-primary">Courses</Link>
                <span>›</span>
                <Link to={`/courses/${course?.id}`} className="hover:text-primary">
                    {course?.name}
                </Link>
                <span>›</span>
                <span className="font-semibold">{module?.name}</span>
            </nav>
            {/* Module Header */}
            <div className="bg-white p-6 rounded-lg shadow mb-5">
                <span className="text-sm text-gray-600 bg-gray-100 p-1 rounded">{course?.name}</span>
                <h1 className="text-3xl md:text-3xl font-bold mb-2 mt-2">{module?.name}</h1>
                <p className="text-gray-700 mb-2">{module?.description}</p>
                <div>
                    <h2 className="text-xl font-bold mb-2 mt-4">What’s Included</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span className="text-gray-700">{content?.content_counts?.videos} videos</span>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m-6-8h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                            <span className="text-gray-700">{content?.content_counts?.notes} readings</span>
                        </div>
                        <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m-6-8h6M7 4h10a2 2 0 012 2v2H5V6a2 2 0 012-2z"></path>
                            </svg>
                            <span className="text-gray-700">{content?.content_counts?.sessions} Sessions</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Module Contents */}
            <div>
                <h2 className="text-xl font-bold mb-4">Learning Content (Videos & Notes)</h2>
                <div className="bg-white p-6 rounded-lg shadow mb-5">
                    <div className="space-y-4">
                        {
                            Array.isArray(content?.learning_shots) && content?.learning_shots.map((contentItem, index) => (
                                <div key={contentItem.program_content_id} className="border border-gray-200 rounded-lg">
                                    <button
                                        className="w-full px-4 py-3 flex items-center justify-between focus:outline-none"
                                        onClick={() =>
                                            setExpandedContentIndex(expandedContentIndex === index ? null : index)
                                        }
                                    >
                                        <div className="flex items-center space-x-3">
                                            {contentItem.content_type === 'video' && (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 text-red-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            )}
                                            {
                                                contentItem.content_type === 'notes' && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m-6-8h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                    </svg>
                                                )
                                            }
                                            <span className="font-medium">{contentItem.title}</span>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-5 w-5 transform transition-transform ${expandedContentIndex === index ? 'rotate-180' : ''
                                                }`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                    {expandedContentIndex === index && (
                                        <div className="px-4 py-3 border-t border-gray-200">
                                            <p className="text-gray-700 mb-2">{contentItem?.description}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-4">Assignment</h2>
                <div className="bg-white p-6 rounded-lg shadow mb-5">
                    <div className="space-y-4">
                        {
                            Array.isArray(content?.assignments) && content?.assignments.map((contentItem, index) => (
                                <div key={contentItem.program_content_id} className="border border-gray-200 rounded-lg">
                                    <button
                                        className="w-full px-4 py-3 flex items-center justify-between focus:outline-none"
                                        onClick={() =>
                                            setExpandedContentIndex(expandedContentIndex === index ? null : index)
                                        }
                                    >
                                        <div className="flex items-center space-x-3">
                                            {contentItem.content_type === 'video' && (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6 text-red-500"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            )}
                                            {
                                                contentItem.content_type === 'notes' && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m-6-8h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                                    </svg>
                                                )
                                            }
                                            <span className="font-medium">{contentItem.title}</span>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-5 w-5 transform transition-transform ${expandedContentIndex === index ? 'rotate-180' : ''
                                                }`}
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                    {expandedContentIndex === index && (
                                        <div className="px-4 py-3 border-t border-gray-200">
                                            <p className="text-gray-700 mb-2">{contentItem?.description}</p>
                                        </div>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CourseModuleShow