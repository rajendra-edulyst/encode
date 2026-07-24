import React from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
// @ts-ignore
import ChatbotApp from '@/views/Company_Chatbot_Project/frontend/src/App'
import '@/views/Company_Chatbot_Project/frontend/src/index.css'

const ChatbotDialog = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="p-0 sm:max-w-[500px] w-full border-none shadow-2xl">
                <div className="chatbot-root h-full w-full">
                    <ChatbotApp />
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default ChatbotDialog
