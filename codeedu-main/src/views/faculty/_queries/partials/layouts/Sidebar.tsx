import React from "react"
import {
  Inbox,
  Send,
  Paperclip,
  MailIcon,
  PenIcon,
} from "lucide-react"

import { Button } from "@/components/ui/ShadcnButton"
import { useMailboxStore } from "../mailboxStore"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Inbox", icon: Inbox },
  { title: "Sent", icon: Send },
  { title: "Draft", icon: Paperclip },
]

interface SidebarProps {
  onNewQueryClick: () => void
  resetQueryopen: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onNewQueryClick, resetQueryopen }) => {
  const { activeTab, setActiveTab } = useMailboxStore()

  return (
    <SidebarContent>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <MailIcon className="mr-2" />
              <span>Queries</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <Button
        variant="outline"
        size="sm"
        className="mx-3 my-1 mb-0 rounded-full bg-primary text-white hover:bg-primary hover:text-white"
        onClick={onNewQueryClick}
      >
        <PenIcon className="mr-1 h-4 w-4" />
        Compose New
      </Button>

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map(({ title, icon: Icon }) => (
              <SidebarMenuItem key={title}>
                <SidebarMenuButton
                  className={activeTab === title ? "bg-muted text-primary" : ""}
                  onClick={() => {
                    setActiveTab(title as any)
                    resetQueryopen()
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}

export default Sidebar
