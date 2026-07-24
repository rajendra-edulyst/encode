import Breadcrumb from '@/components/breadcrumb'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/hooks/data/useGettingStarted';
import Licenses from './pages/licenses';
import Overview from './pages/overview';
import OnTheAgenda from './pages/on-the-agenda';
import Jobs from './pages/jobs';
import MustAttend from './pages/must-attend';
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import PackageCard from '@/components/PackageCard';
import CommunityCard from '@/components/CommunityCard';
import LoadingSection from '@/components/LoadingSection';
import LicenseToken from './components/LicenseToken';
import { useInstitutePlanDetails } from '@/hooks/data/collaborate/useJobs';
import { useCsvMapCommunityUsers, useMapCommunityUsers, useOrgCommunities } from '@/hooks/data/connect/useCommunity';
import { useAuth } from '@/auth';
import { Link } from 'react-router-dom';
import { Download, Plus, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/ShadcnButton';
import { downloadSampleMapUsersCsv } from '@/services/connect/CommunityService';
import { toast } from 'sonner';


const Index = () => {

    const { data: userProfile, isSuccess: userProfileLoaded } = useUserProfile();
    const { user } = useAuth();
    const preferenceColor = userProfile?.preference?.name === 'Explorer' ? 'text-codeblue' : userProfile?.preference?.name === 'Builder' ? 'text-codepink' : userProfile?.preference?.name === 'Navigator' ? 'text-codegreen' : '';
    const { data: planDetails } = useInstitutePlanDetails();
    const { data: orgCommunities = [], isLoading: orgCommunitiesLoading } = useOrgCommunities();
    const mapCommunityUsersMutation = useMapCommunityUsers();
    const csvMapCommunityUsersMutation = useCsvMapCommunityUsers();
    const [tab, setTab] = useState<'overview' | 'licenses' | 'on-the-agenda' | 'jobs' | 'must-attend' | 'community-manager'>('overview');
    const [filter, setFilter] = useState<string>('yearly');
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    /** Joy category id for the community whose "Add User" opened the modal (map_user / csv_map_user). */
    const [addUserModalCategoryId, setAddUserModalCategoryId] = useState<number | null>(null);
    const [addUserMode, setAddUserMode] = useState<'organization' | 'csv'>('organization');
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const csvInputRef = useRef<HTMLInputElement>(null);
    const prioritizedOrgCommunities = useMemo(() => {
        const userOrgId = user?.organization_id?.toString();

        return [...orgCommunities].sort((a, b) => {
            const aId = a.org_id?.toString();
            const bId = b.org_id?.toString();

            if (userOrgId && aId === userOrgId) return -1;
            if (userOrgId && bId === userOrgId) return 1;

            const aName = (a.org_name ?? '').trim().toLowerCase();
            const bName = (b.org_name ?? '').trim().toLowerCase();
            if (aName === 'code') return -1;
            if (bName === 'code') return 1;

            return 0;
        });
    }, [orgCommunities, user]);

    const currentOrg = prioritizedOrgCommunities[0];
    const orgCommunitiesList = currentOrg?.communities ?? [];
    const communityCategoryId = addUserModalCategoryId;

    /** Community Manager: only for institute/industry org admins (user-profile). */
    const showCommunityManagerTab = useMemo(() => {
        if (!userProfileLoaded || !userProfile) return false;
        const role = userProfile.user_profile?.role;
        const pkgType = (userProfile.packages?.type ?? '').toLowerCase();
        const isInstituteOrIndustry = pkgType === 'institute' || pkgType === 'industry';
        return role === 'industry_admin' && isInstituteOrIndustry;
    }, [userProfileLoaded, userProfile]);

    const breadcrumbItems = [
        { label: 'Institute', path: '/collaborate/institute' },
        { label: tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, ' '), path: '' }
    ];

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab') as 'overview' | 'licenses' | 'on-the-agenda' | 'jobs' | 'must-attend' | 'community-manager' | null;
        if (tabParam && tabParam !== 'community-manager') {
            setTab(tabParam);
        }
    }, []);

    useEffect(() => {
        if (!userProfileLoaded) return;
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam === 'community-manager') {
            if (showCommunityManagerTab) {
                setTab('community-manager');
            } else {
                setTab('overview');
                const url = new URL(window.location.href);
                url.searchParams.set('tab', 'overview');
                url.searchParams.delete('details');
                window.history.replaceState({}, '', url.toString());
            }
            return;
        }
        if (tab === 'community-manager' && !showCommunityManagerTab) {
            setTab('overview');
            const url = new URL(window.location.href);
            url.searchParams.set('tab', 'overview');
            url.searchParams.delete('details');
            window.history.replaceState({}, '', url.toString());
        }
    }, [userProfileLoaded, showCommunityManagerTab, tab]);

    const handleTabChange = (value: string) => {
        const newTab = value as 'overview' | 'licenses' | 'on-the-agenda' | 'jobs' | 'must-attend' | 'community-manager';
        setTab(newTab);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', newTab);
        url.searchParams.delete('details');
        window.history.pushState({}, '', url.toString());
    };

    const handleSameTabClick = (tabValue: string) => {
        if (tab === tabValue) {
            const url = new URL(window.location.href);
            const hasDetails = url.searchParams.get('details');
            if (hasDetails) {
                url.searchParams.delete('details');
            }
            window.history.pushState({}, '', url.toString());

            // Trigger state update in Licenses component
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    };

    const handleDownloadSampleCsv = async () => {
        try {
            await downloadSampleMapUsersCsv();
        } catch {
            toast.error('Could not download sample CSV. Please try again.');
        }
    };

    const pickCsvFile = (file: File | null) => {
        if (!file) {
            setCsvFile(null);
            return;
        }
        if (file.type && file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
            return;
        }
        setCsvFile(file);
    };

    const handleCsvInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        pickCsvFile(event.target.files?.[0] ?? null);
        event.target.value = '';
    };

    return (
        <div>
            <div className='space-y-4'>
                <Breadcrumb items={breadcrumbItems} />
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                    <PackageCard />
                    <LicenseToken
                        explorerLicenses={{
                            used: planDetails?.explorer?.licenses_used || 0,
                            total: planDetails?.explorer?.total_licenses || 0
                        }}
                        builderLicenses={{
                            used: planDetails?.builder?.licenses_used || 0,
                            total: planDetails?.builder?.total_licenses || 0
                        }}
                        navigatorLicenses={{
                            used: planDetails?.navigator?.licenses_used || 0,
                            total: planDetails?.navigator?.total_licenses || 0
                        }}
                    />
                </div>
            </div>
            <div className='mt-8 space-y-10'>
                <Tabs defaultValue={tab} value={tab} onValueChange={handleTabChange}>
                    <div className='flex justify-between items-center mb-4'>
                        <TabsList className='mb-5 rounded-xl p-0 h-auto'>
                            <TabsTrigger value='overview' className={`capitalize px-4 rounded-none rounded-l-xl`} onClick={() => handleSameTabClick('overview')}>Overview</TabsTrigger>
                            <TabsTrigger value='licenses' className={`capitalize px-4 rounded-none`} onClick={() => handleSameTabClick('licenses')}>Licenses</TabsTrigger>
                            <TabsTrigger value='on-the-agenda' className={`capitalize px-4 rounded-none`} onClick={() => handleSameTabClick('on-the-agenda')}>On The Agenda</TabsTrigger>
                            <TabsTrigger value='must-attend' className={`capitalize px-4 rounded-none`} onClick={() => handleSameTabClick('must-attend')}>Must Attend</TabsTrigger>
                            <TabsTrigger value='jobs' className={`capitalize px-4 rounded-none ${showCommunityManagerTab ? '' : 'rounded-r-xl'}`} onClick={() => handleSameTabClick('jobs')}>Jobs</TabsTrigger>
                            {showCommunityManagerTab && (
                                <TabsTrigger value='community-manager' className='capitalize px-4 rounded-none rounded-r-xl' onClick={() => handleSameTabClick('community-manager')}>Community Manager</TabsTrigger>
                            )}
                        </TabsList>
                        {tab !== 'community-manager' && (
                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-[200px] capitalize">
                                    {filter.replace(/_/g, ' ')}
                                </SelectTrigger>
                                <SelectContent>
                                    {/* <SelectItem value="monthly">Monthly</SelectItem> */}
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="half_yearly">Half Yearly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    <TabsContent value='overview'>
                        <Overview filter={filter} />
                    </TabsContent>
                    <TabsContent value='licenses'>
                        <Licenses filter={filter} />

                    </TabsContent>
                    <TabsContent value='on-the-agenda'>
                        <OnTheAgenda filter={filter} />
                    </TabsContent>
                    <TabsContent value='must-attend'>
                        <MustAttend filter={filter} />
                    </TabsContent>
                    <TabsContent value='jobs'>
                        <Jobs filter={filter} />
                    </TabsContent>
                    {showCommunityManagerTab && (
                        <TabsContent value='community-manager'>
                            <div className='grid grid-cols-1 lg:grid-cols-10 gap-6'>
                                <div className='lg:col-span-7 space-y-5'>
                                    <LoadingSection isLoading={orgCommunitiesLoading} title="Communities" />
                                    {!orgCommunitiesLoading && currentOrg && orgCommunitiesList.length > 0 && (
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                            {orgCommunitiesList.map((community) => (
                                                <div key={community.id} className='relative w-full max-w-md'>
                                                    <CommunityCard
                                                        community={community}
                                                        org_name={currentOrg.org_name}
                                                        org_logo={community.cover_image || community.image || currentOrg.org_logo}
                                                        org_id={`${currentOrg.org_id}`}
                                                        className='[&_[data-slot=card-footer]]:pr-[8.5rem] sm:[&_[data-slot=card-footer]]:pr-[9rem]'
                                                    />
                                                    <button
                                                        type='button'
                                                        onClick={() => {
                                                            setAddUserModalCategoryId(community.id);
                                                            setIsAddUserModalOpen(true);
                                                        }}
                                                        className='absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-xl bg-codepink px-3 py-2.5 text-sm font-semibold text-white shadow-md whitespace-nowrap min-h-[40px]'
                                                    >
                                                        <Plus size={18} strokeWidth={2.5} />
                                                        Add User
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {!orgCommunitiesLoading && (!currentOrg || orgCommunitiesList.length === 0) && (
                                        <p className='text-sm text-muted-foreground'>No community available.</p>
                                    )}
                                </div>
                                <div className='lg:col-span-3 flex lg:justify-end lg:items-start'>
                                    <Link
                                        to='/connect/communities'
                                        className='inline-flex w-fit max-w-[200px] flex-col items-center justify-center gap-1.5 rounded-xl bg-codegreen px-4 py-3 text-center text-sm font-semibold text-black'
                                    >
                                        <Plus size={20} />
                                        <span className='leading-tight'>Create Community</span>
                                    </Link>
                                </div>
                            </div>
                        </TabsContent>
                    )}
                </Tabs>
            </div>
            <Dialog
                open={isAddUserModalOpen}
                onOpenChange={(open) => {
                    setIsAddUserModalOpen(open);
                    if (!open) {
                        setCsvFile(null);
                        setAddUserModalCategoryId(null);
                    }
                }}
            >
                <DialogContent className='max-w-3xl bg-[#5F5F61] border-none text-white p-7 md:p-8'>
                    <DialogHeader className='items-center'>
                        <DialogTitle className='text-4xl md:text-5xl font-bold leading-tight text-center'>Add User to Community</DialogTitle>
                    </DialogHeader>
                    <div className='space-y-6'>
                        <div className='flex flex-col items-center gap-3'>
                            <div className='flex w-full max-w-xl rounded-xl overflow-hidden bg-[#7A7A7A]'>
                                <button
                                    type='button'
                                    onClick={() => setAddUserMode('organization')}
                                    className={`flex-1 min-w-0 px-4 py-2 text-base font-medium text-center ${addUserMode === 'organization' ? 'bg-codegreen text-black' : 'text-white bg-transparent'}`}
                                >
                                    Organization mapping
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setAddUserMode('csv')}
                                    className={`flex-1 min-w-0 px-4 py-2 text-base font-medium text-center ${addUserMode === 'csv' ? 'bg-codegreen text-black' : 'text-white bg-transparent'}`}
                                >
                                    CSV Upload
                                </button>
                            </div>
                            {addUserMode === 'csv' && (
                                <Button
                                    type='button'
                                    variant='secondary'
                                    className='h-10 px-5 bg-codegreen text-black hover:bg-codegreen/90 text-sm rounded-xl'
                                    onClick={() => void handleDownloadSampleCsv()}
                                >
                                    <Download size={16} />
                                    Sample CSV
                                </Button>
                            )}
                        </div>

                        {addUserMode === 'organization' ? (
                            <div className='pt-1 flex flex-col items-center justify-center gap-5'>
                                <p className='text-sm md:text-base text-gray-100 text-center max-w-[520px]'>
                                    Click the button below to map all learner users from this organization to the community.
                                    This action will enroll them automatically.
                                </p>
                                <button
                                    type='button'
                                    disabled={!communityCategoryId || mapCommunityUsersMutation.isPending}
                                    onClick={() => {
                                        if (!communityCategoryId) {
                                            toast.error('No community selected. Please try again after communities load.');
                                            return;
                                        }
                                        mapCommunityUsersMutation.mutate(
                                            { categoryId: communityCategoryId },
                                            {
                                                onSuccess: () => {
                                                    setIsAddUserModalOpen(false);
                                                },
                                            }
                                        );
                                    }}
                                    className='w-full max-w-sm rounded-xl bg-codepink py-3 text-lg font-medium text-white hover:opacity-90 transition-colors disabled:opacity-50 disabled:pointer-events-none'
                                >
                                    {mapCommunityUsersMutation.isPending ? 'Mapping…' : 'Map Organization Users'}
                                </button>
                            </div>
                        ) : (
                            <div className='space-y-4'>
                                <p className='text-base md:text-lg text-[#f0f0f0] text-center'>Upload a CSV file to map specific users.</p>
                                <input
                                    ref={csvInputRef}
                                    type='file'
                                    accept='.csv,text/csv'
                                    className='sr-only'
                                    onChange={handleCsvInputChange}
                                />
                                <div className='mx-auto w-full max-w-[230px]'>
                                    <div className='flex min-h-[36px] items-center gap-1.5 rounded-xl bg-[#4a4a4a] px-1.5 py-1'>
                                        <button
                                            type='button'
                                            onClick={() => csvInputRef.current?.click()}
                                            className='shrink-0 rounded-sm bg-gray-100 px-2.5 py-1 text-xs font-bold text-black'
                                        >
                                            Choose file
                                        </button>
                                        <span
                                            className='min-w-0 flex-1 truncate px-1.5 text-xs text-white'
                                            title={csvFile?.name ?? undefined}
                                        >
                                            {csvFile ? csvFile.name : 'No file chosen'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {addUserMode === 'csv' && (
                            <div className='flex justify-center gap-4 pt-4'>
                                <Button
                                    type='button'
                                    variant='secondary'
                                    className='h-12 min-w-[140px] bg-[#d1d1d1] text-black hover:bg-[#c4c4c4] text-base rounded-xl'
                                    onClick={() => setIsAddUserModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type='button'
                                    disabled={
                                        !communityCategoryId ||
                                        !csvFile ||
                                        csvMapCommunityUsersMutation.isPending
                                    }
                                    className='h-12 min-w-[170px] bg-[#10B4F1] hover:bg-[#07a7e2] text-black text-base rounded-xl disabled:opacity-50'
                                    onClick={() => {
                                        if (!communityCategoryId) {
                                            toast.error('No community selected.');
                                            return;
                                        }
                                        if (!csvFile) {
                                            toast.error('Please choose a CSV file.');
                                            return;
                                        }
                                        csvMapCommunityUsersMutation.mutate(
                                            { categoryId: communityCategoryId, file: csvFile },
                                            {
                                                onSuccess: () => {
                                                    setIsAddUserModalOpen(false);
                                                    setCsvFile(null);
                                                },
                                            }
                                        );
                                    }}
                                >
                                    <Upload size={16} />
                                    {csvMapCommunityUsersMutation.isPending ? 'Uploading…' : 'Add Users'}
                                </Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Index