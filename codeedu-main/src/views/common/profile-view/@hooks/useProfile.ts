import { useQuery } from '@tanstack/react-query';
import { getprofile, Profile } from '../services/profileService';
import { Section } from '../services/sectionService';


interface ProfileResponse {
    portfolio: Profile
    sections?: [Section]
}

export const useMyProfile = () => {
    return useQuery<ProfileResponse>({
        queryKey: ['myProfile'],
        queryFn: async () => {
            const res = await getprofile();
            return res;
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};
