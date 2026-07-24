'use client';

import {
  useEffect,
  useState,
  useCallback,
} from 'react';

import { getQueries, getDraftQueries, getUserQueries, sendDraftQuery, deleteQuery } from '@/services/learner/QueryService';
import { fetchAssignedProgramsforFilter } from '@/services/faculty/ProgramService';
import { AssignedProgramForFilter } from '@/@types/faculty/program';
import { useQueryStore } from '@/store/learner/queryStore';
import { Query, QueryResponse } from '@/@types/learner/mailbox';
import QueryTable from './QueryTable';
import ReplyQueryTable from './ReplyQueryTable';
import Breadcrumb from '@/components/breadcrumb'
import { toast } from 'sonner';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';
import { Link } from 'react-router-dom';



const FacultyUserQueries = () => {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [is_replied, setIsReplied] = useState<number>(0);
  const [programs, setPrograms] = useState<AssignedProgramForFilter[]>([]);
  const [programId, setProrgramId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'user' | 'my' | 'draft'>('user');

   const breadcrumbItems = [
        { label: 'Queries' },
    ]


  const { setQueries: setQueryList } = useQueryStore();

  const getPrograms = useCallback(async () => {
    try {
      const programs = await fetchAssignedProgramsforFilter();
      setPrograms(programs);
      console.log('Programs:', programs);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  }, []);

 const fetchQueries = useCallback(
  async (tab: 'user' | 'my' | 'draft', currentPage: number = 1) => {
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
      if (tab === 'user') {
        // Default empty response already assigned
        const userRes = await getUserQueries(currentPage, is_replied, programId === null ? undefined : programId);
        res = {
          data: userRes?.data || [],
          paginate: userRes?.paginate,
          status: userRes?.status || 1,
          error: userRes?.error || '',
        };
      } else if (tab === 'draft') {
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
      // Optionally set error state here
    } finally {
      setLoading(false);
    }
  },
  [setQueryList, is_replied, programId],
);

  // Initial + whenever tab or page changes
  useEffect(() => {
     getPrograms();
    fetchQueries(activeTab, page);
  }, [activeTab, page, fetchQueries, getPrograms]);

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
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex items-center mb-3 justify-between">
        <div>
          <h1 className="text-2xl font-bold">Queries</h1>
          <p className="text-sm text-gray-500">Manage your Queries</p>
        </div> 
        {(activeTab === 'my' || activeTab === 'draft') && (
        <div className='flex md:hidden items-center mb-1'>
            <Link to="/queries/new" className="px-5 py-2 bg-primary text-white rounded-md">
              New Query
            </Link>
          </div>  
        )}  
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value as 'user' | 'my' | 'draft');
          setPage(1);
        }}
      >
        <div className="flex items-center justify-between mb-4 border-b-2 border-gray-200">

         

          <TabsList>
            <TabsTrigger value="user">Student Queries</TabsTrigger>
            <TabsTrigger value="my">My Queries</TabsTrigger>
            <TabsTrigger value="draft">Draft Queries</TabsTrigger>
          </TabsList>



          {(activeTab === 'my' || activeTab === 'draft') && (
            <div className='hidden md:flex items-center mb-1'>
              <Link to="/queries/new" className="px-5 py-2 bg-primary text-white rounded-md">
                New Query
              </Link>
            </div>
          )}
        </div>

        <TabsContent value="user">
          <div className='flex items-center gap-3 flex-wrap'>
          <div className='justify-start flex items-center'>
            <label className="text-sm font-medium mr-2">Status:</label>
            <select
              className="p-2 border rounded-md"
              value={is_replied}
              onChange={(e) => {
                setIsReplied(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={0}>Unreplied</option>
              <option value={1}>Replied</option>
            </select>
          </div>

            <div className="flex items-center justify-start">
              <label className="text-sm font-medium mr-2">Subject:</label>

             <select
              className="p-2 border rounded-md"
              value={programId ?? 0}
              onChange={(e) => {
                setProrgramId(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={0}>All</option>
              {/* map the programs */}
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
              
            </select>
            </div>
          </div>
          <ReplyQueryTable
            queries={queries}
            loading={loading}
            page={page}
            lastPage={lastPage}
            actions={['view', 'reply']}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </TabsContent>

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
            actions={['send', 'delete']}
            tab='draft'
            SendDraft={handleSendDarft}
            DeleteQuery={handleDeleteQuery}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyUserQueries;
