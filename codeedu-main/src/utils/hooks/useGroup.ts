import { useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'

function useGroup(
    group: string =  '',
    groups: string[] = [],
) {
    
    const groupMatched = useMemo(() => {return groups.includes(group)}, [groups, group])

    if (isEmpty(groups) || typeof group === 'undefined') {
        return true
    }

    return groupMatched

}

export default useGroup
