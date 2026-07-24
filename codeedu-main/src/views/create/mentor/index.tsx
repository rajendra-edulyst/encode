
import { useMemo, useEffect, useState, useRef } from 'react';
import Breadcrumb from '@/components/breadcrumb';
import LoadingSection from '@/components/LoadingSection';
import ProfilePopup from '@/views/common/profile-view/openview/ProfilePopup';
import { useMentors, useMyMentors, useRecommendedMentors } from '@/hooks/data/create/useMentor';
import { useMentorListV2 } from '@/hooks/data/faculty/useMentor';
import type { Mentor } from '@/@types/create/mentor';
import MentorFilters from './components/MentorFilters';
import MentorGrid from './components/MentorGrid';
import { useMentorFilters } from './components/useMentorFilters';
import { TabKey } from './components/tabsConfig';
import { useParams } from 'react-router-dom';
import { useFunctionalDomains } from '@/hooks/data/useGettingStarted';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';




const MentorPage = () => {
    const breadcrumbItems = [{ label: 'Mentors' }];
    const { data: mentors = [], isLoading, isError, error, refetch } = useMentors();
    const { data: myMentors = [], isLoading: isMyMentorsLoading } = useMyMentors();
    const { data: recommendedMentors = [], isLoading: isRecommendedMentorsLoading } = useRecommendedMentors();
    const { data: mentorListV2 = [] } = useMentorListV2();
    const { data: functionalDomains = [] } = useFunctionalDomains();

    // url tab sync
    const tab = window.location.pathname === '/mentoring/explore' ? 'explore' : window.location.pathname === '/mentoring/my-mentors' ? 'my-mentors' : window.location.pathname === '/mentoring/recommended' ? 'recommended' : 'all';
    const [selectedTab, setSelectedTab] = useState<TabKey>(tab ?? 'all');
    const params = useParams<{ is_refresh: string }>();
    const isRefresh = params.is_refresh === 'true';
    const [locationFilter, setLocationFilter] = useState<string>('All Locations');
    const [domainFilter, setDomainFilter] = useState<string>('All Domains');
    const [sortBy, setSortBy] = useState<string>('Rating');
    const [searchTerm, setSearchTerm] = useState<string>('');


    const trackedTabRef = useRef<string | null>(null);
    useEffect(() => {
        if (trackedTabRef.current !== selectedTab) {
            mixpanelService.track("Mentor Page Viewed", {
                tab: selectedTab,
            });
            trackedTabRef.current = selectedTab;
        }
    }, [selectedTab]);

    // filtering
    const { filteredMentors, locations, domains } = useMentorFilters({
        mentors,
        myMentors,
        recommendedMentors,
        mentorListV2,
        selectedTab,
        locationFilter,
        domainFilter,
        sortBy,
        searchTerm,
    });
    const domainOptions = useMemo(() => {
        const fromSelectionScreen = functionalDomains
            .map((domain) => domain?.name?.trim())
            .filter((name): name is string => Boolean(name))
            .filter((name, index, arr) => arr.indexOf(name) === index)
            .sort((a, b) => a.localeCompare(b));

        // Keep old derived domain list as fallback if domain API is unavailable.
        return fromSelectionScreen.length > 0 ? fromSelectionScreen : domains;
    }, [functionalDomains, domains]);

    // popup state
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

    const openProfile = (mentor: Mentor) => {
        setSelectedMentor(mentor);
        setIsProfileOpen(true);
    };

    const handleSocialClick = (url?: string) => {
        if (!url) return;
        let u = url;
        if (!u.startsWith('http://') && !u.startsWith('https://')) u = `https://${u}`;
        window.open(u, '_blank', 'noopener,noreferrer');
    };

    if (isRefresh === true) {
        window.location.reload();
    }

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <MentorFilters
                selectedTab={selectedTab}
                locationFilter={locationFilter}
                domainFilter={domainFilter}
                sortBy={sortBy}
                locations={locations}
                domains={domainOptions}
                searchTerm={searchTerm}
                count={filteredMentors.length}
                onLocationChange={setLocationFilter}
                onDomainChange={setDomainFilter}
                onSortChange={setSortBy}
                onSearchChange={setSearchTerm}
                onTabChange={setSelectedTab}
                onRefetch={refetch}
            />


            {selectedTab === 'recommended' ? (
                <MentorGrid
                    mentors={filteredMentors}
                    mentorRatings={mentorListV2}
                    onOpenProfile={openProfile}
                    onOpenSocial={handleSocialClick}

                />
            ) : (
                <MentorGrid
                    mentorRatings={mentorListV2}
                    mentors={filteredMentors}
                    onOpenProfile={openProfile}
                    onOpenSocial={handleSocialClick}
                />
            )}

            {(isLoading || isMyMentorsLoading || isRecommendedMentorsLoading) && (
                <LoadingSection
                    isLoading={isLoading || isMyMentorsLoading || isRecommendedMentorsLoading}
                    title="Loading Mentors..."
                    description="Please wait while we fetch the mentors for you."
                />
            )}

            {isError && (
                <div className="text-center text-red-600 mt-4">
                    Error: {error?.message || 'Something went wrong while fetching mentors.'}
                </div>
            )}

            {selectedMentor && (
                <ProfilePopup
                    isOpen={isProfileOpen}
                    org_id={selectedMentor.org_id}
                    uniqueIdentifier={selectedMentor.uniqueIdentifier}
                    onClose={() => setIsProfileOpen(false)}
                />
            )}
        </div>
    );
};

export default MentorPage;
