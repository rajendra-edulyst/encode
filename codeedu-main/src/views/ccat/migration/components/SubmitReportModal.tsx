import React, { FunctionComponent } from "react";

type SubmitReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SubmitReportModal: FunctionComponent<SubmitReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "500px",
          backgroundColor: "#2c2c2c",
          borderRadius: "16px",
          padding: "40px 30px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          border: "1px solid #3d3d3d",
        }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Title */}
        <h2
          style={{
            color: "#ffffff",
            fontSize: "32px",
            fontWeight: 800,
            margin: "0 0 20px 0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          Thank You<span style={{ color: "#fcee0a" }}>✨</span>
        </h2>

        {/* Message */}
        <p
          style={{
            color: "#ffffff",
            fontSize: "16px",
            margin: "0 0 40px 0",
            lineHeight: "1.5",
            fontWeight: 400,
            opacity: 0.9,
          }}
        >
          Your response has successfully submitted.
        </p>

        <button
          onClick={onClose}
          style={{
            backgroundColor: "#ffec00",
            color: "#000",
            border: "0",
            borderRadius: "12px",
            width: "110px",
            height: "90px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'Jacques Pro', sans-serif",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SubmitReportModal;
