import { FunctionComponent, useCallback } from "react";
import styles from "./ProblemOverview.module.css";

export type ProblemOverviewType = {
  className?: string;
};

const ProblemOverview: FunctionComponent<ProblemOverviewType> = ({
  className = "",
}) => {
  const onActionButtonsClick = useCallback(() => {
    // Please sync "CCAT- Stage 2(Choose Course)" to the project
  }, []);

  return (
    <div className={[styles.problemOverview, className].join(" ")}>
      <section className={styles.problemStatement}>
        <div className={styles.problemStatementContainer}>
          <h3 className={styles.problemStatement2}>Problem Statement</h3>
          <div className={styles.createADigital}>
            Create a digital poster (A4 size, 1080x1920px for social media)
            promoting "Diwali Design Fest 2026," a virtual event by an EdTech
            platform in Jaipur. The event features UX workshops, student
            placement drives, and digital art contests inspired by Indian
            mythology.
          </div>
        </div>
        <div className={styles.enrollingInAndContainer}>
          <ul className={styles.enrollingInAndFinishingOur}>
            <li>
              Enrolling in and finishing our "UX Design Basics" course (free
              access via platform).
            </li>
            <li>
              Booking a 30-min mentorship session with a Jaipur-based design
              expert.
            </li>
          </ul>
        </div>
      </section>
      <section className={styles.engagementPlatform}>
        <div className={styles.enrollCourse}>
          <div className={styles.actionCards}>
            <b
              className={styles.learnApply}
            >{`Learn, Apply, & Showcase Your Outcomes`}</b>
            <div className={styles.enrollIntoA}>Enroll into a Course</div>
          </div>
          <button className={styles.actionImages}>
            <img
              className={styles.image401Icon}
              loading="lazy"
              alt=""
              src="/ccat-landing-page/image-4012@2x.png"
            />
            <button
              className={styles.actionButtons}
              onClick={onActionButtonsClick}
            >
              <img
                className={styles.arrowRightAltIcon}
                alt=""
                src="/ccat-landing-page/arrow-right-alt.svg"
              />
              <button className={styles.startACourse}>
                Start a<br />
                Course
                <br />
                Now
              </button>
            </button>
          </button>
        </div>
        <div className={styles.createCommunity}>
          <div className={styles.actionCards}>
            <h3 className={styles.buildYourOwn}>Build Your Own Tribe</h3>
            <div className={styles.createAMicroCommunity}>
              Create a micro-community
            </div>
          </div>
          <button className={styles.actionImages}>
            <img
              className={styles.image401Icon2}
              loading="lazy"
              alt=""
              src="/ccat-landing-page/image-4013@2x.png"
            />
            <button className={styles.arrowRightAltParent}>
              <img
                className={styles.arrowRightAltIcon}
                alt=""
                src="/ccat-landing-page/arrow-right-alt.svg"
              />
              <button className={styles.startACourse}>
                Create
                <br />
                Community
                <br />
                Now
              </button>
            </button>
          </button>
        </div>
        <div className={styles.shareTheBuzz}>
          <div className={styles.actionCards}>
            <b className={styles.learnApply}>
              Create the Buzz, Capture the Pulse
            </b>
            <div
              className={styles.shareABuzz}
            >{`Share a Buzz & Conduct a Poll`}</div>
          </div>
          <button className={styles.image401Group}>
            <img
              className={styles.image401Icon3}
              loading="lazy"
              alt=""
              src="/ccat-landing-page/image-401@2x.png"
            />
            <button className={styles.arrowRightAltGroup}>
              <img
                className={styles.arrowRightAltIcon}
                alt=""
                src="/ccat-landing-page/arrow-right-alt.svg"
              />
              <button className={styles.startACourse}>
                Buzz
                <br />
                Now
              </button>
            </button>
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProblemOverview;
