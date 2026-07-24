import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileCard from '@/components/ProfileCard';
import PackageCard from '@/components/PackageCard';
import Licenses from '@/views/collaborate/institute/pages/licenses';

const HodDashboard = () => {
    const [filter, setFilter] = useState<string>('yearly');
    return (
        <div className="flex flex-col gap-6">
            <ProfileCard />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                <Licenses filter={filter} />

            </div>
        </div>
    );
};

export default HodDashboard;
