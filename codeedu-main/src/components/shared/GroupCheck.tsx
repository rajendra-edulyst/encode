import useGroup from '@/utils/hooks/useGroup'
import type { CommonProps } from '@/@types/common'
import { useThemeStore } from '@/store/themeStore'
// import { Theme } from '@/@types/theme'

interface GroupCheckProps extends CommonProps {
    groups?: ('create' | 'collaborate' | 'connect')[]
}

const GroupCheck = (props: GroupCheckProps) => {
    const { groups = [], children } = props
    const { group } = useThemeStore((state) => state)
    const groupMatched = useGroup(group, groups)
    return <>{groupMatched ? children : null}</>
}

export default GroupCheck
