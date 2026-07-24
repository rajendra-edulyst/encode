import { FunctionComponent, useMemo, type CSSProperties } from "react";
import styles from "./Container.module.css";

export type ContainerType = {
  className?: string;
  spatialExperienceDesign?: string;
  child_domains?: string;
  p?: string;

  /** Style props */
  proficiencyLabelsBackgroundColor?: CSSProperties["backgroundColor"];
  proficiencyLabelsPadding?: CSSProperties["padding"];
  rectangleDivBackgroundColor?: CSSProperties["backgroundColor"];
};

const Container: FunctionComponent<ContainerType> = ({
  className = "",
  spatialExperienceDesign,
  child_domains,
  proficiencyLabelsBackgroundColor,
  proficiencyLabelsPadding,
  rectangleDivBackgroundColor,
  p,
}) => {
  const proficiencyLabelsStyle: CSSProperties = useMemo(() => {
    return {
      backgroundColor: proficiencyLabelsBackgroundColor,
      padding: proficiencyLabelsPadding,
    };
  }, [proficiencyLabelsBackgroundColor, proficiencyLabelsPadding]);

  const rectangleDivStyle: CSSProperties = useMemo(() => {
    return {
      backgroundColor: rectangleDivBackgroundColor,
    };
  }, [rectangleDivBackgroundColor]);

  const childDomainsList = useMemo(() => {
    if (!child_domains) return [];
    return child_domains.split(",").map((item) => item.trim()).slice(0, 3);
  }, [child_domains]);

  return (
    <div className={[styles.container, className, "relative"].join(" ")}>
      <div className={styles.domain1}>
        <div className={styles.container2}>
          <img className={styles.containerIcon} alt="" />
          <div className={styles.container3}>
            <div className={styles.text}>
              <div className={styles.primary}>Primary</div>
            </div>
            <b className={styles.spatialExperience}>
              {spatialExperienceDesign}
            </b>
            <div className={styles.interiorDesignExhibitionContainer}>
              <ul className={[styles.interiorDesignExhibitionDes, "list-disc font-normal leading-[20px]"].join(" ")}>
                {childDomainsList.map((domain, index) => (
                  <li key={index}>{domain}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.container4}>
          <div className={styles.container5}>
            <div className={styles.interiorDesignExhibitionContainer}>
              Progress
            </div>
            <div className={styles.div}>78%</div>
          </div>
          <div className={styles.container6}>
            <div className={styles.container7} />
          </div>
        </div>
      </div>
      <div className={styles.domain3}>
        <div className={styles.container8}>
          <img className={styles.containerIcon2} alt="" />
          <div className={styles.container3}>
            <div className={styles.text2}>
              <div className={styles.primary}>Primary</div>
            </div>
            <div className={styles.heading3}>
              <b className={styles.productDesign}>Product Design</b>
            </div>
            <div className={styles.paragraph}>
              <div className={styles.coursesCompleted}>
                2/4 courses completed
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container10}>
          <div className={styles.container5}>
            <div className={styles.interiorDesignExhibitionContainer}>
              Progress
            </div>
            <div className={styles.div}>45%</div>
          </div>
          <div className={styles.container6}>
            <div className={styles.container13} />
          </div>
        </div>
      </div>
      <div className={styles.container14}>
        <div className={styles.container15}>
          <img className={styles.containerIcon2} alt="" />
          <div className={styles.container16}>
            <div className={styles.text3}>
              <div className={styles.primary}>Secondary</div>
            </div>
            <div className={styles.heading32}>
              <div className={styles.frontendDevelopment}>
                Frontend Development
              </div>
            </div>
            <div className={styles.paragraph2}>
              <div className={styles.coursesCompleted2}>
                2/4 courses completed
              </div>
            </div>
          </div>
        </div>
        <div className={styles.container17}>
          <div className={styles.container18}>
            <div className={styles.text4}>
              <div className={styles.progress3}>Progress</div>
            </div>
            <div className={styles.text5}>
              <div className={styles.progress3}>45%</div>
            </div>
          </div>
          <div className={styles.container6}>
            <div className={styles.container20} />
          </div>
        </div>
      </div>
      <div className={[styles.proficiencyLabels, "top-0 right-0"].join(" ")} style={{ ...proficiencyLabelsStyle, marginTop: 0, position: "absolute" }}>
        <div
          className={styles.proficiencyLabelsChild}
          style={rectangleDivStyle}
        />
        <h3 className={styles.p}>{p}</h3>
      </div>
    </div>
  );
};

export default Container;
