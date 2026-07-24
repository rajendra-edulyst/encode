import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/ShadcnButton'
import { Input } from '@/components/ui/ShadcnInput'

interface CalendarHeaderProps {
    currentView: 'day' | 'week' | 'month' | 'year'
    currentDate: Date
    onViewChange: (view: 'day' | 'week' | 'month' | 'year') => void
    onNavigate: (direction: 'prev' | 'next' | 'today') => void
}

export const CalendarHeader = ({
    currentView,
    onViewChange,
    onNavigate,
}: CalendarHeaderProps) => {

    return (
        <div className="flex flex-wrap dark:bg-[#1D1D1D] bg-gray-200 items-center justify-between p-4 gap-4">
            <div className="flex items-center gap-2">
                <Button
                    variant="default"
                    size="sm"
                    className='dark:bg-white dark:text-black font-bold '
                    onClick={() => onNavigate('prev')}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="default"
                    size="sm"
                    className='dark:bg-white min-w-[80px] dark:text-black '
                    onClick={() => onNavigate('today')}
                >
                    Today
                </Button>
                <Button
                    variant="default"
                    size="sm"
                    className='dark:bg-white dark:text-black font-bold '
                    onClick={() => onNavigate('next')}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex gap-2">
                <Button
                    variant={currentView === 'day' ? 'default' : 'ghost'}
                    size="sm"
                    className={
                        currentView === 'day'
                            ? 'bg-primary text-white'
                            : 'dark:text-white'
                    }
                    onClick={() => onViewChange('day')}
                >
                    Day
                </Button>
                <Button
                    variant={currentView === 'week' ? 'default' : 'ghost'}
                    size="sm"
                    className={
                        currentView === 'week'
                            ? 'bg-primary text-white'
                            : 'dark:text-white'
                    }
                    onClick={() => onViewChange('week')}
                >
                    Week
                </Button>
                <Button
                    variant={currentView === 'month' ? 'default' : 'ghost'}
                    size="sm"
                    className={
                        currentView === 'month'
                            ? 'bg-primary text-white'
                            : 'dark:text-white'
                    }
                    onClick={() => onViewChange('month')}
                >
                    Month
                </Button>
                <Button
                    variant={currentView === 'year' ? 'default' : 'ghost'}
                    size="sm"
                    className={
                        currentView === 'year'
                            ? 'bg-primary text-white'
                            : 'dark:text-white'
                    }
                    onClick={() => onViewChange('year')}
                >
                    Year
                </Button>
            </div>

            <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-9" />
            </div>
        </div>
    )
}
