import React from 'react'
import { Breadcrumb as ShadcnBreadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
    label: string;
    path?: string;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {

    const { group } = useThemeStore((state) => state);

    const dashboard = group === 'create' ? '/create' : group === 'collaborate' ? '/collaborate' : '/connect';

    return (
        <ShadcnBreadcrumb className={cn('mb-3', className)}>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink to={`${dashboard}`} className='dark:text-white text-lg'>Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                {
                    items.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.path ? (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink to={item.path} className='dark:text-white text-lg'>{item.label}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                </>
                            ) : item.onClick ? (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <button onClick={item.onClick} className='dark:text-white text-lg hover:text-primary transition-colors cursor-pointer'>{item.label}</button>
                                    </BreadcrumbItem>
                                </>
                            ) : (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className='text-primary font-bold text-lg'>{item.label}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </React.Fragment>
                    ))
                }
            </BreadcrumbList>
        </ShadcnBreadcrumb>
    )
}

export default Breadcrumb
