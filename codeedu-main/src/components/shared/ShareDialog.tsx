import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/ShadcnButton';
import { Check, Copy, Facebook, Linkedin, Twitter, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  url: string;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  url,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  const shareOnTwitter = () => {
    const text = description ? `${title} - ${description}` : title;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  const shareOnLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, '_blank', 'width=600,height=400');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(
      `${description ? description + '\n\n' : ''}Check out this community: ${url}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Share &quot;{title}&quot;
          </DialogTitle>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {description}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Copy Link Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Copy Link
            </label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                type="text"
                value={url}
                className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Media Share Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-white">
              Share on Social Media
            </label>
            <div className="grid grid-cols-4 gap-2">
              {/* Facebook */}
              <button
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                aria-label="Share on Facebook"
                onClick={shareOnFacebook}
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Facebook className="h-5 w-5 text-white" fill="white" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Facebook</span>
              </button>

              {/* Twitter */}
              <button
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                aria-label="Share on Twitter"
                onClick={shareOnTwitter}
              >
                <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Twitter className="h-5 w-5 text-white" fill="white" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Twitter</span>
              </button>

              {/* LinkedIn */}
              <button
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                aria-label="Share on LinkedIn"
                onClick={shareOnLinkedIn}
              >
                <div className="w-10 h-10 rounded-full bg-[#0A66C2] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Linkedin className="h-5 w-5 text-white" fill="white" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">LinkedIn</span>
              </button>

              {/* Email */}
              <button
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                aria-label="Share via Email"
                onClick={shareViaEmail}
              >
                <div className="w-10 h-10 rounded-full bg-gray-600 dark:bg-gray-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">Email</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
