import classNames from '@/utils/classNames'
import { HEADER_HEIGHT } from '@/constants/theme.constant'
import type { ReactNode } from 'react'
import type { CommonProps } from '@/@types/common'

interface HeaderProps extends CommonProps {
    headerStart?: ReactNode
    headerEnd?: ReactNode
    headerMiddle?: ReactNode
    container?: boolean
    wrapperClass?: string
}

const Header = (props: HeaderProps) => {
    const {
        headerStart,
        headerEnd,
        headerMiddle,
        className,
        container,
        wrapperClass,
    } = props

    return (
        <header className={classNames('header', className, 'z-[99]')}>
            <div
                className={classNames(
                    'header-wrapper md:!h-[75px] flex items-center justify-between',
                    container && 'container mx-auto',
                    wrapperClass,
                )}
                style={{ height: HEADER_HEIGHT }}
            >
                <div className="header-action header-action-start flex-1">
                    {headerStart}
                </div>
                {headerMiddle && (
                    <div className="header-action header-action-middle flex-1">
                        {headerMiddle}
                    </div>
                )}
                <div className="header-action header-action-end flex-1 justify-end">
                    {headerEnd}
                </div>
            </div>
        </header>
    )
}

export default Header
