import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/ShadcnButton";

// NEW ICONS (Lucide)
import {
  Link as LinkIcon,
  Mail,
  Smartphone,
  Instagram,
  Download as DownloadIcon,
  MessageCircle,
} from "lucide-react";

import { toast } from "sonner";
import { useAuth } from "@/auth";
import { AnalyticsLoggingService } from "@/services/analytics-logging/AnalyticsLoggingService";
import { AnalyticsEventType } from "@/@types/analytics-logging";

interface SharePopupProps {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
}

const SharePopup: React.FC<SharePopupProps> = ({ open, onClose, shareUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const message = encodeURIComponent(`Here is the link: ${shareUrl}`);

  const { user } = useAuth();
  const analyticsLogger = AnalyticsLoggingService.init(user);

  useEffect(() => {
    if (canvasRef.current && open) {
      QRCode.toCanvas(canvasRef.current, shareUrl, { width: 200 });
    }
  }, [open, shareUrl]);

  // ---------------------------
  // SHARE ACTION HANDLERS
  // ---------------------------

  const logShare = (type: string) => {
    analyticsLogger.logEvent({
      event: AnalyticsEventType.profile_share,
      meta: {
        share_type: type,
        share_url: shareUrl,
      },
    });
  };

  const shareToWhatsApp = () => {
    logShare("whatsapp");
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const shareToSMS = () => {
    logShare("sms");
    window.open(`sms:?body=${message}`, "_blank");
  };

  const shareToInstagram = () => {
    logShare("instagram");
    window.open("https://www.instagram.com/", "_blank");
  };

  const shareToEmail = () => {
    logShare("email");
    window.location.href = `mailto:?subject=Check this out&body=${message}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link Copied!");
      logShare("copy_link");
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const downloadQR = async () => {
    logShare("download_qr");

    if (canvasRef.current) {
      await QRCode.toCanvas(canvasRef.current, shareUrl);
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-[#1E1E1E] rounded-lg w-full max-w-md shadow-lg relative border border-gray-700">

        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Share</h2>
          <button
            className="text-gray-400 hover:bg-gray-700 p-2 rounded-full text-lg"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5 text-center">

          {/* QR Code */}
          <canvas ref={canvasRef} className="mx-auto mb-3" />

          {/* Link */}
          <a
            href={shareUrl}
            rel="noreferrer"
            target="_blank"
            className="text-primary text-xs hover:underline break-all"
          >
            {shareUrl}
          </a>

          {/* SHARE BUTTONS */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center">

            <Button variant="outline" onClick={shareToWhatsApp}>
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
            </Button>

            <Button variant="outline" onClick={shareToSMS}>
              <Smartphone className="w-5 h-5 text-white" />
            </Button>

            <Button variant="outline" onClick={shareToInstagram}>
              <Instagram className="w-5 h-5 text-pink-500" />
            </Button>

            <Button variant="outline" onClick={shareToEmail}>
              <Mail className="w-5 h-5 text-blue-400" />
            </Button>

            <Button variant="outline" onClick={copyToClipboard}>
              <LinkIcon className="w-5 h-5 text-gray-300" />
            </Button>

            <Button variant="outline" onClick={downloadQR}>
              <DownloadIcon className="w-5 h-5 text-yellow-400" />
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;
