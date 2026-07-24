import { FunctionComponent } from "react";
import styles from "./FrameComponent1.module.css";
import { useCCITimer } from "@/context/CCIContext";

export type FrameComponentType = {
  className?: string;
};

const FrameComponent: FunctionComponent<FrameComponentType> = ({
  className = "",
}) => {
  const { timeLeft } = useCCITimer();

  return (
    <section className={[styles.ccatStage4Inner, className].join(" ")}>
      <div className={styles.frameParent}>
        <div className={styles.stage04CciTrackContinuousParent}>
          <div className={styles.stage04CciContainer}>
            <span>
              Stage 04
              <br />
            </span>
            <b className={styles.cciTrackContinuous}>
              CCIQ Track: Continuous Performance Layer
            </b>
          </div>
          <div className={styles.ellipseParent}>
            <div className={styles.frameChild} />
            <div className={styles.div}>90%</div>
            <div className={styles.frameItem} />
          </div>
          <b className={styles.timeLeft031522}>Time Left: {timeLeft}</b>
        </div>
        <div className={styles.timeLeft004953}>Time Left: {timeLeft}</div>
      </div>
    </section>
  );
};


export default FrameComponent;
