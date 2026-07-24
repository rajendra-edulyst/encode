import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLearningStage } from "@/hooks/data/create/useCourses";

interface LearningStageProps {
  timeFilter?: string;
}

export function LearningStage({ timeFilter = 'yearly' }: LearningStageProps) {
  const { data: learningStage, isLoading } = useLearningStage(timeFilter);

  const getTimeFilterLabel = () => {
    return timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1);
  };

  const getColorByStage = (stageName: string) => {
    if (stageName === "Advanced") return "bg-pink-500";
    return undefined;
  };

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-5 space-y-4">
          <div className="h-5 bg-zinc-800 rounded animate-pulse w-1/3" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <div className="h-3 bg-zinc-800 rounded animate-pulse w-16" />
                  <div className="h-3 bg-zinc-800 rounded animate-pulse w-8" />
                </div>
                <div className="h-2 bg-zinc-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div>
            <div className="h-3 bg-zinc-800 rounded animate-pulse w-24 mb-1" />
            <div className="h-2 bg-zinc-800 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-5 space-y-4">
        <h3 className="text-white font-semibold">
          Learning Stage
        </h3>

        {learningStage?.stages.map((stage) => (
          <Stage
            key={stage.name}
            label={stage.name}
            value={stage.progress}
            color={getColorByStage(stage.name)}
          />
        ))}

        <div>
          <p className="text-xs text-muted-foreground mb-1">
            Overall Progress
          </p>
          <Progress value={learningStage?.overall_progress || 0} className="h-2 bg-zinc-700" />
        </div>
      </CardContent>
    </Card>
  );
}

function Stage({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress
        value={value}
        className={`h-2 ${color ?? "bg-zinc-700"}`}
      />
    </div>
  );
}