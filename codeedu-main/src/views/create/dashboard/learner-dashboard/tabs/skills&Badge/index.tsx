import { BadgesUnlocked } from "./BadgesUnlocked";
import { DomainProgress } from "./DomainProgress";
import { LearningStage } from "./LearningStage";
import { SkillsProgress } from "./SkillsProgress";
import { StatsCards } from "./StatsCards";

interface LearnerProgressDashboardProps {
  timeFilter?: string;
}

export default function LearnerProgressDashboard({ timeFilter = 'yearly' }: LearnerProgressDashboardProps) {
    return (
        <div className="space-y-6">
            <StatsCards timeFilter={timeFilter} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <LearningStage timeFilter={timeFilter} />
                <SkillsProgress timeFilter={timeFilter} />
                <DomainProgress timeFilter={timeFilter} />
            </div>
            <BadgesUnlocked timeFilter={timeFilter} />
        </div>
    );
}