import { create } from "zustand"

type MailItem = {
  id: string
  subject: string
  sender: string
  message: string
  date: string
}

type MailboxTab = "Inbox" | "Sent" | "Draft"

type MailboxStore = {
  activeTab: MailboxTab
  setActiveTab: (tab: MailboxTab) => void

  selectedMail: MailItem | null
  setSelectedMail: (mail: MailItem | null) => void
}

export const useMailboxStore = create<MailboxStore>((set) => ({
  activeTab: "Inbox",
  setActiveTab: (tab) =>
    set({
      activeTab: tab,
      selectedMail: null, // Clear selected mail when tab changes
    }),

  selectedMail: null,
  setSelectedMail: (mail) => set({ selectedMail: mail }),
}))
