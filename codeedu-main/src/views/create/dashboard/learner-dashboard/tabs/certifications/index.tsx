import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEarnedCertificates } from "@/hooks/data/create/useCourses";
import { Download, ExternalLink } from "lucide-react";

interface CertificatesEarnedProps {
  timeFilter?: string;
}

export default function CertificatesEarned({ timeFilter = 'yearly' }: CertificatesEarnedProps) {
  const { data: certificates, isLoading } = useEarnedCertificates(timeFilter);

  const getTimeFilterLabel = () => {
    return timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Certificates Earned
        </CardTitle>
        <CardAction>
          <Badge className="text-black">{certificates?.length || 0} Total</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-[#323232]">
                <CardContent>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-md bg-zinc-700 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-zinc-700 rounded animate-pulse w-2/3" />
                      <div className="h-3 bg-zinc-700 rounded animate-pulse w-full" />
                      <div className="h-3 bg-zinc-700 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : certificates && certificates.length > 0 ? (
          <div className="space-y-3">
            {certificates.map((cert, index) => (
              <Card key={index} className="bg-[#323232]">
                <CardContent>
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-md bg-sky-500 flex items-center justify-center shrink-0">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="8" r="5" />
                        <path d="M8 14v7l4-2 4 2v-7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {cert.certificate_name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {cert.issuing_organization}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {cert.earned_date} · Grade: {cert.grade}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <a
                      download
                      href={cert.download_url}
                      className="text-sky-400 hover:text-sky-300"
                    >
                      <Download size={16} />
                    </a>
                    <a
                      href={cert.download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No certificates earned for {getTimeFilterLabel()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}