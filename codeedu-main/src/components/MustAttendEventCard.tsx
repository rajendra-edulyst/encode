import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/ShadcnButton'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import React from 'react'

interface EventCardData {
    icon: string
    type: string
    description: string
    banner: string
    title: string
    purpose: string
    is_assigned?: number
}

interface EventCardProps {
    data: EventCardData
}

const MustAttendEventCard: React.FC<EventCardProps> = ({ data }) => {
    const getColorScheme = () => {
        switch (data?.type?.toLowerCase()) {
            case 'creators meetups':
                return { bgColor: 'bg-codegreen/10' }
            case 'flagship event':
                return { bgColor: 'bg-codepink/10' }
            case 'career drive':
                return { bgColor: 'bg-codeyellow/10' }
            case 'immersion program':
                return { bgColor: 'bg-codeblue/20' }
            default:
                return { bgColor: 'bg-codepink/10' }
        }
    }

    const { bgColor } = getColorScheme()

    return (
        <Card className="flex flex-col min-h-[320px] bg-[#323232] border border-gray-700 hover:border-gray-600 transition-all duration-300 overflow-hidden p-0">
            <div
                className="h-48 w-full bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url(${data.banner})` }}
            />

            <CardContent className="flex items-center gap-4 pt-5 shrink-0">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${bgColor}`}>
                    <img src={data.icon} alt={data.type} className="h-4 w-4" />
                </div>

                <h5 className="text-[20px] font-semibold text-white leading-snug line-clamp-2">
                    {data.title}
                </h5>
            </CardContent>

            <CardFooter className="mt-auto flex items-end justify-between gap-4 pb-6 shrink-0">
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-4 max-w-[70%]">
                    {data.purpose}
                </p>

                <Button
                    disabled={data.is_assigned === 1}
                    className={cn(
                        "w-[130px] h-[94px] rounded-[12px] bg-codegreen hover:bg-codegreen/90 text-black shadow-md flex flex-col items-center justify-center gap-[14px] pt-[14px] pr-[20px] pb-[14px] pl-[20px]",
                        data.is_assigned === 1 && "bg-gray-500 cursor-not-allowed opacity-50"
                    )}
                >
                    <ArrowRight className="h-5 w-5" />
                    <span className="text-sm font-medium leading-tight text-center">
                        {data.is_assigned === 1 ? "Registered" : <>View <br /> Details</>}
                    </span>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default MustAttendEventCard
