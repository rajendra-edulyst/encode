import { PropsWithChildren, useEffect } from 'react'
import { Theme } from '@/@types/theme'
import { useThemeStore } from '@/store/themeStore'

type GroupCheckProps = PropsWithChildren<{
    groups?: Theme['groups']
}>

const GroupCheck = (props: GroupCheckProps) => {
    const { groups = [], children } = props
    
    const { group, setGroup } = useThemeStore();

    useEffect(() => {
        if (groups && groups.length > 0) {
            if (!groups.includes(group as 'create' | 'collaborate' | 'connect')) {
                if(groups.length > 0) {
                    setGroup(groups[0]);
                }
            }
        }
    }, [groups, group, setGroup])

    return <>{children}</>
}

export default GroupCheck
