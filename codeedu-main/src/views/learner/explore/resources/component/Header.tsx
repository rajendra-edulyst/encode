import Heading from '@/components/heading';
import { ArrowLeft, Search } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

interface HeaderProps {
    menus: string[];
    children: React.ReactNode;
    activeMenu?: string;
    setActiveMenu: (menu: string) => void;
    type: string;
    search: string;
    onSearch: (search: string) => void;
}

const Header = ({ menus, children, activeMenu, setActiveMenu, type, search, onSearch }: HeaderProps) => {
    const handleMenuClick = (menu: string) => {
        setActiveMenu(menu?.toLowerCase().replace("-", " "));
    };

    return (
        <div>
            <div>
                <div className='flex items-center gap-5'>
                    <Link to={'/explore/resources'} className="flex items-center">
                        <ArrowLeft className='w-5 h-5 text-cblack dark:text-white' />
                    </Link>
                    <Heading 
                        title={type?.toLowerCase().replace("-", " ")} 
                        description='Explore a curated list of resources tailored for your needs.' 
                        className='mb-0' 
                    />
                </div>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 mt-9 border-b'>
                    <div className='flex gap-9 overflow-x-auto pb-2'>
                        {menus.map((tab) => (
                            <button 
                                key={tab} 
                                className={`text-base dark:text-white text-cblack capitalize whitespace-nowrap ${activeMenu === tab?.toLowerCase().replace("-", " ") ? "border-b-2 border-pink-500 font-bold" : "text-cblack hover:text-gray-700"}`} 
                                onClick={() => handleMenuClick(tab)}
                            >
                                {tab?.toLowerCase().replace("-", " ")}
                            </button>
                        ))}
                    </div>
                    <div className='relative w-full md:w-72 pb-2'>
                        <span className='absolute left-3 top-2.5 text-gray-400'> 
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder='Search tools & resources'
                            value={search}
                            className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-black'
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div>
                {children}
            </div>
        </div>
    )
}

export default Header