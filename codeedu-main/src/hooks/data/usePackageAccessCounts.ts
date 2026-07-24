import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ApiService from '@/services/ApiService';
import { useUserPackageDetails, useUserProfile } from './useGettingStarted';

export type PackageAccessCount = {
    allowedAccessCount: number | string;
    usedAccessCount: number | string;
    packageContentMaster?: {
        key?: string;
    };
};

type PackageAccessCountResponse = {
    data?: PackageAccessCount[];
};

const fetchPackageAccessCounts = async (
    userId: number | string,
    packageId: number | string,
) => {
    const response = await ApiService.fetchDataWithNode<PackageAccessCountResponse>({
        url: `/v1/user-package-parameter-items/access-count/${userId}/${packageId}`,
        method: 'get',
    });
    // const result = await fetch(`http://localhost:3001/api/v1/user-package-parameter-items/access-count/${userId}/${packageId}`);
    // const response: PackageAccessCountResponse = await result.json();
    // console.log('Fetched package access counts:', response);
    return response.data ?? [];
};

export const usePackageAccessCounts = () => {
    const { data: userProfile } = useUserProfile();
    const userId = userProfile?.id;
    
    const { data: packageDetails } = useUserPackageDetails(userId || 0)
    const packageData = useMemo(() => packageDetails?.data?.package, [packageDetails]);
    
    const packageId = packageData?.id;
    // const packageId = 6;

    const query = useQuery<PackageAccessCount[]>({
        queryKey: ['package-access-counts', userId, Number(packageId)],
        queryFn: () => fetchPackageAccessCounts(userId!, Number(packageId)),
        enabled: Boolean(userId && packageId),
        retry: 1,
        staleTime: 1000 * 60,
    });

    const usedCounts = useMemo(() => query.data ?? [], [query.data]);

    const isAccessExhausted = useCallback(
        (contentKey: string) => {
            const usage = usedCounts.find(
                (count) => count?.packageContentMaster?.key === contentKey,
            );

            return usage
                ? Number(usage.allowedAccessCount) === Number(usage.usedAccessCount)
                : false;
        },
        [usedCounts],
    );

    return {
        ...query,
        isAccessExhausted,
        usedCounts,
    };
};
