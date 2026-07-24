import { Alert } from '@/components/ui'
import React from 'react'

function index() {
    return (
        <section className="container mx-auto bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h1 className="text-3xl font-bold mb-8">
                Notification
            </h1>
            <Alert
                title='This is a notification message'
                type='info'
            />
        </section>
    )
}

export default index