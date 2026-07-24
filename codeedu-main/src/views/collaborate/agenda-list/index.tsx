import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useEventCategories } from '@/hooks/data/collaborate/useEvents';
import Breadcrumb from '@/components/breadcrumb';
import AgendaCard from '@/components/AgendaCard';

const agendaStaticConfig: Record<number, any> = {
    4: { banner: '/img/others/image15.png' },
    3: { banner: '/img/others/image16.png' },
    5: { banner: '/img/others/Image14.png' },
    8: { banner: '/img/others/Image17.png' }
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

const AgendaList = () => {
    const { data: categoryData = [] } = useEventCategories();

    const agendaData = useMemo(() => categoryData
        .filter(cat => cat.group_name === 'On the Agenda')
        .map(cat => ({
            id: cat.id,
            type: cat.name,
            title: cat.name,
            description: cat.description,
            banner: resolveBanner(cat, agendaStaticConfig, '/img/others/image15.png'),
        })), [categoryData]);

    const breadcrumbItems = [
        { label: 'On Agenda list', path: '' },
    ];

    return (
        <div className="space-y-5">
            <div className="space-y-4">
                <Breadcrumb items={breadcrumbItems} className='mb-0' />
                <p className='text-lg text-white'>Upcoming learning and networking opportunities across India</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-5 md:pb-0">
                {agendaData.map((item, index) => (
                    <div key={`${item.type}-${index}`} className="h-96 rounded-[20px] overflow-hidden relative bg-cover bg-center">
                        <Link to={`/collaborate/agenda?category=${item.type}`} className="block h-full">
                            <AgendaCard data={item} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgendaList;
