export const colorStyles: Record<
    string,
    {
        bg: string;
        border: string;
        text: string;
        glow: string;
        iconBg: string;
        button: string;
        badge: string;
        color: string;
    }
> = {
    blue: {
        bg: 'bg-package-blue/10',
        border: 'border-package-blue/30',
        glow: 'card-glow-blue',
        text: 'text-package-blue',
        iconBg: 'bg-package-blue/10 text-package-blue border-package-blue/30',
        button: 'border-package-blue/30 text-package-blue hover:bg-package-blue/10 hover:border-package-blue/50',
        badge: 'bg-package-blue/10 text-package-blue',
        color: '#00A8E9',
    },
    "#3b82f6": {
        bg: 'bg-package-blue/10',
        border: 'border-package-blue/30',
        glow: 'card-glow-blue',
        text: 'text-package-blue',
        iconBg: 'bg-package-blue/10 text-package-blue border-package-blue/30',
        button: 'border-package-blue/30 text-package-blue hover:bg-package-blue/10 hover:border-package-blue/50',
        badge: 'bg-package-blue/10 text-package-blue',
        color: '#00A8E9',
    },
    magenta: {
        bg: 'bg-package-magenta/10',
        border: 'border-package-magenta/30',
        glow: 'card-glow-magenta',
        text: 'text-package-magenta',
        iconBg: 'bg-package-magenta/10 text-package-magenta border-package-magenta/30',
        button: 'border-package-magenta/30 text-package-magenta hover:bg-package-magenta/10 hover:border-package-magenta/50',
        badge: 'bg-package-magenta/10 text-package-magenta',
        color: '#E60086',
    },
    "#d946ef": {
        bg: 'bg-package-magenta/10',
        border: 'border-package-magenta/30',
        glow: 'card-glow-magenta',
        text: 'text-package-magenta',
        iconBg: 'bg-package-magenta/10 text-package-magenta border-package-magenta/30',
        button: 'border-package-magenta/30 text-package-magenta hover:bg-package-magenta/10 hover:border-package-magenta/50',
        badge: 'bg-package-magenta/10 text-package-magenta',
        color: '#E60086',
    },
    green: {
        bg: 'bg-package-green/10',
        border: 'border-package-green/30',
        glow: 'card-glow-green',
        text: 'text-package-green',
        iconBg: 'bg-package-green/10 text-package-green border-package-green/30',
        button: 'border-package-green/30 text-package-green hover:bg-package-green/10 hover:border-package-green/50',
        badge: 'bg-package-green/10 text-package-green',
        color: '#7FBC42',
    },
    "#10b981": {
        bg: 'bg-package-green/10',
        border: 'border-package-green/30',
        glow: 'card-glow-green',
        text: 'text-package-green',
        iconBg: 'bg-package-green/10 text-package-green border-package-green/30',
        button: 'border-package-green/30 text-package-green hover:bg-package-green/10 hover:border-package-green/50',
        badge: 'bg-package-green/10 text-package-green',
        color: '#7FBC42',
    },
};



export const duration: Record<string, { text: string; month: number; days: number }> = {
    '1_month': {
        text: '1 Month',
        month: 1,
        days: 30,
    },
    '3_months': {
        text: '3 Months',
        month: 3,
        days: 90,
    },
    '6_months': {
        text: '6 Months',
        month: 6,
        days: 180,
    },
    '1_year': {
        text: '1 Year',
        month: 12,
        days: 365,
    },
    '2_years': {
        text: '2 Years',
        month: 24,
        days: 730,
    },
}


export const packageGrouping = {
    "Min. Courses to complete": ["self-paced", "self_paced", "live-online", "live_online"],
    "Mentor Session to Complete": ["mentoring-session", "mentoring_session", "mentorship-session", "mentorship_session", "mentor-session", "mentor_session", "mentoring_sessions"],
    "Buzz Polls and Opinion Polls": ["buzz", "opinion_poll", "opinion-poll", "opinion_polls", "opinion-polls", "blogs", "blog"],
    "Attend Masterclass, Workshop etc": ["masterclass", "workshop", "workshops", "industry-visits", "industry_visits"],
    "Competitions": ["competition", "competitions"],
    "500+ Resource Tools Communities Building": ["add-on", "add_on"],
}

/**
 * Dynamically groups package parameters based on global parameter definitions.
 * Filters global parameters where isGroup is 1 and status is active, parses their groupItemIds (comma-separated),
 * matches them against allParameters of the package (by matching master.id),
 * and sums up their values.
 * 
 * @param allParameters Package parameters (e.g. userPackage.parameters)
 * @param globalParameters Global parameter definitions (e.g. from usePackageParameters)
 */
export const getGroupedParameters = (
    allParameters: any[],
    globalParameters: any[]
): Array<{ id: string | number; title: string; value: number; key: string }> => {
    if (!Array.isArray(allParameters) || !Array.isArray(globalParameters)) {
        return [];
    }

    // Filter active group parameters
    const groupDefinitions = globalParameters.filter(
        (param) => Number(param.isGroup) === 1 && param.status === 'active'
    );

    return groupDefinitions
        .map((group) => {
            const childIds = group.groupItemIds
                ? String(group.groupItemIds)
                      .split(',')
                      .map((id: string) => id.trim())
                : [];

            const matchedItems = allParameters.filter((item) => {
                const masterId = item?.master?.id;
                return masterId && childIds.includes(String(masterId));
            });

            if (matchedItems.length === 0) return null;

            const total = matchedItems.reduce(
                (sum: number, item: any) => sum + Number(item?.value || 0),
                0
            );

            return {
                id: group.id,
                title: group.label || group.key,
                value: total,
                key: group.key,
            };
        })
        .filter((item): item is { id: string | number; title: string; value: number; key: string } => item !== null);
};

/**
 * Dynamically groups package usage stats based on global parameter definitions.
 * Filters global parameters where isGroup is 1 and status is active, parses their groupItemIds (comma-separated),
 * matches them against userPackageParameterItems (by matching package_content_master.id),
 * and sums up their used and allowed values.
 * 
 * @param userPackageParameterItems Package parameter items (e.g. user_package_parameter_items)
 * @param globalParameters Global parameter definitions (e.g. from usePackageParameters)
 */
export const getGroupedUsageStats = (
    userPackageParameterItems: any[],
    globalParameters: any[]
): Array<{ id: string | number; title: string; used: number; allowed: number; key: string }> => {
    if (!Array.isArray(userPackageParameterItems) || !Array.isArray(globalParameters)) {
        return [];
    }

    // Filter active group parameters
    const groupDefinitions = globalParameters.filter(
        (param) => Number(param.isGroup) === 1 && param.status === 'active'
    );

    return groupDefinitions
        .map((group) => {
            const childIds = group.groupItemIds
                ? String(group.groupItemIds)
                      .split(',')
                      .map((id: string) => id.trim())
                : [];

            const matchedItems = userPackageParameterItems.filter((item) => {
                const masterId = item?.package_content_master?.id;
                return masterId && childIds.includes(String(masterId));
            });

            if (matchedItems.length === 0) return null;

            const used = matchedItems.reduce(
                (sum: number, item: any) => sum + Number(item?.used_access_count || 0),
                0
            );

            const allowed = matchedItems.reduce(
                (sum: number, item: any) => sum + Number(item?.allowed_access_count || 0),
                0
            );

            return {
                id: group.id,
                title: group.label || group.key,
                used,
                allowed,
                key: group.key,
            };
        })
        .filter((item): item is { id: string | number; title: string; used: number; allowed: number; key: string } => item !== null);
};