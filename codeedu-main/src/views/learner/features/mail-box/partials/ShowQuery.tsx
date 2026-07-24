import { useLocation } from "react-router-dom";
import { Query } from "@/@types/learner/mailbox";

const ShowQuery = () => {
    const location = useLocation();
    const { query } = location.state as { query: Query };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold dark:text-darkPrimary text-lightPrimary capitalize">
                {query.title}
            </h1>
            <p className="text-gray-400 text-sm mt-3">
                {query.description}
            </p>

            {/* attachment */}

            {
                query?.attachment && (
                    <div className="mt-4">
                        <h6 className="text-lg font-semibold dark:text-darkPrimary text-lightPrimary">Attachment</h6>
                        <img src={query?.attachment} alt="attachment" className="mt-2 w-96 rounded" />
                    </div>
                )
            }
        </div>
    );
};

export default ShowQuery;
