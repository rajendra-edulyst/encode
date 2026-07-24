import { LeaderboardUser } from "@/@types/learner/leaderboard";
import Loading from "@/components/shared/Loading";
import { fetchMyCompetitionLeaderboard } from "@/services/learner/ScoreboardService";
import React, { useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const data = [
  { score: 1000, Users: 10, "Completions %": 100 },
  { score: 980, Users: 25, "Completions %": 90 },
  { score: 900, Users: 75, "Completions %": 80 },
  { score: 850, Users: 100, "Completions %": 70 },
];


export default function Leaderboard() {

  const [leaderboardData, setLeaderboardData] = React.useState<LeaderboardUser>({} as LeaderboardUser);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchMyCompetitionLeaderboard().then((data) => {
      if (data) {
        setLeaderboardData(data);
      }
    }).catch((error) => {
      console.error("Error fetching leaderboard data:", error);
      setError("Failed to load leaderboard data.");
    }).finally(() => {
      setLoading(false);
    });
  }, []);


  if (loading) {
    <Loading loading={loading} />
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-5">
      {/* View Toggle */}
      <div className="grid gap-8">
        {/* My Rank Section */}
        <div>
          <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 overflow-hidden rounded-full bg-orange-100">
                  <img
                    src={leaderboardData?.profile_image}
                    alt={leaderboardData?.name}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="font-medium">{leaderboardData?.name}</div>
                <div className="text-sm text-gray-500">Total Activity: {leaderboardData?.total_activities}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">Score</div>
              <div className="text-gray-500">{leaderboardData?.g_score}</div>
            </div>
          </div>
        </div>
        {/* Top 100 Section */}
        <div>
          <div className="flex justify-center items-center mt-10">
            <div className="w-full max-w-2xl p-5 border  bg-white">
              <h2 className="text-2xl font-bold text-center mb-5">
                Score and Course Completion by Users
              </h2>
              <BarChart
                width={600}
                height={400}
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="score" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Users" fill="#01AEF0" animationDuration={1500} />
                <Bar dataKey="Completions %" fill="#82ca9d" animationDuration={1500} />
              </BarChart>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
