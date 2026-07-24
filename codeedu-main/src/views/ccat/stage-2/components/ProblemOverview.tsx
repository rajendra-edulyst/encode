import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProblemOverview.module.css";
import { fetchAssignment } from "@/services/learner/assignmentService";

const COMPLETED_BADGE_SRC = "/cci/stage-3/completed-badge-v5.png";

const CompletedBadge = () => (
  <div
    style={{
      width: "104px",
      height: "104px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: "rotate(-5deg)",
      flexShrink: 0,
    }}
  >
    <img
      src={COMPLETED_BADGE_SRC}
      alt="Completed"
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
    />
  </div>
);

export type ProblemOverviewType = {
  className?: string;
  isCourseCompleted?: boolean;
  isCommunityCompleted?: boolean;
  isBuzzCompleted?: boolean;
};

const ProblemOverview: FunctionComponent<ProblemOverviewType> = ({
  className = "",
  isCourseCompleted = false,
  isCommunityCompleted = false,
  isBuzzCompleted = false,
}) => {
  const navigate = useNavigate();
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    const getAssignment = async () => {
      try {
        const data = await fetchAssignment(9724);
        if (data?.description) {
          setDescription(data.description);
        }
      } catch (error) {
        console.error("Failed to fetch assignment details:", error);
      }
    };
    getAssignment();
  }, []);

  const onActionButtonsClick = useCallback(() => {
    navigate("/courses/explore?cci=1");
  }, [navigate]);

  const onCreateCommunityClick = useCallback(() => {
    navigate("/community/create_v2?cci=1");
  }, [navigate]);

  const onBuzzNowClick = useCallback(() => {
    navigate("/connect/add-buzz?is_cci=1");
  }, [navigate]);

  const formatDescription = (text: string) => {
    if (!text) return 'Loading...';
    if (text.includes('<p>') || text.includes('<br')) return text;

    let formatted = text;
    formatted = formatted.replace(/Key Requirements:/gi, '<br/><br/>Key Requirements:');

    const bullets = [
      'Structure:', 'Analysis Focus:', 'Evidence-Based:', 'Deliverables:',
      'Analysis Scope:', 'Text Elements to Check:'
    ];

    bullets.forEach(bullet => {
      const regex = new RegExp(`(${bullet})`, 'gi');
      formatted = formatted.replace(regex, '<br/>&bull; $1');
    });

    return formatted;
  };

  return (
    <div className={[styles.problemOverview, className].join(" ")}>
      <section className={styles.problemStatement}>
        <div className={styles.problemStatementContainer}>
          <h3 className={styles.problemStatement2}>Problem Statement</h3>
          <div
            className={styles.createADigital}
            dangerouslySetInnerHTML={{ __html: formatDescription(description) }}
          />

        </div>
      </section>
      <section className={styles.engagementPlatform}>
        {/* Card 1 — Course */}
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
            {isCourseCompleted ? (
              <CompletedBadge />
            ) : (
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
            )}
          </button>
        </div>

        {/* Card 2 — Community */}
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
            {isCommunityCompleted ? (
              <CompletedBadge />
            ) : (
              <button className={styles.arrowRightAltParent} onClick={onCreateCommunityClick}>
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
            )}
          </button>
        </div>

        {/* Card 3 — Buzz */}
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
            {isBuzzCompleted ? (
              <CompletedBadge />
            ) : (
              <button
                className={styles.arrowRightAltGroup}
                onClick={onBuzzNowClick}
              >
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
            )}
          </button>
        </div>
      </section>

      {/* Continue to Next Stage Button */}
      {isCourseCompleted && isCommunityCompleted && isBuzzCompleted && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
          <button
            onClick={() => navigate("/cci")}
            style={{
              backgroundColor: "#facc15",
              color: "#000",
              fontWeight: "600",
              fontSize: "16px",
              lineHeight: "1.2",
              padding: "16px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              border: "none",
              textAlign: "center"
            }}
          >
            Continue to<br />Next Stage
          </button>
        </div>
      )}
    </div>
  );
};

export default ProblemOverview;
