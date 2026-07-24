import { FunctionComponent } from "react";
import CreativeCriticalThinking from "./CreativeCriticalThinking";
import styles from "./FrameComponent1.module.css";

export type FrameComponent1Type = {
  className?: string;
};

const FrameComponent1: FunctionComponent<FrameComponent1Type> = ({
  className = "",
}) => {
  return (
    <section className={[styles.fluencyAnalysisWrapper, className].join(" ")}>
      <div className={styles.fluencyAnalysis}>
        <CreativeCriticalThinking
          creativeCriticalThinkingMinWidth="242px"
          neurology="/ccat-landing-page/flowchart.svg"
          frameDivPadding="0px 65px"
          creativeCriticalThinking={`Digital & AI
Fluency`}
          creativeCriticalWidth="137px"
          theAbilityToGenerateIdeasAnal="Leveraging technology and AI to research, analyze data, and drive creative solutions."
          isProblemSolving={true}
          frameImage="/ccat-landing-page/Frame-14100812883.svg"
        />
        <div className={styles.collaborationLeadership}>
          <img
            className={styles.collaborationLeadershipChild}
            alt=""
            src="/ccat-landing-page/Frame-1410081288.svg"
          />
          <img className={styles.neurologyIcon} alt="" src="/ccat-landing-page/neurology.svg" />
          <img className={styles.paletteIcon} alt="" src="/ccat-landing-page/palette1.svg" />
          <div className={styles.diversity1Wrapper}>
            <img
              className={styles.diversity1Icon}
              loading="lazy"
              alt=""
              src="/ccat-landing-page/diversity-1.svg"
            />
          </div>
          <div className={styles.frameParent}>
            <div className={styles.collaborationLeadershipWrapper}>
              <b className={styles.collaborationLeadership2}>
                {`Collaboration &`}
                <br />
                {`Leadership`}
              </b>
            </div>
            <div className={styles.workingCollaborativelyLeadi}>
              Working collaboratively, leading with initiative, and taking
              ownership while resolving challenges.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameComponent1;
