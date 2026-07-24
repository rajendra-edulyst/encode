import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'
import { Link } from 'react-router-dom'

const RecentActivity = () => {
    return (
        <Card className="p-0 mt-4">
            <CardHeader className="p-2 px-3">
                <div className="flex items-center justify-between">
                    <h1 className='font-semibold capitalize text-lg mb-1'>Recent Activity</h1>
                    <Link to="/activity" className="text-sm text-primary hover:underline">View All</Link>
                </div>
            </CardHeader>
            <CardContent className="px-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity available.</p>
            </CardContent>
        </Card>
    )
}

export default RecentActivity