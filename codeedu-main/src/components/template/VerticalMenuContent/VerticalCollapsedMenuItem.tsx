import Menu from '@/components/ui/Menu'
import Dropdown from '@/components/ui/Dropdown'
import VerticalMenuIcon from './VerticalMenuIcon'
import AuthorityCheck from '@/components/shared/AuthorityCheck'
import type { CommonProps, TraslationFn } from '@/@types/common'
import type { Direction } from '@/@types/theme'
import type { NavigationTree } from '@/@types/navigation'
import GroupCheck from '@/components/shared/GroupCheck'

interface DefaultItemProps extends CommonProps {
    nav: NavigationTree
    onLinkClick?: (link: { key: string; title: string; path: string }) => void
    t: TraslationFn
    indent?: boolean
    dotIndent?: boolean
    userAuthority: string[]
    expanded?: boolean
    onToggle?: (expanded: boolean) => void
    direction?: Direction
    renderAsIcon?: boolean
    currentKey?: string
    parentKeys?: string[]
}

interface CollapsedItemProps extends DefaultItemProps {
    direction: Direction
    renderAsIcon?: boolean
    currentKey?: string
    parentKeys?: string[]
}

interface VerticalCollapsedMenuItemProps extends CollapsedItemProps {
    sideCollapsed?: boolean
}

const { MenuItem, MenuCollapse } = Menu

const DefaultItem = ({
    nav,
    indent,
    dotIndent,
    children,
    userAuthority,
    t,
    expanded,
    onToggle,
}: DefaultItemProps) => {
    return (
        <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
            <GroupCheck groups={nav.groups}>
                <MenuCollapse
                    key={nav.key}
                    label={
                        <>
                            <VerticalMenuIcon icon={nav.icon} />
                            <span>{t(nav.translateKey, nav.title)}</span>
                        </>
                    }
                    eventKey={nav.key}
                    expanded={expanded}
                    dotIndent={dotIndent}
                    indent={indent}
                    onToggle={onToggle}
                >
                    {children}
                </MenuCollapse>
            </GroupCheck>
        </AuthorityCheck>
    )
}

const CollapsedItem = ({
    nav,
    direction,
    children,
    t,
    renderAsIcon,
    userAuthority,
    parentKeys,
}: CollapsedItemProps) => {
    const menuItem = (
        <MenuItem key={nav.key} isActive={parentKeys?.includes(nav.key)} eventKey={nav.key} className="mb-2" style={{ minWidth: "48px" }}>
            <VerticalMenuIcon icon={nav.icon} />
        </MenuItem>
    )

    const dropdownItem = (
        <div key={nav.key}>{t(nav.translateKey, nav.title)}</div>
    )

    return (
        <GroupCheck groups={nav.groups}>
            <AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
                <Dropdown
                    trigger="hover"
                    renderTitle={renderAsIcon ? menuItem : dropdownItem}
                    placement={direction === 'rtl' ? 'left-start' : 'right-start'}
                    strategy="fixed"
                >
                    {children}
                </Dropdown>
            </AuthorityCheck>
        </GroupCheck>
    )
}

const VerticalCollapsedMenuItem = ({
    sideCollapsed,
    ...rest
}: VerticalCollapsedMenuItemProps) => {
    return sideCollapsed ? (
        <CollapsedItem {...rest} />
    ) : (
        <DefaultItem {...rest} />
    )
}

export default VerticalCollapsedMenuItem
