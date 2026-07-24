import React, { useState } from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

import Sidebar from "./partials/layouts/Sidebar"
import MailList from "./partials/MailList"
import MailContent from "./partials/MailContent"
import CreateQuery from "./partials/CreateQuery"

const Mailbox: React.FC = () => {
  const [queryOpen, setQueryOpen] = useState(false)

  const toggleQuery = () => setQueryOpen(prev => !prev)
  const resetQueryOpen = () => setQueryOpen(false)

  return (
    <div className="w-full h-full p-4 bg-muted/40">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[600px] rounded-lg border bg-white shadow"
      >
        <ResizablePanel defaultSize={18} minSize={12} maxSize={20}>
          <Sidebar onNewQueryClick={toggleQuery} resetQueryopen={resetQueryOpen} />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {queryOpen ? (
          <ResizablePanel defaultSize={60} minSize={30} maxSize={80}>
            <CreateQuery resetQueryopen={resetQueryOpen} />
          </ResizablePanel>
        ) : (
          <>
            <ResizablePanel defaultSize={25} minSize={20} maxSize={35}>
              <MailList />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={60}>
              <MailContent />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  )
}

export default Mailbox
