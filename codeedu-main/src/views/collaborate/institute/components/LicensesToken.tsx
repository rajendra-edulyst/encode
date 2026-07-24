import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import PlanCard from './PlanCard'

interface LicensesTokenProps {
    planDetails?: {
        explorer?: {
            total_courses: number
            mentor_slots: number
            on_the_agenda: number
            peak_actions: number
            licenses_used: number
            total_licenses: number
        }
        builder?: {
            total_courses: number
            mentor_slots: number
            on_the_agenda: number
            peak_actions: number
            licenses_used: number
            total_licenses: number
        }
        navigator?: {
            total_courses: number
            mentor_slots: number
            on_the_agenda: number
            peak_actions: number
            licenses_used: number
            total_licenses: number
        }
    }
}

const LicensesToken: React.FC<LicensesTokenProps> = ({ planDetails }) => {
    const plans = [
        {
            icon: 'https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/getting-started/travel_explore.png',
            title: 'Explorer Plan',
            color: 'bg-cyan-400',
            stats: {
                totalCourses: planDetails?.explorer?.total_courses || 0,
                mentorSlots: planDetails?.explorer?.mentor_slots || 0,
                onTheAgenda: planDetails?.explorer?.on_the_agenda || 0,
                peakActions: planDetails?.explorer?.peak_actions || 0
            },
            licensesUsed: {
                used: planDetails?.explorer?.licenses_used || 0,
                total: planDetails?.explorer?.total_licenses || 0
            }
        },
        {
            icon: 'https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/getting-started/build.png',
            title: 'Builder Plan',
            color: 'bg-pink-500',
            stats: {
                totalCourses: planDetails?.builder?.total_courses || 0,
                mentorSlots: planDetails?.builder?.mentor_slots || 0,
                onTheAgenda: planDetails?.builder?.on_the_agenda || 0,
                peakActions: planDetails?.builder?.peak_actions || 0
            },
            licensesUsed: {
                used: planDetails?.builder?.licenses_used || 0,
                total: planDetails?.builder?.total_licenses || 0
            }
        },
        {
            icon: 'https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/getting-started/explore.png',
            title: 'Navigator Plan',
            color: 'bg-lime-400',
            stats: {
                totalCourses: planDetails?.navigator?.total_courses || 0,
                mentorSlots: planDetails?.navigator?.mentor_slots || 0,
                onTheAgenda: planDetails?.navigator?.on_the_agenda || 0,
                peakActions: planDetails?.navigator?.peak_actions || 0
            },
            licensesUsed: {
                used: planDetails?.navigator?.licenses_used || 0,
                total: planDetails?.navigator?.total_licenses || 0
            }
        }
    ]

    return (
        <Card>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map((plan, index) => (
                        <PlanCard key={index} {...plan} />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default LicensesToken
