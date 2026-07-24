import { FunctionComponent } from "react";
import styles from "./ShortTerms.module.css";

export type ShortTermsType = {
  className?: string;
  shortTermGoals?: string;
  next36Months?: string;
  refineYourStorytellingMethods?: string;
  takeComprehensiveCopywriting?: string;
};

const ShortTerms: FunctionComponent<ShortTermsType> = ({
  className = "",
  shortTermGoals,
  next36Months,
  refineYourStorytellingMethods,
  takeComprehensiveCopywriting,
}) => {
  return (
    <div className={[styles.shortTerms, className].join(" ")}>
      <div className={styles.container}>
        <img className={styles.containerIcon} alt="" src="/Container1.svg" />
        <div className={styles.container2}>
          <h3 className={styles.shortTermGoals}>{shortTermGoals}</h3>
          <div className={styles.next36Months}>{next36Months}</div>
        </div>
      </div>
      <div className={styles.container3}>
        <div className={styles.container4}>
          <img className={styles.icon} loading="lazy" alt="" src="/Icon3.svg" />
          <div className={styles.refineYourStorytelling}>
            {refineYourStorytellingMethods}
          </div>
        </div>
        <div className={styles.container4}>
          <img className={styles.icon} loading="lazy" alt="" src="/Icon5.svg" />
          <div className={styles.refineYourStorytelling}>
            {takeComprehensiveCopywriting}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShortTerms;
