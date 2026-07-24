import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/ShadcnButton';
import { ArrowRight } from 'lucide-react';

interface Industry {
    id: string;
    name: string;
    logo: string;
    description: string;
    tag?: string;
}

const ParticipatingIndustries = () => {
    const industries: Industry[] = [
        {
            id: '1',
            name: 'Livespace',
            logo: '/img/others/livespace.png',
            description: 'De-end-to-end interiors, renovation or modular solutions, we have it, all for your home.',
            tag: 'Coming Soon'
        },
        {
            id: '2',
            name: 'Interaction Design Foundation',
            logo: '/img/others/idf.png',
            description: 'De-end-to-end interiors, renovation or modular solutions, we have it, all for your home.',
            tag: 'Coming Soon'
        },
        {
            id: '3',
            name: 'Fabriclore',
            logo: '/img/others/fabriclore.png',
            description: 'De-end-to-end interiors, renovation or modular solutions, we have it, all for your home.',
            tag: 'Coming Soon'
        },
        {
            id: '4',
            name: 'Adobe',
            logo: '/img/others/adobe.png',
            description: 'De-end-to-end interiors, renovation or modular solutions, we have it, all for your home.',
            tag: 'Coming Soon'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry) => (
                <Card key={industry.id} className="bg-[#2A2A2A] border-none rounded-3xl overflow-hidden group">
                    <CardContent className="p-0">
                        <div className="bg-white h-24 flex items-center justify-center p-4 relative">
                            <img src={industry.logo} alt={industry.name} className="max-h-full max-w-full object-contain" />
                            {industry.tag && (
                                <div className="absolute top-2 right-2 bg-[#FF5A5A] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    {industry.tag}
                                </div>
                            )}
                        </div>
                        <div className="p-4 space-y-3">
                            <h4 className="text-white font-bold text-lg">{industry.name}</h4>
                            <p className="text-gray-400 text-xs line-clamp-2">
                                {industry.description}
                            </p>
                            <div className="flex gap-2">
                                <span className="bg-[#3A3A3A] text-gray-400 text-[10px] px-2 py-1 rounded-full">Furniture</span>
                                <span className="bg-[#3A3A3A] text-gray-400 text-[10px] px-2 py-1 rounded-full">Interior Design</span>
                            </div>
                            <Button className="w-full bg-[#88C057] hover:bg-[#76a84c] text-black font-bold flex items-center justify-between px-4 py-5 rounded-xl mt-2">
                                <span className="text-sm">View Profile</span>
                                <ArrowRight size={18} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ParticipatingIndustries;
