import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSkillsProgress } from "@/hooks/data/create/useCourses";

interface SkillsProgressProps {
  timeFilter?: string;
}

const skillColors: Record<string, string> = {
  creative_thinking: "bg-pink-500",
  visual_sense: "bg-sky-500",
  problem_solving: "bg-green-500",
  logical_reasoning: "bg-orange-500",
  design_awareness: "bg-purple-500",
};

const skillLabels: Record<string, string> = {
  creative_thinking: "Creative Thinking",
  visual_sense: "Visual Sense",
  problem_solving: "Problem Solving",
  logical_reasoning: "Logical Reasoning",
  design_awareness: "Design Awareness",
};

export function SkillsProgress({ timeFilter = 'yearly' }: SkillsProgressProps) {
  const { data: skillsData, isLoading } = useSkillsProgress(timeFilter);

  const getTimeFilterLabel = () => {
    return timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1);
  };

  if (isLoading) {
    return (
      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-5 space-y-5">
          <div className="h-5 bg-zinc-800 rounded animate-pulse w-1/3" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="flex justify-between mb-1">
                <div className="h-4 bg-zinc-800 rounded animate-pulse w-32" />
                <div className="h-4 bg-zinc-800 rounded animate-pulse w-12" />
              </div>
              <div className="h-2 bg-zinc-800 rounded animate-pulse" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const skills = skillsData
    ? Object.entries(skillsData).map(([key, value]) => ({
      name: skillLabels[key] || key,
      value,
      color: skillColors[key] || "bg-zinc-700",
    }))
    : [];

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-5 space-y-5">
        <h3 className="text-white font-semibold">
          Skills Progress
        </h3>

        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between text-sm text-white mb-1">
              <span>{skill.name}</span>
              <span className="text-muted-foreground">
                {skill.value}%
              </span>
            </div>
            <Progress
              value={skill.value}
              className={`h-2 ${skill.color}`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}