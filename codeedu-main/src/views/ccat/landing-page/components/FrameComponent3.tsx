import { FunctionComponent } from "react";
import styles from "./FrameComponent3.module.css";

export type FrameComponent3Type = {
  className?: string;
};

const FrameComponent3: FunctionComponent<FrameComponent3Type> = ({
  className = "",
}) => {
  return (
    <main className={[styles.frameParent, className].join(" ")}>
      <div className={styles.competencyAssetsParent}>
        <div className={styles.competencyAssets}>
          <div className={styles.objects}>
            <img className={styles.groupIcon} alt="" src="/ccat-landing-page/Group_fixed.svg" />
            <div className={styles.indexLabel}>
              <div className={styles.cci}>CCIQ</div>
            </div>
            <div className={styles.competitiveCapabilityIndex}>
              Competitive
              <br />
              Capability Index
            </div>
            <img
              className={styles.asset4Icon}
              loading="lazy"
              alt=""
              src="/ccat-landing-page/Asset-41.svg"
            />
            <img
              className={styles.asset321}
              loading="lazy"
              alt=""
              src="/ccat-landing-page/Asset-3-2-1.svg"
            />
          </div>
          <section className={styles.competencyAssetsInner}>
            <div className={styles.frameGroup}>
              <div className={styles.creativityTitleWrapper}>
                <div className={styles.creativityTitle}>
                  <h2 className={styles.curiousCreators}>Curious Creators</h2>
                  <div className={styles.turnYourCuriosity}>
                    Turn your curiosity into clarity and direction.
                  </div>
                </div>
              </div>
              <div className={styles.talentProfile}>
                <img
                  className={styles.asset4Icon2}
                  alt=""
                  src="/ccat-landing-page/Asset-4@2x.png"
                />
                <div className={styles.industryTitleWrapper}>
                  <div className={styles.industryTitle}>
                    <h2 className={styles.creativeIndustries}>
                      Creative Industries
                    </h2>
                    <div className={styles.forCreativeIndustries}>
                      For creative industries that prioritize originality,
                      design, and expression.
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.builderTitleWrapper}>
                <div className={styles.creativityTitle}>
                  <h2 className={styles.futureInnovators}>Future Innovators</h2>
                  <div className={styles.understandHowYou}>
                    Understand how you think, solve, and build what’s next.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className={styles.talentForwardInstitutionsWrapper}>
          <h2 className={styles.talentForwardInstitutions}>
            Talent-Forward Institutions
          </h2>
        </div>
      </div>
      <div className={styles.asset5Parent}>
        <img
          className={styles.asset5Icon}
          loading="lazy"
          alt=""
          src="/ccat-landing-page/Asset-5.svg"
        />
        <div className={styles.identifyAndNurtureCreativeWrapper}>
          <div className={styles.identifyAndNurture}>
            Identify and nurture creative capability beyond academic scores.
          </div>
        </div>
      </div>
    </main>
  );
};

export default FrameComponent3;
