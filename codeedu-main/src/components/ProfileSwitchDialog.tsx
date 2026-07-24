import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useSessionUser } from "@/store/authStore"
import { Button } from "./ui/ShadcnButton"
import { useNavigate } from "react-router-dom"
import { useMentorshipStatus } from "@/hooks/data/create/useMentor"

interface ProfileSwitchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    profile: 'creator' | 'presenter' | 'mentor' | 'hod' | null
}

export function ProfileSwitchDialog({ open, onOpenChange, profile }: ProfileSwitchDialogProps) {
    const { setProfile, user } = useSessionUser();
    const navigate = useNavigate();
    const { data: mentorStatus } = useMentorshipStatus();

    const changeProfile = () => {
        if (profile) {
            if (profile === 'mentor') {
                const isApproved = mentorStatus?.status === 'approved' || (mentorStatus as any)?.approved_by === 1;
                if (!user?.is_mentor && !isApproved) {
                    navigate('/become-mentor');
                    onOpenChange(false);
                    return;
                }
            }

            setProfile(profile);
            if (profile === 'hod') {
                navigate('/hod/dashboard');
            }
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-black max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-5xl text-center text-white">Hey Creator!</DialogTitle>
                </DialogHeader>
                <div>
                    <p className="mb-4 text-center text-white text-2xl font-light">Ready to take the lead? As an Instructor, you have the power to turn your creative journey into someone else&apos;s first step.</p>
                    <p className="mb-4 text-center text-white text-2xl font-light">Teach, inspire, and keep the creative cycle alive — your classroom starts here!</p>
                </div>
                <div className="flex gap-4 items-center justify-center">
                    <DialogClose asChild className="w-[132px] h-[118px] bg-[#5A5A5A] text-white">
                        <Button variant="outline">Not <br /> Now</Button>
                    </DialogClose>
                    <Button type="submit" className="w-[225px] h-[118px] text-black" onClick={changeProfile}>
                        Switch to<br />
                        {profile === 'presenter' ? 'Presenter' : profile === 'mentor' ? 'Mentor' : profile === 'hod' ? 'HOD' : 'Creator'} Profile
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
