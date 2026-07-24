import { CommonProps } from '@/@types/common'
import LayoutBase from '@/components/template/LayoutBase'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/constants/theme.constant'

const CcatLayout = ({ children }: CommonProps) => {
    return (
        <LayoutBase type={LAYOUT_COLLAPSIBLE_SIDE} className="app-layout-collapsible-side flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col">
            <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 bg-black">
                <div className="relative flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col">
                    <div className="flex min-h-0 min-w-0 w-full max-w-full flex-1 flex-col">
                        {children}
                    </div>
                </div>
            </div>
        </LayoutBase>
    )
}

export default CcatLayout