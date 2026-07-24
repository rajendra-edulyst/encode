import { FunctionComponent } from "react";
import CreativeCriticalThinking from "./CreativeCriticalThinking";
import styles from "./FrameComponent.module.css";

export type FrameComponentType = {
  className?: string;
};

const FrameComponent: FunctionComponent<FrameComponentType> = ({
  className = "",
}) => {
  return (
    <div className={[styles.frameParent, className].join(" ")}>
      <div className={styles.whatCciEvaluatesCciFocuseWrapper}>
        <div className={styles.whatCciEvaluatesContainer}>
          <b>
            What CCIQ Evaluates?
            <br />
          </b>
          <span className={styles.cciFocusesOn}>
            CCIQ focuses on the core pillars of creative intelligence-
          </span>
        </div>
      </div>
      <section className={styles.evaluationDetails}>
        <CreativeCriticalThinking
          neurology="/ccat-landing-page/neurology1.svg"
          creativeCriticalThinking={`Creative &
Critical Thinking`}
          theAbilityToGenerateIdeasAnal="The ability to generate ideas, analyze, recognize patterns, decide under uncertainty, and reflect."
        />
        <CreativeCriticalThinking
          creativeCriticalThinkingMinWidth="280px"
          neurology="/ccat-landing-page/extension.svg"
          frameDivPadding="0px 12px 0px 11px"
          creativeCriticalThinking={`Problem Solving
& Systems Thinking`}
          creativeCriticalWidth="244px"
          theAbilityToGenerateIdeasAnal="Analyzing problems, mapping systems, and building solutions through iterative thinking."
          isProblemSolving={true}
          frameImage="/ccat-landing-page/Frame-14100812884.svg"
        />
        <div className={styles.commuunicationExpressions}>
          <img
            className={styles.commuunicationExpressionsChild}
            alt=""
            src="/ccat-landing-page/Frame-14100812881.svg"
          />
          <img className={styles.neurologyIcon} alt="" src="/ccat-landing-page/neurology.svg" />
          <div className={styles.paletteWrapper}>
            <img
              className={styles.paletteIcon}
              loading="lazy"
              alt=""
              src="/ccat-landing-page/palette.svg"
            />
          </div>
          <div className={styles.frameGroup}>
            <div className={styles.communicationExpressionsWrapper}>
              <b className={styles.communicationExpressions}>
                {`Communication`}
                <br />
                {`& Expressions`}
              </b>
            </div>
            <div className={styles.aBlendOf}>
              A blend of verbal, visual, and written communication to convey
              ideas clearly and persuasively.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FrameComponent;
