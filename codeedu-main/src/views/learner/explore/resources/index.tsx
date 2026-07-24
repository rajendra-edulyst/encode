import Breadcrumb from '@/components/breadcrumb';
import Heading from '@/components/heading';
import { Card, CardContent } from '@/components/ui/card';
import React, { useMemo, useState } from 'react'
import { FiSearch, FiFolder, FiBook, FiTool, FiVideo } from 'react-icons/fi';
import { Link } from 'react-router-dom';

type ResourceItem = {
    title: string;
    description: string;
    img: string;
};

type ResourceCategory = "Toolkits" | "Reading Shelf" | "AV Vault" | "Creative Library";
type Tab = "All" | ResourceCategory;
const tabs: Tab[] = ["All", "Toolkits", "Reading Shelf", "AV Vault", "Creative Library"];

const resource: Record<ResourceCategory, ResourceItem[]> = {
    "Toolkits": [
        {
            title: "AI Tools",
            description: "Explore cutting-edge AI platforms that boost creativity, productivity, and innovation.",
            img: "/img/others/image4.png",
        },
        {
            title: "Design Softwares",
            description: "Creative platforms for graphics, presentations, and branding.",
            img: "/img/others/image5.png",
        },
        {
            title: "Productivity + Collaboration",
            description: "Apps to streamline tasks, scheduling, and workflow efficiency.",
            img: "/img/others/image6.png",
        },
    ],
    "Creative Library": [
        {
            title: "Creative Library",
            description: "A curated space for books, magazines, and research to fuel learning and creativity.",
            img: "/img/others/image24.png",
        },

    ],
    "Reading Shelf": [
        {
            title: "Magazines",
            description: "Curated digital and print publications to stay updated with industry trends and insights",
            img: "/img/others/image7.png",
        },
        {
            title: "Books",
            description: "Academic and reference titles to deepen subject knowledge and expand learning",
            img: "/img/others/image8.png",
        },
        {
            title: "Blogs + Research",
            description: "Short, practical articles offering fresh ideas, tips, and perspectives on diverse topics",
            img: "/img/others/image9.png",
        },
    ],
    "AV Vault": [
        {
            title: "Documentaries",
            description: "Explore real stories, cultures, and innovations shaping our world",
            img: "/img/others/image10.png",
        },
        {
            title: "Podcasts",
            description: "On-demand audio sessions from experts and peers to learn anytime, anywhere",
            img: "/img/others/image11.png",
        },
        {
            title: "Video Lectures",
            description: "Recorded sessions by educators to supplement classroom learning",
            img: "/img/others/image12.png",
        },
        {
            title: 'Professional Connect',
            description:
                'Connect with professionals and industry leaders to expand your network',
            img: '/img/others/image13.png',
        },
    ],

}

const Resources = () => {
    const [activeTab, setActiveTab] = useState<Tab>("All");
    const [search, setSearch] = useState("");

    const filteredSections = useMemo(() => {
        return activeTab === "All"
            ? (Object.keys(resource) as ResourceCategory[])
            : [activeTab as ResourceCategory];
    }, [activeTab]);

    const filteredResources = useMemo(() => {
        return filteredSections.map((section) => ({
            section,
            items: resource[section].filter((item) =>
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.description.toLowerCase().includes(search.toLowerCase())
            ),
        }));
    }, [filteredSections, search]);


    const noResourcesFound = filteredResources.every(res => res.items.length === 0);

    const breadcrumbItems = [
        { label: 'Resource Hub' }
    ];


    const getEmptyStateIcon = () => {
        if (activeTab === "Toolkits") return <FiTool className="text-gray-400 text-4xl" />;
        if (activeTab === "Reading Shelf") return <FiBook className="text-gray-400 text-4xl" />;
        if (activeTab === "AV Vault") return <FiVideo className="text-gray-400 text-4xl" />;
        return <FiFolder className="text-gray-400 text-4xl" />;
    };


    const getEmptyStateMessage = () => {
        if (search) {
            return `No resources found matching "${search}" in ${activeTab === "All" ? "any category" : activeTab}`;
        }

        if (activeTab === "All") return "No resources available at the moment. Check back later.";
        return `No resources available in ${activeTab} at the moment. Check back later.`;
    };

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <Heading title='Resource Hub' description='Discover the best AI tools, development resources, and productivity apps to supercharge your workflow and creativity.' className='mb-2' />

            <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 border-b'>
                <div className='flex gap-9 justify-between overflow-x-auto pb-2'>
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`text-base text-cblack dark:text-white whitespace-nowrap ${activeTab === tab ? "border-b-2 border-pink-500 font-bold" : "text-cblack hover:text-gray-700"}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className='relative w-full md:w-72 pb-2'>
                    <span className='absolute left-3 top-2.5 text-gray-400'>
                        <FiSearch />
                    </span>
                    <input
                        type="text"
                        placeholder='Search tools & resources'
                        value={search}
                        className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-black'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>


            {noResourcesFound ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-gray-100 p-6 rounded-full mb-4">
                        {getEmptyStateIcon()}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No resources found</h3>
                    <p className="text-gray-500 max-w-md">
                        {getEmptyStateMessage()}
                    </p>
                </div>
            ) : (
                filteredSections.map((section) => {
                    const sectionResources = filteredResources.find((res) => res.section === section)?.items || [];

                    return sectionResources.length > 0 ? (
                        <Card key={section}>
                            <CardContent>
                                <h2 className="text-xl font-semibold mb-4 dark:text-white">{section}</h2>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                    {sectionResources.map((item: ResourceItem) => (
                                        <ResourceCard key={item.title} item={item} section={section} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : null;
                })
            )}
        </div>
    )
}

const ResourceCard = ({ item, section }: { item: ResourceItem; section: string }) => (
    <div className="bg-white dark:bg-black border rounded-lg shadow overflow-hidden hover:shadow-lg relative hover:transform hover:scale-95 transition-transform duration-300 min-w-[270px]">
        <Link to={`/explore/resources/${section.toLowerCase().replace(" ", "-")}`}>
            <div className="relative h-48">
                <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-base text-cblack dark:text-white">{item.title}</span>
                </div>
                <h3 className="font-normal mb-3 text-sm line-clamp-3">{item.description}</h3>
            </div>
        </Link>
    </div>
);

export default Resources;