import { FunctionComponent, useCallback, useState, useEffect } from "react";
import StageDetails from "./components/StageDetails";
import ProblemOverview from "./components/ProblemOverview";
import Footer from "./components/Footer";
import styles from "./CCATStage2ChooseOptions.module.css";
import { fetchCCIStage2Status } from "@/services/learner/CCIService";

const CCATStage2ChooseOptions: FunctionComponent = () => {
  const onFrameContainerClick = useCallback(() => {
    // Please sync "CCAT- Stage 2(Mentor Sessions)" to the project
  }, []);

  const [status, setStatus] = useState({
    course: 0,
    community: 0,
    buzz: 0,
    final: 0,
  });

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await fetchCCIStage2Status();
        if (response.status === 1) {
          setStatus(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch CCI stage 2 status:", error);
      }
    };
    getStatus();
  }, []);

  return (
    <div className={styles.ccatStage2chooseOptions}>
      <div className={styles.ccatStage2chooseOptionsInner}>
        <div className={styles.frameChild} />
      </div>
      <div className={styles.container}>
        <div className={styles.container2}>
          <div className={styles.badge}>
            <div className={styles.question15Out}>Question 15 out of 15</div>
          </div>
          <div className={styles.container3}>
            <div className={styles.badge2}>
              <div
                className={styles.roxServices}
              >{`ROX Services & SIM Management`}</div>
            </div>
            <div className={styles.badge3}>
              <div className={styles.roxServices}>2 of 27</div>
            </div>
          </div>
        </div>
        <div className={styles.primitivediv}>
          <div className={styles.container4} />
        </div>
      </div>

      <div className={styles.mentoringSession}>
        <img className={styles.image401Icon} alt="" src="/ccat-landing-page/image-4011@2x.png" />
        <div
          className={styles.arrowRightAltParent}
          onClick={onFrameContainerClick}
        >
          <img
            className={styles.arrowRightAltIcon}
            alt=""
            src="/ccat-landing-page/arrow-right-alt.svg"
          />
          <div className={styles.bookTheSession}>
            Book the
            <br />
            Session
            <br />
            Now
          </div>
        </div>
        <b className={styles.getGuidedBy}>Get Guided by Experts</b>
        <div className={styles.bookattendAMentoring}>
          Book/Attend a Mentoring session
        </div>
      </div>
      <main className={styles.mainContent}>
        <div className={styles.stageInfo}>
          <StageDetails />
          <ProblemOverview
            isCourseCompleted={status.course === 1}
            isCommunityCompleted={status.community === 1}
            isBuzzCompleted={status.buzz === 1}
          />
        </div>
      </main>
      <div className={styles.component8}>
        <div className={styles.rectangleParent}>
          <div className={styles.rectangleDiv} />
          <div className={styles.blue}>
            <img
              className={styles.blueChild}
              alt=""
              src="/ccat-landing-page/Frame-14451@2x.png"
            />
            <img
              className={styles.blueChild}
              alt=""
              src="/ccat-landing-page/Frame-14521@2x.png"
            />
            <img className={styles.blueChild} alt="" src="/ccat-landing-page/Frame-1454@2x.png" />
            <img className={styles.blueChild} alt="" src="/ccat-landing-page/Frame-1455@2x.png" />
            <img className={styles.blueChild} alt="" src="/ccat-landing-page/Frame-1456@2x.png" />
            <img
              className={styles.blueChild}
              alt=""
              src="/ccat-landing-page/Frame-14531@2x.png"
            />
          </div>
        </div>
        <img className={styles.frameIcon2} alt="" src="/ccat-landing-page/Frame.svg" />
      </div>
      <Footer />
    </div>
  );
};

export default CCATStage2ChooseOptions;
