import { Button } from '@/components/ui/ShadcnButton';
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PortfolioCard from '../components/PortfolioCard';
import CreativeDirectory from '../components/CreativeDirectory';
import { useThemeStore } from '@/store/themeStore';
import { useInFocus } from '@/hooks/data/collaborate/useFocus';
import LoadingSection from '@/components/LoadingSection';
import { ButtonGroup } from "@/components/ui/button-group"
import { useLocation } from "react-router-dom";
import { mixpanelService } from "@/services/mixpanel/MixpanelService";
import { useSearchParams } from 'react-router-dom';

const InFocusAll = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const tabFromUrl = searchParams.get('tab');
    const [inFocusActiveTab, setInFocusActiveTab] = React.useState(tabFromUrl || 'Creators');

    const trackedPageView = React.useRef(false);
    React.useEffect(() => {
        if (!trackedPageView.current) {
            mixpanelService.track("In Focus Page Viewed", {
                page_path: location.pathname,
                timestamp: new Date().toISOString(),
            });
            trackedPageView.current = true;
        }
    }, [location.pathname]);

    React.useEffect(() => {
        if (tabFromUrl) {
            setInFocusActiveTab(tabFromUrl);
        }
    }, [tabFromUrl]);

    const handleTabChange = (tab: string) => {
        setInFocusActiveTab(tab);
        setSearchParams({ tab });

        mixpanelService.track("In Focus Tab Changed", {
            tab_name: tab,
            page_path: location.pathname,
            timestamp: new Date().toISOString(),
        });
    };

    const { layout } = useThemeStore((state) => state);
    const { data: inFocusData = [], isLoading: isLoadingInFocus } = useInFocus();

    const transformInFocusData = (data: any[]) => {
        return data.map((item: any) => {
            if (item.profiles && item.profiles.length > 0) {
                return item.profiles.map((profile: any) => {
                    // Check org_type from profile first, fallback to item.type
                    const orgType = profile?.org_type || item.type;
                    const finalName = item.display_name || profile?.name || item.name || 'Unknown';

                    if (item.type === 'profile' || item.type === 'mentor') {
                        return {
                            type: 'designer',
                            id: profile?.id || item?.id,
                            name: profile?.name || item.display_name || item.name || 'Unknown',
                            designation: profile?.role || 'Creative Professional',
                            description: item.placeholder || profile?.description || item.description || 'No description available',
                            skills: profile?.skills?.map((skill: any) => skill.skill_name || skill.name) || [],
                            role: profile?.role || 'Designer',
                            profile_image: profile?.profile_image || 'https://ui-avatars.com/api/?name=User',
                            profile: profile,
                            profiles: item.profiles,
                            email: profile?.email,
                            org_type: profile?.org_type,
                            about: '',
                            banner: '',
                            display_name: item.display_name,
                            reference_id: item.reference_id
                        };
                    } else if (orgType === 'university' || orgType === 'institute') {
                        return {
                            type: orgType,
                            name: finalName,
                            about: profile?.org_description || item.placeholder || 'No description available',
                            banner: profile?.logo || item.file || '/img/placeholder-institute.png',
                            profile: profile,
                            profiles: item.profiles,
                            description: '',
                            skills: [],
                            id: String(item.id),
                            display_name: item.display_name,
                            reference_id: item.reference_id
                        };
                    } else if (orgType === 'industry') {
                        return {
                            type: 'industry',
                            name: finalName,
                            about: profile?.org_description || item.placeholder || 'No description available',
                            banner: profile?.logo || '/img/placeholder-industry.png',
                            profile: profile,
                            profiles: item.profiles,
                            description: '',
                            skills: [],
                            id: String(item.id),
                            display_name: item.display_name,
                            reference_id: item.reference_id
                        };
                    }
                    return null;
                }).filter((profileItem: any) => profileItem !== null);
            }

            const itemName = item.display_name || item.name;

            // Handle cases with no profiles using item.type
            if (item.type === 'profile' || item.type === 'mentor') {
                return {
                    type: 'designer',
                    id: item?.id,
                    name: itemName || 'Unknown',
                    designation: 'Creative Professional',
                    description: item.placeholder || item.description || 'No description available',
                    skills: [],
                    role: 'Designer',
                    profile_image: 'https://ui-avatars.com/api/?name=User',
                    profile: null,
                    profiles: item.profiles || [],
                    about: '',
                    banner: '',
                    display_name: item.display_name,
                    reference_id: item.reference_id
                };
            } else if (item.type === 'industry') {
                return {
                    type: 'industry',
                    name: itemName || 'Unknown Industry',
                    about: item.placeholder || 'No description available',
                    banner: '/img/placeholder-industry.png',
                    profile: null,
                    profiles: item.profiles || [],
                    description: '',
                    skills: [],
                    id: String(item.id),
                    display_name: item.display_name,
                    reference_id: item.reference_id
                };
            } else if (item?.type === 'university' || item?.type === 'institute') {
                return {
                    type: item.type,
                    name: itemName || (item.type === 'institute' ? 'Unknown Institute' : 'Unknown University'),
                    about: item.placeholder || 'No description available',
                    banner: item.file || '/img/placeholder-university.png',
                    profile: null,
                    profiles: item.profiles || [],
                    description: '',
                    skills: [],
                    id: String(item.id),
                    display_name: item.display_name,
                    reference_id: item.reference_id
                };
            }

            return null;
        }).flat().filter(item => item !== null);
    };

    const transformedData = transformInFocusData(inFocusData).reverse();

    const getFilteredInFocusData = () => {
        if (inFocusActiveTab === 'Creators') {
            return transformedData.filter((item) => item.type === 'designer');
        } else if (inFocusActiveTab === 'Industries') {
            return transformedData.filter((item) => item.type === 'industry');
        } else if (inFocusActiveTab === 'Institutes') {
            return transformedData.filter((item) => item.type === 'university' || item.type === 'institute');
        }
        return [];
    };

    const filteredInFocusData = getFilteredInFocusData();

    return (
        <div className='flex flex-col gap-5'>
            <Card className="border rounded-[20px] overflow-hidden">
                <CardHeader className='flex flex-col gap-4 px-6'>
                    <div className="flex flex-col md:flex-row md:items-center mx-2 w-full justify-between gap-4">
                        <CardTitle className='text-primary text-lg md:text-[28px] whitespace-nowrap'>In Focus</CardTitle>
                        <ButtonGroup className='bg-[#5A5A5A] rounded-xl overflow-hidden p-0 h-auto w-full md:w-auto'>
                            <Button
                                variant={inFocusActiveTab === 'Creators' ? 'default' : 'outline'}
                                className={`w-full md:w-32 rounded-none border text-white ${inFocusActiveTab !== 'Creators' && 'bg-[#5A5A5A]'}`}
                                onClick={() => handleTabChange('Creators')}
                            >
                                Creators
                            </Button>
                            <Button
                                variant={inFocusActiveTab === 'Industries' ? 'default' : 'outline'}
                                className={`w-full md:w-32 rounded-none border text-white ${inFocusActiveTab !== 'Industries' && 'bg-[#5A5A5A]'}`}
                                onClick={() => handleTabChange('Industries')}
                            >
                                Industries
                            </Button>
                            <Button
                                variant={inFocusActiveTab === 'Institutes' ? 'default' : 'outline'}
                                className={`w-full md:w-32 rounded-none border text-white ${inFocusActiveTab !== 'Institutes' && 'bg-[#5A5A5A]'}`}
                                onClick={() => handleTabChange('Institutes')}
                            >
                                Institutes
                            </Button>
                        </ButtonGroup>
                    </div>
                    <CardDescription className='md:w-[70%] my-4 dark:text-white text-lg'>
                        Key collaboration opportunities within the Indian tech community
                    </CardDescription>
                </CardHeader>
                <CardContent className='px-6'>
                    <LoadingSection
                        isLoading={isLoadingInFocus}
                        title="Loading In Focus..."
                        description="Please wait while we fetch the latest data."
                    />

                    {!isLoadingInFocus && transformedData.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No data available for In Focus.</p>
                        </div>
                    )}

                    {!isLoadingInFocus && transformedData.length > 0 && (
                        <div className={`${layout.sideNavCollapse ? 'w-[87vw]' : 'w-full'} overflow-hidden`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
                                {filteredInFocusData.map((item, index) => (
                                    <div key={`${item.type}-${item.name}-${index}`}>
                                        {item.type === 'designer' ? (
                                            <PortfolioCard data={item} />
                                        ) : (
                                            <CreativeDirectory data={item} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default InFocusAll;