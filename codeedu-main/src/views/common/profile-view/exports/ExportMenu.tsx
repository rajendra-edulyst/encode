import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas"; 
import type { Profile } from "../services/profileService";
import type { Section } from "../services/sectionService";
import ResumeTemplateClassic from "./ResumeTemplateClassic";
import ResumeTemplateModern from "./ResumeTemplateModern";

interface ExportMenuProps {
  profile: Profile;
  open: boolean;
  onClose: () => void;
  profileSections?: Section[];
}

type TemplateKey = "classic" | "modern";

const templates = {
  classic: {
    name: "Classic Resume",
    component: ResumeTemplateClassic,
  },
  modern: {
    name: "Modern Resume",
    component: ResumeTemplateModern,
  },
};

const ExportMenu: React.FC<ExportMenuProps> = ({ profile, open, onClose, profileSections = [] }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>("classic");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedTemplate("classic");
      setPreviewImage(null);
    }
  }, [open]);

  // Generate preview image for mobile
  useEffect(() => {
    if (!open) return;

    const SelectedTemplateComponent = templates[selectedTemplate].component;

    // Render to HTML string
    const htmlString = ReactDOMServer.renderToString(
      <SelectedTemplateComponent profile={profile} profileSections={profileSections} />
    );

    // Create offscreen div container to render html string
    const offscreenDiv = document.createElement("div");
    offscreenDiv.style.position = "fixed";
    offscreenDiv.style.width = "800px"; // set width for consistent snapshot
    offscreenDiv.style.backgroundColor = "white";
    offscreenDiv.innerHTML = htmlString;

    document.body.appendChild(offscreenDiv);

    // Use html2canvas to convert offscreenDiv to image
    html2canvas(offscreenDiv, { scale: 2, useCORS: true }).then((canvas) => {
      setPreviewImage(canvas.toDataURL("image/png"));
      document.body.removeChild(offscreenDiv);
    }).catch(() => {
      // On error fallback: clear image
      setPreviewImage(null);
      document.body.removeChild(offscreenDiv);
    });
  }, [selectedTemplate, profile, open]);

  // Helper to wait for images to load (same as before)
  const waitForImagesAndFonts = (container: HTMLElement) => {
    const images = Array.from(container.querySelectorAll("img"));
    const imagePromises = images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) resolve();
          else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        })
    );

    return Promise.all(imagePromises).then(() => new Promise((res) => setTimeout(res, 100)));
  };

  const handleExportPDF = () => {
    const SelectedTemplateComponent = templates[selectedTemplate].component;

    // Render React component to HTML string
    const htmlString = ReactDOMServer.renderToString(
      <SelectedTemplateComponent profile={profile} profileSections={profileSections} />
    );

    // Create offscreen wrapper div
    const wrapper = document.createElement("div");
    wrapper.innerHTML = htmlString;

    document.body.appendChild(wrapper);

    const opt = {
      margin: 0,
      filename: `resume_${selectedTemplate}_${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    waitForImagesAndFonts(wrapper).then(() => {
      html2pdf()
        .set(opt)
        .from(wrapper)
        .save()
        .finally(() => {
          document.body.removeChild(wrapper);
        });
    });
  };

  if (!open) return null;



  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-card rounded-lg w-full  sm:max-w-md shadow-lg relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center border-b border-gray-500 shadow p-4 px-6 justify-between sticky top-0 z-10">
          <h2 className="text-xl font-semibold">Export Resume</h2>
          <button
            className="text-gray-400 p-1 px-3 transition duration-150 rounded-full text-lg hover:text-gray-600"
            aria-label="Close export menu"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 flex flex-col items-center">
          <div className="flex items-center gap-3 flex-wrap w-full">
            <select
              id="template-select"
              value={selectedTemplate}
              className="px-3 py-2 border bg-card border-gray-600 rounded focus:outline-none"
              onChange={(e) => setSelectedTemplate(e.target.value as TemplateKey)}
            >
              {Object.entries(templates).map(([key, { name }]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>

            <button
              className="ml-auto bg-primary text-white px-4 py-2 rounded font-normal transition"
              onClick={handleExportPDF}
            >
              Export PDF
            </button>
          </div>

          {/* Preview */}

         <div
  className="border border-gray-300 max-w-sm rounded p-4 bg-white shadow max-h-[60vh] overflow-auto"
  style={{ minHeight: 300 }}
>
  {previewImage ? (
    <img
      src={previewImage}
      alt="Resume Preview"
      className="w-full object-contain"
      style={{ maxHeight: "60vh", margin: "auto", display: "block" }}
    />
  ) : (
    <div className="text-center text-gray-500">Loading preview...</div>
  )}
</div>

        </div>
      </div>
    </div>
  );
};

export default ExportMenu;
