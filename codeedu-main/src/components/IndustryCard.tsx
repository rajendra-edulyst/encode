import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Link } from 'react-router-dom'
import { Button } from './ui/ShadcnButton'
import { MoveRight } from 'lucide-react'
import { Industry } from '@/@types/collaborate/industry'

interface IndustryCardProps {
    industry: Industry;
}

const IndustryCard: React.FC<IndustryCardProps> = ({ industry }) => {
    return (
        <Card className='p-0 relative bg-[#323232] h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 overflow-hidden'>
            <CardHeader className='p-0 bg-white'>
                <div className='h-[183px] bg-contain bg-center bg-no-repeat rounded-t-lg' style={{ backgroundImage: `url(${industry.logo})` }}></div>
            </CardHeader>
            <CardContent className=''>
                <h4 className='mb-2 line-clamp-1 text-white'>{industry?.name}</h4>
            </CardContent>
            <CardFooter className='px-4 pb-6 flex flex-row gap-4 items-center justify-between'>
                <p className='text-white line-clamp-3'>{industry?.org_description}</p>
                <Button className='bg-[#7FBC42] hover:bg-[#7FBC42] text-black w-24 h-24 flex flex-col items-center justify-center gap-2 py-2'>
                    <Link
                        to={`/collaborate/infocus/profile/${industry?.id}`}
                        className='flex flex-col items-center justify-center gap-2 text-center'
                    >
                        <MoveRight size={16} />
                        View<br />Profile
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default IndustryCard