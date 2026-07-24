import { FunctionComponent } from "react";
import styles from "./FrameComponent2.module.css";

export type FrameComponent2Type = {
  className?: string;
};

const FrameComponent2: FunctionComponent<FrameComponent2Type> = ({
  className = "",
}) => {
  return (
    <section className={[styles.attemptWrapper, className].join(" ")}>
      <div className={styles.attempt}>
        <div className={styles.frameParent}>
          <div className={styles.frameGroup}>
            <div className={styles.vectorParent}>
              <img className={styles.frameChild} alt="" />
              <b className={styles.create}>CREATE</b>
            </div>
            <div className={styles.learnAtYourPaceParent}>
              <b className={styles.learnAtYour}>Learn at your Pace</b>
              <div
                className={styles.repositoryOfCourses}
              >{`Repository of Courses, Mentors & Resources.`}</div>
            </div>
          </div>
          <div className={styles.frameGroup}>
            <div className={styles.vectorParent}>
              <img className={styles.frameChild} alt="" />
              <b className={styles.create}>CREATE</b>
            </div>
            <div className={styles.learnAtYourPaceParent}>
              <b className={styles.learnAtYour}>Learn at your Pace</b>
              <div
                className={styles.repositoryOfCourses}
              >{`Repository of Courses, Mentors & Resources.`}</div>
            </div>
          </div>
          <div className={styles.frameInner} />
          <div className={styles.frameDiv}>
            <div className={styles.vectorContainer}>
              <img className={styles.vectorIcon} alt="" />
              <b className={styles.connect}>CONNECT</b>
            </div>
            <div className={styles.addValueToYourExperienceParent}>
              <b className={styles.learnAtYour}>Add value to your experience</b>
              <div className={styles.repositoryOfCourses}>
                Community driven learning ecosystem.
              </div>
            </div>
          </div>
          <div className={styles.lineDiv} />
          <div className={styles.frameParent2}>
            <div className={styles.groupDiv}>
              <img className={styles.frameChild2} alt="" />
              <b className={styles.collaborate}>COLLABORATE</b>
            </div>
            <div className={styles.fuelYourGrowthWithExposureParent}>
              <b className={styles.fuelYourGrowth}>
                Fuel your growth with exposure
              </b>
              <div className={styles.repositoryOfCourses}>
                Tech driven interaction industry engine.
              </div>
            </div>
          </div>
        </div>
        <div className={styles.ccatCreativeCapabilityContainer}>
          <span className={styles.ccatCreativeCapabilityContainer2}>
            <span className={styles.ccat}>
              <span>CCAT</span>
              <b className={styles.b}>-</b>
            </span>
            <b className={styles.b}>
              <span>{` `}</span>
            </b>
            <span>
              <span className={styles.creative}>Creative</span>
              <span className={styles.span}>{` `}</span>
              <span className={styles.capability}>Capability</span>
              <span>{` Assessment `}</span>
              <span className={styles.test}>Test</span>
            </span>
          </span>
        </div>
        <div className={styles.categoryColumnParent}>
          <div className={styles.categoryColumn}>
            <div className={styles.cci}>CCIQ</div>
          </div>
          <div className={styles.frameParent3}>
            <div className={styles.hciWrapper}>
              <div className={styles.hci}>HCI</div>
            </div>
            <div className={styles.cci2}>CCIQ</div>
          </div>
        </div>
        <div className={styles.attemptInner}>
          <div className={styles.detailsColumnParent}>
            <div className={styles.detailsColumn}>
              <div className={styles.detailsColumnInner}>
                <div className={styles.growthIsntOneShotYouGetParent}>
                  <div className={styles.growthIsntOneShotContainer}>
                    <span>
                      {`Growth isn’t one-shot.`}
                      <br />
                      {`You get `}
                    </span>
                    <span className={styles.span}>3 attempts</span>
                    <span> a year, use them to evolve.</span>
                  </div>
                  <div className={styles.cci3}>CCIQ</div>
                </div>
              </div>
              <div className={styles.cci4}>CCIQ</div>
            </div>
            <div className={styles.createConnectCollaborateWrapper}>
              <h2 className={styles.createConnectContainer}>
                <span className={styles.creative}>Create</span>
                <span>{` `}</span>
                <span className={styles.creative}>|</span>
                <span>{` `}</span>
                <span className={styles.capability}>Connect</span>
                <span>{` `}</span>
                <span className={styles.capability}>|</span>
                <span>{` `}</span>
                <span className={styles.test}>Collaborate</span>
              </h2>
            </div>
          </div>
        </div>
        <div className={styles.frameParent4}>
          <div className={styles.frameParent5}>
            <div className={styles.cciWrapper}>
              <div className={styles.cci}>CCIQ</div>
            </div>
            <div className={styles.cci6}>CCIQ</div>
          </div>
          <div className={styles.cci7}>CCIQ</div>
        </div>
        <div className={styles.abilityScore}>
          <div className={styles.cci8}>CCIQ</div>
          <div className={styles.hciContainer}>
            <div className={styles.hci2}>HCI</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameComponent2;
