import { Query } from "@/@types/learner/mailbox";
import { useNavigate } from "react-router-dom";

type SentsProps = {
    queries: Query[]
}

const Draft = ({ queries }: SentsProps) => {
    const navigate = useNavigate();

    const handleQueryClick = (query: Query) => {
        navigate('/queries?tab=show', { state: { query } });
    };

    return (
        <>
            <header className="p-4 sticky top-0 bg-white dark:bg-gray-900">
                <h1 className="text-3xl font-bold dark:text-darkPrimary text-lightPrimary capitalize">
                    Draft Queries
                </h1>
            </header>
            <main className="flex-1 px-4 overflow-y-auto">
                <div className="dark:bg-gray-800 rounded-lg shadow-lg">
                    {
                        Array.isArray(queries) ? (
                            queries.map((query, index) => (
                                query.type == '0' && (
                                    <div
                                        key={`inbox-${index}`}
                                        className="flex bg-gray-200 dark:bg-gray-800 rounded-lg justify-between items-center p-4 border-b border-gray-700 last:border-b-0 hover:dark:bg-gray-700 hover:bg-gray-300 transition cursor-pointer"
                                        onClick={() => handleQueryClick(query)}
                                    >
                                        <div>
                                            <p className="font-semibold">{query.title}</p>
                                            <p className="text-gray-400 text-sm">
                                                {
                                                    query.description.length > 100
                                                        ? query.description.slice(0, 100) + '...'
                                                        : query.description
                                                }
                                            </p>
                                        </div>
                                        {/* Time */}
                                        <div className="text-gray-400 text-sm">

                                        </div>
                                    </div>
                                )
                            ))
                        ) : (
                            <div
                                className="flex justify-between items-center p-4 border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition cursor-pointer"
                            >
                                Not Found
                            </div>
                        )
                    }
                </div>
            </main>
        </>
    )
}

export default Draft;