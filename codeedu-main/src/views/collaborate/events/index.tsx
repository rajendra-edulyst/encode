import LoadingSection from '@/components/LoadingSection'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEvents, useEventCategories } from '@/hooks/data/collaborate/useEvents'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import EventCard from './eventCard'
import Breadcrumb from '@/components/breadcrumb'
import { mixpanelService } from '@/services/mixpanel/MixpanelService'

const Events = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    const breadcrumbItems = [
        {
            label: 'Industry', path: "/collaborate/my-analysis/on-the-agenda",

        },
        {
            label: 'Event', path: "/",

        },

    ];

    const params =
        selectedCategory !== 'all'
            ? new URLSearchParams({ event_category_id: selectedCategory })
            : null

    const { data: events = [], isLoading, isError } = useEvents(params)
    const { data: categories = [], isLoading: isLoadingCategories } =
        useEventCategories()

    const location = useLocation()
    const urlCategory = new URLSearchParams(location.search).get('category')

    useEffect(() => {
        if (!urlCategory || selectedCategory !== 'all' || !categories.length)
            return

        const matched = categories.find(
            (cat) => cat.name.toLowerCase() === urlCategory.toLowerCase()
        )
        if (matched) setSelectedCategory(matched.id.toString())
    }, [urlCategory, categories, selectedCategory])

    useEffect(() => {
        mixpanelService.track('Events Page Viewed', {
            page_path: window.location.pathname,
            timestamp: new Date().toISOString()
        })
    }, [])

    useEffect(() => {
        if (selectedCategory && selectedCategory !== 'all') {
            const catName = categories.find((c) => c.id.toString() === selectedCategory)?.name || selectedCategory
            mixpanelService.track('Category Selected', {
                category: catName,
                page_path: window.location.pathname,
                timestamp: new Date().toISOString()
            })
        }
    }, [selectedCategory, categories])

    const isPastEvent = (endDate: string) =>
        new Date(endDate) < new Date()

    const getCategoryName = (id: number) =>
        categories.find((c) => c.id === id)?.name || 'Event'

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                {/* <div className="flex items-center gap-2">
                    <Link to="/collaborate/my-analysis/on-the-agenda">
                        <ArrowLeft className="w-5 h-5" color="#7FBC42" />
                    </Link>
                    <h1 className="text-cgreen text-2xl font-bold">Events</h1>
                </div> */}

                {/* Filter */}
                <Select
                    value={selectedCategory}
                    disabled={isLoadingCategories}
                    onValueChange={setSelectedCategory}
                >
                    <SelectTrigger className="w-[240px] bg-[#323232] border-gray-600 text-white">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        categoryName={getCategoryName(Number(event.event_category_id))}
                        isPast={isPastEvent(event.end_date)}
                    />
                ))}
            </div>

            {/* States */}
            {isLoading && (
                <LoadingSection
                    title="Loading events..."
                    isLoading={isLoading}
                    description="Please wait while we fetch the latest events."
                />
            )}

            {!isLoading && events.length === 0 && !isError && (
                <p className="text-center text-white py-12">
                    No events found.
                </p>
            )}

            {isError && (
                <p className="text-center text-red-500 py-12">
                    Failed to load events.
                </p>
            )}
        </div>
    )
}

export default Events

