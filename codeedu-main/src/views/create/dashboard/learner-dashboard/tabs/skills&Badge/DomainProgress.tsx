import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Layers, Palette, Shirt, Code, Briefcase } from "lucide-react";
import { useDomainProgress } from "@/hooks/data/create/useCourses";

interface DomainProgressProps {
  timeFilter?: string;
}

const domainIcons: Record<string, { icon: any; iconBg: string; barColor: string }> = {
  "Product Design": { icon: BookOpen, iconBg: "bg-indigo-500", barColor: "bg-violet-500" },
  "Fashion Design": { icon: Layers, iconBg: "bg-sky-500", barColor: "bg-sky-500" },
  "Graphic Design": { icon: Palette, iconBg: "bg-pink-500", barColor: "bg-pink-500" },
  "Web Development": { icon: Code, iconBg: "bg-green-500", barColor: "bg-green-500" },
  "Business": { icon: Briefcase, iconBg: "bg-orange-500", barColor: "bg-orange-500" },
};

export function DomainProgress({ timeFilter = 'yearly' }: DomainProgressProps) {
  const { data: domains, isLoading } = useDomainProgress(timeFilter);

  const getTimeFilterLabel = () => {
    return timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1);
  };

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div className="h-5 bg-zinc-800 rounded animate-pulse w-1/3" />
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-16" />
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="bg-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex gap-3 items-center">
                <div className="h-10 w-10 rounded-md bg-zinc-700 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-zinc-700 rounded animate-pulse w-32 mb-1" />
                  <div className="h-3 bg-zinc-700 rounded animate-pulse w-24" />
                </div>
              </div>
              <div className="flex justify-between">
                <div className="h-3 bg-zinc-700 rounded animate-pulse w-16" />
                <div className="h-3 bg-zinc-700 rounded animate-pulse w-10" />
              </div>
              <div className="h-2 bg-zinc-700 rounded-full animate-pulse" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">
            Domain Progress
          </h3>
          <span className="text-xs text-muted-foreground">
            {domains?.length || 0} Domains
          </span>
        </div>

        {domains?.map((domain) => {
          const config = domainIcons[domain.domain_name] || {
            icon: Shirt,
            iconBg: "bg-zinc-600",
            barColor: "bg-zinc-500",
          };
          return (
            <DomainItem
              key={domain.domain_name}
              title={domain.domain_name}
              subtitle={`${domain.completed_courses}/${domain.total_courses} courses completed`}
              value={domain.progress}
              icon={config.icon}
              iconBg={config.iconBg}
              barColor={config.barColor}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}

/* ---------- Domain Item ---------- */

function DomainItem({
  title,
  subtitle,
  value,
  icon: Icon,
  iconBg,
  barColor,
}: {
  title: string;
  subtitle: string;
  value: number;
  icon: any;
  iconBg: string;
  barColor: string;
}) {
  return (
    <div className="bg-zinc-800 rounded-xl p-4 space-y-3">
      {/* Top Row */}
      <div className="flex gap-3 items-center">
        {/* Icon */}
        <div
          className={`h-10 w-10 rounded-md flex items-center justify-center ${iconBg}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>

        {/* Text */}
        <div>
          <h4 className="text-sm font-semibold text-white">
            {title}
          </h4>
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Progress Row */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Progress</span>
        <span>{value}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}