import React, { useEffect, useState } from 'react'
import { useUserProfile } from '@/hooks/data/useGettingStarted'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet'
import { ArrowRight } from 'lucide-react'
import { Badge } from './ui/badge'
import { useWebSocket } from '@/hooks/useWebSocket'
import { colorStyles } from '@/lib/packageColor'
import { colorStyles as pkgColor } from '@/utils/colorMapping'

const PackageCard = () => {
    const { data: userProfile } = useUserProfile()
    const [parameters, setParameters] = useState<any>([])
    const [isCanvasOpen, setIsCanvasOpen] = useState(false)
    const [packageStyle, setPackageStyle] = useState<any>({})
    const { send, lastMessage } = useWebSocket();

    useEffect(() => {
        if (!userProfile?.id) return;

        send({
            type: 'get_user_package_parameters',
            userId: userProfile.id,
        });
    }, [userProfile?.id]);

    useEffect(() => {
        if (!lastMessage || lastMessage.type !== 'user_package_parameters') return

        const messageData = lastMessage.data ?? lastMessage.payload ?? lastMessage
        const packages = Array.isArray(messageData?.packages) ? messageData.packages : []
        setParameters(packages)
        const nextColorCode = packages[0]?.color_code
        setPackageStyle(nextColorCode ? pkgColor[nextColorCode] ?? {} : {})
    }, [lastMessage])

    const currentPackage = parameters[0]

    // Group items by category name
    const getItemsByCategory = () => {
        if (!currentPackage?.items) return {}

        return currentPackage.items.reduce((acc: any, item: any) => {
            const categoryName = item.package_category_name || 'Other'
            if (!acc[categoryName]) {
                acc[categoryName] = []
            }
            acc[categoryName].push(item)
            return acc
        }, {})
    }

    const itemsByCategory = getItemsByCategory()

    // Calculate overall consumption
    const calculateOverallConsumption = () => {
        if (!currentPackage?.items) return { totalAllowed: 0, totalUsed: 0, percentage: 0 }

        const totalAllowed = currentPackage.items.reduce((sum: number, item: any) => sum + item.allowed_access_count, 0)
        const totalUsed = currentPackage.items.reduce((sum: number, item: any) => sum + item.used_access_count, 0)
        const percentage = totalAllowed > 0 ? (totalUsed / totalAllowed) * 100 : 0

        return { totalAllowed, totalUsed, percentage }
    }

    const { totalAllowed, totalUsed, percentage } = calculateOverallConsumption()

    // Category color mapping
    const getCategoryColor = (categoryName: string) => {
        const color = colorStyles[categoryName]
        return color
    }

    const ProgressCanvas = () => (
        <Sheet open={isCanvasOpen} onOpenChange={setIsCanvasOpen}>
            <SheetContent side="right" className="w-[350px] sm:w-[600px] overflow-y-auto min-w-[350px] lg:max-w-lg lg-p-6 p-4 z-[999]">
                <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-start">Package Progress Details</SheetTitle>
                </SheetHeader>

                <div className="mt-6 mb-24 space-y-6">
                    {/* User Info */}
                    <div className="border-b pb-4">
                        <h3 className="font-semibold text-lg">{userProfile?.name || 'Ankita'}</h3>
                        <p className="text-gray-500 text-sm">{userProfile?.email || 'ankita@mailinator.com'}</p>
                        <p className="text-gray-400 text-xs">Detailed package & activity consumption</p>
                    </div>

                    {/* Package Info */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className={`text-2xl font-bold ${packageStyle?.text}`}
                                >
                                    {currentPackage?.package_name || 'Builder'}
                                </span>
                                <Badge variant="outline" className="pt-1 text-[11px]">1 YEAR</Badge>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                Expires 13 May 2027 · 365 days left
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold">{Math.round(percentage)}%</p>
                            <p className="text-xs text-gray-500">Consumed</p>
                        </div>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Overall consumption</span>
                            <span>{totalUsed} / {totalAllowed} ({Math.round(percentage)}%)</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className={`rounded-full h-2 transition-all duration-300 ${packageStyle?.bgDark}`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Activity Section */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Activity</h4>
                        <div className="space-y-4">
                            {Object.entries(itemsByCategory).sort(([, a]: any, [, b]: any) => {
                                const orderA = a?.[0]?.package_category_order ?? 0
                                const orderB = b?.[0]?.package_category_order ?? 0

                                return orderA - orderB
                            }).map(([categoryName, items]: [string, any]) => {
                                const colorCode = items.length > 0 ? items[0].package_category_color_code : "#3b82f6"

                                const color = getCategoryColor(colorCode).color

                                return (
                                    <div key={categoryName} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h5 className={`font-medium text-[${color}]`} style={{ color: color }}>
                                                {categoryName.toUpperCase()}
                                            </h5>
                                            <Badge variant={"outline"} className="text-[11px] px-2 pt-1 bg-green-500">ACTIVE</Badge>
                                        </div>
                                        <div className="space-y-3">
                                            {items.map((item: any) => {
                                                const used = item.used_access_count
                                                const allowed = item.allowed_access_count
                                                const progress = allowed > 0 ? (used / allowed) * 100 : 0
                                                return (
                                                    <div key={item.id} className="space-y-1">
                                                        <div className="flex justify-between text-sm">
                                                            <span>{item.label}</span>
                                                            <span>{used} of {allowed} used</span>
                                                        </div>
                                                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                                                            <div
                                                                className="rounded-full h-1.5 transition-all duration-300"
                                                                style={{
                                                                    width: `${progress}%`,
                                                                    backgroundColor: color
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Summary Table */}
                    <div className="border rounded-lg overflow-auto mb-8">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-700 text-gray-300">
                                <tr>
                                    <th className="px-2 py-1 text-left">Category</th>
                                    <th className="px-2 py-1 text-left">Allotted</th>
                                    <th className="px-2 py-1 text-left">Used</th>
                                    <th className="px-2 py-1 text-left">Left</th>
                                    <th className="px-2 py-1 text-left">Progress</th>
                                </tr>
                            </thead>
                            <tbody className='text-gray-300'>
                                {currentPackage?.items?.map((item: any) => {
                                    const used = item.used_access_count
                                    const allowed = item.allowed_access_count
                                    const left = allowed - used
                                    const progress = allowed > 0 ? (used / allowed) * 100 : 0
                                    return (
                                        <tr key={item.id} className="border-t">
                                            <td className="px-4 py-2 font-medium">{item.label}</td>
                                            <td className="px-4 py-2">{allowed}</td>
                                            <td className="px-4 py-2">{used}</td>
                                            <td className="px-4 py-2">{left}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-gray-500 rounded-full h-1.5">
                                                        <div
                                                            className="bg-green-500 rounded-full h-1.5"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs">{Math.round(progress)}%</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )

    return (
        <>
            <div className='border border-gray-300 dark:border-gray-800 dark:bg-gray-900 bg-white rounded-xl p-4 flex'>
                {/* Package Header */}
                <div className='flex flex-col items-center justify-center pb-1 w-1/3 lg:w-1/4 xl:w-1/4 relative'>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center">
                        {
                            (currentPackage && currentPackage?.package_name && currentPackage?.icon) ? (
                                <img src={currentPackage?.icon} alt={currentPackage?.package_name} width={'30px'} height={'30px'} />
                            ) :
                                currentPackage?.package_name?.toLowerCase() === 'builder' ? (
                                    <img src={"https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/getting-started/build.png"} alt={currentPackage?.package_name} width={'30px'} height={'30px'} />
                                ) :
                                    currentPackage?.package_name?.toLowerCase() === 'explorer' ? (
                                        <img src={"https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/getting-started/explore.png"} alt={currentPackage?.package_name} width={'30px'} height={'30px'} />
                                    ) : (
                                        <img src={"https://nlmscdnawsbackup.blob.core.windows.net/nlms-cdn/media/codeedu/getting-started/travel_explore.png"} alt={currentPackage?.package_name} width={'30px'} height={'30px'} />
                                    )
                        }
                    </div>
                    <span className={`text-lg font-semibold ${packageStyle?.text ?? ''}`} >
                        {currentPackage?.package_name}
                    </span>
                    <span className='text-gray-400 text-sm'>(Plan Includes)</span>
                    {/* View Details Button */}
                    <button
                        onClick={() => setIsCanvasOpen(true)}
                        className="text-sky-600 hover:text-sky-400 hover:underline text-xs flex items-center w-fit h-auto p-1 font-normal bg-transparent hover:bg-transparent"
                    >
                        {/* <Eye className="w-4 h-4 mr-1" /> */}
                        Progress
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                </div>

                {/* Categories Grid */}
                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 w-2/3 lg:w-3/4 xl:w-3/4'>
                    {Object.entries(itemsByCategory).sort(([, a]: any, [, b]: any) => {
                        const orderA = a?.[0]?.package_category_order ?? 0
                        const orderB = b?.[0]?.package_category_order ?? 0

                        return orderA - orderB
                    }).map(([categoryName, items]: [string, any]) => {
                        const colorCode = items.length > 0 ? items[0].package_category_color_code : "#3b82f6"
                        const color = getCategoryColor(colorCode)?.color
                        return (
                            <div key={categoryName} className="space-y-3 p-2 bg-gray-200 dark:bg-black rounded-lg">
                                <h3
                                    className="text-sm font-semibold tracking-wider"
                                    style={{ color: color }}
                                >
                                    {categoryName.toUpperCase()}
                                </h3>
                                <div className="space-y-2">
                                    {items.map((item: any) => (
                                        <div key={item.id} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-700 dark:text-gray-300">{item.label} :</span>
                                            <span className="text-black dark:text-white font-mono">
                                                {item.used_access_count}/{item.allowed_access_count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <ProgressCanvas />

        </>
    )
}

export default PackageCard
