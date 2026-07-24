import React from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'

interface PlanCardProps {
    icon: string
    title: string
    stats: {
        totalCourses: number
        mentorSlots: number
        onTheAgenda: number
        peakActions: number
    }
    licensesUsed: {
        used: number
        total: number
    }
}

const PlanCard: React.FC<PlanCardProps> = ({ icon, title, stats, licensesUsed }) => {
    return (
        <Card className="bg-[#323232] rounded-2xl p-6 border border-gray-700">
            <CardHeader>
                <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-2xl`}>
                        <img src={icon} alt={title} className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Courses</span>
                        <span className="text-white font-semibold">{stats.totalCourses}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Mentor Slots</span>
                        <span className="text-white font-semibold">{stats.mentorSlots}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">On The Agenda</span>
                        <span className="text-white font-semibold">{stats.onTheAgenda}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Peak Actions</span>
                        <span className="text-white font-semibold">{stats.peakActions}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="border-t border-gray-700 pt-4 w-full">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Total Licenses Used</span>
                        <span className="text-white font-bold text-lg">
                            {licensesUsed.used}/{licensesUsed.total}
                        </span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default PlanCard
