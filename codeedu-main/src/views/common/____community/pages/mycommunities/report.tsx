import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/ShadcnButton';
import { toast } from 'sonner';
import { reportCommunity } from '../../services/CommunityService';


interface ReportProps {
    communityId: number | undefined;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const Report = ({ communityId, open, onOpenChange }: ReportProps) => {

    const [type, setType] = React.useState<string>('');
    const [comments, setComments] = React.useState<string>('');
    const [termsAccepted, setTermsAccepted] = React.useState<boolean>(false);

    const handleSubmit = async () => {
        if (!type) {
            toast('Please select a reason for reporting this community.');
            return;
        }
        if (type === '❓ Other' && !comments) {
            toast('Please provide details about your report.');
            return;
        }
        if (!termsAccepted) {
            toast('You must accept the terms to submit a report.');
            return;
        }

        if (!communityId) {
            toast('Community ID is required to submit a report.');
            return;
        }

        // Here you would typically send the report data to your server
        const reason = type === '❓ Other' ? comments : type;
        await reportCommunity(communityId, reason);

        // Reset form
        setType('');
        setComments('');
        setTermsAccepted(false);
        onOpenChange(false);

        toast('Report Submitted', {
            description: 'Thank you for helping us maintain a safe community!',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Community Report</DialogTitle>
                    <DialogDescription>Please select a reason for reporting this community. Your feedback helps us maintain a safe and respectful environment for all users.</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 mb-3">
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="🚫 Inappropriate or offensive content">
                                <div className='w-full text-start'>
                                    <p className='text-sm font-medium'>🚫 Inappropriate or offensive content</p>
                                    <p className="text-xs text-muted-foreground">Includes hate speech, graphic content, or harmful material.</p>
                                </div>
                            </SelectItem>
                            <SelectItem value="⚠️ Spam or misleading information">
                                <div className='w-full text-start'>
                                    <p>⚠️ Spam or misleading information</p>
                                    <p className="text-xs text-muted-foreground">Promotes scams, fake news, or irrelevant content.</p>
                                </div>
                            </SelectItem>
                            <SelectItem value="👎 Harassment or abusive behavior">
                                <div className='w-full text-start'>
                                    <p>👎 Harassment or abusive behavior</p>
                                    <p className="text-xs text-muted-foreground">Targeted attacks, bullying, or toxic discussions.</p>
                                </div>
                            </SelectItem>
                            <SelectItem value="💣 Promotes violence or illegal activity">
                                <div className='w-full text-start'>
                                    <p>💣 Promotes violence or illegal activity</p>
                                    <p className="text-xs text-muted-foreground">Includes threats, dangerous behavior, or unlawful content.</p>
                                </div>
                            </SelectItem>
                            <SelectItem value="❓ Other">
                                <div className='w-full text-start'>
                                    <p>❓ Other</p>
                                    <p className="text-xs text-muted-foreground">Not listed above? Tell us more.</p>
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {/* select ? Other to take mesage */}
                    {type === '❓ Other' && (
                        <div>
                            <Label>Why are you reporting this community?</Label>
                            <textarea
                                className="w-full p-2 border rounded"
                                placeholder="Please provide details about your report..."
                                rows={4}
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="terms-2"
                            className="bg-white  data-[state=checked]:text-white data-[state=checked]:bg-blue-500"
                            checked={termsAccepted}
                            onCheckedChange={(checked) => setTermsAccepted(!!checked)}
                        />
                        <p className="text-xs text-muted-foreground">
                            By submitting this report, you agree to our <a href="#" className="text-blue-500 hover:underline">Community Guidelines</a> and acknowledge that false reports may result in account restrictions.
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" className='text-white'
                        onClick={handleSubmit}
                    >Submit Report</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default Report