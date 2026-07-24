import { useAuth } from '@/auth';
import { Switch } from '@/components/ui/switch';
import { INDUSTRY } from '@/constants/roles.constant';
import { useUserProfile, useSaveUserInterest } from '@/hooks/data/useGettingStarted';
import { memo, useEffect, useState } from 'react';

const SwitchGroup = () => {


    const { data: userProfile } = useUserProfile();
    const { mutate: saveUserInterest } = useSaveUserInterest();
    const { user } = useAuth();

    const isOrg = `${user?.authority}` === INDUSTRY;


    const items = [
        { label: 'Hire Me', key: 'is_hire_me_enabled', forOrg: false },
        { label: 'Skill Up', key: 'is_skill_up_enabled', forOrg: false },
        { label: 'Hiring Now', key: 'is_hiring_now_enabled', forOrg: true },
        { label: 'Co-Collab Now', key: 'is_co_collab_now_enabled', forOrg: true }
    ] as const;

    const [switches, setSwitches] = useState({
        is_hire_me_enabled: userProfile?.is_hire_me_enabled === 1,
        is_skill_up_enabled: userProfile?.is_skill_up_enabled === 1,
        is_hiring_now_enabled: userProfile?.is_hiring_now_enabled === 1,
        is_co_collab_now_enabled: userProfile?.is_co_collab_now_enabled === 1,
    });


    const handleSwitchChange = (field: string, checked: boolean) => {
        setSwitches(prev => ({ ...prev, [field]: checked }));
        const payload = {
            [field]: checked ? 1 : 0
        };
        saveUserInterest(payload);
    };

    useEffect(() => {
        if (userProfile) {
            setSwitches({
                is_hire_me_enabled: userProfile.is_hire_me_enabled === 1,
                is_skill_up_enabled: userProfile.is_skill_up_enabled === 1,
                is_hiring_now_enabled: userProfile.is_hiring_now_enabled === 1,
                is_co_collab_now_enabled: userProfile.is_co_collab_now_enabled === 1,
            });
        }
    }, [userProfile]);


    return (
        <div className="flex flex-wrap gap-3">
            {items
                .filter(({ forOrg }) => forOrg === isOrg)
                .map(({ label, key }) => (
                    <button
                        key={key}
                        className="px-6 py-3 bg-[#5A5A5A] rounded-xl font-jacques flex items-center gap-2 hover:bg-gray-700 transition"
                    >
                        <span>{label}</span>
                        <Switch
                            className="rounded-full relative bg-[#171717] data-[state=checked]:bg-[#2A2A2A]"
                            checked={switches[key]}
                            onCheckedChange={(checked) => handleSwitchChange(key, checked)}
                        />
                    </button>
                ))}
        </div>
    );
};

export default memo(SwitchGroup);