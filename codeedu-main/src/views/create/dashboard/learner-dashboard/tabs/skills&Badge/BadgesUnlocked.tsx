import { Card, CardContent } from "@/components/ui/card";
import { useBadges, useSkillsBadgesSummary } from "@/hooks/data/create/useCourses";
import {
  Zap,
  Flame,
  Star,
  Trophy,
  Target,
  Heart,
  Crown,
  Sparkles,
} from "lucide-react";

interface BadgesUnlockedProps {
  timeFilter?: string;
}

const iconMap: Record<string, React.ElementType> = {
  "Quick Learner": Zap,
  "7 Day Streak": Flame,
  "Perfect Score": Star,
  "High Achiever": Trophy,
  "Goal Crusher": Target,
  "Community Helper": Heart,
  "Top Performer": Crown,
  "Early Adopter": Sparkles,
};

const colorMap: Record<string, string> = {
  "Quick Learner": "bg-orange-500",
  "7 Day Streak": "bg-red-500",
  "Perfect Score": "bg-sky-500",
  "High Achiever": "bg-purple-500",
  "Goal Crusher": "bg-green-500",
  "Community Helper": "bg-pink-500",
  "Top Performer": "bg-yellow-600",
  "Early Adopter": "bg-blue-600",
};

export function BadgesUnlocked({ timeFilter = 'yearly' }: BadgesUnlockedProps) {
  const { data: badges, isLoading } = useBadges(timeFilter);
  const { data: summary } = useSkillsBadgesSummary(timeFilter);

  const getTimeFilterLabel = () => {
    return timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1);
  };

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800 mt-6">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 bg-zinc-800 rounded animate-pulse w-32" />
            <div className="h-6 bg-zinc-800 rounded-full animate-pulse w-16" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg p-4 bg-zinc-800">
                <div className="h-10 w-10 rounded-md bg-zinc-700 animate-pulse mb-3" />
                <div className="h-4 bg-zinc-700 rounded animate-pulse mb-2" />
                <div className="h-3 bg-zinc-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 mt-6">
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">
            Badges Unlocked
          </h3>
          <span className="text-xs bg-sky-500 text-white px-3 py-1 rounded-full">
            {badges?.length || 0}/{summary?.total_badges || 0}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {badges?.map((badge) => {
            const Icon = iconMap[badge.badge_name] || Sparkles;
            const color = colorMap[badge.badge_name] || "bg-zinc-600";

            return (
              <div
                key={badge.badge_name}
                className="rounded-lg p-4 transition bg-zinc-800"
              >
                {/* Icon or Image */}
                {badge.badge_icon_url && badge.badge_icon_url.includes('http') ? (
                  <div className="h-10 w-10 rounded-md mb-3 overflow-hidden">
                    <img
                      src={badge.badge_icon_url}
                      alt={badge.badge_name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`h-10 w-10 rounded-md flex items-center justify-center mb-3 ${color}`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                )}

                {/* Text */}
                <h4 className="text-sm font-semibold text-white">
                  {badge.badge_name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">
                  {badge.badge_description}
                </p>
                {badge.unlocked_date && (
                  <p className="text-xs text-sky-400 mt-2">
                    {badge.unlocked_date}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}