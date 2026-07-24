import Breadcrumb from '@/components/breadcrumb'
import React from 'react'

const Activity = () => {

    const breadcrumbItems = [
        { label: 'Recent Activity' },
    ]

    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Recent Activity</h1>
                    <p className="text-sm text-gray-500">Manage your Recent Activity</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* <StatusIndicator error={error} loading={loading} loadingMessage={"Syncing Scheduled Sessions"} /> */}
                </div>
            </div>
            <div className="mt-4">
                <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity available.</p>
            </div>
        </div>
    )
}

export default Activity