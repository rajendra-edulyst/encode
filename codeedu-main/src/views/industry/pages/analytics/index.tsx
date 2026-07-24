import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/ShadcnButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as echarts from "echarts";
import { RefreshCcw } from "lucide-react";
import { useDashboardStatData } from "../../hooks/useDashboardStatData";
import { useQueryClient } from "@tanstack/react-query";

const App: React.FC = () => {


  const { data: stat } = useDashboardStatData();

  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  React.useEffect(() => {
    // eslint-disable-next-line import/namespace
    const jobStatusChart = echarts.init(
      document.getElementById("jobStatusChart"),
    );
    const jobStatusOption = {
      animation: false,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
      },
      yAxis: {
        type: "category",
        data: ["Inactive Jobs", "Unpublished Jobs", "Published Jobs"],
      },
      series: [
        {
          type: "bar",
          data: [
            { value: stat?.inactive_job, itemStyle: { color: "#ef4444" } },
            {
              value: stat?.unpublished_job,
              itemStyle: { color: "#f59e0b" },
            },
            { value: stat?.published_job, itemStyle: { color: "#10b981" } },
          ],
          barWidth: "60%",
        },
      ],
    };
    jobStatusChart.setOption(jobStatusOption);

    // eslint-disable-next-line import/namespace
    const pipelineChart = echarts.init(
      document.getElementById("pipelineChart"),
    );
    const pipelineOption = {
      animation: false,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: {
        data: [
          "Applied",
          "Under Review",
          "Under Process",
          "Placed",
          "Rejected",
        ],
        top: 10,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Applied",
          type: "line",
          stack: "Total",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: [320, 332, 301, 334, 390, 330],
          itemStyle: { color: "#3b82f6" },
        },
        {
          name: "Under Review",
          type: "line",
          stack: "Total",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: [120, 132, 101, 134, 90, 230],
          itemStyle: { color: "#f59e0b" },
        },
        {
          name: "Under Process",
          type: "line",
          stack: "Total",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: [220, 182, 191, 234, 290, 330],
          itemStyle: { color: "#8b5cf6" },
        },
        {
          name: "Placed",
          type: "line",
          stack: "Total",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: [150, 232, 201, 154, 190, 330],
          itemStyle: { color: "#10b981" },
        },
        {
          name: "Rejected",
          type: "line",
          stack: "Total",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: [98, 77, 101, 99, 40, 30],
          itemStyle: { color: "#ef4444" },
        },
      ],
    };
    pipelineChart.setOption(pipelineOption);

    // eslint-disable-next-line import/namespace
    const placementChart = echarts.init(
      document.getElementById("placementChart"),
    );
    const placementOption = {
      animation: false,
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Placement Status",
          type: "pie",
          radius: "50%",
          data: [
            {
              value: stat?.placed,
              name: "Placed",
              itemStyle: { color: "#10b981" },
            },
            {
              value: stat?.under_process,
              name: "Under Process",
              itemStyle: { color: "#8b5cf6" },
            },
            {
              value: stat?.under_review,
              name: "Under Review",
              itemStyle: { color: "#f59e0b" },
            },
            {
              value: stat?.rejected,
              name: "Rejected",
              itemStyle: { color: "#ef4444" },
            },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    placementChart.setOption(placementOption);

    // eslint-disable-next-line import/namespace
    const vacancyChart = echarts.init(document.getElementById("vacancyChart"));
    const vacancyOption = {
      animation: false,
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      series: [
        {
          name: "Vacancy Distribution",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "30",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 78, name: "Engineering", itemStyle: { color: "#3b82f6" } },
            { value: 45, name: "Marketing", itemStyle: { color: "#10b981" } },
            { value: 32, name: "Sales", itemStyle: { color: "#f59e0b" } },
            { value: 28, name: "HR", itemStyle: { color: "#8b5cf6" } },
            { value: 13, name: "Others", itemStyle: { color: "#ef4444" } },
          ],
        },
      ],
    };
    vacancyChart.setOption(vacancyOption);

    // Cleanup function
    return () => {
      jobStatusChart.dispose();
      pipelineChart.dispose();
      placementChart.dispose();
      vacancyChart.dispose();
    };
  }, [stat]);


  const reloadData = () => {
    setLoading(true);
    queryClient.invalidateQueries({ queryKey: ['dashboardStatData'] });
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div>
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">Industry Hiring & Process Review Statistics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-4">
              <Select defaultValue="30days">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
              <Button className="whitespace-nowrap cursor-pointer text-white" onClick={reloadData}>
                <RefreshCcw className={loading ? "animate-spin" : ""} />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div>
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-white">
                Total Active Jobs
              </CardTitle>
              <i className="fas fa-briefcase text-blue-500 text-xl"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat?.published_job || '0'}
              </div>
              <p className="text-xs text-green-600 mt-1">
                <i className="fas fa-arrow-up mr-1"></i>
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-white">
                Total Applications
              </CardTitle>
              <i className="fas fa-users text-green-500 text-xl"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat?.applied.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-green-600 mt-1">
                <i className="fas fa-arrow-up mr-1"></i>
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-white">
                Placement Rate
              </CardTitle>
              <i className="fas fa-chart-line text-purple-500 text-xl"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat?.placement_per || '0'}%
              </div>
              <p className="text-xs text-red-600 mt-1">
                <i className="fas fa-arrow-down mr-1"></i>
                -2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-white">
                Total Vacancies
              </CardTitle>
              <i className="fas fa-clipboard-list text-orange-500 text-xl"></i>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat?.num_of_vacancy || '0'}
              </div>
              <p className="text-xs text-green-600 mt-1">
                <i className="fas fa-arrow-up mr-1"></i>
                +5% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Job Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Job Status Overview
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-white">
                Distribution of job postings by status
              </p>
            </CardHeader>
            <CardContent>
              <div
                id="jobStatusChart"
                style={{ width: "100%", height: "300px" }}
              ></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Placement Distribution
              </CardTitle>
              <p className="text-sm text-gray-600  dark:text-white">
                Current status of all applications
              </p>
            </CardHeader>
            <CardContent>
              <div
                id="placementChart"
                style={{ width: "100%", height: "300px" }}
              ></div>
            </CardContent>
          </Card>
        </div>

        {/* Application Pipeline Graph */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Application Pipeline Trends
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-white">
              Weekly progression of applications through the hiring process
            </p>
          </CardHeader>
          <CardContent>
            <div
              id="pipelineChart"
              style={{ width: "100%", height: "400px" }}
            ></div>
          </CardContent>
        </Card>

        {/* Detailed Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Opportunities Breakdown
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-white">
                Detailed view of current opportunities
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-[#323232] rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-eye text-blue-500 mr-3"></i>
                    <span className="text-sm font-medium dark:text-white">
                      Total Opportunities
                    </span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {stat?.opportunities.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-[#323232] rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-500 mr-3"></i>
                    <span className="text-sm font-medium dark:text-white">
                      Successfully Placed
                    </span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {stat?.placed}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-[#323232] rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-clock text-purple-500 mr-3"></i>
                    <span className="text-sm font-medium dark:text-white">Under Process</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {stat?.under_process}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-[#323232] rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-search text-orange-500 mr-3"></i>
                    <span className="text-sm font-medium dark:text-white">Under Review</span>
                  </div>
                  <span className="text-lg font-bold text-orange-600">
                    {stat?.under_review}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                Vacancy Distribution
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-white">
                Breakdown of vacancies by department
              </p>
            </CardHeader>
            <CardContent>
              <div
                id="vacancyChart"
                style={{ width: "100%", height: "300px" }}
              ></div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">
                    Application Success Rate
                  </p>
                  {stat?.applied ? (
                    <p className="text-2xl font-bold">
                      {((stat?.placed / stat?.applied) * 100).toFixed(1)}%
                    </p>
                  ) : (
                    <p className="text-2xl font-bold">0%</p>
                  )}
                </div>
                <i className="fas fa-trophy text-3xl text-blue-200"></i>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Active Pipeline</p>
                  {stat?.under_review ? (
                    <p className="text-2xl font-bold">
                      {stat?.under_process || 0 + stat?.under_review || 0}
                    </p>
                  ) : (
                    <p className="text-2xl font-bold">0%</p>
                  )}
                </div>
                <i className="fas fa-stream text-3xl text-green-200"></i>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Job Fill Rate</p>
                  {stat?.num_of_vacancy ? (
                    <p className="text-2xl font-bold">
                      {(
                        (stat?.published_job / stat?.num_of_vacancy) *
                        100
                      ).toFixed(1)}
                      %
                    </p>
                  ) : (
                    <p className="text-2xl font-bold">0%</p>
                  )}
                </div>
                <i className="fas fa-chart-pie text-3xl text-purple-200"></i>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default App;