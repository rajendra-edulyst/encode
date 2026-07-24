import { Dialog, DialogClose } from '@/components/ui/dialog';
import { DialogContent } from '@/components/ui/Dialog/index';
import { Button } from '@/components/ui/ShadcnButton';
import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin, FaSquareXTwitter } from 'react-icons/fa6';
import { IoLogoWhatsapp } from 'react-icons/io';
import { toast } from 'sonner';

interface ShareDataProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    content: string | null;
}

const ShareData: React.FC<ShareDataProps> = ({ open, onOpenChange, content }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg p-6 rounded-2xl [&>button:first-of-type]:hidden">
                <DialogClose asChild>
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </DialogClose>
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-gray-800">Invite</h2>
                    <div className="grid grid-cols-3 w-full items-center gap-4">
                        <div className="text-blue-900 font-medium col-span-2 truncate">
                            {content}
                        </div>
                        <div className="col-span-1 flex justify-end">
                            <Button
                                size="sm"
                                className="border border-blue-500 bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent"
                                onClick={() => {
                                    navigator.clipboard.writeText(content || '');
                                    toast.success("Link copied to clipboard");
                                }}
                            >
                                Copy Link
                            </Button>
                        </div>
                    </div>
                    <div className="text-sm text-gray-900">You can also invite from</div>
                    <div className="flex gap-3">
                        <a href={`https://wa.me/?text=${content}`} target="_blank" rel="noopener noreferrer">
                            <div className="bg-gray-100 p-2 rounded-full">
                   
                                <IoLogoWhatsapp className="text-green-500 w-7 h-7"/>
                            </div>
                        </a>
                        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(content ?? ' ')}`}
                            target="_blank" rel="noopener noreferrer">
                            <div className="bg-gray-100 p-2 rounded-full">
                                <FaLinkedin className="text-blue-500 w-7 h-7" />
                            </div>
                        </a>
                        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(content ?? ' ')}`}
                            target="_blank" rel="noopener noreferrer">
                            <div className="bg-gray-100 p-2 rounded-full">
                                <FaSquareXTwitter className="text-black-500 w-7 h-7" />
                            </div>
                        </a>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content ?? ' ')}`}
                            target="_blank" rel="noopener noreferrer">
                            <div className="bg-gray-100 p-2 rounded-full">
                                <FaFacebook className="text-blue-500 w-7 h-7" />
                            </div>
                        </a>
                        <a href={`https://www.instagram.com/yourusername/`}
                            target="_blank" rel="noopener noreferrer">
                            <div className="bg-gray-100 p-2 rounded-full">
                                <FaInstagram className="text-red-500 w-7 h-7" />
                            </div>
                        </a>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ShareData