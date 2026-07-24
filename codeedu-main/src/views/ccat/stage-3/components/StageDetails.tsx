import { FunctionComponent } from "react";
import styles from "./StageDetails.module.css";
import { useCCITimer } from "@/context/CCIContext";

export type StageDetailsType = {
  className?: string;
};

const StageDetails: FunctionComponent<StageDetailsType> = ({
  className = "",
}) => {
  const { timeLeft } = useCCITimer();

  return (
    <section className={[styles.stageDetails, className].join(" ")}>
      <div className={styles.stageTitle}>
        <div className={styles.stage02CciContainer}>
          <span>
            Stage 02
            <br />
          </span>
          <b className={styles.cciEngageEcosystem}>
            CCIQ Engage: Ecosystem Simulation
          </b>
        </div>
        <div className={styles.ellipseParent}>
          <div className={styles.frameChild} />
          <div className={styles.div}>90%</div>
          <div className={styles.frameItem} />
        </div>
        <h3 className={styles.timeLeft460153}>Time Left: {timeLeft}</h3>
      </div>
      <div className={styles.timeLeft004953}>Time Left: {timeLeft}</div>
    </section>
  );
};


export default StageDetails;
