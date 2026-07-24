import SafeHtml from '@/components/SafeHtml';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIndustryDetails } from '@/hooks/data/collaborate/useIndustry';
import { Eye, MapPin } from 'lucide-react';
import { Link, useParams, useLocation } from 'react-router-dom';
import IndustriesJobs from './jobs';
import Mentors from './mentors';
import { Card, CardContent } from '@/components/ui/card';
import MustAttendEventCard from '@/components/MustAttendEventCard';
import AgendaCard from '@/components/AgendaCard';
import Breadcrumb from '@/components/breadcrumb';
import { socialIcons } from '@/views/common/profile-view/components/SocialIcons/socialIcons';
import industryBanner from '@/assets/images/industry_banner.png';
const DEFAULT_INDUSTRY_LOGO = 'https://codeedu.blob.core.windows.net/encode/media/encode/media/nlms_content/1769240550_logo.jpg';
import CircuitAnimation from '@/components/ui/CircuitAnimation';
import { useEffect } from 'react';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

const IndustryDetails = () => {

  const { industryId } = useParams<{ industryId: string }>();

  const { data: organization } = useIndustryDetails(industryId);

  useEffect(() => {
    if (organization?.name) {
        mixpanelService.track('Industry Profile Viewed', {
            industry_id: industryId,
            industry_name: organization.name,
            category: 'Industry',
            page_path: location.pathname,
            timestamp: new Date().toISOString()
        })
    }
  }, [ organization?.id,organization?.name,industryId])

  const location = useLocation();
  const state = location.state as { from?: string; breadcrumbLabel?: string; type?: string } | null;

  const breadcrumbItems = state?.from && state?.type === 'must-attend' ? [
    { label: "Must Attend", path: "/collaborate/must-attend" },
    { label: state.breadcrumbLabel || "Event Details", path: state.from },
    { label: organization?.name ?? "Details", path: "" }
  ] : [
    { label: "Industries", path: "/collaborate/industries" },
    { label: organization?.name ?? "Details", path: "" },
  ];

  const params = new URLSearchParams();
  params.append("org_id", industryId || '');

  const mustAttendData = [
    {
      type: 'Creators Meetup',
      description: 'Where ideas vibe and collabs spark',
      icon: '/img/icons/handshake.png',
      title: 'Creators Meetup',
      banner: '/img/others/Image19.png',
      purpose: "Step into the vibe zone where ideas flow, minds connect, and collaborations come alive. Your next big spark might just start here."
    },
    {
      type: 'enCODE',
      description: 'The grand stage of design madness',
      icon: '/img/icons/ticket.png',
      title: 'enCODE',
      banner: '/img/others/Image20.png',
      purpose: "Design unleashed. Chaos celebrated. Magic created. Welcome to the grand stage of design madness."
    },
    {
      type: 'Career Drive',
      description: 'Kickstart your hustle, design-style.',
      icon: '/img/icons/graduation-cap.png',
      title: 'Career Drive',
      banner: '/img/others/Image21.png',
      purpose: "Don't just dream design live it. Kickstart your hustle with real projects, real teams, and real impact. Your creative career begins here."
    },
    {
      type: 'Immersion Programs',
      description: 'Kickstart your hustle, design-style.',
      icon: '/img/icons/streetview.png',
      title: 'Immersion Programs',
      banner: '/img/others/Image23.png',
      purpose: "Not just learning — living the experience. Dive deep, explore, and emerge transformed through immersive creation."
    }
  ]

  const agendaData = [
    {
      banner: '/img/others/image15.png',
      title: 'Masterclass',
      description: 'Expert-led AMA sessions and masterclasses offering practical tips, career insights, and real-world design knowledge.',
      type: 'Masterclass'
    },
    {
      banner: '/img/others/image16.png',
      title: 'Workshops',
      description: 'Live, interactive creative workshops led by experts where you learn, practice, and get feedback on your work.',
      type: 'Workshops'
    },
    {
      banner: '/img/others/Image14.png',
      title: 'Industry Visits',
      description: 'Virtual tours and behind-the-scenes sessions that give you a real-time view of how professionals work.',
      type: 'Industry Visits'
    },
    {
      banner: '/img/others/Image17.png',
      title: 'Competitions',
      description: 'Industry-driven challenges that test skills, offer portfolio-worthy work, and provide exposure with prizes.',
      type: 'Competitions'
    },
    // {
    //     banner: '/img/others/Image18.png',
    //     title: 'Immersion Programs',
    //     description: 'Creative learning trips that blend exploration, culture, and hands-on experiences to spark new perspectives.',
    //     type: 'Immersion Programs'
    // }
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} className="mb-4" />
      <Card className='pt-0 overflow-hidden'>
        <CardContent className='px-0'>
          <div className='relative w-full h-[300px] bg-[#1a1a1a] overflow-hidden'>
            {organization?.banners && organization.banners.length > 0 ? (
              <img 
                src={organization.banners[0]} 
                alt={`${organization?.name || 'Industry'} Banner`} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <CircuitAnimation />
            )}
            <div className="absolute inset-0 bg-gray-900 opacity-50 dark:opacity-30 h-full pointer-events-none"></div>
          </div>
          <div className='px-4 py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
            <div className="rounded-md relative flex items-end gap-3 sm:gap-4 pb-2 sm:pb-3">
              <div className="w-20 h-20 sm:w-28 sm:h-28 dark:bg-white rounded-2xl border-4 overflow-hidden -mt-12 sm:-mt-16 shrink-0 bg-white">
                <img
                  src={organization?.logo || DEFAULT_INDUSTRY_LOGO}
                  alt={organization?.name || 'Industry Logo'}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = DEFAULT_INDUSTRY_LOGO;
                  }}
                />
              </div>
              <div className='min-w-0 space-y-1'>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold dark:text-primary text-primary break-words leading-tight">{organization && organization?.name}</h1>
                  {[organization?.city, organization?.state_name, organization?.country_name].filter(Boolean).length > 0 && (
                    <p className="flex gap-1 items-center text-gray-500 dark:text-white text-sm sm:text-base break-words mt-1">
                      <MapPin size={16} className="shrink-0" />
                      <span>{[organization?.city, organization?.state_name, organization?.country_name].filter(Boolean).join(', ')}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* <a href={`${organization?.brochure}`} target="_blank" rel="noreferrer" className='mt-4 bg-primary p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center text-black mb-3 cursor-pointer'>
              <Eye className='mb-2' />
              <div className='text-sm font-medium'>View Brochure</div>
            </a> */}
          </div>
        </CardContent>
      </Card>
      <Card className='mt-6'>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className='w-full md:w-fit bg-[#5A5A5A] rounded-xl p-0 h-auto mb-6 overflow-x-auto overflow-y-hidden flex-nowrap justify-start divide-x divide-gray-400'>
              <TabsTrigger className='rounded-none text-white data-[state=active]:text-[#000000] py-3 px-4 shrink-0 whitespace-nowrap' value="overview">Overview</TabsTrigger>
              {(organization as any)?.buzzzed && (
                <TabsTrigger className='rounded-none text-white data-[state=active]:text-[#000000] py-3 px-4 shrink-0 whitespace-nowrap' value="buzzzed">Buzzzed</TabsTrigger>
              )}
              {(organization as any)?.awards && (
                <TabsTrigger className='rounded-none text-white data-[state=active]:text-[#000000] py-3 px-4 shrink-0 whitespace-nowrap' value="awards">Awards & Recognition</TabsTrigger>
              )}
              {(organization as any)?.clients && (
                <TabsTrigger className='rounded-none text-white data-[state=active]:text-[#000000] py-3 px-4 shrink-0 whitespace-nowrap' value="clients">Clients & Projects</TabsTrigger>
              )}
              <TabsTrigger className='rounded-none text-white data-[state=active]:text-[#000000] py-3 px-4 shrink-0 whitespace-nowrap' value="hosted_events">Hosted Events</TabsTrigger>
              <TabsTrigger className='rounded-none text-white data-[state=active]:text-[#000000] py-3 px-4 shrink-0 whitespace-nowrap' value="participating">Participating In</TabsTrigger>
              <TabsTrigger className='rounded-none text-white data-[state=active]:text-[#000000] py-3 px-4 shrink-0 whitespace-nowrap' value="join_us">Join Us</TabsTrigger>
              <TabsTrigger className='rounded-none text-white data-[state=active]:text-[#000000] py-3 px-4 shrink-0 whitespace-nowrap' value="reach_out">Reach Out</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className='flex flex-col gap-6'>
              {!organization?.about && organization?.org_description && <Card className='bg-[#323232]'>
                <CardContent>
                  <div className='py-2 px-3'>
                    <SafeHtml html={organization?.org_description ?? ''} className='text-gray-500' />
                  </div>
                </CardContent>
              </Card>}
              {
                organization?.about && <Card className='bg-[#323232]'>
                  <CardContent>
                    <div className='py-2 px-3'>
                      <h1 className='text-2xl font-semibold mb-2 text-white'>About</h1>
                      <SafeHtml html={organization?.about ?? ''} className='text-gray-500' />
                    </div>
                  </CardContent>
                </Card>
              }
              {
                organization?.placements && <Card className='bg-[#323232]'>
                  <CardContent>
                    <div className='py-2 px-3'>
                      <h1 className='text-2xl font-semibold mb-2 text-white'>Placements</h1>
                      <SafeHtml html={organization?.placements ?? ''} className='text-gray-500' />
                    </div>
                  </CardContent>
                </Card>
              }
              {
                organization?.testimonial && <Card className='bg-[#323232]'>
                  <CardContent>
                    <div className='py-2 px-3'>
                      <h1 className='text-2xl font-semibold mb-2 text-white'>Testimonial</h1>
                      <SafeHtml html={organization?.testimonial ?? ''} className='text-gray-500' />
                    </div>
                  </CardContent>
                </Card>
              }
              {organization?.faq && <Card className='bg-[#323232]'>
                <CardContent>
                  <div className='py-2 px-3'>
                    <h1 className='text-2xl font-semibold mb-2 text-white'>Faq</h1>
                    <SafeHtml html={organization?.faq ?? ''} className='text-gray-500' />
                  </div>
                </CardContent>
              </Card>}
              {!organization?.about && !organization?.org_description && (
                <Card className='bg-[#323232]'>
                  <CardContent>
                    <div className='py-12 text-center'>
                      <p className='text-gray-400 text-lg'>No overview information available</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Buzzzed Tab */}
            {(organization as any)?.buzzzed && (
              <TabsContent value="buzzzed">
                <Card className='bg-[#323232]'>
                  <CardContent>
                    <div className='py-12 text-center'>
                      <p className='text-gray-400 text-lg'>No buzzzed content available</p>
                      <p className='text-gray-500 text-sm mt-2'>Stay tuned for exciting updates and highlights!</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Awards & Recognition Tab */}
            {(organization as any)?.awards && (
              <TabsContent value="awards">
                <Card className='bg-[#323232]'>
                  <CardContent>
                    <div className='py-12 text-center'>
                      <p className='text-gray-400 text-lg'>No awards & recognition available</p>
                      <p className='text-gray-500 text-sm mt-2'>Achievements and accolades will be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Clients & Projects Tab */}
            {(organization as any)?.clients && (
              <TabsContent value="clients">
                <Card className='bg-[#323232]'>
                  <CardContent>
                    <div className='py-12 text-center'>
                      <p className='text-gray-400 text-lg'>No clients & projects available</p>
                      <p className='text-gray-500 text-sm mt-2'>Client partnerships and project showcases coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Hosted Events Tab */}
            <TabsContent value="hosted_events">
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-4">
                {agendaData?.map(item => (
                  <Link key={item?.type} to={`/collaborate/agenda?category=${item.type}&industry_id=${industryId}`}>
                    <AgendaCard data={item} />
                  </Link>
                ))}
              </div>
            </TabsContent>

            {/* Participating In Tab */}
            <TabsContent value="participating">
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-2 gap-4">
                {mustAttendData.map((item) => (
                  <Link key={item.type} to={`/collaborate/must-attend?category=${item.type}`}>
                    <MustAttendEventCard data={item} />
                  </Link>
                ))}
              </div>
            </TabsContent>

            {/* Join Us Tab */}
            <TabsContent value="join_us">
              {industryId ? (
                <Card className='bg-[#323232]'>
                  <CardContent>
                    <IndustriesJobs org_id={industryId} />
                  </CardContent>
                </Card>
              ) : (
                <Card className='bg-[#323232]'>
                  <CardContent>
                    <div className='py-12 text-center'>
                      <p className='text-gray-400 text-lg'>No job opportunities available</p>
                      <p className='text-gray-500 text-sm mt-2'>Career opportunities will be posted here</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Reach Out Tab */}
            <TabsContent value="reach_out">
              <Card className='bg-[#111111] border-none rounded-3xl overflow-hidden'>
                <CardContent className="">
                  <div className='flex flex-col gap-10'>

                    {/* Contact Info Row */}
                    <div className="flex flex-wrap items-center gap-x-12 gap-y-8">
                      {/* Website */}
                      <div className="flex items-center gap-5">
                        <span className="text-white text-lg font-semibold tracking-tight min-w-[70px]">Website</span>
                        <div className="bg-[#242424] px-5 py-2.5 rounded-xl border border-white/5 shadow-inner">
                          <a
                            href={organization?.subdomain_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-codegreen hover:text-codegreen/80 transition-colors font-medium text-base md:text-lg"
                          >
                            {organization?.subdomain_url?.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') || 'www.website.com'}
                          </a>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-5">
                        <span className="text-white text-lg font-semibold tracking-tight">Email</span>
                        <div className="bg-[#242424] px-5 py-2.5 rounded-xl border border-white/5 shadow-inner">
                          <a
                            href={`mailto:${organization?.email}`}
                            className="text-codegreen hover:text-codegreen/80 transition-colors font-medium text-base md:text-lg"
                          >
                            {organization?.email || 'info@website.com'}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Social Links Row */}
                    <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
                      <span className="text-white text-lg font-semibold tracking-tight min-w-[70px]">Social Links</span>
                      <div className="flex items-center gap-4">
                        {(['behance', 'instagram', 'pinterest', 'dribbble', 'youtube'] as const).map((platform) => (
                          <a
                            key={platform}
                            href={organization?.[platform] || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-all hover:scale-110 active:scale-95 duration-200"
                          >
                            <img
                              src={socialIcons[platform]}
                              alt={platform}
                              className="w-10 h-10 md:w-11 md:h-11 object-contain drop-shadow-lg"
                            />
                          </a>
                        ))}
                      </div>
                    </div>

                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default IndustryDetails;