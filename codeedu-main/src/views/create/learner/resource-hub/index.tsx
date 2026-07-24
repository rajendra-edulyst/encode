import Breadcrumb from '@/components/breadcrumb';
import Heading from '@/components/heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/ShadcnInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '@/services/ApiService';
import { toast } from 'sonner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

type ResourceHubCategoryItem = {
  title: string;
  items: {
    title: string;
    description: string;
    img: string;
    externalUrl?: string;
  }[];
};

const CategoryCarousel = ({ category, navigate, urlEncode }: any) => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative group">
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); swiperRef.current?.slidePrev(); }}
          className="w-10 h-10 rounded-full bg-[#00A8E9] text-white flex items-center justify-center hover:bg-primary transition-all shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); swiperRef.current?.slideNext(); }}
          className="w-10 h-10 rounded-full bg-[#00A8E9] text-white flex items-center justify-center hover:bg-primary transition-all shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={40}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-4"
      >
        {category.items.map((item: any, idx: number) => (
          <SwiperSlide key={`item-${idx}`} className="h-auto">
            <Card
              className="cursor-pointer dark:bg-[#323232] pt-0 hover:scale-[1.02] transition-transform transition-duration-200 h-full"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/explore/resource-hub/${urlEncode(category.title.toLowerCase())}?tab=${urlEncode(item.title.toLowerCase().replace(/\s+/g, '-'))}`);
              }}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-72 object-cover rounded-t-xl bg-white"
              />
              <CardContent className="pt-0">
                <CardTitle className="text-lg dark:text-white mt-4">
                  {item.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground dark:text-white">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const searchParams = new URLSearchParams(window.location.search);
  const rawTabParam = searchParams.get('tab') || 'all';
  const tabParam = rawTabParam.toLowerCase().replace(/\s+/g, '-');

  const tabs: string[] = [
    'all',
    'toolkits',
    'creative library',
    'reading shelf',
    'a/v vault',
  ];

  const resource: ResourceHubCategoryItem[] = [
    {
      title: 'Toolkits',
      items: [
        {
          title: 'AI Tools',
          description:
            'Explore cutting-edge AI platforms that boost creativity, productivity, and innovation.',
          img: '/img/others/image4.png',
        },
        {
          title: 'Design Softwares',
          description:
            'Creative platforms for graphics, presentations, and branding.',
          img: '/img/others/image5.png',
        },
        {
          title: 'Productivity + Collaboration',
          description:
            'Apps to streamline tasks, scheduling, and workflow efficiency.',
          img: '/img/others/image6.png',
        },
      ],
    },
    {
      title: 'Creative Library',
      items: [
        {
          title: 'Creative Library',
          description:
            'A curated space for books, magazines, and research to fuel learning and creativity.',
          img: '/img/others/Image25.svg',
        },
      ],
    },
    {
      title: 'Reading Shelf',
      items: [
        {
          title: 'Magazines',
          description:
            'Curated digital and print publications to stay updated with industry trends and insights',
          img: '/img/others/image7.png',
        },
        {
          title: 'Books',
          description:
            'Academic and reference titles to deepen subject knowledge and expand learning',
          img: '/img/others/image8.png',
        },
        {
          title: 'Blogs + Research',
          description:
            'Short, practical articles offering fresh ideas, tips, and perspectives on diverse topics',
          img: '/img/others/image9.png',
        },
      ],
    },
    {
      title: 'A/V Vault',
      items: [
        {
          title: 'Documentaries',
          description:
            'Explore real stories, cultures, and innovations shaping our world',
          img: '/img/others/image10.png',
        },
        {
          title: 'Podcasts',
          description:
            'On-demand audio sessions from experts and peers to learn anytime, anywhere',
          img: '/img/others/image11.png',
        },
        {
          title: 'Video Lectures',
          description:
            'Recorded sessions by educators to supplement classroom learning',
          img: '/img/others/image12.png',
        },
        {
          title: 'Professional Connect',
          description:
            'Connect with professionals and industry leaders to expand your network',
          img: '/img/others/image13.png',
        },
      ],
    },
  ];

  const filteredResource = resource
    .map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  const breadcrumbItems = [{ label: 'Resource Hub' }];

  const urlEncode = (str: string) => {
    return encodeURIComponent(str);
  };

  const getSSOData = async () => {
    const loadingToast = toast.loading('Connecting to Creative Library...');
    try {
      const response = await ApiService.fetchDataWithAxios<{
        status: number;
        data: {
          jwt: string;
          orgId: string;
          url: string;
        };
      }>({
        url: 'https://encodeapi.codeedu.co/api/knimbus-sso',
        method: 'get',
      });

      if (response.status === 1) {
        const { url, jwt, orgId } = response.data;

        // Create a hidden form and submit it
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        form.target = '_blank';

        const jwtInput = document.createElement('input');
        jwtInput.type = 'hidden';
        jwtInput.name = 'jwt';
        jwtInput.value = jwt;
        form.appendChild(jwtInput);

        const orgIdInput = document.createElement('input');
        orgIdInput.type = 'hidden';
        orgIdInput.name = 'orgId';
        orgIdInput.value = orgId;
        form.appendChild(orgIdInput);

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        toast.dismiss(loadingToast);
      } else {
        toast.error('Failed to authenticate with Creative Library', { id: loadingToast });
      }
    } catch (error) {
      console.error('SSO Login failed', error);
      toast.error('Creative Library authentication failed', { id: loadingToast });
    }
  };

  const handleCategoryClick = (category: ResourceHubCategoryItem) => {
    if (category.title === 'Creative Library') {
      getSSOData();
    } else {
      navigate(`/explore/resource-hub/${urlEncode(category.title.toLowerCase())}`);
    }
  };

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex justify-between items-center mb-6">
        <Heading
          title="Resource Hub"
          description="Explore a curated list of resources tailored for your needs."
          className="mb-0"
        />

        <div className="relative">
          <Input
            type="text"
            placeholder="Search resources..."
            className="w-full rounded-xl ps-12 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-white" size={20} />
        </div>
      </div>

      <div>
        <Tabs defaultValue={tabParam}>
          <TabsList className="mb-5 rounded-xl p-0 h-auto bg-gray-200 dark:bg-[#4d4d4d] divide-x divide-gray-300 dark:divide-gray-500 border border-gray-300 dark:border-gray-500 overflow-hidden">
            {tabs.map((tab, index) => (
              <TabsTrigger
                key={`tab-${index}`}
                value={tab.toLowerCase().replace(/\s+/g, '-')}
                className={`capitalize px-4 rounded-none py-2 text-sm font-normal text-white data-[state=active]:font-semibold`}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab, index) => (
            <TabsContent
              key={`tab-content-${index}`}
              value={tab.toLowerCase().replace(/\s+/g, '-')}
            >
              <div className="flex flex-col gap-6">
                {filteredResource.filter(
                  (category) =>
                    tab === 'all' || tab === category.title.toLowerCase()
                ).length > 0 ? (
                  filteredResource.map(
                    (category, index) =>
                      (tab === 'all' || tab === category.title.toLowerCase()) && (
                        <Card
                          key={`category-${index}`}
                          onClick={() => handleCategoryClick(category)}
                          className={`${category.title === 'Creative Library' ? 'cursor-pointer hover:scale-[1.01] transition-transform transition-duration-200' : ''}`}
                        >
                          <CardHeader>
                            <CardTitle className="text-[#00A8E9] text-3xl">
                              {category.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {category.title === 'Creative Library' ? (
                              <Card className="overflow-hidden">
                                <img
                                  src={category.items[0].img}
                                  alt="Creative Library"
                                  className="w-full h-[320px] object-cover"
                                />
                                <CardContent className="pt-4">
                                  <CardTitle className="text-lg dark:text-white">
                                    {category.items[0].title}
                                  </CardTitle>
                                  <p className="text-sm text-muted-foreground dark:text-white">
                                    {category.items[0].description}
                                  </p>
                                </CardContent>
                              </Card>
                            ) : category.items.length > 3 ? (
                              <CategoryCarousel category={category} navigate={navigate} urlEncode={urlEncode} />
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                {category.items.map((item, idx) => (
                                  <Card
                                    key={`item-${idx}`}
                                    className="cursor-pointer dark:bg-[#323232] pt-0 hover:scale-[1.02] transition-transform transition-duration-200"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/explore/resource-hub/${urlEncode(category.title.toLowerCase())}?tab=${urlEncode(item.title.toLowerCase().replace(/\s+/g, '-'))}`);
                                    }}
                                  >
                                    <img
                                      src={item.img}
                                      alt={item.title}
                                      className="w-full h-72 object-cover rounded-t-xl bg-white"
                                    />
                                    <CardContent className="pt-0">
                                      <CardTitle className="text-lg dark:text-white mt-4">
                                        {item.title}
                                      </CardTitle>
                                      <p className="text-sm text-muted-foreground dark:text-white">
                                        {item.description}
                                      </p>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                  )
                ) : (
                  <Card>
                    <CardContent className="text-center py-20">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                          No resources found
                        </h3>
                        <p className="text-muted-foreground dark:text-gray-400 max-w-md">
                          {searchTerm
                            ? `No results match "${searchTerm}" in this category. Try adjusting your search or check another tab.`
                            : `No resources available in this category at the moment.`}
                        </p>
                        {searchTerm && (
                          <button
                            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                            onClick={() => setSearchTerm('')}
                          >
                            Clear Search
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Index;