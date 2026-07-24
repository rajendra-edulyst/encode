import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Sent from "./partials/Sent";
import Draft from "./partials/Draft";
import CreateQuery from "./partials/CreateQuery";
import { getQueries } from "@/services/learner/QueryService";
import { useQueryStore } from "@/store/learner/queryStore";
import Loading from "@/components/shared/Loading";
import ShowQuery from "./partials/ShowQuery";
import { Alert } from "@/components/ui";

const Mailbox: React.FC = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tab = queryParams.get('tab') || 'sent';

  const { queries, setQueries, loading, setLoading, error, setError } = useQueryStore();

  useEffect(() => {
    setError('');
    setLoading(true);
    getQueries().then((data) => {
      setQueries(data);
    }).catch((error) => {
      setError(error);
    }).finally(() => {
      setLoading(false);
    })
  }, [tab, setQueries, setLoading, setError]);


  if (error) {
    return <Alert title={error} type="danger" />;
  }

  return (
    <div className="flex flex-col h-[80vh] rounded-lg dark:bg-gray-900 bg-white bg-gray-100 dark:text-white text-gray-900">
      {/* Left Sidebar */}
      <div className="dark:bg-gray-800 bg-gray-200 p-4 flex justify-between items-center rounded-t-lg">
        <ul className="flex gap-1">
          {[
            { key: "sent", icon: "📤", label: "Sent" },
            { key: "drafts", icon: "📝", label: "Drafts" },
          ].map((item) => (
            <li key={item.key}>
              <Link to={`/queries?tab=${item.key}`} className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer dark:text-gray-300 text-gray-700 hover:dark:bg-gray-700 hover:bg-gray-300
                ${tab === item.key ? 'dark:bg-gray-700 bg-gray-300' : 'dark:bg-gray-800 bg-gray-200'}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link to={`/queries?tab=new`}>
          <button
            className="bg-primary text-white py-2 px-4 rounded-lg mb-4 font-semibold"
          >
            Create A Query
          </button>
        </Link>
      </div>
      <div className="pb-5 flex-1 overflow-y-auto">
        {
          loading ? (
            <Loading loading={loading} />
          ) : (
            <>
              {tab === 'sent' && <Sent queries={queries} />}
              {tab === 'drafts' && <Draft queries={queries} />}
              {tab === 'new' && <CreateQuery />}
              {tab == 'show' && <ShowQuery />}
            </>
          )
        }
      </div>
    </div>
  );
};

export default Mailbox;

// import React, { useEffect } from "react";
// import {
//   ResizableHandle,
//   ResizablePanel,
//   ResizablePanelGroup,
// } from "@/components/ui/resizable"
// import MailSidebar from "./partials/layouts/Sidebar";
// import Listing from "./partials/Listing";
// import MailContent from "./partials/Cotent";
// import { useQueryStore } from "@/store/learner/queryStore";
// import { getQueries } from "@/services/learner/QueryService";
// import { Alert } from "@/components/ui";

// const Mailbox: React.FC = () => {

//   const { queries, inbox, setInbox, drafts, setDrafts, sent, setSent, setQueries, loading, setLoading, error, setError } = useQueryStore();

//   useEffect(() => {
//     setError('');
//     setLoading(true);
//     getQueries().then((data) => {
//       console.log(data);
//       setQueries(data);
//     }).catch((error) => {
//       setError(error);
//     }).finally(() => {
//       setLoading(false);
//     })
//   }, [setQueries, setLoading, setError]);


//   if (error) {
//     return <Alert title={error} type="danger" />;
//   }

//   return (
//     <ResizablePanelGroup
//       direction="horizontal"
//       className="min-h-[200px] rounded-lg border w-screen"
//     >
//       <ResizablePanel defaultSize={15} minSize={4} maxSize={15}>
//         <MailSidebar />
//       </ResizablePanel>
//       <ResizableHandle withHandle />
//       <ResizablePanel defaultSize={25} minSize={25} maxSize={25}>
//         <Listing />
//       </ResizablePanel>
//       <ResizableHandle withHandle />
//       <ResizablePanel defaultSize={50}>
//         <MailContent />
//       </ResizablePanel>
//     </ResizablePanelGroup>
//   )
// }

// export default Mailbox;