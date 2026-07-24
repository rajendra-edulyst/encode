import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Download, Eye, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/ShadcnButton";
import { Input } from "@/components/ui/ShadcnInput";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isPDF = (url: any): boolean =>
  typeof url === "string" && url.toLowerCase().endsWith(".pdf");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isVideo = (url: any): boolean =>
  typeof url === "string" &&
  [".mp4", ".webm", ".mov"].some((ext) => url.toLowerCase().endsWith(ext));

// Resume item component showing embedded preview or video
const ResumeItem = ({
  url,
  title,
  onDelete,
}: {
  url: string;
  title?: string;
  onDelete: () => void;
}) => (
  <div className="w-48 p-2 border rounded shadow overflow-hidden bg-white dark:bg-card flex flex-col">
    <div className="flex-1">
      {isPDF(url) ? (
        <div className="relative w-full h-full">
          <embed
            src={url}
            type="application/pdf"
            width="100%"
            height="100%"
            className="object-cover"
          />
          <Button className="absolute top-2 right-2" size="sm" variant="outline" aria-label={`Download resume ${title || 'document'}`} onClick={() => window.open(url, "_blank")}>
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ) : isVideo(url) ? (
        <video controls muted className="w-full h-full object-cover">
          <source src={url} />
          Your browser does not support the video tag.
        </video>

      ) : (
        <div className="text-sm text-center p-4">Unsupported format</div>
      )}
    </div>
    {title && (
      <div className="px-2 py-2 text-center text-sm font-medium border-t truncate flex justify-between items-center">
        <span>{title}</span>

        <div className="flex gap-2 mt-1">
          <button
            className="btn btn-primary btn-xs px-1 py-1 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded"
            aria-label={`Download resume ${title}`}
            onClick={() => window.open(url, "_blank")}
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            className="btn btn-primary btn-xs px-1 py-1 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded"
            aria-label={`Delete resume ${title}`}
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    )}
  </div>
);

type Resume = {
  id: string;
  resume: string;
  title: string;
  isLatest: boolean;
};

type ResumesProps = {
  resumes: Resume[];
  onResumeUploaded: (file: File, title: string) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
};

const Resumes = ({ resumes, onResumeUploaded, deleteResume }: ResumesProps) => {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    // Cleanup preview URL when file changes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle file selected by input
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selected = e.target.files?.[0];
  //   if (selected && (isPDF(selected.name) || isVideo(selected.name))) {
  //     setFile(selected);
  //     setPreviewUrl(URL.createObjectURL(selected));
  //   } else {
  //     alert("Only PDF or video files are allowed.");
  //   }
  // };

  // Handle drag and drop accepted files
  const onDrop = (acceptedFiles: File[]) => {
    const selected = acceptedFiles?.[0];
    if (selected && (isPDF(selected.name) || isVideo(selected.name))) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      alert("Only PDF or video files are allowed.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "video/*": [".mp4", ".webm", ".mov"],
    },
    maxFiles: 1,
  });

  // Upload handler with fake progress bar simulation
  const handleUpload = async () => {
    if (!file || !title.trim()) return;

    setUploadProgress(10);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      await onResumeUploaded(file, title.trim());

      setUploadProgress(100);
      setTimeout(() => {
        setShowModal(false);
        setFile(null);
        setTitle("");
        setPreviewUrl(null);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload resume.");
      setUploadProgress(0);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-2 sm:mb-4">
        <h2 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">Resumes</h2>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-primary dark:bg-gray-800 dark:hover:bg-gray-900 hover:bg-primary/20 border-0 p-0 w-8 h-8 flex items-center justify-center text-white"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Horizontal scroll wrapper */}
      <div className="overflow-x-auto">
        <div
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {resumes.length === 0 ? (
            <div className="text-sm text-gray-500 dark:text-white">No resumes found</div>
          ) : (
            resumes.map(({ id, resume, title }) => (
              <div
                key={id}
                className="snap-start shrink-0" // <- this ensures carousel-like snapping
              >
                <ResumeItem
                  url={resume}
                  title={title}
                  onDelete={() => deleteResume(id)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-card rounded-lg w-full max-w-xl shadow-lg relative">
            <div className="h-full max-h-[90vh] w-full overflow-y-auto space-y-6">
              <div className="flex items-center border-b border-gray-200 shadow p-4 px-6 justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Upload Resume</h2>
                  <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                    Click or drag and drop your PDF/video file
                  </p>
                </div>
                <button
                  className="text-gray-400 hover:bg-gray-100 p-1 px-3 transition duration-150 rounded-full text-lg hover:text-gray-600"
                  aria-label="Close upload modal"
                  onClick={() => {
                    setShowModal(false);
                    setFile(null);
                    setPreviewUrl(null);
                    setTitle("");
                    setUploadProgress(0);
                  }}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 px-6 pb-6">
                {/* Drag and drop area */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed dark:bg-[#323232] rounded-md p-6 cursor-pointer transition-all duration-200 ${isDragActive ? "bg-blue-50 border-blue-400" : "bg-gray-50 border-gray-300"
                    }`}
                >
                  <input {...getInputProps()} />
                  <p className="text-center text-gray-500">
                    {isDragActive
                      ? "Drop the file here ..."
                      : "Click to select or drag and drop your PDF/video file"}
                  </p>
                </div>

                {/* Preview area */}
                {previewUrl && (
                  <div className="mb-4 border rounded overflow-hidden">
                    {file && isPDF(file.name) ? (
                      <embed
                        src={previewUrl}
                        type="application/pdf"
                        width="100%"
                        height="240"
                      />
                    ) : (
                      <video controls className="w-full h-60 object-cover">
                        <source src={previewUrl} />
                      </video>
                    )}
                  </div>
                )}

                <Input
                  type="text"
                  value={title}
                  placeholder="Enter resume title"
                  className="w-full px-4 py-2 border rounded mb-4 dark:bg-[#323232]"
                  onChange={(e) => setTitle(e.target.value)}
                />


                <div className="flex justify-between items-center">


                  <div className="flex items-center justify-start min-w-[8rem] max-w-[10rem] gap-3">
                    {/* Progress Bar */}
                    {uploadProgress > 0 && (
                      <>
                        <div className="bg-gray-200 w-full rounded-full h-3">
                          <div
                            className="bg-green-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          >
                          </div>

                        </div>
                        <span className="text-gray-600 text-sm">{uploadProgress}%</span>

                      </>
                    )}
                  </div>


                  <div className="flex justify-end gap-3">
                    <button
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => {
                        setShowModal(false);
                        setFile(null);
                        setPreviewUrl(null);
                        setTitle("");
                        setUploadProgress(0);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
                      disabled={!file || !title.trim() || uploadProgress > 0}
                      onClick={handleUpload}
                    >
                      Upload
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resumes;
