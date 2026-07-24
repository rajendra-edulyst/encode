import { BsCalendar } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { usejobs } from '../../../@hooks/usePost';


const jobs = () => {

    const { data: jobs = [] } = usejobs();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };



    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border glowConnectCard">
            <div className="flex items-center mb-4">
                <h2 className="text-lg font-semibold text-cblack mr-2">Grab the</h2>
                <h2 className="text-2xl font-bold text-cpink">Opportunity</h2>
            </div>

            <div className="space-y-4">
                {jobs.slice(0, 3).map((job) => (
                    <Link key={job.id} to={`/internship/${job.id}`}>
                    <div
                        key={job.id}
                        className="flex items-start gap-4 border-b pb-4 last:border-none"
                    >
                        <img
                            src={`https://ui-avatars.com/api/?name=${job?.name}&background=random`}
                            alt={`${job?.name} logo`}
                            className="w-14 h-14 rounded-lg object-cover border"
                        />
                        <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">{job?.name}</h3>
                            <p className="text-sm text-gray-500 mb-1">{job?.location || 'Unknown'}</p>
                            <div className="flex items-center text-sm text-gray-500 gap-2">
                                <BsCalendar className="text-base" />
                                <span>{formatDate(job?.start_date)}</span>
                            </div>
                        </div>
                    </div>
                    </Link>
                ))}

                <div className="text-right">
                    <Link
                        to="/opportunities"
                        className="text-blue-500 text-sm font-medium hover:underline"
                    >
                        View All
                    </Link>
                </div>
            </div>
        </div>

    )
}

export default jobs