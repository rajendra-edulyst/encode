/* eslint-disable import/first */
// import Breadcrumb from '@/components/breadcrumb';
// import Heading from '@/components/heading';
// import ToolCard from '@/components/ToolCard';
// import { useMyResource } from '@/hooks/data/create/useResource';
// import { mapResourceIds } from '@/services/learner/ResourceService';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import React, { useState } from 'react'
// import { FiSearch } from 'react-icons/fi';
// import { toast } from 'sonner';

// const tabs = ["All", "toolkits", "reading-shelf", "A/V Vault"];



// const Resources = () => {


//     const queryClient = useQueryClient();
//     const [activeTab, setActiveTab] = useState("All");
//     const [search, setSearch] = useState("");

//     const params = new URLSearchParams();
//     const { data: items = [] } = useMyResource(params);

//     const filteredItems = items.filter(item => {
//         const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
//         const matchesCategory = activeTab === "All" || item.type === activeTab;
//         return matchesSearch && matchesCategory;
//     });

//     // show filteredItems according alphabetical order
//     filteredItems.sort((a, b) => a.name.localeCompare(b.name));


//     const mapResourceMutation = useMutation({
//         mutationFn: mapResourceIds,
//         onSuccess: (data) => {
//             console.log("Mapped resources:", data);
//             queryClient.invalidateQueries({ queryKey: ['resource'] });
//             queryClient.invalidateQueries({ queryKey: ['myresource'] });
//             toast.success('My Resources Updated successfully');
//         },
//         onError: (error) => {
//             console.error("Error mapping resources:", error);
//         }
//     });


//     const mapResource = (id: number) => {
//         mapResourceMutation.mutate([id]);
//     }

//     const breadcrumbItems = [
//         { label: 'My Resources' }
//     ];

//     return (
//         <div>
//             <Breadcrumb items={breadcrumbItems} />
//             <Heading title="My Resources" description="Discover the best AI tools, development resources, and productivity apps to supercharge your workflow and creativity." />
//             <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 mt-9 border-b'>
//                 <div className='flex gap-9'>
//                     {tabs.map((tab) => (
//                         <button key={tab} className={`capitalize text-base font-bold text-cblack ${activeTab === tab ? "border-b-2 border-pink-500" : "text-cblack hover:text-gray-700"}`} onClick={() => setActiveTab(tab)}>
//                             {tab}
//                         </button>
//                     ))}
//                 </div>
//                 <div className='relative w-full md:w-72 pb-2'>
//                     <input
//                         type="text"
//                         placeholder='Search tools & resources'
//                         value={search}
//                         className='w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 '
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                     <span className='absolute right-3 top-2.5 text-gray-400'> <FiSearch /></span>
//                 </div>
//             </div>
//             <div className='mt-6'>
//                 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//                     {filteredItems && filteredItems.map(item => (
//                         <ToolCard key={item.id} item={item} mapResource={mapResource} showRemove={true} />
//                     ))}
//                     {
//                         filteredItems?.length === 0 && (
//                             <p className="text-gray-500">No results found</p>
//                         )
//                     }
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default Resources








{/*
import { useState } from "react";
import { Search, ExternalLink, Sparkles, Code, Palette, Database, Brain, Zap } from "lucide-react";
import { Input } from "@/components/ui/ShadcnInput";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useResource } from "@/hooks/data/create/useResource";

interface Resource {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    tags: string[];
    featured?: boolean;
}

const resources: Resource[] = [
    {
        id: "1",
        name: "ChatGPT",
        description: "Conversational AI assistant for writing, coding, and problem-solving",
        url: "https://chat.openai.com",
        category: "AI Tools",
        tags: ["conversational", "writing", "coding"],
        featured: true
    },
    {
        id: "2",
        name: "Midjourney",
        description: "AI-powered image generation for creative artwork and design",
        url: "https://midjourney.com",
        category: "AI Tools",
        tags: ["image generation", "art", "design"],
        featured: true
    },
    {
        id: "3",
        name: "GitHub Copilot",
        description: "AI pair programmer that helps you write code faster",
        url: "https://github.com/features/copilot",
        category: "Development",
        tags: ["coding", "autocomplete", "productivity"]
    },
    {
        id: "4",
        name: "Figma",
        description: "Collaborative design tool for UI/UX design and prototyping",
        url: "https://figma.com",
        category: "Design",
        tags: ["design", "prototyping", "collaboration"]
    },
    {
        id: "5",
        name: "Claude",
        description: "AI assistant by Anthropic for analysis, writing, and coding",
        url: "https://claude.ai",
        category: "AI Tools",
        tags: ["analysis", "writing", "coding"]
    },
    {
        id: "6",
        name: "Notion AI",
        description: "AI-powered workspace for notes, docs, and project management",
        url: "https://notion.so",
        category: "Productivity",
        tags: ["notes", "documentation", "productivity"]
    },
    {
        id: "7",
        name: "Runway ML",
        description: "AI tools for video editing and creative content generation",
        url: "https://runwayml.com",
        category: "AI Tools",
        tags: ["video", "creative", "generation"]
    },
    {
        id: "8",
        name: "Supabase",
        description: "Open source Firebase alternative for backend services",
        url: "https://supabase.com",
        category: "Development",
        tags: ["database", "backend", "authentication"]
    }
];

const categories = [
    { name: "All", icon: Sparkles, color: "from-purple-500 to-pink-500" },
    { name: "AI Tools", icon: Brain, color: "from-blue-500 to-purple-500" },
    { name: "Development", icon: Code, color: "from-green-500 to-blue-500" },
    { name: "Design", icon: Palette, color: "from-pink-500 to-red-500" },
    { name: "Productivity", icon: Zap, color: "from-yellow-500 to-orange-500" },
    { name: "Database", icon: Database, color: "from-indigo-500 to-purple-500" }
];

const Resources = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredResources = resources.filter(resource => {
        const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });
    return (
        <div className="min-h-screen bg-gradient-background">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-primary opacity-10" />
                <div className="relative container mx-auto px-6 pt-24 pb-5">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text">
                            Resource Hub
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                            Discover the best AI tools, development resources, and productivity apps
                            to supercharge your workflow and creativity.
                        </p>

                        <div className="relative max-w-2xl mx-auto mb-12">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Search tools and resources..."
                                value={searchTerm}
                                className="pl-12 h-14 text-lg shadow-card focus-visible:ring-0"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 pb-24">
                <div className="mb-12">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const isSelected = selectedCategory === category.name;

                            return (
                                <button
                                    key={category.name}
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${isSelected
                                        ? 'bg-primary text-primary-foreground shadow-glow text-white'
                                        : 'bg-card/50 hover:bg-card border hover:border-primary/50 border-gray-200'
                                        }`}
                                    onClick={() => setSelectedCategory(category.name)}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="font-medium">{category.name}</span>
                                    <Badge variant="secondary" className="ml-1 text-xs">
                                        {category.name === "All"
                                            ? resources.length
                                            : resources.filter(r => r.category === category.name).length
                                        }
                                    </Badge>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredResources.map((resource) => (
                        <Card
                            key={resource.id}
                            className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-muted hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                            <CardHeader className="relative pb-4">
                                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                    {resource.name}
                                </CardTitle>
                                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                                    {resource.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="relative pt-0">
                                <div className="flex flex-wrap gap-1 mb-4">
                                    {resource.tags.slice(0, 3).map((tag) => (
                                        <Badge key={tag} variant="outline" className="text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="text-xs">
                                        {resource.category}
                                    </Badge>
                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        <span className="text-xs font-medium">Visit</span>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredResources.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold mb-2">No resources found</h3>
                        <p className="text-muted-foreground">
                            Try adjusting your search or filter criteria
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resources; */}



import Breadcrumb from '@/components/breadcrumb';
import Heading from '@/components/heading';
import ToolCard from '@/components/___ToolCard';
import { Button } from '@/components/ui/ShadcnButton';
import { useMyResource } from '@/hooks/data/create/useResource';
import { mapResourceIds } from '@/services/create/ResourceService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { FiSearch, FiInbox } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const tabs = ["All", "toolkits", "reading-shelf", "A/V Vault" ,"creative library"];

const Resources = () => {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("All");
    const [search, setSearch] = useState("");

    const params = new URLSearchParams();
    const { data: items = [] } = useMyResource(params);

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeTab === "All" || item.type === activeTab;
        return matchesSearch && matchesCategory;
    });


    filteredItems.sort((a, b) => a.name.localeCompare(b.name));

    const mapResourceMutation = useMutation({
        mutationFn: mapResourceIds,
        onSuccess: (data) => {
            console.log("Mapped resources:", data);
            queryClient.invalidateQueries({ queryKey: ['resource'] });
            queryClient.invalidateQueries({ queryKey: ['myresource'] });
            toast.success('My Resources Updated successfully');
        },
        onError: (error) => {
            console.error("Error mapping resources:", error);
        }
    });

    const mapResource = (id: number) => {
        mapResourceMutation.mutate([id]);
    }

    const breadcrumbItems = [
        { label: 'My Resources' }
    ];

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <Heading title="My Resources" description="Discover the best AI tools, development resources, and productivity apps to supercharge your workflow and creativity." />
            <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 mt-9 border-b'>
                <div className='flex gap-9 overflow-x-auto pb-2'>
                    {tabs.map((tab) => (
                        <button key={tab} className={`capitalize text-base text-cblack dark:text-white whitespace-nowrap ${activeTab === tab ? "border-b-2 border-pink-500 font-bold" : "text-cblack hover:text-gray-700"}`} onClick={() => setActiveTab(tab)}>
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
                        className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-black'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            <div className="mt-6">
                {filteredItems.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {filteredItems.map((item) => (
                            <ToolCard
                                key={item.id}
                                item={item}
                                mapResource={mapResource}
                                showRemove={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <FiInbox className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No resources found
                        </h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            {search ? `No resources match your search for "${search}". Try a different search term.` : "You haven't added any resources yet."}
                        </p>
                        <Button className='text-white'>
                            <Link to="/explore/resources" className="flex items-center gap-2">Explore Resources</Link>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Resources