import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateData {
  userName: string;
  courseName: string;
  organizationName: string;
  organizationLogo: string;
  skills: string[] | undefined;
  certificateId?: string;
  completionDate?: string;
  courseLeader?: string;
  academicHead?: string;
}

export const generateCertificateHTML = (data: CertificateData): string => {
  const skillsHTML = data?.skills?.slice(0, 5).map((skill) => `<div class="proficiency">${skill}</div>`).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Certificate of Completion</title>
<meta name="viewport" content="width=794, initial-scale=1" />
<style>
  body {
    background-color: #ede6de;
    font-family: 'Times New Roman', serif;
    color:#ffffff;
    margin: 0;
    padding: 0;
  }

  .certificate-wrapper {
    width: 794px;
    height: 1123px;
    margin: 0 auto;
    display: flex;
    overflow: hidden;
    background: url('/certificate/certi01.png') center center / cover no-repeat;
    position: relative;
  }
  
  .logo {
    position: absolute;
    top: 10px;
    right: 30%;
    width: 140px;
    padding-top: 50px;
  }
  
  .sidebar {
    width: 22%;
  }
  
  .content {
    position: relative;
    width: 78%;
    padding: 110px 45px 35px 45px;
    background: transparent;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .text-normal {
    margin-top: 50px;
    font-size: 1.3rem;
    margin-bottom: 6px;
    text-align: center;
    width: 100%;
  }
  
  .title {
    font-size: 2.5rem;
    font-weight: bold;
    letter-spacing: 2px;
    margin-bottom: 8px;
    text-align: center;
    width: 100%;
  }
  
  .recipient {
    font-size: 2.15rem;
    font-weight: 500;
    color: #00a8e9;
    margin: 18px auto 6px auto;
    padding-bottom: 2px;
    width: 100%;
    text-align: center;
  }
  
  .proficiencies {
    display: flex;
    flex-wrap: wrap;
    gap: 9px 18px;
    margin-bottom: 28px;
    justify-content: center;
    width: 100%;
  }
  
  .proficiency {
    border: 1px solid #adadad;
    border-radius: 10px;
    padding: 6.5px 16px;
    margin-top: 15px;
    font-size: 0.95rem;
    background: transparent;
  }
  
  .logo-title {
    font-size: 2.2rem;
    font-weight: bold;
    letter-spacing: 1px;
    margin-bottom: 8px;
    text-align: center;
    width: 100%;
  }
  
  .seal-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  
  .seal-image {
    width: 90px;
    margin-left: 20px;
    max-width: 80%;
    height: auto;
    display: block;
  }
  
  .signatures {
    display: flex;
    justify-content: space-between;
    width: 90%;
    font-size: 1.03rem;
    margin: 90px auto 0 auto;
  }
  
  .head {
    margin-top: 5px;
    text-align: center;
    font-weight: bold;
  }
  
  .sign-label {
    display: block;
    font-size: 0.85rem;
    text-align: center;
    margin-top: 5px;
    font-weight: normal;
  }
</style>
</head>
<body>
  <div class="certificate-wrapper">
    <img class="logo" src="${data.organizationLogo || '/certificate/codelogo.png'}" alt="Organization Logo" />
    <div class="sidebar"></div>
    <div class="content">
      <div class="text-normal">acknowledging</div>
      <div class="title">${data.userName}</div>
      <div class="text-normal" style="margin-top:1px;">for completing</div>
      <div class="recipient">"${data.courseName}"</div>
      <div class="text-normal" style="margin-top:1px;">crafting new perspectives in</div>
      
      <div class="proficiencies">
        ${skillsHTML}
      </div>
      
      <div class="text-normal" style="margin-top:1px;">
        with<br>
        ${data.certificateId ? `certification ID ${data.certificateId},<br>` : ''}
        ${data.completionDate ? `on ${data.completionDate}<br>` : ''}
        hosted by
      </div>
      
      <div class="seal-container">
        <div class="logo-title">${data.organizationName}</div>
        <img class="seal-image" src="${data.organizationLogo || '/certificate/ixdflogo.png'}" alt="Organization Seal" />
      </div>
      
      <div class="signatures">
        ${data.courseLeader ? `
          <div class="head">
            ${data.courseLeader}
            <span class="sign-label">Course Instructor</span>
          </div>
        ` : ''}
        ${data.academicHead ? `
          <div class="head">
            ${data.academicHead}
            <span class="sign-label">Academic Head</span>
          </div>
        ` : ''}
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

export const downloadCertificate = async (data: CertificateData): Promise<void> => {
  try {
    // Create a temporary iframe to render the certificate
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.width = '794px';
    iframe.style.height = '1123px';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) throw new Error('Cannot access iframe document');

    iframeDoc.open();
    iframeDoc.write(generateCertificateHTML(data));
    iframeDoc.close();

    // Wait for images to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Capture the certificate as canvas
    const canvas = await html2canvas(iframeDoc.body, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ede6de',
    });

    // Convert to PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${data.courseName}-Certificate.pdf`);

    // Cleanup
    document.body.removeChild(iframe);
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
};

export const viewCertificate = (data: CertificateData): void => {
  const certificateHTML = generateCertificateHTML(data);
  const newWindow = window.open('', '_blank');
  if (newWindow) {
    newWindow.document.write(certificateHTML);
    newWindow.document.close();
  }
};
