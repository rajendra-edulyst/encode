import React, { FormEvent, useState, useEffect, useCallback } from 'react';


import { useParams } from 'react-router-dom';
import Loading from '@/components/shared/Loading';
import { Alert } from '@/components/ui';
import { FaStar } from 'react-icons/fa';
import { MapPin } from 'lucide-react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { enqueueSnackbar } from 'notistack';
import { useUniversityDetailsStore } from '../../../store/UniversityStore';
import { fetchBrochure } from '../../../services/BrochureLeadService';


const Details: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();

    const { university, setUniversity, error, setError, loading, setLoading } = useUniversityDetailsStore();
    const [tab, setTab] = useState('about');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getUniversity = useCallback(async () => {
        if (!postId) {
            setError('University ID is required');
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await fetchUniversityById(postId);
            setUniversity(response);
        } catch (error) {
            setError('University not found');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [postId, setUniversity, setError, setLoading]);

    useEffect(() => {
        getUniversity();
    }, [getUniversity]);

    const getBrochureLead = useCallback(async (formData: FormData) => {
        try {
            setLoading(true);
            const leadData = {
                name: formData.get('name'),
                email: formData.get('email'),
                mobile: formData.get('mobile'),
                education: formData.get('education'),
                university: formData.get('university'),
                university_sort_name: formData.get('university_sort_name'),
            };
            const brochureLeadData = await fetchBrochure(leadData);
            enqueueSnackbar('Thank you for sharing your details!', { variant: 'success' });
            console.log('fetch brochure lead', brochureLeadData);
        } catch (error) {
            setError('Brochure not found');
            enqueueSnackbar('Brochure not found', { variant: 'error' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [setLoading, setError]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        formData.set('university', university?.name ?? '');
        formData.set('university_sort_name', university?.name.slice(0, 4) ?? '');
        try {
            await getBrochureLead(formData);
            e.currentTarget.reset();
        } catch (error) {
            setMessage('Something went wrong. Please try again.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Loading loading={loading} />;
    if (error) return <Alert type="danger" title={error} showIcon={true} />;

    return (
        <div className="mt-8">
            {postId}
            <div
                style={{
                    backgroundImage: `url('/img/event/event.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '500px',
                }}
                className="flex justify-center items-end absolute h-[500px] w-full left-0 top-0"
            >
                <div className="absolute inset-0 bg-gray-900 opacity-50 dark:opacity-70"></div>
            </div>
            <div className="container mx-auto relative mt-16">
                <div
                    style={{ backgroundImage: `url('${university?.banners?.[0]}')` }}
                    className="w-full h-96 bg-cover bg-center rounded-md relative"
                >
                    <div className="absolute bottom-[-45px] ml-4 w-24 h-24 bg-dark rounded-full border-4 overflow-hidden">
                        <img
                            src={`${university?.logo}`}
                            alt={university?.name}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            </div>
            <div className="rounded-md relative mt-16 px-4">
                <h1 className="text-2xl font-bold dark:text-primary text-primary">
                    {university && university?.name}
                </h1>
                <div className="flex items-center gap-4 mt-2 dark:text-white">
                    <p className="flex gap-1 items-center">
                        <MapPin size={16} /> {university?.city ?? ''}, {university?.state_name ?? ''}, {university?.country_name ?? ''}
                    </p>
                    {university && university?.rating && (
                        <div className="flex gap-2 items-center">
                            <p>Rating {university?.rating}</p> |
                            <ul className="flex gap-1">
                                {Array.from({ length: university.rating }).map((_, index) => (
                                    <li key={'rating' + index}>
                                        <FaStar size={16} className="text-yellow-600" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                {/* <div className="mt-4">
                    <Dialog>
                        <DialogTrigger className="bg-primary dark:text-ac-dark text-ac-dark px-4 py-2 rounded-md">
                            View Brochure
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="mb-5">Get Brochure</DialogTitle>
                                <DialogDescription>
                                    <p className="text-gray-600 mb-4 dark:text-gray-200">
                                        Please fill in your details to download the brochure.
                                    </p>
                                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                placeholder="Name"
                                                className="w-full px-3 py-2 border border-gray-300 dark:text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:dark:ring-primary"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                placeholder="Email"
                                                className="w-full px-3 py-2 border border-gray-300 dark:text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:dark:ring-primary"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="mobile" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">
                                                Mobile
                                            </label>
                                            <input
                                                type="tel"
                                                id="mobile"
                                                name="mobile"
                                                required
                                                pattern="[0-9]{10}"
                                                placeholder="Mobile number"
                                                className="w-full px-3 py-2 border border-gray-300 dark:text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:dark:ring-primary"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="education" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">
                                                Education
                                            </label>
                                            <input
                                                type="text"
                                                id="education"
                                                name="education"
                                                required
                                                placeholder="Highest Qualification"
                                                className="w-full px-3 py-2 border border-gray-300 dark:text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:dark:ring-primary"
                                            />
                                        </div>

                                        <div className="hidden">
                                            <label htmlFor="university" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">
                                                University
                                            </label>
                                            <input
                                                type="text"
                                                id="university"
                                                name="university"
                                                disabled={true}
                                                value={university?.name}
                                                required
                                                placeholder="University Name"
                                                className="w-full px-3 py-2 border border-gray-300 dark:text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:dark:ring-primary"
                                            />
                                        </div>

                                        <div className="hidden">
                                            <label htmlFor="university_sort_name" className="block text-sm dark:text-gray-200 font-medium text-gray-700 mb-1">
                                                University Short Name
                                            </label>
                                            <input
                                                type="text"
                                                id="university_sort_name"
                                                name="university_sort_name"
                                                required
                                                disabled={true}
                                                value={university?.name.slice(0, 4)}
                                                placeholder="University"
                                                className="w-full px-3 py-2 border border-gray-300 dark:text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:dark:ring-primary"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full px-4 py-2 text-ac-dark bg-primary dark:bg-primary rounded-md hover:dark:bg-primary focus:outline-none focus:ring-2 focus:dark:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? 'Submitting...' : 'Submit'}
                                            </button>
                                        </div>
                                    </form>

                                    {message && <div className="mt-4 p-3 bg-blue-50 text-primary rounded-md">{message}</div>}
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div> */}
            </div>
            <div className="rounded-md relative px-4">
                <div className="mt-4">
                    <div className="container mx-auto">
                        <div className="flex gap-5 border-b">
                            {
                                ['about', 'why', 'admission', 'Programs'].map((item, index) => (
                                    <button
                                        key={index}
                                        className={`text-primary capitalize font-bold py-3 ${tab === item && 'border-b-2 border-primary'}`}
                                        onClick={() => setTab(item)}
                                    >
                                        {item === 'why' && `Why We`}
                                        {item !== 'why' && item}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="container mx-auto mt-4">
                    {tab === 'about' && (
                        <div>
                            <h1 className="text-xl font-bold dark:text-primary text-primary">
                                <span className="relative before:content-[''] before:absolute before:h-1 before:bg-primary before:w-full before:bottom-[-5px]">
                                    About
                                </span>{' '}
                                {university?.name}
                            </h1>
                            <div className="mt-4" dangerouslySetInnerHTML={{ __html: university?.about ?? '' }}></div>
                        </div>
                    )}
                    {tab === 'why' && (
                        <div>
                            <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-md" dangerouslySetInnerHTML={{ __html: university?.why_this_university ?? '' }}></div>
                        </div>
                    )}
                    {tab === 'admission' && (
                        <div>
                            <div className="text-sm dark:text-gray-200 custom-html-container" dangerouslySetInnerHTML={{ __html: university?.admission ?? '' }}></div>
                        </div>
                    )}
                    {/* {tab === 'placements' && (
                        <div>
                            <h1 className="text-xl font-bold dark:text-primary text-primary">
                                <span className="relative before:content-[''] before:absolute before:h-1 before:bg-primary before:w-full before:bottom-[-5px]">
                                    Placements
                                </span>{' '}
                                {university?.name}
                            </h1>
                            <div className="mt-4" dangerouslySetInnerHTML={{ __html: university?.placements ?? '' }}></div>
                        </div>
                    )} */}
                    {tab === 'Programs' && (
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <Courses universityId={university?.id} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Details;
function fetchUniversityById(postId: string) {
    throw new Error('Function not implemented.');
}

