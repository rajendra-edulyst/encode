import { FunctionComponent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import styles from "./Heading.module.css";

export type HeadingType = {
  className?: string;
};

const Heading: FunctionComponent<HeadingType> = ({ className = "" }) => {
  const navigate = useNavigate();

  const onButtonIconClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleEmail = useCallback(() => {
    window.location.href = `mailto:?subject=My CCIQ Assessment Certificate&body=Check out my certificate: ${window.location.href}`;
  }, []);

  const handleDownload = useCallback(async () => {
    const element = document.getElementById("cciq-certificate-content");
    if (!element) return;

    // Temporarily force desktop width to prevent responsive wrapping and right-side clipping
    const originalWidth = element.style.width;
    element.style.width = "1400px";

    // Capture the exact layout currently shown
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      windowWidth: 1400,
    });
    
    element.style.width = originalWidth;

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    
    // Create PDF with the exact dimensions of the layout to avoid any white spaces
    const pdfWidth = canvas.width / 2;
    const pdfHeight = canvas.height / 2;
    
    const pdf = new jsPDF({
      orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
      unit: "px",
      format: [pdfWidth, pdfHeight]
    });
    
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("CCIQ-Certificate.pdf");
  }, []);

  const handlePrint = useCallback(async () => {
    const element = document.getElementById("cciq-certificate-content");
    if (!element) return;

    // Temporarily force desktop width to prevent responsive wrapping and right-side clipping
    const originalWidth = element.style.width;
    element.style.width = "1400px";

    // Capture the exact layout currently shown
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      windowWidth: 1400,
    });
    
    element.style.width = originalWidth;

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>CCIQ Assessment Certificate</title>
            <style>
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; background: #fff; }
              img { max-width: 100%; height: auto; }
              @media print {
                @page { margin: 0; size: portrait; }
                body { margin: 0; }
                img { max-width: 100%; max-height: 100vh; object-fit: contain; }
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  }, []);

  return (
    <section className={[styles.heading, className].join(" ")}>
      <div className={styles.container}>
        <img
          className={styles.buttonIcon}
          alt=""
          src="/Button.svg"
          onClick={onButtonIconClick}
        />
        <div className={styles.container2}>
          <h3 className={styles.cciAssessmentCertificate}>
            CCIQ Assessment Certificate
          </h3>
          <div className={styles.viewAndManage}>
            View and manage your purchase history
          </div>
        </div>
      </div>
      <nav className={styles.actionButtons} data-html2canvas-ignore="true">
        <button className={styles.button} onClick={handleEmail}>
          <img className={styles.icon} alt="" src="/Icon4.svg" />
          <div className={styles.email}>Email</div>
        </button>
        <button className={styles.button} onClick={handleDownload}>
          <img className={styles.icon} alt="" src="/Icon2.svg" />
          <div className={styles.email}>Download</div>
        </button>
        <button className={styles.button3} onClick={handlePrint}>
          <img className={styles.icon} alt="" src="/Icon.svg" />
          <div className={styles.email}>Print</div>
        </button>
      </nav>
    </section>
  );
};

export default Heading;
