'use client';

import {
  useEffect,
  useState,
  useCallback,
} from 'react';

import { getQueries, getDraftQueries, sendDraftQuery, deleteQuery } from '@/services/learner/QueryService';
import { useQueryStore } from '@/store/learner/queryStore';
import { Query, QueryResponse } from '@/@types/learner/mailbox';
import QueryTable from './QueryTable';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';




const LearnerUserQueries = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'my' | 'draft'>('my');

  const { setQueries: setQueryList } = useQueryStore();

  const fetchQueries = useCallback(
    async (tab: 'my' | 'draft', currentPage: number = 1) => {
      setLoading(true);

      let res: QueryResponse = {
        data: [],
        paginate: {
          total: 0,
          count: 0,
          per_page: 0,
          current_page: 1,
          total_pages: 1,
          next_page_url: null,
          prev_page_url: null,
          from: 0,
          to: 0,
        },
        status: 1,
        error: '',
      };

      try {
        if (tab === 'draft') {
          const draftRes = await getDraftQueries(currentPage);
          const data = Array.isArray(draftRes?.data) ? draftRes.data : [];
          const filtered = data.filter((q: Query) => q.type === '0');
          res = {
            data: filtered,
            paginate: draftRes?.paginate,
            status: 200,
            error: '',
          };
        } else if (tab === 'my') {
          const myRes = await getQueries(currentPage);
          const data = Array.isArray(myRes?.data) ? myRes.data : [];
          const filtered = data.filter((q: Query) => q.type === '1');
          res = {
            data: filtered,
            paginate: myRes?.paginate,
            status: 200,
            error: '',
          };
        }

        setQueries(res.data);
        setLastPage(res.paginate?.total_pages ?? 1);
        setQueryList(res.data);
      } catch (error) {
        console.error('Failed to fetch queries:', error);
      } finally {
        setLoading(false);
      }
    },
    [setQueryList]
  );

  // Initial + whenever tab or page changes
  useEffect(() => {
    fetchQueries(activeTab, page);
  }, [activeTab, page, fetchQueries]);

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < lastPage) setPage((prev) => prev + 1);
  };

  const handleSendDarft = async (Query: Query) => {
    const res = await sendDraftQuery(Query);
    if (res === 1) {
      toast.success("Query sent successfully!");
      setActiveTab('my');
      fetchQueries(activeTab, page);
    } else {
      toast.error("Failed to send query. Please try again.");
    }
  }

  const handleDeleteQuery = async (Query: Query) => {
    const res = await deleteQuery(Query);
    if (res === 1) {
      toast.success("Query deleted successfully!");
      fetchQueries(activeTab, page);
    } else {
      toast.error("Failed to delete query. Please try again.");
    }
  }




  return (
    <div >
      <div className="flex items-center mb-3 justify-between">
        <div>
          <h1 className="text-2xl font-bold">Queries</h1>
          <p className="text-sm text-gray-500">Manage your Queries</p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as 'my' | 'draft');
          setPage(1);
        }}
      >
        <div className="flex items-center justify-between mb-4 border-b-2 border-gray-200">



          <TabsList>
            <TabsTrigger value="my">My Queries</TabsTrigger>
            <TabsTrigger value="draft">Draft Queries</TabsTrigger>
          </TabsList>

          <div className='flex items-center mb-1'>
            <Link to="/queries/new" className="px-5 py-2 bg-primary text-white rounded-md">
              New Query
            </Link>
          </div>
        </div>

        <TabsContent value="my">
          <QueryTable
            queries={queries}
            loading={loading}
            page={page}
            lastPage={lastPage}
            actions={['view', 'delete']}
            tab='my'
            DeleteQuery={handleDeleteQuery}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </TabsContent>

        <TabsContent value="draft">
          <QueryTable
            queries={queries}
            loading={loading}
            page={page}
            lastPage={lastPage}
            actions={['edit', 'send', 'delete']}
            tab='draft'
            DeleteQuery={handleDeleteQuery}
            SendDraft={handleSendDarft}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearnerUserQueries;
