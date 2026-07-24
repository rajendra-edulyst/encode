import { Card, CardContent } from "@/components/ui/card";
import { useSkillsBadgesSummary } from "@/hooks/data/create/useCourses";

interface StatsCardsProps {
  timeFilter?: string;
}

export function StatsCards({ timeFilter = 'yearly' }: StatsCardsProps) {
  const { data: skillsBadgesData, isLoading } = useSkillsBadgesSummary(timeFilter);

  const getTimeFilterLabel = () => {
    return timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1);
  };

  const stats = [
    { label: "Total Badges", value: skillsBadgesData?.total_badges || 0 },
    { label: "Skills Earned Ratio", value: `${skillsBadgesData?.skills_earned_ratio || 0}%` },
    { label: "Domains Progress", value: `${skillsBadgesData?.domains_progress || 0}%` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {isLoading ? (
        [1, 2, 3].map((i) => (
          <Card key={i} className="gap-0">
            <CardContent>
              <div className="h-4 bg-zinc-800 rounded animate-pulse mb-3" />
              <div className="h-8 bg-zinc-800 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))
      ) : (
        stats.map((item) => (
          <Card key={item.label} className="gap-0">
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {item.label}
              </p>
              <div className="flex justify-between items-end mt-3">
                <h2 className="text-2xl font-semibold text-white">
                  {item.value}
                </h2>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}