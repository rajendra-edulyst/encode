import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import React from 'react';

export interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    color?: 'blue' | 'teal' | 'purple' | 'amber' | 'red' | 'green';
    loading?: boolean;
    error?: string | null;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, loading = false }) => {



    return (
        <>
            {!loading && <Card className="gap-0">
                <CardHeader>
                    <CardTitle className='dark:text-white'>{title}</CardTitle>
                    <CardAction><Icon size={24} className="dark:text-white" /></CardAction>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end justify-between mt-3">
                        <h2 className="text-2xl font-semibold dark:text-white">
                            {value}
                        </h2>
                    </div>
                </CardContent>
            </Card>}
            {
                loading && <Card className="gap-0">
                    <CardHeader>
                        <CardTitle className='dark:text-white'>{title}</CardTitle>
                        <CardAction><Icon size={24} className="dark:text-white" /></CardAction>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between mt-3">
                            <h2 className="text-2xl font-semibold dark:text-white animate-pulse">
                                ...
                            </h2>
                        </div>
                    </CardContent>
                </Card>
            }
        </>
    );
};

export default StatCard;