import React from "react";

interface CertificateViewerProps {
  pdfUrl: string;
  onClose: () => void;
}

const CertificateViewer: React.FC<CertificateViewerProps> = ({
  pdfUrl,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1E1E1E] relative rounded-xl p-4 w-full max-w-xl h-[90vh] flex flex-col shadow-xl border border-gray-800">

        {/* Close */}
        <div className="flex absolute right-8 top-8 justify-end mb-3">
          <button
            className="text-white text-lg px-3 py-1 rounded-full bg-gray-500 opacity-30"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Correct PDF container */}
        <div className="flex-1 rounded-lg border border-gray-700 bg-black">
          <div className="w-full h-full flex-1 items-center justify-center">
            <embed
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              type="application/pdf"
                width="100%"
                height="100%"
              className="object-contain"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CertificateViewer;
