import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import Heading from "../components/Heading";
import FrameComponent2 from "../components/FrameComponent2";
import styles from "./CCATExamDashboard.module.css";
import { useUserProfile } from "@/hooks/data/useGettingStarted";

const CCATExamDashboard: FunctionComponent = () => {
  const { data: userProfile } = useUserProfile();
  return (
    <div className={styles.ccatExamDashboard}>
      <div className={styles.profileCard}>
        <div className={styles.heyRahul}>
          <b>{`Hey, `}</b>
          <span className={styles.rahul}>{userProfile?.platform_name || userProfile?.name || 'User'}</span>
        </div>
        <b className={styles.readyToPut}>
          Ready to put your creativity to the test?
        </b>
        <div className={styles.frameParent}>
          <div className={styles.feb2026Parent}>
            <b className={styles.am}>25 Feb, 2026</b>
            <img className={styles.keyboardArrowDownIcon} alt="" />
          </div>
          <div className={styles.amParent}>
            <b className={styles.am}>07:00:00 AM</b>
            <b className={styles.pm}>07:45 PM</b>
            <img className={styles.keyboardArrowDownIcon} alt="" />
          </div>
        </div>
        <b className={styles.yourCcatExam}>Your CCIQ Exam Schedule</b>
        {/*<div className={styles.attemptsLeft23}>Attempts Left: 2/3</div>*/}
        <div className={styles.foundationStageParent}>
          <div className={styles.foundationStage}>
            <b>
              Foundation
              <br />
            </b>
            <span className={styles.stage}>Stage</span>
          </div>
          <div className={styles.ellipseParent}>
            <div className={styles.frameChild} />
            <div className={styles.div}>0%</div>
            <div className={styles.frameItem} />
          </div>
        </div>
        <div className={styles.applicationStageParent}>
          <div className={styles.foundationStage}>
            <b>
              Application
              <br />
            </b>
            <span className={styles.stage}>Stage</span>
          </div>
          <div className={styles.ellipseParent}>
            <div className={styles.frameChild} />
            <div className={styles.div}>0%</div>
            <div className={styles.frameItem} />
          </div>
        </div>
        <div className={styles.executionStageParent}>
          <div className={styles.foundationStage}>
            <b>
              Execution
              <br />
            </b>
            <span className={styles.stage}>Stage</span>
          </div>
          <div className={styles.ellipseParent}>
            <div className={styles.frameChild} />
            <div className={styles.div}>0%</div>
            <div className={styles.frameItem} />
          </div>
        </div>
        <div className={styles.arrowOutwardParent}>
          <img className={styles.arrowOutwardIcon} alt="" />
          <div className={styles.startNow}>
            Start
            <br />
            Now
          </div>
        </div>
      </div>

      <main className={styles.assessmentArea}>
        <section className={styles.titleArea}>
          <Heading />
          <div id="cciq-certificate-content" style={{ width: "100%" }}>
            <FrameComponent2
              shortTermsTermGoals="Short Term Goals"
              longTermsShortTermGoals="Long Term Goals"
              shortTermsNext36Months="Next 3-6 months"
              longTermsNext36Months="6-12 Months"
              shortTermsRefineYourStorytelling="Refine your storytelling methods through practice and feedback"
              longTermsRefineYourStorytelling="Develop cross-platform content strategy expertise"
              shortTermsTakeComprehensive="Take comprehensive copywriting courses to enhance skills"
              longTermsTakeComprehensive="Master video editing and animation skills for multimedia"
            />
          </div>
        </section>
      </main>
      <div className={styles.component8}>
        <div className={styles.rectangleParent}>
          <div className={styles.rectangleDiv} />
          <div className={styles.blue}>
            <img className={styles.blueChild} alt="" />
            <img className={styles.blueChild} alt="" />
            <img className={styles.blueChild} alt="" />
            <img className={styles.blueChild} alt="" />
            <img className={styles.blueChild} alt="" />
            <img className={styles.blueChild} alt="" />
          </div>
        </div>
        <img className={styles.frameIcon2} alt="" />
      </div>
      <footer className={styles.footerShapeParent}>
        <div className={styles.footerShape} />
        <div className={styles.footerNavigation}>
          <h3 className={styles.faqSupport}>
            <Link to="/help-center?cci=1" style={{ color: 'inherit', textDecoration: 'none' }}>FAQ</Link> | <Link to="/queries?cci=1" style={{ color: 'inherit', textDecoration: 'none' }}>Support</Link>
          </h3>
          {/*<h3 className={styles.attemptsLeft232}>Attempts Left: 2/3</h3>*/}
        </div>
        <div className={styles.companyCreditWrapper}>
          <div className={styles.companyCredit}>
            <img className={styles.copyrightIcon} alt="" src="/copyright.svg" />
            <h3 className={styles.copyrights2025All}>
              Copyrights 2026 All rights reserved by CODE EDU
            </h3>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CCATExamDashboard;
