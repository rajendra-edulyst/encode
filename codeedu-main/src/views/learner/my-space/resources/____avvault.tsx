import { useResource } from '@/hooks/data/create/useResource';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import React, { useMemo, useState } from 'react'
import { FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';





const Avvault = () => {
    const [activeTab, setActiveTab] = useState("All");
    const [search, setSearch] = useState("");

    const { data: allResources = [] } = useResource();

    const Avvault = allResources.filter((item) => item.type === "A/V Vault");


    const tabs = useMemo(() => {
        const uniqueCategories = Array.from(new Set(Avvault.map((item) => item.sub_type).filter((subType) => subType !== "Professional Connect")));
        return ["All", ...uniqueCategories];
    }, [Avvault]);




    const filteredSections = activeTab === "All" ? tabs.slice(1) : [activeTab];

    return (
        <div className='p-6 md:p-10'>
            <div className='flex items-center gap-2'>
                <Link to={'/my-space/resources'}>
                    <p className='w-4 h-4'>  <ArrowLeft /></p>
                </Link>
                <h1 className='text-cblack'>AV Vault</h1>

            </div>
            <p className='text-lg mt-3' >
                Multimedia learning that informs, engages, and inspires.
            </p>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 mt-9 border-b'>
                <div className='flex gap-9'>
                    {tabs.map((tab) => (
                        <button key={tab}
                            className={` text-base font-bold text-cblack ${activeTab === tab
                                ? "border-b-2 border-pink-500"
                                : "text-cblack hover:text-gray-700"
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}

                        </button>
                    ))}
                </div>

                <div className='relative w-full md:w-72 pb-2'>
                    <input
                        type="text"
                        placeholder='Search tools & resources'
                        value={search}
                        className='w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 dark:bg-black'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <span className='absolute right-3 top-2.5 text-gray-400'> <FiSearch /></span>
                </div>
            </div>

            {filteredSections.map((section) => (
                <div key={section} className=" rounded-lg  p-3 overflow-hidden md:overflow-auto w-screen md:w-auto mb-10">
                    <h2 className="text-xl font-semibold mb-4">{section}</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {Avvault
                            .filter((item) =>
                                item.name.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((item) => (
                                <div key={item.name}
                                    className="max-w-sm bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition cursor-pointer"
                                    onClick={() => item.official_url && window.open(item.official_url, "_blank")}

                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                        {item.category && (
                                            <span className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-600 font-medium truncate max-w-[100px]">
                                            {Array.isArray(item.category)
                                                ? item.category[0]?.split(/[\s,]/)[0] 
                                                : (item.category as string).split(/[\s,]/)[0]} 
                                            </span>
                                        )}
                                     </div>
                                    <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                                    <p className="text-sm font-medium text-gray-800 mt-1">{item.pricing}</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        {item.description}
                                    </p>
                                    <div className="mt-auto flex justify-end">
                                        <a
                                            className="mt-4 inline-flex items-center gap-1 text-pink-600 hover:text-pink-700 font-medium text-sm"
                                            onClick={() => item.official_url && window.open(item.official_url, "_blank")}
                                        >
                                            <ExternalLink className="w-4 h-4" /> Visit
                                        </a>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
export default Avvault