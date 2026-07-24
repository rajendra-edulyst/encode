import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_elements(num_pages)
            super().showPage()
        super().save()

    def draw_page_elements(self, page_count):
        if self._pageNumber == 1:
            # Cover Page: Dark background
            self.saveState()
            self.setFillColor(colors.HexColor("#1A1A1A"))
            self.rect(0, 0, 612, 792, fill=True, stroke=False)
            
            # Draw a branding bar in Lime Green (#8CC63F)
            self.setFillColor(colors.HexColor("#8CC63F"))
            self.rect(0, 310, 612, 10, fill=True, stroke=False)
            
            # Bottom design element
            self.setFillColor(colors.HexColor("#2E2E2E"))
            self.rect(0, 0, 612, 60, fill=True, stroke=False)
            self.setFillColor(colors.HexColor("#8CC63F"))
            self.rect(0, 56, 612, 4, fill=True, stroke=False)
            
            self.restoreState()
            return

        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(colors.HexColor("#1A1A1A"))
        
        # Header (Top margin is at 720 points, header draws at 750 points)
        self.drawString(54, 750, "enCODE PLATFORM")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#555555"))
        self.drawRightString(558, 750, "Placement Acknowledgement - Technical & Process Document")
        
        # Header Divider
        self.setStrokeColor(colors.HexColor("#DDDDDD"))
        self.setLineWidth(0.5)
        self.line(54, 742, 558, 742)
        
        # Footer (Bottom margin is at 72 points, footer draws at 40 points)
        self.drawString(54, 40, "Confidential - For Client Sharing Only")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(558, 40, page_text)
        
        # Footer Divider
        self.line(54, 52, 558, 52)
        
        self.restoreState()

def build_pdf(filename, logo_path):
    # Setup document
    # Standard Letter: 612 x 792
    # Margin: 54 points (0.75 inch) -> Printable width is 504 points
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=72,
        bottomMargin=72
    )

    # Styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    cover_title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        textColor=colors.HexColor('#FFFFFF'),
        alignment=0, # Left-aligned
        spaceAfter=15
    )
    
    cover_subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#8CC63F'),
        alignment=0,
        spaceAfter=40
    )
    
    cover_meta_label = ParagraphStyle(
        'CoverMetaLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#8CC63F')
    )
    
    cover_meta_val = ParagraphStyle(
        'CoverMetaVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#CCCCCC')
    )
    
    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=22,
        textColor=colors.HexColor('#1A1A1A'),
        spaceBefore=22,
        spaceAfter=10,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1A1A1A'),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'Header3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#8CC63F'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#333333'),
        spaceAfter=8
    )
    
    body_bold_style = ParagraphStyle(
        'BodyTextBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )
    
    code_style = ParagraphStyle(
        'CodeBlock',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#222222'),
        backColor=colors.HexColor('#F5F5F5'),
        borderColor=colors.HexColor('#E0E0E0'),
        borderWidth=0.5,
        borderPadding=6,
        spaceBefore=6,
        spaceAfter=8
    )
    
    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.HexColor('#FFFFFF')
    )
    
    table_body_style = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#333333')
    )
    
    table_body_bold_style = ParagraphStyle(
        'TableBodyBold',
        parent=table_body_style,
        fontName='Helvetica-Bold'
    )

    story = []

    # ------------------ COVER PAGE ------------------
    story.append(Spacer(1, 40))
    # Logo placement: Scale the 832x308 logo down to width=180, height=66.6
    if os.path.exists(logo_path):
        story.append(Image(logo_path, width=180, height=66.6, hAlign='LEFT'))
    else:
        # Placeholder text in case logo is missing
        story.append(Paragraph("<b>enCODE Logo Placeholder</b>", cover_title_style))
    
    story.append(Spacer(1, 80))
    story.append(Paragraph("PLACEMENT & OFFER LETTER ACKNOWLEDGEMENT SYSTEM", cover_title_style))
    story.append(Paragraph("Comprehensive Technical Specifications & Client Process Guide", cover_subtitle_style))
    
    story.append(Spacer(1, 100))
    
    # Metadata Box at bottom of Cover Page (Table for formatting)
    meta_data = [
        [Paragraph("DEVELOPER:", cover_meta_label), Paragraph("Sanjay Maddheshiya", cover_meta_val)],
        [Paragraph("ROLE:", cover_meta_label), Paragraph("Full Stack Developer", cover_meta_val)],
        [Paragraph("DATE:", cover_meta_label), Paragraph("June 13, 2026", cover_meta_val)],
        [Paragraph("TARGET AUDIENCE:", cover_meta_label), Paragraph("Client Tech Admins & Operational Teams", cover_meta_val)],
        [Paragraph("STATUS:", cover_meta_label), Paragraph("Production-Ready Release v1.0", cover_meta_val)]
    ]
    
    meta_table = Table(meta_data, colWidths=[130, 374], hAlign='LEFT')
    meta_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    
    story.append(meta_table)
    story.append(PageBreak())

    # ------------------ PART A: TECHNICAL SPECIFICATIONS ------------------
    story.append(Paragraph("PART A: TECHNICAL SPECIFICATIONS", h1_style))
    story.append(Paragraph(
        "This section details the architecture, code implementation, client-side validation logic, "
        "and API payloads of the Placement & Offer Letter Acknowledgement interface. This module resides "
        "within the enCODE platform frontend codebase under the component path "
        "<code>src/views/collaborate/must-attend/components/AcknowledgementTab.tsx</code>.",
        body_style
    ))
    
    story.append(Paragraph("1. Component Architecture & State Management", h2_style))
    story.append(Paragraph(
        "The acknowledgement workspace is driven by two tightly coupled React components:",
        body_style
    ))
    story.append(Paragraph(
        "• <b>AcknowledgementTab</b>: Controls the main panel. It fetches previous submissions, parses uploaded "
        "offer letters, validates fields, formats input figures, and renders forms dynamically depending on the selected "
        "status.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>AcknowledgementSurvey</b>: A sub-component rendered when a student selects the 'Share Feedback' option. "
        "It dynamically fetches, registers, and submits customized MCQ and subjective questionnaires from the Career Drive backend service.",
        bullet_style
    ))
    
    story.append(Spacer(1, 5))
    story.append(Paragraph(
        "The system relies on <b>React Query</b> (<code>@tanstack/react-query</code>) for fetching asynchronous server states, specifically "
        "querying student status via <code>useStudentQueries</code> and caching the list of registered companies. Active query invalidation is "
        "performed on submission to ensure instant state propagation.",
        body_style
    ))
    
    story.append(Paragraph("2. Client-Side PDF Text Extraction & OCR Verification Heuristics", h2_style))
    story.append(Paragraph(
        "To ensure students submit authentic placement documents rather than blank pages, incorrect formats, or dummy PDFs, "
        "the frontend leverages <b>PDF.js</b> (<code>pdfjs-dist</code>) to perform client-side text parsing. The extraction runs directly inside the browser "
        "sandbox, reading binary arrays before the file hits any network request.",
        body_style
    ))
    
    story.append(Paragraph("Heuristic Verification Rules:", h3_style))
    story.append(Paragraph(
        "The system extracts content from up to the first 3 pages of the uploaded document. It validates the extracted text "
        "string (case-insensitively) against a list of essential keywords defined as follows:",
        body_style
    ))
    
    keywords_list = ", ".join(f"\"{k}\"" for k in ["offer letter", "employment offer", "joining date", "annual ctc", "salary", "designation", "candidate name"])
    story.append(Paragraph(f"<b>Keywords Array:</b> [ {keywords_list} ]", code_style))
    
    story.append(Paragraph(
        "If none of these keywords match the text, a <code>sonner</code> notification toast triggers an error: "
        "<i>\"The uploaded document does not appear to be an Offer Letter.\"</i> and clears the file selector. "
        "This drastically reduces database overhead and prevents faulty data collection.",
        body_style
    ))

    # Code block showing the extraction mechanism
    extraction_code = """// PDF.js Client-Side Text Extraction Code Snippet
const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  const maxPages = Math.min(pdf.numPages, 3);
  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(' ') + ' ';
  }
  return fullText;
};"""
    story.append(Paragraph(extraction_code.replace("<", "&lt;").replace(">", "&gt;"), code_style))

    story.append(PageBreak())

    # ------------------ API INTEGRATION AND PAYLOADS ------------------
    story.append(Paragraph("3. Backend Integration & Data Payload Schemas", h2_style))
    story.append(Paragraph(
        "Submitting acknowledgement requests routes to the <code>saveJobLead</code> API service. The payload sent to "
        "the server varies dynamically depending on the student's status. Below is a structured summary of backend integration:",
        body_style
    ))

    # Payloads Table
    headers = [
        Paragraph("Type & Value", table_header_style),
        Paragraph("Trigger Condition", table_header_style),
        Paragraph("Payload Structure (JSON / Multipart)", table_header_style)
    ]
    
    row1 = [
        Paragraph("<b>Type 1</b><br/>Offer Received", table_body_style),
        Paragraph("Student reports they got placed and uploads a valid PDF.", table_body_style),
        Paragraph("<code>{<br/> type: 1,<br/> company_name: string,<br/> job_role: 'full-time'|'part-time'|'internship',<br/> designation: string,<br/> salary_package: string (e.g. '12 Lacs Yearly'),<br/> location: string,<br/> company_mobile: string,<br/> company_email: string,<br/> company_full_address: string,<br/> duration: string (optional)<br/>}</code><br/><i>*Accompanied by PDF file binary.</i>", table_body_style)
    ]
    
    row2 = [
        Paragraph("<b>Type 2</b><br/>Decline Placement", table_body_style),
        Paragraph("Student opts out of placement/internship support.", table_body_style),
        Paragraph("<code>{<br/> type: 2,<br/> problem_challenge: 'higher_edu' | 'family_business' | 'startup' | 'no_job'<br/>}</code>", table_body_style)
    ]
    
    row3 = [
        Paragraph("<b>Type 3</b><br/>Still Looking", table_body_style),
        Paragraph("Student is searching and wants to remain active.", table_body_style),
        Paragraph("<code>{<br/> type: 3,<br/> problem_challenge: string (student message)<br/>}</code>", table_body_style)
    ]

    row4 = [
        Paragraph("<b>Type 4</b><br/>Requires Help", table_body_style),
        Paragraph("Student has query or block and needs direct help.", table_body_style),
        Paragraph("<code>{<br/> type: 4,<br/> problem_challenge: string (student message)<br/>}</code>", table_body_style)
    ]

    row5 = [
        Paragraph("<b>Type 5</b><br/>Survey Feedback", table_body_style),
        Paragraph("Student fills career drive event survey.", table_body_style),
        Paragraph("<code>{<br/> type: 5,<br/> rating: number,<br/> liked_most: string,<br/> suggestions: string<br/>}</code>", table_body_style)
    ]

    table_data = [headers, row1, row2, row3, row4, row5]
    payloads_table = Table(table_data, colWidths=[100, 140, 264])
    payloads_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1A1A1A')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D3D3D3')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F9F9F9')]),
    ]))
    
    story.append(payloads_table)
    story.append(Spacer(1, 10))

    story.append(Paragraph("4. Shorthand Salary Formatting Engine", h2_style))
    story.append(Paragraph(
        "To standardize compensation figures inside the system and maintain database consistency, "
        "the frontend converts raw numeric values into human-readable Indian Numbering System shorthands "
        "(e.g., K, Lacs, Cr) on the fly. The logic runs reactively, rendering helper text beneath the input field "
        "and compiling the final package string dynamically.",
        body_style
    ))
    
    story.append(Paragraph("Formatting Rules:", h3_style))
    story.append(Paragraph("• Raw values &ge; 10,000,000 are formatted as <b>Cr</b> (Crores), truncated to 2 decimals.", bullet_style))
    story.append(Paragraph("• Raw values &ge; 100,000 are formatted as <b>Lacs</b> (Lakhs), truncated to 2 decimals.", bullet_style))
    story.append(Paragraph("• Raw values &ge; 1,000 are formatted as <b>K</b> (Thousands), truncated to 2 decimals.", bullet_style))
    story.append(Paragraph("• Selected multiplier (Yearly, Monthly, Fixed) is appended prior to API transmission (e.g. \"6.5 Lacs Yearly\").", bullet_style))

    story.append(PageBreak())

    # ------------------ PART B: CLIENT OPERATIONAL PROCESS GUIDE ------------------
    story.append(Paragraph("PART B: CLIENT PROCESS GUIDE & USE CASES", h1_style))
    story.append(Paragraph(
        "This section serves as the process documentation for sharing with the client. It outlines the operational workflow, "
        "student lifecycle states, and functional use cases that drive student placements data collection.",
        body_style
    ))
    
    story.append(Paragraph("1. Placement Acknowledgement Funnel Overview", h2_style))
    story.append(Paragraph(
        "During a career or campus placement drive, collecting verified outcomes is a high-priority operational requirement. "
        "The enCODE Placement Acknowledgement System enables universities and institutes to automate this process. It gives students "
        "five distinct, user-friendly pathways to report their current employment status, which then propagates to administrative panels.",
        body_style
    ))
    
    story.append(Paragraph("2. Detailed Operational Use Cases", h2_style))

    # Use Case 1 Card/Box
    story.append(Paragraph("USE CASE 1: Placement Offer Submitted & Verified", h3_style))
    story.append(Paragraph(
        "<b>Goal:</b> Capture and verify a student's positive placement outcome.<br/>"
        "<b>Step-by-Step Flow:</b><br/>"
        "1. The student selects the 'Yes, I have received the offer letter' option.<br/>"
        "2. The student searches for the company in the dropdown list. If not found, they click 'Other' and type the company name.<br/>"
        "3. The student enters their job type (Full-time, Part-time, Internship), Designation, and Location.<br/>"
        "4. The student types the raw numerical Salary Package (e.g., 800000) and selects the type (Yearly, Monthly, Fixed). The interface dynamically displays '8 Lacs'.<br/>"
        "5. If it's a part-time job/internship, they specify the duration (e.g., 6 Months).<br/>"
        "6. The student fills in the company contact mobile/email and full address details.<br/>"
        "7. The student uploads their offer letter PDF. The system parses and verifies the document. If validated, the submit button is unlocked.<br/>"
        "8. The student clicks submit, triggering api sync and caching the outcome.",
        body_style
    ))
    
    # Use Case 2 Card/Box
    story.append(Paragraph("USE CASE 2: Opting Out / Declining Placement Support", h3_style))
    story.append(Paragraph(
        "<b>Goal:</b> Document students who choose an alternate career path and exclude them from job email campaigns.<br/>"
        "<b>Step-by-Step Flow:</b><br/>"
        "1. The student selects the 'No, I don't want any offer letter' option.<br/>"
        "2. The system prompts the student to choose one of four predefined alternatives:<br/>"
        "   &bull; <i>Higher Education</i> (GRE/GATE preparation, Masters enrollments)<br/>"
        "   &bull; <i>Family Business</i> (Joining established parent companies)<br/>"
        "   &bull; <i>Own Startup</i> (Entrepreneurship ventures)<br/>"
        "   &bull; <i>No Job/Internship</i> (General opt-out)<br/>"
        "3. Upon selection, the student submits, classifying their record as 'Opted Out' in reports.",
        body_style
    ))
    
    # Use Case 3 Card/Box
    story.append(Paragraph("USE CASE 3: Active Search - Still Looking for Opportunities", h3_style))
    story.append(Paragraph(
        "<b>Goal:</b> Allow students to flag that they have not secured an offer but are actively seeking one.<br/>"
        "<b>Step-by-Step Flow:</b><br/>"
        "1. Student selects 'No, I am still looking for Job/Internship Opportunities'.<br/>"
        "2. A textarea appears. The student details their current status, technical preferences, or recent interview progress.<br/>"
        "3. Upon submission, the record alerts placement coordinators to include them in upcoming matching rounds.",
        body_style
    ))
    
    # Use Case 4 Card/Box
    story.append(Paragraph("USE CASE 4: Direct Intervention - Requesting Support", h3_style))
    story.append(Paragraph(
        "<b>Goal:</b> Open an escalation channel for students facing critical hurdles (e.g., visa issues, technical issues).<br/>"
        "<b>Step-by-Step Flow:</b><br/>"
        "1. Student selects 'I, would require help from enCODE support'.<br/>"
        "2. Student details their problem/query in the open text field.<br/>"
        "3. Submission flags the student profile for direct email/call outreach by the support team.",
        body_style
    ))
    
    story.append(PageBreak())

    # Use Case 5 Card/Box
    story.append(Paragraph("USE CASE 5: Career Drive Feedback Survey", h3_style))
    story.append(Paragraph(
        "<b>Goal:</b> Collect qualitative feedback from participants regarding the overall execution of the drive.<br/>"
        "<b>Step-by-Step Flow:</b><br/>"
        "1. The student selects 'Share your valuable feedback for the Career Drive'.<br/>"
        "2. The system loads the configured survey (e.g. ID 9730) for the current event.<br/>"
        "3. The student is presented with multiple-choice questions (e.g. Rating: Poor to Excellent), open subjective textareas, and other MCQ dropdowns.<br/>"
        "4. Validates that all fields are complete and submits in bulk via multipart payload, closing the loop.",
        body_style
    ))

    story.append(Spacer(1, 10))
    story.append(Paragraph("3. Student State Transitions & Response Override Flow", h2_style))
    story.append(Paragraph(
        "The system enforces single active states while preserving flexibility for historical updates:",
        body_style
    ))
    story.append(Paragraph(
        "• <b>Initial Submission Lock:</b> Once a student successfully submits their placement status, "
        "their view changes from form inputs to a read-only dashboard displaying <b>'Your Submitted Response'</b>. "
        "This card shows the status, response description, and lists all uploaded offer letter PDFs clickable for previewing inside a secure PDF viewer modal.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>New Offer Override:</b> If a student receives a revised package, a different offer letter, or changes their career mind "
        "(e.g. transitioning from 'Still Looking' to 'Offer Received'), they click the green <b>'Submit New'</b> button. This resets "
        "the local form state, unlocking inputs for new submissions and preserving history on the database backend.",
        bullet_style
    ))

    # State transition summary table
    transition_headers = [
        Paragraph("Current UI State", table_header_style),
        Paragraph("Action Taken", table_header_style),
        Paragraph("Target UI State & Result", table_header_style)
    ]
    t_row1 = [
        Paragraph("New user (No data)", table_body_style),
        Paragraph("Fills form and clicks submit", table_body_style),
        Paragraph("Transitions to <b>'Your Submitted Response'</b>. Form locks. PDF uploaded.", table_body_style)
    ]
    t_row2 = [
        Paragraph("Locked response panel", table_body_style),
        Paragraph("Clicks 'Submit New' button", table_body_style),
        Paragraph("Resets <code>showNewForm = true</code>. Unlocks all form inputs to compile a fresh response.", table_body_style)
    ]
    t_row3 = [
        Paragraph("Offer Letter PDF upload", table_body_style),
        Paragraph("Uploads blank or non-offer PDF", table_body_style),
        Paragraph("OCR rejects file via toast alert. File selector resets. Submission remains locked.", table_body_style)
    ]
    
    transition_table = Table([transition_headers, t_row1, t_row2, t_row3], colWidths=[150, 150, 204])
    transition_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1A1A1A')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D3D3D3')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F9F9F9')]),
    ]))
    
    story.append(Spacer(1, 10))
    story.append(transition_table)
    
    story.append(Spacer(1, 15))
    story.append(Paragraph("4. Recommended Administrative Best Practices for Clients", h2_style))
    story.append(Paragraph(
        "For universities and platform admins using this system to manage their placement metrics, we recommend the following processes:",
        body_style
    ))
    story.append(Paragraph(
        "1. <b>Daily Triage on Type 4 (Requires Help):</b> Ensure placement cell officers inspect Type 4 messages daily. "
        "Students flagging these are blocked by critical hurdles.",
        bullet_style
    ))
    story.append(Paragraph(
        "2. <b>Audit Type 2 (Decline Reasons):</b> Analyze why students opt out. High volumes of 'Family Business' or "
        "'Higher Education' indicate a shifting student demographic, whereas high volumes of 'No Job' might merit counselling.",
        bullet_style
    ))
    story.append(Paragraph(
        "3. <b>PDF Inspection & Matching:</b> While the system validates files programmatically, admin operators should review "
        "uploaded documents periodically via the admin panel to ensure the metadata matches (e.g. verifying Designation and CTC in PDF matches form inputs).",
        bullet_style
    ))

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {filename}")

if __name__ == '__main__':
    logo = '/Volumes/Edulyst/Product/React/codeedu/src/assets/images/New_Logo.png'
    output = '/Volumes/Edulyst/Product/React/codeedu/Acknowledgement_Tech_and_Process_Document.pdf'
    build_pdf(output, logo)
