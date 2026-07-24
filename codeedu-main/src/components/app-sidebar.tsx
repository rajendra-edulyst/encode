import {
    Sidebar,
    SidebarHeader,
    useSidebar
} from "@/components/ui/sidebar"
import { useThemeStore } from "@/store/themeStore";
import { X } from "lucide-react";

export function AppSidebar() {
    const { content, title, description, icon, setOpen } = useSidebar();
    const { setSideNavCollapse } = useThemeStore((state) => state)
    return (
        <Sidebar side="right">
            <SidebarHeader className="border-b pb-3">
                <div className="flex justify-between">
                    <div className="flex items-center">
                        {icon && <span>{icon}</span>}
                        <div>
                            <h2 className="text-lg font-semibold">{title}</h2>
                            <p className="text-xs">{description}</p>
                        </div>
                    </div>
                    <button
                        className="text-sm text-gray-500 hover:text-gray-700"
                        onClick={() => { setOpen(false); setSideNavCollapse(false) }}
                    >
                        <X />
                    </button>
                </div>
            </SidebarHeader>
            {content}
        </Sidebar>
    )
}
