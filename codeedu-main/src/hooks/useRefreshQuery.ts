import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { debounce } from '@tanstack/pacer';

type QueryKey = Array<string>;

export function useRefreshQuery(key: QueryKey, debounceMs = 1000) {
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();
    const debouncedRef = useRef(
        debounce(async () => {
            setLoading(true);
            await queryClient.invalidateQueries({ queryKey: key });
            setLoading(false);
        }, { wait: debounceMs })
    );

    const refresh = useCallback(() => {
        debouncedRef.current();
    }, []);

    return { refresh, loading };
}