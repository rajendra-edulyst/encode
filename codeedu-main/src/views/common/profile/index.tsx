import React, { useEffect } from 'react';
import { useAuth } from '@/auth';
import Preview from './preview';
import { mixpanelService } from '@/services/mixpanel/MixpanelService';

const Portfolio: React.FC = () => {

    const { user } = useAuth()

    useEffect(() => {
        mixpanelService.track('Profile Page Viewed', {
            page_path: window.location.pathname,
            timestamp: new Date().toISOString()
        })
    }, [])

    if (!user) {
        return (
            <div>
                <Preview personalInfoHideIn={true} />
            </div>
        );
    } else {
        return (
            <div>
                <Preview showTypeIn="edit" personalInfoHideIn={false} />
            </div>
        );
    }

};

export default Portfolio;