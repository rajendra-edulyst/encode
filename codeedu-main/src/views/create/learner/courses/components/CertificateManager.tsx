import { useState, useMemo } from 'react';
import { Download, Eye, FileText, Share2, Facebook, Linkedin, Twitter, Link, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CertificatePreview from './CertificatePreview';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { AnalyticsLoggingService } from '@/services/analytics-logging/AnalyticsLoggingService';
import { useAuth } from '@/auth';
import { AnalyticsEventType } from '@/@types/analytics-logging';



export interface Certificate {
  certificate_number?: string;
  pdf_file_path?: string;
  content_name?: string;
  content_type?: string;
  content_id?: number;
  course_name?: string;
  type: 'program' | 'content';
}

interface RawCertificate {
  certificate_number?: string;
  pdf_file_path?: string;
  content_name?: string;
  content_type?: string;
  content_id?: number;
  course_name?: string;
}

interface CertificateManagerProps {
  programCertificates: RawCertificate[];
  contentCertificates: RawCertificate[];
  courseCompletion: number;
  userName?: string;
  courseName?: string;
  organizationName?: string;
  organizationLogo?: string;
  skills?: string[];
  courseLeader?: string;
  onDownload?: (certificate: Certificate) => void;
  onView?: (certificate: Certificate) => void;
  showOnlyPreview?: boolean;
  selectedCertificate?: Certificate | null;
  onCertificateSelect?: (certificate: Certificate) => void;
}

const CertificateManager = ({
  programCertificates = [],
  contentCertificates = [],
  courseCompletion,
  userName = "Student",
  courseName = "",
  organizationName = "",
  organizationLogo = "",
  skills = [],
  courseLeader,
  onDownload,
  onView,
  showOnlyPreview = false,
  selectedCertificate: externalSelectedCertificate,
  onCertificateSelect,
}: CertificateManagerProps) => {

  // Normalize certificates with type
  const allCertificates = useMemo<Certificate[]>(() => {
    const program = (Array.isArray(programCertificates) ? programCertificates : [])
      .filter(cert => cert?.certificate_number)
      .map(cert => ({ ...cert, type: 'program' as const }));

    const content = (Array.isArray(contentCertificates) ? contentCertificates : [])
      .filter(cert => cert?.certificate_number)
      .map(cert => ({ ...cert, type: 'content' as const }));

    // Priority: program certificates first, then content certificates
    return [...program, ...content];
  }, [programCertificates, contentCertificates]);

  const [internalSelectedCertificate, setInternalSelectedCertificate] = useState<Certificate | null>(
    allCertificates.length > 0 ? allCertificates[0] : null
  );

  // Use external selected certificate if provided, otherwise use internal state
  const selectedCertificate = externalSelectedCertificate !== undefined
    ? externalSelectedCertificate
    : internalSelectedCertificate;

  const handleCertificateSelect = (cert: Certificate) => {
    if (onCertificateSelect) {
      onCertificateSelect(cert);
    } else {
      setInternalSelectedCertificate(cert);
    }
  };

  // Certificate availability status
  // const hasCertificates = allCertificates.length > 0;
  // const hasMultipleCertificates = allCertificates.length > 1;
  const hasCertificates = true;
  const hasMultipleCertificates = true;
  const isFullyCompleted = courseCompletion >= 100;
  const canAccessCertificates = hasCertificates || isFullyCompleted;

  // Get display certificate
  const displayCertificate = selectedCertificate || allCertificates[0];

  // Handle download
  const handleDownload = (cert: Certificate = displayCertificate) => {
    if (!cert || (!hasCertificates && !isFullyCompleted)) return;

    if (cert.pdf_file_path) {
      const link = document.createElement('a');
      link.href = cert.pdf_file_path;
      link.download = `${cert.course_name || cert.content_name || courseName}_Certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    onDownload?.(cert);
  };

  // Handle view
  const handleView = (cert: Certificate = displayCertificate) => {
    if (!cert || (!hasCertificates && !isFullyCompleted)) return;

    if (cert.pdf_file_path) {
      window.open(cert.pdf_file_path, '_blank');
    }

    onView?.(cert);
  };

  // Get certificate data for preview
  const getCertificatePreviewData = () => {
    if (!displayCertificate) {
      return {
        userName: "Student Name",
        courseName: courseName,
        certificateId: "CERT-XXXX-XXXX",
        completionDate: "Date",
        isBlurred: true,
      };
    }

    return {
      userName: hasCertificates ? userName : "Student Name",
      courseName: displayCertificate.course_name || displayCertificate.content_name || courseName,
      certificateId: displayCertificate.certificate_number || "CERT-XXXX-XXXX",
      completionDate: hasCertificates
        ? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : "Date",
      isBlurred: !hasCertificates,
    };
  };

  const previewData = getCertificatePreviewData();
  const { user } = useAuth();

  const analyticsLogger = AnalyticsLoggingService.init(user); 

  // If showOnlyPreview is true, render only the preview
  if (showOnlyPreview) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full max-w-2xl">
          <CertificatePreview
            userName={previewData.userName}
            courseName={previewData.courseName}
            organizationName={organizationName}
            organizationLogo={organizationLogo}
            skills={skills}
            certificateId={previewData.certificateId}
            completionDate={previewData.completionDate}
            courseLeader={courseLeader}
            academicHead="Academic Head"
            isBlurred={previewData.isBlurred}
            pdfUrl={displayCertificate?.pdf_file_path}
          />
        </div>
        <p className="text-white text-lg mt-4">
          {hasCertificates ? (
            hasMultipleCertificates ? "Selected Certificate" : "Your Certificate"
          ) : (
            "Sample of your Certificate"
          )}
        </p>
      </div>
    );
  }

  // Get status message
  const getStatusMessage = () => {
    if (hasCertificates) {
      return hasMultipleCertificates
        ? `You have ${allCertificates.length} certificates available`
        : "Congratulations! Your certificate is ready.";
    }

    if (isFullyCompleted) {
      return "Your certificate is being generated.";
    }

    return "Complete the course to unlock your certificate.";
  };

  return (
    <div className="space-y-6">
      {/* Status Message */}
      <div>
        <p className="text-white text-base mb-2">{getStatusMessage()}</p>
        {displayCertificate?.certificate_number && (
          <p className="text-white text-sm">
            Certificate ID: <span className="text-codeblue font-semibold">{displayCertificate.certificate_number}</span>
          </p>
        )}
      </div>

      {/* Certificate List - Show when multiple certificates */}
      {hasMultipleCertificates && (
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-white font-semibold text-lg mb-3">Your Certificates</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {allCertificates.map((cert, index) => (
              <Card
                key={`${cert.type}-${cert.certificate_number}-${index}`}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:border-codeblue",
                  selectedCertificate?.certificate_number === cert.certificate_number
                    ? "border-codeblue bg-[#2A2A2A]"
                    : "border-transparent bg-[#323232]"
                )}
                onClick={() => handleCertificateSelect(cert)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-codeblue flex-shrink-0" />
                        <span className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded",
                          cert.type === 'program'
                            ? "bg-codeblue/20 text-codeblue"
                            : "bg-purple-500/20 text-purple-400"
                        )}>
                          {cert.type === 'program' ? 'Course' : 'Content'}
                        </span>
                      </div>
                      <h4 className="text-white font-medium text-sm truncate">
                        {cert.course_name || cert.content_name || 'Certificate'}
                      </h4>
                      <p className="text-gray-400 text-xs mt-1">
                        ID: {cert.certificate_number}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="p-2 hover:bg-codeblue/10 rounded transition-colors"
                            title="Share Certificate"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <Share2 className="w-4 h-4 text-codeblue" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-1 bg-[#1e1e1e] border-gray-700" align="end">
                          <div className="flex flex-col">
                            <button
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 rounded transition-colors w-full text-left"
                              onClick={(e) => {
                                e.stopPropagation();
                                const shareUrl = encodeURIComponent(cert.pdf_file_path || window.location.href);
                                const title = encodeURIComponent(cert.course_name || cert.content_name || 'Certificate');
                                const summary = encodeURIComponent(`Check out my certificate for ${cert.course_name || cert.content_name || 'a course'}.`);
                                analyticsLogger.logEvent({
                                  event: AnalyticsEventType.certificate_share,
                                  meta: {
                                    share_type: 'linkedin',
                                    share_url: cert.pdf_file_path,
                                    course_name: cert.course_name,
                                    content_name: cert.content_name,
                                  }
                                })
                                window.open(
                                  `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${title}&summary=${summary}`,
                                  '_blank',
                                  'noopener,noreferrer'
                                );
                              }}
                            >
                              <Linkedin className="w-4 h-4 text-[#0077b5]" />
                              LinkedIn
                            </button>
                            <button
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 rounded transition-colors w-full text-left"
                              onClick={(e) => {
                                e.stopPropagation();
                                const shareUrl = encodeURIComponent(cert.pdf_file_path || window.location.href);
                                analyticsLogger.logEvent({
                                  event: AnalyticsEventType.certificate_share,
                                  meta: {
                                    share_type: 'facebook',
                                    share_url: cert.pdf_file_path,
                                    course_name: cert.course_name,
                                    content_name: cert.content_name,
                                  }
                                })
                                window.open(
                                  `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                                  '_blank',
                                  'noopener,noreferrer'
                                );
                              }}
                            >
                              <Facebook className="w-4 h-4 text-[#1877F2]" />
                              Facebook
                            </button>
                            <button
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 rounded transition-colors w-full text-left"
                              onClick={(e) => {
                                e.stopPropagation();
                                const shareUrl = encodeURIComponent(cert.pdf_file_path || window.location.href);
                                const title = encodeURIComponent(cert.course_name || cert.content_name || 'Certificate');
                                analyticsLogger.logEvent({
                                  event: AnalyticsEventType.certificate_share,
                                  meta: {
                                    share_type: 'twitter',
                                    share_url: cert.pdf_file_path,
                                    course_name: cert.course_name,
                                    content_name: cert.content_name,
                                  }
                                })
                                window.open(
                                  `https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`,
                                  '_blank',
                                  'noopener,noreferrer'
                                );
                              }}
                            >
                              <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                              Twitter
                            </button>
                            <button
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 rounded transition-colors w-full text-left"
                              onClick={(e) => {
                                e.stopPropagation();

                                const shareUrl = encodeURIComponent(cert.pdf_file_path || window.location.href);
                                const title = encodeURIComponent(cert.course_name || cert.content_name || 'Certificate');
                                analyticsLogger.logEvent({
                                  event: AnalyticsEventType.certificate_share,
                                  meta: {

                                    share_type: 'whatsapp',
                                    share_url: cert.pdf_file_path,
                                    course_name: cert.course_name,
                                    content_name: cert.content_name,
                                  }
                                })
                                window.open(
                                  `https://wa.me/?text=${title}%20${shareUrl}`,
                                  '_blank',
                                  'noopener,noreferrer'
                                );
                              }}
                            >
                              <MessageCircle className="w-4 h-4 text-[#25D366]" />
                              WhatsApp
                            </button>
                            <button
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-200 hover:bg-white/10 rounded transition-colors w-full text-left"
                              onClick={(e) => {
                                e.stopPropagation();
                                const shareUrl = cert.pdf_file_path || window.location.href;
                                navigator.clipboard.writeText(shareUrl);
                                toast.success('Link copied to clipboard');
                                analyticsLogger.logEvent({
                                  event: AnalyticsEventType.certificate_share,
                                  meta: {
                                    share_type: 'copy_link',
                                    share_url: cert.pdf_file_path,
                                    course_name: cert.course_name,
                                    content_name: cert.content_name,
                                  }
                                })
                              }}
                            >
                              <Link className="w-4 h-4 text-gray-400" />
                              Copy Link
                            </button>

                          </div>
                        </PopoverContent>
                      </Popover>
                      <button
                        className="p-2 hover:bg-codeblue/10 rounded transition-colors"
                        title="View Certificate"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(cert);
                        }}
                      >
                        <Eye className="w-4 h-4 text-codeblue" />
                      </button>
                      <button
                        className="p-2 hover:bg-codeblue/10 rounded transition-colors"
                        title="Download Certificate"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(cert);
                        }}
                      >
                        <Download className="w-4 h-4 text-codeblue" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!hasMultipleCertificates && (
        <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
          <button
            disabled={!canAccessCertificates}
            className={cn(
              "p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center transition-all",
              canAccessCertificates
                ? "bg-codeblue text-black cursor-pointer hover:bg-codeblue/80"
                : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
            )}
            onClick={() => handleView()}
          >
            <Eye className="mb-2" />
            View Certificate
          </button>
          <button
            disabled={!canAccessCertificates}
            className={cn(
              "p-3 rounded-lg h-[96px] w-[126px] flex flex-col justify-center items-center text-center transition-all",
              canAccessCertificates
                ? "bg-codeblue text-black cursor-pointer hover:bg-codeblue/80"
                : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
            )}
            onClick={() => handleDownload()}
          >
            <Download className="mb-2" />
            Download Certificate
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificateManager;
