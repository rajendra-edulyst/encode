import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/ShadcnButton"

interface ConfirmationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    title: string
    text: string
    confirmBtn: string
    cancelBtn?: string
}

export function ConfirmationDialog({ open, onOpenChange, onConfirm, title, text, confirmBtn, cancelBtn }: ConfirmationDialogProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-black max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-5xl text-center text-white"> {title} </DialogTitle>
                </DialogHeader>
                <div>
                    <p className="mb-4 text-center text-white text-lg font-light"> {text} </p>
                </div>
                <div className="flex gap-4 items-center justify-center">
                    <DialogClose asChild className="w-[132px] h-[118px] bg-[#5A5A5A] text-white">
                        {cancelBtn ? <Button variant="outline"> {cancelBtn} </Button> : <Button variant="outline"> Not <br /> Now </Button>}
                    </DialogClose>
                    <Button type="button" className="w-[225px] h-[118px] text-black bg-[#00a8e9]" onClick={onConfirm}>
                        {confirmBtn}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
