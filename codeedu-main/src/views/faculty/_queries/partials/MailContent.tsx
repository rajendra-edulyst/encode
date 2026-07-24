import React, { useState } from 'react'
import { useMailboxStore } from './mailboxStore'
import { Button } from '@/components/ui/ShadcnButton'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'


const MailContent: React.FC = () => {
    const { selectedMail, activeTab } = useMailboxStore()
    const [reply, setReply] = useState('')
    const [submitted, setSubmitted] = useState(false)

    if (!selectedMail) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground text-lg font-light">
                Select a message to read
            </div>
        )
    }

    const handleSendReply = () => {
        console.log(`Reply to ${selectedMail?.sender}:`, reply)
        setSubmitted(true)
        console.log('Reply status:', submitted);
        toast.success('Reply sent successfully!')
        setReply('')
        setTimeout(() => setSubmitted(false), 2000)
    }

    return (
        <div className="p-6 h-full flex justify-between flex-col gap-6 overflow-y-auto bg-white rounded-lg shadow-md">
            <div>
                {/* Header */}
                <div className="border-b border-gray-200 pb-4">
                    <h3 className="text-2xl font-semibold text-gray-900">
                        {selectedMail?.subject}
                    </h3>
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500">
                        <span>
                            From:{' '}
                            <span className="font-medium text-gray-700">
                                {selectedMail?.sender}
                            </span>
                        </span>
                        <span>
                            Date:{' '}
                            <span className="font-medium text-gray-700">
                                {selectedMail?.date}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Message Body */}
                <div className="prose mt-3 prose-sm max-w-none text-gray-800 whitespace-pre-line leading-relaxed">
                    {selectedMail?.message}
                </div>
            </div>

            { activeTab === 'Inbox' ? (
                <div className="flex flex-col gap-3">
                <Textarea
                    id="reply"
                    rows={6}
                    placeholder="Type your message here..."
                    value={reply}
                    className="border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-none"
                    onChange={(e) => setReply(e.target.value)}
                />
                <div className="flex justify-end">
                    <Button
                        disabled={!reply.trim()}
                        className="bg-primary disabled:bg-gray-400 disabled:text-black disabled:cursor-not-allowed transition"
                        onClick={handleSendReply}
                    >
                        Send Reply
                    </Button>
                </div>
            </div>
            ) : (
                <></>
            )

            }
            
        </div>
    )
}

export default MailContent
