import { FunctionComponent, useMemo, type CSSProperties } from "react";
import styles from "./CreativeCriticalThinking.module.css";

export type CreativeCriticalThinkingType = {
  className?: string;
  neurology?: string;
  creativeCriticalThinking?: string;
  theAbilityToGenerateIdeasAnal?: string;

  /** Style props */
  creativeCriticalThinkingMinWidth?: CSSProperties["minWidth"];
  frameDivPadding?: CSSProperties["padding"];
  creativeCriticalWidth?: CSSProperties["width"];
  isProblemSolving?: boolean;
  frameImage?: string;
};

const CreativeCriticalThinking: FunctionComponent<
  CreativeCriticalThinkingType
> = ({
  className = "",
  creativeCriticalThinkingMinWidth,
  neurology,
  frameDivPadding,
  creativeCriticalThinking,
  creativeCriticalWidth,
  theAbilityToGenerateIdeasAnal,
  isProblemSolving,
  frameImage = "/ccat-landing-page/Frame-14100812882.svg",
}) => {
  const creativeCriticalThinkingStyle: CSSProperties = useMemo(() => {
    return {
      minWidth: creativeCriticalThinkingMinWidth,
    };
  }, [creativeCriticalThinkingMinWidth]);

  const frameDivStyle: CSSProperties = useMemo(() => {
    return {
      padding: frameDivPadding,
    };
  }, [frameDivPadding]);

  const creativeCriticalStyle: CSSProperties = useMemo(() => {
    return {
      width: creativeCriticalWidth,
    };
  }, [creativeCriticalWidth]);

  return (
    <div
      className={[styles.creativeCriticalThinking, className].join(" ")}
      style={creativeCriticalThinkingStyle}
    >
      <img
        className={styles.creativeCriticalThinkingChild}
        alt=""
        src={frameImage}
      />
      <div className={styles.neurologyWrapper}>
        <img
          className={styles.neurologyIcon}
          loading="lazy"
          alt=""
          src={neurology}
        />
      </div>
      <div className={styles.frameParent}>
        <div
          className={styles.creativeCriticalThinkingWrapper}
          style={frameDivStyle}
        >
          <b className={styles.creativeCritical} style={creativeCriticalStyle}>
            {creativeCriticalThinking}
          </b>
        </div>
        <div className={styles.theAbilityTo}>
          {theAbilityToGenerateIdeasAnal}
        </div>
      </div>
    </div>
  );
};

export default CreativeCriticalThinking;
