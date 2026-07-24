import Breadcrumb from '@/components/breadcrumb'
import StatusIndicator from '@/components/StatusIndicator'
import { Input } from '@/components/ui/ShadcnInput';
import { useSearchUserStore } from '@/store/faculty/SearchUserStore'
import { Search, X, User, ClipboardPen } from 'lucide-react';
import { debounce } from 'lodash'
import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/shadcnAvatar';
import { Button } from '@/components/ui/ShadcnButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from 'react-router-dom';
import UserAssignments from './user-assignments';
import UserAssessment from './user-assessment';
import LoginHistory from './login-history';
import maskEmail from '@/utils/maskEmail';
import ExpandableText from '@/components/ui/ExpandableText';

const SearchUsers = () => {
  const { fetchUsers, users, loading, error, query, setQuery, setUsers, selectedUser, setSelectedUser } = useSearchUserStore();
  const [showPopover, setShowPopover] = useState(false);

  const breadcrumbItems = [
    { label: 'Users' },
  ];

  const handleSearch = (query: string) => {
    setQuery(query);
    fetchUsers();
    setShowPopover(true);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchUsers = useCallback(
    debounce((query: string) => {
      handleSearch(query);
    }, 300),
    []
  );

  useEffect(() => {
    if (!query) {
      setUsers([]);
      setShowPopover(false);
      return;
    }

    if (selectedUser) {
      return;
    }

    debouncedFetchUsers(query);
    return () => {
      debouncedFetchUsers.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, debouncedFetchUsers]);

  return (
    <div className="p-4">
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Users</h1>
          <p className="text-sm text-gray-500 dark:text-white">Find Users</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusIndicator error={error} loading={loading} loadingMessage={"Syncing Live Sessions"} />
        </div>
      </div>
      <div className="relative mt-3">
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search ..."
            className="pl-10 pr-10 border rounded-md w-full focus-visible:ring-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search className="absolute top-2 left-2 text-gray-500" />
          {query && (
            <X
              className="absolute top-2 right-2 text-gray-500 cursor-pointer"
              onClick={() => {
                setQuery('');
                setUsers([]);
                setShowPopover(false);
                setSelectedUser(null);
              }}
            />
          )}
        </div>
        {showPopover && !selectedUser && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-card border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedUser(user);
                  setQuery(user.name);
                  setShowPopover(false);
                  setUsers([]);
                }}
              >
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{maskEmail(user.email)}</p>
              </div>
            ))}
            {
              !users || users.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No users found for {query}
                </div>
              )
            }
          </div>
        )}
      </div>
      {selectedUser && (
        <Card className='mt-4'>
          <CardHeader className='border-b'>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser.profile_image ?? ''} alt={selectedUser.name} />
                  <AvatarFallback>
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm font-bold">{selectedUser.name}</CardTitle>
                  <p className="text-sm text-gray-500">{maskEmail(selectedUser.email)}</p>
                </div>
              </div>
              <Link to={`/portfolio/codeedu-dae124fa/${selectedUser.id}`}>
                <Button variant="outline">View Portfolio</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className='p-0 pt-0'>
            <Tabs defaultValue="details" className='w-full'>
              <TabsList className='w-full flex justify-start gap-7 rounded-none border-b'>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="assignment">Assignment</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="loginHistory">Login History</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="p-4 ">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><User className='mr-2 w-5 h-5'></User>  User Details</h3>

                  <div className="space-y-3 text-sm text-gray-700">
                    <div>
                      <span className="font-medium text-gray-800">Full Name:</span>{" "}
                      {selectedUser?.portfolio_profile?.name} {selectedUser?.portfolio_profile?.lastName}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">Email:</span>{" "}
                      {maskEmail(selectedUser.email)}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">Address:</span>{" "}
                      {selectedUser?.portfolio_profile?.headline}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">Country:</span>{" "}
                      {selectedUser?.portfolio_profile?.country}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">State:</span>{" "}
                      {selectedUser?.portfolio_profile?.state}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">City:</span>{" "}
                      {selectedUser?.portfolio_profile?.city}
                    </div>
                  </div>

                  <div className="mt-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center"><ClipboardPen className='mr-2 w-5 h-5'></ClipboardPen> Bio</h3>
                    <ExpandableText
                      className="text-sm mt-3 text-gray-600"
                      text={selectedUser.portfolio_profile?.about_me || "No bio provided"}
                      lines={2}
                    />
                  </div>
                </div>

              </TabsContent>
              <TabsContent value="assignment">
                <UserAssignments user={selectedUser} />
              </TabsContent>
              <TabsContent value="assessment">
                <UserAssessment user={selectedUser} />
              </TabsContent>
              <TabsContent value="loginHistory">
                <LoginHistory user={selectedUser} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      {
        !query && !selectedUser && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Enter a name or email to search for users. You can also click on a user from the search results to view their details.</p>
          </div>
        )
      }
    </div>
  )
}

export default SearchUsers