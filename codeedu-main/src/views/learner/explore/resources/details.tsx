import React from 'react'
import Header from './component/Header'
import { useParams } from 'react-router-dom';
import { useResource } from '@/hooks/data/create/useResource';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mapResourceIds } from '@/services/create/ResourceService';
import { toast } from 'sonner';
import ToolCard from '@/components/___ToolCard';
import LoadingSection from '@/components/LoadingSection';

type ResourceCategory = "Toolkits" | "Reading Shelf" | "av-vault";
type Tab = "all" | ResourceCategory;

const details = () => {

    const queryClient = useQueryClient();
    const { type, sub_type } = useParams<{ type?: string, sub_type?: string }>();
    const isTab = (val: string): val is Tab => ["all", "toolkits", "reading-shelf", "av-vault"].includes(val);
    const activeTab: Tab = type && isTab(type) ? (type as Tab) : "all";
    const [search, setSearch] = React.useState("");

    const subType = {
        toolkits: ['all', 'ai-tools', 'design-software', 'Productivity + Collaboration'],
        'reading-shelf': ['all', 'Magazines', 'Books', 'Blogs & Research Platforms'],
        'av-vault': ['all', 'Documentaries', 'Podcast', 'Video Lectures']
    }

    const menus = subType[activeTab.toLowerCase().replace(" ", "-") as keyof typeof subType] || [];
    const [activeMenu, setActiveMenu] = React.useState(sub_type ?? menus[0]);


    const params = new URLSearchParams();
    params.append('type', activeTab === "all" ? "" : activeTab === "av-vault" ? "A/V Vault" : activeTab?.toLowerCase().replace("-", " "));
    params.append('sub_type', activeMenu === "all" ? "" : activeMenu);
    const { data: items = [], isLoading } = useResource(params);

    const filteredItems = items.filter((item) => {
        if (!search) return true; // no search → show all
        const query = search.toLowerCase();
        return (
            item.name?.toLowerCase().includes(query) ||
            item.category?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query)
        );
    });


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

    return (
        <Header menus={menus} activeMenu={activeMenu?.toLowerCase().replace("-", " ")} setActiveMenu={setActiveMenu} type={activeTab} search={search} onSearch={setSearch} >
            <h2 className="text-xl font-semibold mb-4 capitalize dark:text-white">{activeMenu?.toLowerCase().replace("-", " ")}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {
                    filteredItems.map((item) => (
                        <ToolCard key={item.id} item={item} mapResource={mapResource} />
                    ))
                }
            </div>
            {
                (filteredItems.length === 0 && !isLoading) && (
                    <p className="text-gray-500">No results found</p>
                )
            }
            {
                isLoading && <LoadingSection title='Loading resources...' description='Please wait while we fetch the latest resources.' isLoading={isLoading} />
            }
        </Header >
    )
}

export default details





//     const [selectedCategory, setSelectedCategory] = React.useState("all");
//     const categories = ["all", ...new Set(items.map(item => item.category))];

//     const filteredItems = items.filter((item) => {
//         const matchesSearch = !search || (
//             item.name?.toLowerCase().includes(search.toLowerCase()) ||
//             item.category?.toLowerCase().includes(search.toLowerCase()) ||
//             item.description?.toLowerCase().includes(search.toLowerCase())
//         );
//         const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
//         return matchesSearch && matchesCategory;
//     });     
//     return (
//         <Header
//         categories={categories}             
//       selectedCategory={selectedCategory}   
//       onCategoryChange={setSelectedCategory} 
