import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/ShadcnButton';
import { Calendar, Clock, ArrowRight, MapPin } from 'lucide-react';

interface IndustryHeroProps {
    banner: string;
    logo: string;
    name: string;
    location: string;
    domain?: string;
    date?: string;
    time?: string;
}

const IndustryHero: React.FC<IndustryHeroProps> = ({ banner, logo, name, location, domain, date, time }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
            {/* Left - Banner Image (70%) */}
            <div className="md:col-span-7 relative h-80 md:h-[450px] rounded-3xl overflow-hidden border border-gray-800 bg-cover bg-center"
                style={{ backgroundImage: `url(${banner || '/img/others/event.png'})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* Right - Profile Card (30%) */}
            <Card className="md:col-span-3 flex flex-col justify-between bg-[#1A1A1A] border-gray-800 rounded-3xl overflow-hidden">
                <CardContent className="p-6 space-y-6">
                    <div className="w-24 h-24 bg-white rounded-2xl p-3 flex items-center justify-center mb-4">
                        <img src={logo} alt={name} className="max-w-full max-h-full object-contain" />
                    </div>
                    
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-white leading-tight">
                            {name}
                        </h1>
                        <p className="flex items-center gap-1 text-gray-400 text-sm">
                            <MapPin size={14} />
                            {location}
                        </p>
                        {domain && <p className="text-[#88C057] text-sm font-medium">Domain: {domain}</p>}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-800">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#88C057]" />
                            <p className="text-white text-sm">
                                Date: <span className="font-bold">{date || 'TBA'}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-[#88C057]" />
                            <p className="text-white text-sm">
                                Time : <span className="font-bold">{time || 'TBA'}</span>
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                    <Button className="w-full bg-[#88C057] hover:bg-[#76a84c] text-black font-bold h-16 rounded-2xl flex items-center justify-center gap-2 shadow-lg">
                        <span className="text-left leading-tight">Register<br />Now</span>
                        <ArrowRight className="w-6 h-6 ml-auto" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default IndustryHero;
