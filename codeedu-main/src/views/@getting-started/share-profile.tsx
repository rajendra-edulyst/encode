import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode';
import appConfig from '@/configs/app.config';
import { useAuth } from '@/auth';
import { Button } from '@/components/ui/ShadcnButton';
import { BsWhatsapp } from 'react-icons/bs';
import { Download, Instagram, Link, MessageCircle } from 'lucide-react';
import { MdEmail } from 'react-icons/md';

interface ShareProfileProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ShareProfile: React.FC<ShareProfileProps> = ({ open, onOpenChange }) => {

    const { user } = useAuth();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shareUrl = `${window.location.origin}/portfolio/${appConfig?.organization?.profileServiceid}/${user?.id}`

    const message = encodeURIComponent(`Here is the link to my online portfolio: ${shareUrl}`);

    const shareToWhatsApp = () => window.open(`https://wa.me/?text=${message}`, '_blank');
    const shareToSMS = () => window.open(`sms:?body=${message}`, '_blank');
    const shareToInstagram = () => window.open('https://www.instagram.com/', '_blank');
    const shareToEmail = () => (window.location.href = `mailto:?subject=Check this out&body=${message}`);

    const downloadQR = async () => {
        if (canvasRef.current) {
            await QRCode.toCanvas(canvasRef.current, shareUrl);
            const link = document.createElement('a');
            link.download = 'share-qr.png';
            link.href = canvasRef.current.toDataURL('image/png');
            link.click();
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied!');
        } catch (error) {
            console.error('Copy failed:', error);
        }
    };

    useEffect(() => {
        if (open && canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, shareUrl, {
                width: 180,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            }).catch(console.error)
        }
    }, [open, shareUrl])
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share Profile</DialogTitle>
                    <DialogDescription>
                        Scan the QR code or use the buttons below to share your profile.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center rounded-lg">
                    <canvas ref={canvasRef} />
                </div>
                <div className='mt-4 grid grid-cols-6 gap-4'>
                    <Button variant={'outline'} className='text-white' onClick={shareToWhatsApp}>
                        <BsWhatsapp size={40} />
                    </Button>
                    <Button variant={'outline'} className='text-white' onClick={shareToSMS}>
                        <MessageCircle />
                    </Button>
                    <Button variant={'outline'} className='text-white' onClick={shareToInstagram}>
                        <Instagram />
                    </Button>
                    <Button variant={'outline'} className='text-white' onClick={shareToEmail}>
                        <MdEmail />
                    </Button>
                    <Button variant={'outline'} className='text-white' onClick={copyToClipboard}>
                        <Link />
                    </Button>
                    <Button variant={'outline'} className='text-white' onClick={downloadQR}>
                        <Download />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ShareProfile