import { FunctionComponent, useMemo } from "react";
import styles from "./FellowshipUsage.module.css";
import { usePackageParameters } from "@/hooks/data/useGettingStarted";
import { getGroupedUsageStats } from "@/lib/packageColor";

export type FellowshipUsageType = {
  className?: string;
  progress?: number;
  packageDetailsRes?: any;
  globalParameters?: any[];
};

const FellowshipUsage: FunctionComponent<FellowshipUsageType> = ({
  className = "",
  progress = 0,
  packageDetailsRes,
  globalParameters,
}) => {
  const { data: fetchedParameters } = usePackageParameters();
  const parametersList = globalParameters || fetchedParameters || [];

  const packageInfo = packageDetailsRes?.data?.package;

  const userPackageParameterItems = useMemo(() => {
    return packageDetailsRes?.data?.user_package_parameter_items || [];
  }, [packageDetailsRes]);

  const groupedStats = useMemo(() => {
    return getGroupedUsageStats(userPackageParameterItems, parametersList);
  }, [userPackageParameterItems, parametersList]);

  return (
    <section className={[styles.fellowshipUsage, className].join(" ")}>
      <div className={styles.usageOverview}>
        <div className={styles.usageDetails}>
          <h3 className={styles.yourFellowshipUsage}>Your Fellowship Usage</h3>
        </div>
        <div className={styles.microCreditsWrapper}>
          <h3 className={styles.microCredits}>{packageInfo?.credits || 0} Micro Credits</h3>
        </div>
      </div>
      <div className={styles.frameParent}>
        <div className={styles.explorerLabelsParent}>
          <div className={styles.explorerLabels}>
            {packageInfo?.icon && (
              <img
                className={styles.travelExploreIcon}
                loading="lazy"
                alt={packageInfo?.name}
                src={packageInfo?.icon}
              />
            )}
            <h2 className={styles.explorer}>{packageInfo?.name || "No Plan Selected"}</h2>
            <div className={[styles.forLearnersStarting, "font-normal"].join(" ")}>
              {packageInfo?.description || "Select a fellowship plan to track your usage and access resources."}
            </div>
          </div>
          <div className={styles.explorerLabels2}>
            <CircularProgress percentage={progress} />
            <div className={styles.stageVisualWrapper} style={{ display: "none" }} >
              <div className={styles.stageVisual}>
                <div className={styles.stageDotOne} />
                <h2 className={styles.stageConnector}>35%</h2>
                <div className={styles.stageDotTwo} />
              </div>
            </div>
            <img
              className={styles.travelExploreIcon2}
              alt=""
              src="/travel-explore.svg"
            />
            <h2 className={[styles.fellowshipProgress, "leading-normal"].join(" ")}>
              Fellowship Progress
            </h2>
            <div className={styles.forLearnersStarting2}>
              For learners starting their creative journey
            </div>
          </div>
        </div>
        <div
          className="flex flex-col items-end gap-4"
        >
          {/* Top Row - 2 Cards */}
          <div className="flex justify-end gap-4">
            {groupedStats.slice(0, 2).map((group, idx) => (
              <div
                key={idx}
                className={[styles.rectangleParent, "max-w-[170px] min-w-[150px]"].join(" ")}
                style={{ minHeight: "120px" }}
              >
                <div className={styles.frameChild} />

                <div className={styles.assistanceValueParent}>
                  <h1
                    className={styles.assistanceValue}
                  >
                    <span className={`${(group.used === group.allowed && group.allowed !== 0) ? "" : "text-[24px]"}`}> {group.used}/</span>{group.allowed}
                  </h1>

                  {group.used === group.allowed && group.allowed !== 0 && (
                    <img
                      className={styles.taskAltIcon}
                      alt=""
                      src="/task-alt.svg"
                    />
                  )}
                </div>

                <div
                  className={[styles.buzzPostedAnd, "font-normal"].join(" ")}
                  style={{ lineHeight: "20px", marginTop: "auto" }}
                >
                  {group.title}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row - 3 Cards */}
          <div className="flex justify-end gap-4">
            {groupedStats.slice(2, 5).map((group, idx) => (
              <div
                key={idx}
                className={[styles.rectangleParent, "max-w-[170px] min-w-[150px]"].join(" ")}
                style={{ minHeight: "120px" }}
              >
                <div className={styles.frameChild} />

                <div className={styles.assistanceValueParent}>
                  <h1
                    className={styles.assistanceValue}
                  >
                    <span className={`${(group.used === group.allowed && group.allowed !== 0) ? "" : "text-[24px]"}`}> {group.used}/</span>{group.allowed}
                  </h1>

                  {group.used === group.allowed && group.allowed !== 0 && (
                    <img
                      className={styles.taskAltIcon}
                      alt=""
                      src="/task-alt.svg"
                    />
                  )}
                </div>

                <div
                  className={[styles.buzzPostedAnd, "font-normal"].join(" ")}
                  style={{ lineHeight: "20px", marginTop: "auto" }}
                >
                  {group.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FellowshipUsage;


const CircularProgress = ({ percentage = 15 }) => {
  const radius = 55;
  const stroke = 15;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-30 h-30">
      <svg
        width="133"
        height="133"
        viewBox="0 0 133 133"
        className="-rotate-90"
      >
        {/* Background Ring */}
        <circle
          cx="60"
          cy="60"
          r={normalizedRadius}
          fill="transparent"
          stroke="#5A5A5A"
          strokeWidth={stroke}
        />

        {/* Progress Ring */}
        <circle
          cx="60"
          cy="60"
          r={normalizedRadius}
          fill="transparent"
          stroke="#7FBC42"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-white text-[14px] font-normal">
        {percentage}%
      </div>
    </div>
  );
};