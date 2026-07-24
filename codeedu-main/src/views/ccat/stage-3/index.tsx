import { FunctionComponent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCCITimer } from "@/context/CCIContext";
import { fetchCCIStage3Status } from "@/services/learner/CCIService";
import { fetchAssignment } from "@/services/learner/assignmentService";
import Footer from "./components/Footer";
import styles from "./CCATStage2ChooseOptions.module.css";

const CCIStage3: FunctionComponent = () => {
  const navigate = useNavigate();
  const { timeLeft } = useCCITimer();
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState({
    video: 0,
    graphics: 0,
    Written: 0,
    final: 0
  });

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await fetchCCIStage3Status();
        if (response.status === 1) {
          setStatus(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch CCI stage 3 status:", error);
      }
    };
    getStatus();
  }, []);

  useEffect(() => {
    const getAssignment = async () => {
      try {
        const data = await fetchAssignment(9725);
        if (data?.description) {
          setDescription(data.description);
        }
      } catch (error) {
        console.error("Failed to fetch assignment details:", error);
      }
    };
    getAssignment();
  }, []);

  const formatDescription = (text: string) => {
    if (!text) return '';
    if (text.includes('<ul>')) return text;

    const keyword = 'Key Requirements:';
    if (!text.includes(keyword)) return text;

    const parts = text.split(keyword);
    const intro = parts[0].trim();
    const reqs = parts[1];

    let html = intro + '<br/><br/>Key Requirements:<ul style="margin-top: 8px; margin-bottom: 0; padding-left: 20px; list-style-type: disc;">';

    const reqParts = reqs.split(/(Structure:|Analysis Focus:|Evidence-Based:|Deliverables:)/).filter(Boolean);

    let currentBullet = '';

    for (let i = 0; i < reqParts.length; i++) {
      const part = reqParts[i];
      if (['Structure:', 'Analysis Focus:', 'Evidence-Based:', 'Deliverables:'].includes(part)) {
        if (currentBullet.trim()) {
          html += `<li style="margin-bottom: 4px;">${currentBullet.trim()}</li>`;
        }
        currentBullet = part;
      } else {
        currentBullet += part;
      }
    }

    if (currentBullet.trim()) {
      html += `<li style="margin-bottom: 4px;">${currentBullet.trim()}</li>`;
    }

    html += '</ul>';
    return html;
  };

  return (
    <div className={styles.ccatStage2chooseOptions}>
      <main className={styles.mainContent} style={{ paddingTop: "60px" }}>
        <div className={styles.stageInfo} style={{ width: "100%", maxWidth: "1260px", display: "flex", flexDirection: "column", gap: "40px" }}>
          {/* Top Banner */}
          <div
            style={{
              width: "100%",
              backgroundColor: "#181818",
              borderRadius: "20px",
              padding: "24px 32px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxSizing: "border-box",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              border: "1px solid #222",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "14px", color: "#888", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Stage 03
              </span>
              <h1
                style={{
                  margin: 0,
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "#fff",
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                }}
              >
                CCIQ Present: Narrative Showcase
              </h1>
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#fcee0a",
                whiteSpace: "nowrap",
                fontFamily: "'Jacques Pro', sans-serif",
              }}
            >
              Time Left: {timeLeft}
            </div>
          </div>

          {/* Problem Statement */}
          <div
            style={{
              width: "100%",
              backgroundColor: "#181818",
              borderRadius: "24px",
              padding: "32px 32px",
              boxSizing: "border-box",
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
              border: "1px solid #222",
            }}
          >
            <h2
              style={{
                margin: "0 0 20px 0",
                fontSize: "22px",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.01em",
              }}
            >
              Problem Statement
            </h2>
            <div
              style={{
                margin: "0 0 24px 0",
                fontSize: "14px",
                color: "#ccc",
                lineHeight: "1.6",
                fontWeight: 400,
              }}
              dangerouslySetInnerHTML={{ __html: formatDescription(description) || 'Loading...' }}
            />
            {/*
            <p
              style={{
                margin: "0 0 24px 0",
                fontSize: "14px",
                color: "#ccc",
                lineHeight: "1.6",
                fontWeight: 400,
              }}
            >
              Create a digital poster (A4 size, 1080x1920px for social media) promoting "Diwali Design Fest 2026," a virtual
              event by an EdTech platform in Jaipur. The event features UX workshops, student placement drives, and digital
              art contests inspired by Indian mythology.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14px", color: "#ccc" }}>
                <span style={{ fontSize: "18px", lineHeight: "1", marginTop: "-2px" }}>•</span>
                <span style={{ lineHeight: "1.5" }}>Enrolling in and finishing our "UX Design Basics" course (free access via platform).</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14px", color: "#ccc" }}>
                <span style={{ fontSize: "18px", lineHeight: "1", marginTop: "-2px" }}>•</span>
                <span style={{ lineHeight: "1.5" }}>Booking a 30-min mentorship session with a Jaipur-based design expert.</span>
              </div>
            </div>
            */}
          </div>

          {/* Three Action Cards */}
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "24px",
            }}
          >
            <ActionCard
              title="Let Your Voice Be Seen"
              subtitle="Video Resume Submission"
              imagePath="/cci/stage-3/video-new.png"
              buttonLabel={<>Upload<br />Now</>}
              buttonColor="#00aeef"
              onClick={() => navigate('/cci-stage-3/narrative-showcase?content_id=9586')}
              isCompleted={status.video === 1}
            />

            <ActionCard
              title="See Beyond the Design"
              subtitle="Graphic Analysis"
              imagePath="/cci/stage-3/graphic-new.png"
              buttonLabel={<>Attempt<br />Now</>}
              buttonColor="#e91e84"
              onClick={() => navigate('/cci-stage-3/graphic-analysis?content_id=9587')}
              isCompleted={status.graphics === 1}
            />

            <ActionCard
              title="Turn Thought into Expression"
              subtitle="Written Analysis"
              imagePath="/cci/stage-3/written-new.png"
              buttonLabel={<>Attempt<br />Now</>}
              buttonColor="#8cc63f"
              onClick={() => navigate('/cci-stage-3/written-analysis?content_id=9588')}
              isCompleted={status.Written === 1}
            />
          </div>

          {/* Continue to Next Stage Button */}
          {status.video === 1 && status.graphics === 1 && status.Written === 1 && (
            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginTop: "24px" }}>
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
      </main>
      <Footer />
    </div>
  );
};

type ActionCardProps = {
  title: string;
  subtitle: string;
  imagePath: string;
  buttonLabel: React.ReactNode;
  buttonColor: string;
  onClick: () => void;
  isCompleted?: boolean;
};

const ActionCard: FunctionComponent<ActionCardProps> = ({
  title,
  subtitle,
  imagePath,
  buttonLabel,
  buttonColor,
  onClick,
  isCompleted,
}) => (
  <div
    style={{
      backgroundColor: "#111",
      borderRadius: "24px",
      padding: "24px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      minHeight: "340px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div style={{ marginBottom: "20px" }}>
      <h3
        style={{
          margin: 0,
          fontSize: "19px",
          fontWeight: 800,
          color: "#fff",
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>
      <p style={{ margin: "6px 0 0 0", fontSize: "12px", color: "#888" }}>{subtitle}</p>
    </div>

    <div
      style={{
        marginTop: "auto",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "10px",
        width: "100%",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div style={{ flex: 1, height: "160px", display: "flex", alignItems: "flex-end" }}>
        <img
          src={imagePath}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "left bottom",
            mixBlendMode: "lighten"
          }}
        />
      </div>
      {isCompleted ? (
        <div style={{
          width: "100px",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "rotate(-5deg)",
          marginBottom: "0",
          marginRight: "0"
        }}>
          <img
            src="/cci/stage-3/completed-badge-v5.png"
            alt="Completed"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain"
            }}
          />
        </div>
      ) : (
        <button
          onClick={onClick}
          style={{
            backgroundColor: buttonColor,
            color: "#000",
            border: "none",
            borderRadius: "24px",
            width: "100px",
            height: "100px",
            fontSize: "18px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            lineHeight: 1.1,
            flexShrink: 0,
            transition: "transform 0.2s, background-color 0.2s",
            fontFamily: "'Jacques Pro', sans-serif",
            padding: "10px",
            marginBottom: "4px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.filter = "brightness(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.filter = "brightness(1)";
          }}
        >
          {buttonLabel}
        </button>
      )}
    </div>
  </div>
);

export default CCIStage3;
