import { useState, useEffect } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/ShadcnButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { TABS, TabKey } from './tabsConfig';

type Props = {
    selectedTab: TabKey;
    onTabChange: (tab: TabKey) => void;
    locationFilter: string;
    onLocationChange: (val: string) => void;
    domainFilter: string;
    onDomainChange: (val: string) => void;
    sortBy: string;
    onSortChange: (val: string) => void;
    locations: string[];
    domains: string[];
    searchTerm: string;
    count: number;
    onSearchChange: (val: string) => void;
    onRefetch?: () => void;
};

const MentorFilters = ({
    selectedTab,
    locationFilter,
    onLocationChange,
    domainFilter,
    onDomainChange,
    sortBy,
    onSortChange,
    locations,
    domains,
    searchTerm,
    count,
    onSearchChange,
    onRefetch,
    onTabChange,
}: Props) => {
    const [locationOpen, setLocationOpen] = useState(false);
    const [domainOpen, setDomainOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    const [searchValue, setSearchValue] = useState(searchTerm);

    useEffect(() => {
        setSearchValue(searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        const handler = setTimeout(() => {
            onSearchChange(searchValue);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchValue, onSearchChange]);

    return (
        <div className='flex items-center mb-6 justify-between'>

            {/* Top row: heading + right controls */}
            <div className="flex flex-col items-start mb-4">
                <Heading
                    title={`Mentors (${count})`}
                    description="Find the right mentor for your learning journey."
                    className="mb-0"
                />
                <div className="inline-flex mt-4 overflow-hidden rounded-xl border border-gray-600 bg-[#5A5A5A]">
                    {TABS.map((t, index) => {
                        const isActive = selectedTab === t.key
                        return (
                            <Button
                                key={t.key}
                                asChild
                                variant="ghost"
                                className={`
                                      rounded-none shadow-none min-w-28
                                      ${index !== 0 ? 'border-l border-[#6b6b6b]' : ''}
                                      ${isActive ? 'bg-primary text-white' : 'bg-transparent text-white hover:bg-[#666666]'}
                                    `}
                            >
                                <Link to={`/mentoring/${t.key === 'all' ? 'explore' : t.key}`}
                                    onClick={() => onTabChange(t.key)}
                                >
                                    {t.label}
                                </Link>
                            </Button>
                        )
                    })}
                </div>

            </div>

            {/* Filters row */}
            <div className="flex items-start gap-3">
                {/* Become mentor button */}
                <Link to="/become-mentor">
                    <Button
                        className="bg-[#00ADEF] hover:bg-[#00ADEF]/90 text-black h-20 w-24 rounded-lg text-sm font-semibold leading-tight flex flex-col items-center justify-center p-0"
                        variant="secondary"
                    >
                        <span>Be a</span>
                        <span>Mentor</span>
                    </Button>
                </Link>

                <div className="flex flex-col gap-2 flex-1 max-w-[600px]">
                    <input
                        value={searchValue}
                        placeholder="Search by name or email..."
                        className="w-full border border-neutral-700 rounded-lg px-3 py-2 bg-[#1D1D1D] text-white text-sm outline-none focus:border-primary transition-colors h-9"
                        onChange={(e) => setSearchValue(e.target.value)}
                    />

                    <div className="flex items-center gap-2">
                        {/* Sort By dropdown */}
                        <Popover open={sortOpen} onOpenChange={setSortOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-between min-w-[90px] border-neutral-700 bg-[#1D1D1D] text-white rounded-lg h-9 text-xs px-3">
                                    <span className="truncate">{sortBy === 'Sort By' ? 'A-Z' : sortBy}</span>
                                    <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[140px] p-0" align="start">
                                <Command>
                                    <CommandList>
                                        <CommandGroup>
                                            {['Sort By', 'Rating', 'A-Z', 'Z-A'].map((option) => (
                                                <CommandItem
                                                    key={option}
                                                    value={option}
                                                    className="text-xs"
                                                    onSelect={() => {
                                                        onSortChange(option);
                                                        setSortOpen(false);
                                                    }}
                                                >
                                                    {option}
                                                    <span className={cn("ml-auto", sortBy === option ? "opacity-100" : "opacity-0")}>✓</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {/* Location dropdown */}
                        <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-between min-w-[130px] border-neutral-700 bg-[#1D1D1D] text-white rounded-lg h-9 text-xs px-3">
                                    <span className="truncate">{locationFilter}</span>
                                    <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Search location..." className="h-8 text-xs" />
                                    <CommandList>
                                        <CommandEmpty className="text-xs">No location found.</CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem
                                                key="All Locations"
                                                value="All Locations"
                                                className="text-xs"
                                                onSelect={() => { onLocationChange('All Locations'); setLocationOpen(false); }}
                                            >
                                                All Locations
                                                <span className={cn("ml-auto", locationFilter === "All Locations" ? "opacity-100" : "opacity-0")}>✓</span>
                                            </CommandItem>
                                            {locations.map(loc => (
                                                <CommandItem
                                                    key={loc}
                                                    value={loc}
                                                    className="text-xs"
                                                    onSelect={() => { onLocationChange(loc); setLocationOpen(false); }}
                                                >
                                                    {loc}
                                                    <span className={cn("ml-auto", loc === locationFilter ? "opacity-100" : "opacity-0")}>✓</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {/* Domain dropdown */}
                        <Popover open={domainOpen} onOpenChange={setDomainOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="justify-between min-w-[130px] border-neutral-700 bg-[#1D1D1D] text-white rounded-lg h-9 text-xs px-3">
                                    <span className="truncate">{domainFilter}</span>
                                    <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Search domain..." className="h-8 text-xs" />
                                    <CommandList>
                                        <CommandEmpty className="text-xs">No domain found.</CommandEmpty>
                                        <CommandGroup>
                                            <CommandItem
                                                key="All Domains"
                                                value="All Domains"
                                                className="text-xs"
                                                onSelect={() => { onDomainChange('All Domains'); setDomainOpen(false); }}
                                            >
                                                All Domains
                                                <span className={cn("ml-auto", domainFilter === "All Domains" ? "opacity-100" : "opacity-0")}>✓</span>
                                            </CommandItem>
                                            {domains.map(dom => (
                                                <CommandItem
                                                    key={dom}
                                                    value={dom}
                                                    className="text-xs"
                                                    onSelect={() => { onDomainChange(dom); setDomainOpen(false); }}
                                                >
                                                    {dom}
                                                    <span className={cn("ml-auto", dom === domainFilter ? "opacity-100" : "opacity-0")}>✓</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {/* Refresh */}
                        {onRefetch && (
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => onRefetch?.()}
                                className="border-neutral-700 bg-[#1D1D1D] hover:bg-neutral-800 text-white rounded-lg h-9 w-9"
                            >
                                <RefreshCcw className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorFilters;
