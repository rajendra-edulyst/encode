import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSessionUser } from '@/store/authStore'
import { PiSignOutDuotone } from 'react-icons/pi'
import { useAuth } from '@/auth'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/shadcnAvatar'
import { JSX } from 'react'
import { User2 } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { useUserProfile } from '@/hooks/data/useGettingStarted'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = [
    {
        label: 'Profile',
        path: '/portfolio',
        icon: <User2 />
    }
]

const _UserDropdown = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const { profile_image, name, username } = useSessionUser((state) => state.user)
    const { data: userProfile } = useUserProfile()
    const { signOut } = useAuth()

    const handleSignOut = () => {
        signOut()
    }

    const getInitials = (name?: string) => {
        if (!name) return 'A'
        const parts = name.split(' ')
        return parts.length > 1
            ? parts[0][0]?.toUpperCase() + parts[1][0]?.toUpperCase()
            : parts[0][0]?.toUpperCase()
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="cursor-pointer flex items-center focus:outline-none outline-none border-none bg-transparent p-0"
                >
                    <Avatar className="w-8 h-8">
                        <AvatarImage
                            src={
                                profile_image ??
                                `https://ui-avatars.com/api/?name=${name}`
                            }
                            alt={name}
                        />
                        <AvatarFallback>
                            {getInitials(name)}
                        </AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 p-2 bg-black border-gray-800" align="end" sideOffset={8}>
                {/* User Info Header */}
                <DropdownMenuLabel className="font-normal p-2">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={
                                    profile_image ??
                                    `https://ui-avatars.com/api/?name=${name}`
                                }
                                alt={name}
                            />
                            <AvatarFallback>
                                {getInitials(name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 overflow-hidden">
                            <p className="text-sm font-bold leading-none text-white truncate">
                                {userProfile?.platform_name || name || 'Anonymous'}
                            </p>
                            <p className="text-xs leading-none text-gray-400 truncate">
                                {username || 'No email available'}
                            </p>
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-gray-800 my-1" />

                {/* Profile Link */}
                {dropdownItemList.map((item) => (
                    <DropdownMenuItem
                        key={item.label}
                        className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors focus:bg-white/10 text-white rounded-md ${location.pathname === item.path ? 'bg-white/5 font-medium' : ''
                            }`}
                        onClick={() => navigate(item.path)}
                    >
                        <span className="text-xl opacity-80">{item.icon}</span>
                        <span>{item.label}</span>
                    </DropdownMenuItem>
                ))}

                {/* Sign Out */}
                <DropdownMenuItem
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors focus:bg-white/10 text-white rounded-md mt-1"
                    onClick={handleSignOut}
                >
                    <span className="text-xl opacity-80">
                        <PiSignOutDuotone />
                    </span>
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown