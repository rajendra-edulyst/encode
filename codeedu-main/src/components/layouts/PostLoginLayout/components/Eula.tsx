import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/ShadcnButton";
import { Download, Maximize, Minimize } from "lucide-react";
import html2pdf from "html2pdf.js";
import EulaContent from "@/views/auth/SignUp/components/eula/content";
interface EulaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: (acceptedSteps: { eula: boolean; terms: boolean; privacy: boolean }) => void;
  onClose: () => void;
}

const EulaDialog: React.FC<EulaDialogProps> = ({ open, onOpenChange, onAccept }) => {
  const [accepted, setAccepted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDownload = () => {
    const element = document.getElementById("post-login-eula-content");
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: "CODEEDU_EULA.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, backgroundColor: "#1D1D1D", useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleAccept = () => {
    if (accepted) {
      onAccept({
        eula: accepted,
        terms: accepted,
        privacy: accepted
      });
      onOpenChange(false);

      setAccepted(false);
    }
  };

  const handleCheckboxChange = () => {
    setAccepted(!accepted);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`
          ${isFullscreen
            ? 'w-screen h-screen max-w-none !rounded-none'
            : 'max-w-3xl max-h-[85vh] rounded-2xl'
          }
          overflow-y-auto bg-[#1D1D1D] text-white border-none p-0 transition-all duration-200
        `}
      >
        {/* Action Buttons — top-right */}
        <div className="sticky top-0 z-10 flex items-center justify-end gap-3 bg-[#1D1D1D]/90 backdrop-blur-sm px-6 py-3 border-b border-white/10">
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-white/10"
            title="Download as PDF"
          >
            <Download size={16} />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-white/10"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>

        {/* Scrollable Document */}
        <div className="px-6 pb-2 pt-4" id="post-login-eula-content">
          <EulaContent />
        </div>

        <div className="flex items-center justify-between pb-6 px-6 pt-4 border-t border-white/10 mt-2">
          <div className="flex items-center space-x-2">
            {/* <Checkbox
             className="accent-[#00A8E9] focus:ring-0 focus:ring-offset-0"
              id="eula-confirm"
              checked={accepted}
              onCheckedChange={handleCheckboxChange}
             
            /> */}


            <Checkbox
              id="eula-confirm"
              className="border-gray-400 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              checked={accepted}
              onCheckedChange={handleCheckboxChange}
            />

            <Label htmlFor="eula-confirm" className="text-sm text-white">
              I have read and agree to the End User License Agreement (EULA)
            </Label>
          </div>

          <div className="flex space-x-2 ">
            {/* <Button 
           
              disabled={!accepted} 
              onClick={handleAccept}
            >
              Accept
            </Button> */}
            <Button
              className="px-6 py-2 rounded-lg text-white bg-primary font-semibold text-base focus-visible:ring-0 focus-visible:outline-0 focus-visible:ring-offset-0"
              variant={accepted ? "default" : "outline"}
              disabled={!accepted}
              onClick={handleAccept}

            >
              Accept
            </Button>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { EulaDialog };
export default EulaDialog;