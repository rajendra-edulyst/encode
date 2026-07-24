import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useEventCategories } from '@/hooks/data/collaborate/useEvents';
import Breadcrumb from '@/components/breadcrumb';
import MustAttendEventCard from '@/components/MustAttendEventCard';

const mustAttendStaticConfig: Record<number, any> = {
    6: {
        icon: '/img/icons/handshake.png',
        banner: '/img/others/Image19.png',
        purpose: "Step into the vibe zone where ideas flow, minds connect, and collaborations come alive. Your next big spark might just start here."
    },
    7: {
        icon: '/img/icons/ticket.png',
        banner: '/img/others/Image20.png',
        purpose: "Design unleashed. Chaos celebrated. Magic created. Welcome to the grand stage of design madness."
    },
    2: {
        icon: '/img/icons/graduation-cap.png',
        banner: '/img/others/Image21.png',
        purpose: "Don't just dream design live it. Kickstart your hustle with real projects, real teams, and real impact. Your creative career begins here."
    },
    9: {
        icon: '/img/icons/streetview.png',
        banner: '/img/others/Image23.png',
        purpose: "Not just learning — living the experience. Dive deep, explore, and emerge transformed through immersive creation."
    }
};

const resolveBanner = (catOrEvent: any, config: Record<number, any>, defaultBanner: string) => {
    if (catOrEvent?.name?.toLowerCase() === 'competitions' || catOrEvent?.name?.toLowerCase() === 'competition') {
        return '/img/others/Image17.png';
    }
    const img = catOrEvent.image;
    if (img && typeof img === 'string' && !img.toLowerCase().includes('default.png') && img.trim() !== '' && img !== 'null') {
        return img;
    }
    const id = Number(catOrEvent.id || catOrEvent.event_category_id);
    return config[id]?.banner || defaultBanner;
};

const MustAttendList = () => {
    const { data: categoryData = [] } = useEventCategories();

    const mustAttendData = useMemo(() => categoryData
        .filter(cat => cat.group_name === 'Must Attend')
        .map(cat => {
            const lower = cat.name?.toLowerCase() || '';
            let mappedName = cat.name;
            if (lower.includes('community meetup')) mappedName = 'Creators Meetup';
            if (lower.includes('flagship event')) mappedName = 'enCODE';

            return {
                id: cat.id,
                type: mappedName,
                title: mappedName,
                description: cat.description,
                icon: mustAttendStaticConfig[cat.id]?.icon || '/img/icons/handshake.png',
                banner: resolveBanner(cat, mustAttendStaticConfig, '/img/others/Image19.png'),
                purpose: mustAttendStaticConfig[cat.id]?.purpose || cat.description
            };
        }), [categoryData]);

    const breadcrumbItems = [
        { label: 'Must Attend List', path: '' },
    ];

    return (
        <div className="space-y-5">
            <div className="space-y-4">
                <Breadcrumb items={breadcrumbItems} className='mb-0' />
                <p className='text-lg text-white'>High-priority flagship events and community gatherings across India</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 pb-5 md:pb-0">
                {mustAttendData.map((item, index) => (
                    <div key={`${item.type}-${index}`} className="h-full">
                        <Link to={`/collaborate/must-attend?category=${item.type}`} className="block h-full">
                            <MustAttendEventCard data={item} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MustAttendList;
