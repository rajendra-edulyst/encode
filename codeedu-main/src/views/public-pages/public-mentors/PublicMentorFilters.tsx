import { useState, useEffect } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/ShadcnButton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, RefreshCcw, Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

type Props = {
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

const PublicMentorFilters = ({
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
}: Props) => {
    const [locationOpen, setLocationOpen] = useState(false);
    const [domainOpen, setDomainOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

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
        <div className='flex flex-col md:flex-row md:items-center mb-6 justify-between gap-4 w-full'>
            {/* Top row: heading + right controls */}
            <div className="flex flex-col items-start w-full md:w-auto">
                <Heading
                    title={`Mentors (${count})`}
                    description="Find the right mentor for your learning journey."
                    className="mb-0 text-white"
                />
            </div>

            {/* Filters row */}
            <div className="flex items-start gap-3">
                
                {/* <Link to="/become-mentor">
                    <Button
                        className="bg-[#00ADEF] hover:bg-[#00ADEF]/90 text-black h-20 w-24 rounded-lg text-sm font-semibold leading-tight flex flex-col items-center justify-center p-0"
                        variant="secondary"
                    >
                        <span>Be a</span>
                        <span>Mentor</span>
                    </Button>
                </Link> */}

                <div className="flex flex-col gap-3 w-full md:w-auto md:flex-1 md:max-w-[600px]">
                    {/* Search and Icons Row */}
                    <div className="flex items-center gap-2 w-full">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                value={searchValue}
                                placeholder="Search by name or email..."
                                className="w-full border border-neutral-700 rounded-lg pl-9 pr-3 py-2 bg-[#1D1D1D] text-white text-sm outline-none focus:border-primary transition-colors h-10"
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>
                        
                        {/* Mobile Filter Toggle */}
                        <Button
                            variant="outline"
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className={cn(
                                "md:hidden h-10 w-10 p-0 border-neutral-700 bg-[#1D1D1D] hover:bg-neutral-800 shrink-0",
                                showMobileFilters && "bg-neutral-800"
                            )}
                        >
                            <SlidersHorizontal className="h-4 w-4 text-gray-300" />
                        </Button>

                        {/* Refresh */}
                        {onRefetch && (
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => onRefetch?.()}
                                className="border-neutral-700 bg-[#1D1D1D] hover:bg-neutral-800 text-white rounded-lg h-10 w-10 shrink-0"
                            >
                                <RefreshCcw className="h-4 w-4 text-gray-300" />
                            </Button>
                        )}
                    </div>

                    {/* Filter Dropdowns */}
                    <div className={cn(
                        "items-center gap-2 flex-wrap",
                        showMobileFilters ? "flex" : "hidden md:flex"
                    )}>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicMentorFilters;
