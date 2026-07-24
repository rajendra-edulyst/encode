import { useAuth } from "@/auth";
import {
    programCertificate,
    contentCertificate,
    UserCertificate,
} from "@/@types/portfolio";
import { fetchUsersCertificate } from "@/services/portfolio/PortfolioService";
import { useEffect, useState } from "react";
import Loading from "@/components/shared/Loading";
import CertificateViewer from "./CertificateViewer";
import Breadcrumb from '@/components/breadcrumb'
import { Eye, Download, Share2, Facebook, Linkedin, Twitter, MessageCircle, Link as LinkIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { toast } from "sonner";
import { AnalyticsLoggingService } from "@/services/analytics-logging/AnalyticsLoggingService";
import { AnalyticsEventType } from "@/@types/analytics-logging";

const ViewMyCertificate = () => {
    const { user } = useAuth();
    const [userProgramCertificate, setUserProgramCertificate] = useState<programCertificate[]>([]);
    const [userContentCertificate, setUserContentCertificate] = useState<contentCertificate[]>([]);
    const [viewerPdf, setViewerPdf] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const analyticsLogger = AnalyticsLoggingService.init(user);

    const breadcrumbItems = [
        { label: 'Portfolio', path: '/portfolio' },
        { label: 'My Certificates' }
    ];

    const loadCertificates = async () => {
        try {
            const res = await fetchUsersCertificate(String(user?.id));

            if (res.status === 1) {
                const sortedProgram = [...res.data.program_certificate].sort(
                    (a, b) =>
                        new Date(b.assigned_date).getTime() -
                        new Date(a.assigned_date).getTime()
                );

                const sortedContent = [...res.data.content_certificate].sort(
                    (a, b) =>
                        new Date(b.assigned_date).getTime() -
                        new Date(a.assigned_date).getTime()
                );

                setUserProgramCertificate(sortedProgram);
                setUserContentCertificate(sortedContent);
            } else {
                throw new Error("Unable to fetch certificates");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCertificates();
        // eslint-disable-next-line
    }, [user]);

    if (loading) {
        return <Loading loading />;
    }

    const formatAssignedDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    };

    const handleDownload = (cert: UserCertificate) => {
        if (!cert.pdf_file_path) return;

        const link = document.createElement("a");
        link.href = cert.pdf_file_path;
        link.download = `${cert.course_name || cert.content_name}_Certificate.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        analyticsLogger.logEvent({
            event: AnalyticsEventType.certificate_download,
            meta: {
                certificate_number: cert.certificate_number,
                pdf_url: cert.pdf_file_path,
            }
        });
    };

    const handleShare = (type: string, cert: UserCertificate) => {
        const shareUrl = encodeURIComponent(cert.pdf_file_path);
        const title = encodeURIComponent(String(cert.course_name || cert.content_name) || "");

        analyticsLogger.logEvent({
            event: AnalyticsEventType.certificate_share,
            meta: {
                share_type: type,
                share_url: cert.pdf_file_path,
                certificate_number: cert.certificate_number,
            }
        });

        if (type === "linkedin") {
            window.open(
                `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${title}`,
                "_blank"
            );
        } else if (type === "facebook") {
            window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
                "_blank"
            );
        } else if (type === "twitter") {
            window.open(
                `https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}`,
                "_blank"
            );
        } else if (type === "whatsapp") {
            window.open(
                `https://wa.me/?text=${title}%20${shareUrl}`,
                "_blank"
            );
        } else if (type === "copy") {
            navigator.clipboard.writeText(cert.pdf_file_path);
            toast.success("Link copied to clipboard");
        }
    };

    const renderCertificateCard = (item: UserCertificate) => (
        <div className="bg-[#1F1F1F] h-fit border shadow-md border-gray-800 rounded p-2">
            {/* PDF Preview */}
            <div className="relative h-[310px] justify-center items-center rounded-lg overflow-hidden mb-2">
                <embed
                    src={`${item.pdf_file_path}#toolbar=0&navpanes=0&scrollbar=0`}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                    className="w-full h-full items-center object-contain pointer-events-none"
                />

                {/* Action Buttons */}
                <div className="absolute top-1 right-1 flex flex-col gap-1">

                    {/* VIEW */}
                    <button
                        className="bg-black/50 hover:bg-black/70 p-1.5 rounded-full"
                        onClick={() => setViewerPdf(item.pdf_file_path)}
                    >
                        <Eye size={16} className="text-white" />
                    </button>

                    {/* DOWNLOAD */}
                    <button
                        className="bg-black/50 hover:bg-black/70 p-1.5 rounded-full"
                        onClick={() => handleDownload(item)}
                    >
                        <Download size={16} className="text-white" />
                    </button>

                    {/* SHARE */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="bg-black/50 hover:bg-black/70 p-1.5 rounded-full">
                                <Share2 size={16} className="text-white" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-1 bg-[#1e1e1e] border-gray-700" align="end">
                            <div className="flex flex-col">

                                <button
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded"
                                    onClick={() => handleShare("linkedin", item)}
                                >
                                    <Linkedin size={16} className="text-[#0077b5]" /> LinkedIn
                                </button>

                                <button
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded"
                                    onClick={() => handleShare("facebook", item)}
                                >
                                    <Facebook size={16} className="text-[#1877F2]" /> Facebook
                                </button>

                                <button
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded"
                                    onClick={() => handleShare("twitter", item)}
                                >
                                    <Twitter size={16} className="text-[#1DA1F2]" /> Twitter
                                </button>

                                <button
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded"
                                    onClick={() => handleShare("whatsapp", item)}
                                >
                                    <MessageCircle size={16} className="text-[#25D366]" /> WhatsApp
                                </button>

                                <button
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded"
                                    onClick={() => handleShare("copy", item)}
                                >
                                    <LinkIcon size={16} className="text-gray-400" /> Copy Link
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <h3 className="text-sm font-semibold mb-1 line-clamp-1">
                {item.course_name || item.content_name}
            </h3>

            <p className="text-[10px] text-gray-400">
                Certificate No: {item.certificate_number}
            </p>

            <p className="text-[10px] text-gray-400">
                {formatAssignedDate(item.assigned_date)}
            </p>
        </div>
    );

    return (
        <div className="text-white">
            <Breadcrumb items={breadcrumbItems} />

            <div className="mb-6">
                <h1 className="text-2xl font-semibold">My Certificates</h1>
                <p className="text-gray-400 mt-1">List of Certificates.</p>
            </div>

            {userProgramCertificate.length > 0 && (
            <section className="dark:bg-gray-900 mb-6 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Course Completion Certificates</h2>

                
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {userProgramCertificate.map((item, index) => (
                            <div key={index}>{renderCertificateCard(item)}</div>
                        ))}
                    </div>
            </section>
                )}

            
            {/* CONTENT CERTIFICATES */}
            {userContentCertificate.length > 0 && (
            <section className="dark:bg-gray-900 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Content Proficiency Certificates</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {userContentCertificate.map((item, index) => (
                            <div key={index}>{renderCertificateCard(item)}</div>
                        ))}
                    </div>
            </section>
                )}

           {userContentCertificate.length === 0 && userProgramCertificate.length === 0 && (
                <p>No certificates available yet. Start learning and unlock your first achievement!</p>
            )}


            {viewerPdf && (
                <CertificateViewer
                    pdfUrl={viewerPdf}
                    onClose={() => setViewerPdf(null)}
                />
            )}
        </div>
    );
};

export default ViewMyCertificate;
