import { type Cities, type State, Country, getCities, getCounties, getCountryStates } from "@/services/learner/CountryService";
import { useQuery } from "@tanstack/react-query";


export const useCountries = () => {
    return useQuery<Array<Country>>({
        queryKey: ['countries'],
        queryFn: async () => {
            const data = await getCounties();
            return data ?? [];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });
};

export const useStates = (countryId?: string) => {
    return useQuery<Array<State>>({
        queryKey: ['states', countryId],
        queryFn: async () => {
            const data = await getCountryStates(countryId!);
            return data ?? [];
        },
        enabled: !!countryId,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};

export const useCities = (stateId?: string) => {
    return useQuery<Array<Cities>>({
        queryKey: ['cities', stateId],
        queryFn: async () => {
            const data = await getCities(stateId!);
            return data ?? [];
        },
        enabled: !!stateId,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });
};
