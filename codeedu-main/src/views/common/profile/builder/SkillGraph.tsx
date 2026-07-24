import React, { useCallback, useState } from "react";
import { deleteUserSkill } from "@/services/learner/PortfolioService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { toast } from "sonner"; // or any toast lib you're using

interface Skill {
  id: string;
  name: string;
  self_proficiency: number;
  description: string;
}

interface Props {
  portfolio: {
    skill: Skill[];
  };
  type: string | null;
  fetchUserPortfolio: () => void; // <- make sure to pass this from parent
}

const SkillGraph: React.FC<Props> = ({ portfolio, type = null, fetchUserPortfolio }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const data = portfolio?.skill?.map((skill) => ({
    ...skill,
    proficiency: skill.self_proficiency,
  }));

  const removeUserSkill = useCallback(
    async (id?: string) => {
      if (!id) {
        toast.error("Something went wrong, please try again");
        return;
      }
      setLoading(true);
      setError("");
      try {
        await deleteUserSkill(id);
        await fetchUserPortfolio();
        toast.success("Skill removed successfully");
      } catch (error) {
        setError("Failed to delete skill");
        toast.error("Failed to delete skill");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [fetchUserPortfolio]
  );

  return (
    <div>
      <ResponsiveContainer
      width="100%"
      height={350}
      maxHeight={500}
      >
      <BarChart
        data={data}
        layout="horizontal"
        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        barCategoryGap={20}
      >
        <XAxis
        dataKey="name"
        type="category"
        axisLine={false}
        tickLine={false}
        tick={{ fill: "#1e293b", fontSize: 14, fontWeight: 500 }}
        interval={0}
        angle={-30}
        dy={20}
        height={60}
        />
        <YAxis
        type="number"
        domain={[0, 100]}
        tickFormatter={(v) => `${v}%`}
        axisLine={false}
        tickLine={false}
        tick={{ fill: "#64748b", fontSize: 12 }}
        />
        <Tooltip
        cursor={{ fill: "#f1f5f9" }}
        contentStyle={{
          backgroundColor: "#fff",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          padding: 10,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        }}
        formatter={(value: number) => `${value}%`}
        labelStyle={{ fontWeight: "bold", color: "#0f172a" }}
        itemStyle={{ color: "#475569" }}
        />
        <Bar
        dataKey="proficiency"
        radius={[12, 12, 0, 0]}
        fill="var(--primary)"
        label={{
          position: "top",
          formatter: (v: number) => `${v}%`,
          fill: "#0f172a",
          fontWeight: 500,
          fontSize: 13,
        }}
        />
      </BarChart>
      </ResponsiveContainer>

      {type === "edit" && (
      <div className="mt-6 flex flex-col gap-3">
        {data?.map((skill) => (
        <div
          key={skill.id}
          className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
        >
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {skill.name}
          </span>
          <button
          className="text-red-500 hover:text-red-700 transition text-base"
          title="Remove skill"
          disabled={loading}
          onClick={() => removeUserSkill(skill.id)}
          >
          ✕
          </button>
        </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default SkillGraph;
