import { ChartContainer, ChartConfig } from '@/components/ui/chart';
import { RadialBarChart, RadialBar, Cell, ResponsiveContainer } from 'recharts';

interface LearningData {
  program?: { percentage: number };
  skill?: { percentage: number };
  domain?: { percentage: number };
}

interface LearningProgressCardProps {
  learningStage?: LearningData;
}

const chartConfig = {
  stage: {
    label: 'Stage',
    color: '#22c55e',
  },
  skills: {
    label: 'Skills',
    color: '#ec4899',
  },
  domain: {
    label: 'Domain',
    color: '#a855f7',
  },
} satisfies ChartConfig;

export function LearningProgressCard({
  learningStage = {
    program: { percentage: 0 },
    skill: { percentage: 0 },
    domain: { percentage: 0 },
  },
}: LearningProgressCardProps) {

  const getChartValue = (value: number | undefined) => {
    const val = value || 0;
    return Math.min(val, 100);
  };

  const stageValue = getChartValue(learningStage?.program?.percentage);
  const skillValue = getChartValue(learningStage?.skill?.percentage);
  const domainValue = getChartValue(learningStage?.domain?.percentage);


  const chartData = [
    {
      name: 'Stage',
      progress: stageValue,
      remaining: 100 - stageValue,
      fill: '#22c55e',
      stroke: '#16a34a',
      label: 'Stage',
    },
    {
      name: 'Skills',
      progress: skillValue,
      remaining: 100 - skillValue,
      fill: '#ec4899',
      stroke: '#db2777',
      label: 'Skills',
    },
    {
      name: 'Domain',
      progress: domainValue,
      remaining: 100 - domainValue,
      fill: '#a855f7',
      stroke: '#9333ea',
      label: 'Domain',
    },
  ];


  const reversedData = chartData.map(item => ({
    ...item,
    value: item.remaining,
    background: 100,
  }));

  const averageProgress = Math.round((stageValue + skillValue + domainValue) / 3);

  return (
    <div className="w-lg-[700px] w-auto bg-white dark:bg-gray-900 rounded-3xl p-4 border border-gray-300 dark:border-gray-800">
      <div className="flex items-center flex-wrap h-full gap-5 justify-center">

        <div className="flex-shrink-0 relative w-[160px] h-[160px] ml-4">
          <div className="absolute inset-0 bg-gray-800 rounded-xl opacity-50"></div>

          <ChartContainer config={chartConfig} className="relative h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                data={reversedData}
                innerRadius="40%"
                outerRadius="90%"
                startAngle={90}
                endAngle={450}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                barSize={14}
                cx="50%"
                cy="50%"
              >

                <RadialBar
                  dataKey="background"
                  cornerRadius={8}
                  background={{ fill: '#374151' }}
                  isAnimationActive={true}
                  animationDuration={1500}
                >
                  {reversedData.map((entry, index) => (
                    <Cell
                      key={`background-${index}`}
                      fill="#374151"
                      stroke="#4b5563"
                      strokeWidth={1}
                    />
                  ))}
                </RadialBar>


                <RadialBar
                  dataKey="value"
                  cornerRadius={8}
                  background={false}
                  isAnimationActive={true}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {reversedData.map((entry, index) => (
                    <Cell
                      key={`progress-${index}`}
                      fill={entry.fill}
                      stroke={entry.stroke}
                      strokeWidth={2}
                      fillOpacity={0.9}
                    />
                  ))}
                </RadialBar>
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartContainer>


          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2">
            <div className="flex items-center gap-1 bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-700 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
              <span className="text-black dark:text-white text-xs whitespace-nowrap">Stage</span>
            </div>
          </div>


          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
            <div className="flex items-center gap-1 bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-700 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0"></div>
              <span className="text-black dark:text-white text-xs whitespace-nowrap">Skills</span>
            </div>
          </div>


          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-2">
            <div className="flex items-center gap-1 bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-700 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
              <span className="text-black dark:text-white text-xs whitespace-nowrap">Domain</span>
            </div>
          </div>
        </div>


        <div className="flex-1 space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                <span className="text-black dark:text-white text-sm font-medium">Learning Stage</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400 text-base font-bold">
                  {stageValue}%
                </span>
                <span className="text-gray-400 text-[10px]">Overall</span>
              </div>
            </div>
            <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${stageValue}%` }}
              ></div>
            </div>
          </div>


          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0"></div>
                <span className="text-black dark:text-white text-sm font-medium">Skills Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-pink-400 text-base font-bold">
                  {skillValue}%
                </span>
                <span className="text-gray-400 text-[10px]">Average</span>
              </div>
            </div>
            <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-pink-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${skillValue}%` }}
              ></div>
            </div>
          </div>


          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0"></div>
                <span className="text-black dark:text-white text-sm font-medium">Domain Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-purple-400 text-base font-bold">
                  {domainValue}%
                </span>
                <span className="text-gray-400 text-[10px]">Combined</span>
              </div>
            </div>
            <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${domainValue}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}