import { Card, CardContent } from "@/components/ui/card";
import { useCertificateStats } from "@/hooks/data/create/useCourses";

interface CertificateStatsProps {
  timeFilter?: string;
}

export function CertificateStats({ timeFilter = 'yearly' }: CertificateStatsProps) {
  const { data: certificateStats, isLoading } = useCertificateStats(timeFilter);

  const getTimeFilterLabel = () => {
    return timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1);
  };

  const stats = [
    {
      label: "Certifications Earned",
      value: certificateStats?.certifications_earned || 0,
    },
    {
      label: "In Progress Certificates",
      value: certificateStats?.in_progress_certificates || 0,
    },
    {
      label: "Pending Certificates",
      value: certificateStats?.pending_certificates || 0,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-5">
              <div className="h-4 bg-zinc-800 rounded animate-pulse mb-3" />
              <div className="h-8 bg-zinc-800 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((item) => (
        <Card key={item.label} className="gap-0">
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {item.label}
            </p>
            <div className="flex items-end justify-between mt-3">
              <h2 className="text-2xl font-semibold text-white">
                {item.value}
              </h2>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}