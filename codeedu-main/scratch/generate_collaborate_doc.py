import os
import sys
import urllib.request
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak
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
        self.drawString(54, 750, "enCODE PLATFORM COLLABORATE MODULE")
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#555555"))
        self.drawRightString(558, 750, "Complete Functional & Technical Implementation Guide")
        
        # Header Divider
        self.setStrokeColor(colors.HexColor("#DDDDDD"))
        self.setLineWidth(0.5)
        self.line(54, 742, 558, 742)
        
        # Footer (Bottom margin is at 72 points, footer draws at 40 points)
        self.drawString(54, 40, "Edulyst Ventures Pvt. Ltd. | Confidential - Sharing Restricted")
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
        fontSize=15,
        leading=20,
        textColor=colors.HexColor('#1A1A1A'),
        spaceBefore=22,
        spaceAfter=10,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'Header2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=colors.HexColor('#1A1A1A'),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h3_style = ParagraphStyle(
        'Header3',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#8CC63F'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
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
        fontSize=7.5,
        leading=9.5,
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
        fontSize=8.5,
        leading=10.5,
        textColor=colors.HexColor('#FFFFFF')
    )
    
    table_body_style = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#333333')
    )

    story = []

    # ------------------ COVER PAGE (Page 1) ------------------
    story.append(Spacer(1, 40))
    if os.path.exists(logo_path):
        story.append(Image(logo_path, width=180, height=66.6, hAlign='LEFT'))
    else:
        story.append(Paragraph("<b>enCODE Logo Placeholder</b>", cover_title_style))
    
    story.append(Spacer(1, 80))
    story.append(Paragraph("enCODE COLLABORATE MODULE", cover_title_style))
    story.append(Paragraph("Complete Functional & Technical Implementation Guide", cover_subtitle_style))
    
    story.append(Spacer(1, 100))
    
    meta_data = [
        [Paragraph("COMPANY:", cover_meta_label), Paragraph("Edulyst Ventures Pvt. Ltd.", cover_meta_val)],
        [Paragraph("DEVELOPER:", cover_meta_label), Paragraph("Sanjay Maddheshiya", cover_meta_val)],
        [Paragraph("ROLE:", cover_meta_label), Paragraph("Full Stack Developer", cover_meta_val)],
        [Paragraph("DATE:", cover_meta_label), Paragraph("June 13, 2026", cover_meta_val)],
        [Paragraph("TARGET AUDIENCE:", cover_meta_label), Paragraph("Enterprise Clients, Placement Cells, Universities & Industry Partners", cover_meta_val)],
        [Paragraph("RELEASE:", cover_meta_label), Paragraph("Production-Ready Documentation v1.0", cover_meta_val)]
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

    # ------------------ TABLE OF CONTENTS & EXEC SUMMARY (Page 2) ------------------
    story.append(Paragraph("TABLE OF CONTENTS & EXECUTIVE SUMMARY", h1_style))
    story.append(Spacer(1, 10))
    
    toc_data = [
        [Paragraph("<b>Section</b>", table_header_style), Paragraph("<b>Target Page</b>", table_header_style)],
        [Paragraph("Executive Summary & Document Objective", table_body_style), Paragraph("Page 2", table_body_style)],
        [Paragraph("Section 1: Platform Overview & Functional Architecture", table_body_style), Paragraph("Page 3", table_body_style)],
        [Paragraph("Section 2: Workspace Layout & Common Components", table_body_style), Paragraph("Page 4", table_body_style)],
        [Paragraph("Section 3: On The Agenda Module - Core Features", table_body_style), Paragraph("Page 5", table_body_style)],
        [Paragraph("Section 4: On The Agenda - Technical Integration & Query States", table_body_style), Paragraph("Page 6", table_body_style)],
        [Paragraph("Section 5: Must Attend Module - Core Features", table_body_style), Paragraph("Page 7", table_body_style)],
        [Paragraph("Section 6: Must Attend - Career Drive Events", table_body_style), Paragraph("Page 8", table_body_style)],
        [Paragraph("Section 7: Career Drive - Functional Design & Placement Funnel", table_body_style), Paragraph("Page 9", table_body_style)],
        [Paragraph("Section 8: Career Drive - Use Cases 1 & 2 (Offer Verification & Opt-Out)", table_body_style), Paragraph("Page 10", table_body_style)],
        [Paragraph("Section 9: Career Drive - Use Cases 3, 4 & 5 (Still Looking, Support, Survey)", table_body_style), Paragraph("Page 11", table_body_style)],
        [Paragraph("Section 10: Career Drive - Student Response Lock & Override Lifecycle", table_body_style), Paragraph("Page 12", table_body_style)],
        [Paragraph("Section 11: Career Drive - Client-Side PDF Text Extraction & OCR Rules", table_body_style), Paragraph("Page 13", table_body_style)],
        [Paragraph("Section 12: Career Drive - Backend Integration Payloads & Schemas", table_body_style), Paragraph("Page 14", table_body_style)],
        [Paragraph("Section 13: Career Drive - Indian Numbering System Formatting Engine", table_body_style), Paragraph("Page 15", table_body_style)],
        [Paragraph("Section 14: In Focus Module - Creators Directory", table_body_style), Paragraph("Page 16", table_body_style)],
        [Paragraph("Section 15: In Focus - Industries & Academics Directories", table_body_style), Paragraph("Page 17", table_body_style)],
        [Paragraph("Section 16: In Focus - Technical Data Transformation Code", table_body_style), Paragraph("Page 18", table_body_style)],
        [Paragraph("Section 17: Opportunities Module - Jobs & Internships Boards", table_body_style), Paragraph("Page 19", table_body_style)],
        [Paragraph("Section 18: Opportunities - Integration with Placement Acknowledgement", table_body_style), Paragraph("Page 20", table_body_style)],
        [Paragraph("Section 19: Support & Core Layout Widgets (Calendar, Cat Helper, Ads)", table_body_style), Paragraph("Page 21", table_body_style)],
        [Paragraph("Section 20: Technical Specs - React Hooks & REST APIs Reference", table_body_style), Paragraph("Page 22", table_body_style)],
        [Paragraph("Section 21: Client Operational Guidance & Best Practices", table_body_style), Paragraph("Page 23", table_body_style)]
    ]
    
    toc_table = Table(toc_data, colWidths=[400, 104])
    toc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1A1A1A')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D3D3D3')),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F9F9F9')]),
    ]))
    story.append(toc_table)
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("EXECUTIVE SUMMARY", h2_style))
    story.append(Paragraph(
        "This document serves as the official client-facing system documentation and implementation guide for the "
        "<b>enCODE Collaborate Module</b> developed by <b>Edulyst Ventures Pvt. Ltd.</b>. The Collaborate module is a multi-tenant, "
        "dynamic workspace designed for modern educational institutions, universities, industry placement cells, and creative stakeholders. "
        "It acts as a primary engagement hub for students and coordinators, organizing upcoming training calendars, registering "
        "them for high-priority flagship placement programs (Career Drives), maintaining a creative directory of creator profiles, "
        "providing direct internship and job opportunities boards, and offering a robust, client-side verified placement "
        "acknowledgement sub-system.",
        body_style
    ))
    story.append(Paragraph(
        "By walking through both technical configurations and functional journeys, this guide enables enterprise administrators, "
        "technical leads, and university career officers to successfully deploy, operate, and utilize the Collaborate section.",
        body_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 1: PLATFORM OVERVIEW (Page 3) ------------------
    story.append(Paragraph("SECTION 1: PLATFORM OVERVIEW & FUNCTIONAL ARCHITECTURE", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "The enCODE platform is an end-to-end skill assessment, learning management, and career placement ecosystem. Within this ecosystem, "
        "the <b>Collaborate</b> module plays a critical role as the social, collaborative, and professional bridge. While other modules focus "
        "on structured courses, assessments, and coding environments, the Collaborate section connects students directly with the active tech ecosystem, "
        "peers, industry experts, academic collaborators, and job drives.",
        body_style
    ))
    story.append(Paragraph("Core Objectives of the Collaborate Module:", h2_style))
    story.append(Paragraph(
        "• <b>Unified Engagement Hub</b>: Bring learning events, hackathons, job campaigns, creator networks, and placement trackers together in a single workspace.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Data-Driven Placement Funnel</b>: Enable real-time reporting of job offers, student status flags (placed vs seeking help), and feedback collection.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Peer & Mentor Discovery</b>: Build and browse student portfolio cards, industry partner profiles, and university collaborator databases to facilitate peer review and mentorship.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Active Schedule Synchronization</b>: Maintain a weekly calendar containing assignments, event schedules, and live classrooms to prevent scheduling conflicts.",
        bullet_style
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "Technically, the Collaborate workspace is structured as a client-side single page view driven by React and TypeScript. "
        "It coordinates multiple custom REST APIs and custom hooks to manage user authorization roles, dynamic content tabs, "
        "carousel components, and file parsing algorithms. The UI utilizes Tailwind styling under high-quality custom layouts (Shadcn UI), "
        "adhering to dark mode themes and responsive grid designs to support both mobile viewport clients and large widescreen desktops.",
        body_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 2: WORKSPACE LAYOUT & COMMON COMPONENTS (Page 4) ------------------
    story.append(Paragraph("SECTION 2: WORKSPACE LAYOUT & CORE COMPONENT HIERARCHY", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "The entry-point component of the collaborate view is located at <code>src/views/collaborate/index.tsx</code>. "
        "This file coordinates the dashboard layout using a grid configuration composed of main-panel grids (left column) and sidebar grids (right column). "
        "This structure provides a clean hierarchy of sections:",
        body_style
    ))
    
    hierarchy_data = [
        [Paragraph("<b>Component / Area</b>", table_header_style), Paragraph("<b>Role / Path</b>", table_header_style), Paragraph("<b>Tech Stack</b>", table_header_style)],
        [Paragraph("ProfileCard", table_body_style), Paragraph("Displays top-level logged student profile metadata, points, and avatars.", table_body_style), Paragraph("Tailwind, Custom User Store", table_body_style)],
        [Paragraph("Banner Carousel", table_body_style), Paragraph("Promotes popular, high-priority, or newly active events and career drives.", table_body_style), Paragraph("Embla Carousel, React Router", table_body_style)],
        [Paragraph("In Focus Card Switcher", table_body_style), Paragraph("Tabbed layout toggling Creators, Industry Partners, and Institutes in carousels.", table_body_style), Paragraph("React State, Tailwind Grid", table_body_style)],
        [Paragraph("On The Agenda Carousel", table_body_style), Paragraph("List of categories for upcoming hackathons, masterclasses, and tech conferences.", table_body_style), Paragraph("Embla Carousel, Categories Query", table_body_style)],
        [Paragraph("WeeklyCalendar", table_body_style), Paragraph("Sidebar calendar listing daily schedules, sessions, and upcoming assignments.", table_body_style), Paragraph("Custom React Calendar Widget", table_body_style)],
        [Paragraph("Cat (Support Bot)", table_body_style), Paragraph("Interactive virtual AI assistant for resolving platform issues on-the-fly.", table_body_style), Paragraph("React Icons, Lottie/SVG Animations", table_body_style)],
        [Paragraph("Must Attend Carousel", table_body_style), Paragraph("Highlights flagship drives (e.g. Career Drive, Graduation Ceremony, Immersion Program).", table_body_style), Paragraph("Embla Carousel, Flagship Category Query", table_body_style)]
    ]
    
    hierarchy_table = Table(hierarchy_data, colWidths=[120, 240, 144])
    hierarchy_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1A1A1A')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D3D3D3')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F9F9F9')]),
    ]))
    story.append(hierarchy_table)
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "By structuring the page as a 10-column layout (<code>grid-cols-1 lg:grid-cols-10</code>), the workspace handles viewports dynamically. "
        "On desktop viewports, the central components (Banner, In Focus, Agenda) span 7 columns, while the calendar, Cat support bot, and advertisements "
        "span 3 columns on the right. On mobile devices, the grid collapses into a single-column layout, stacking components sequentially "
        "to ensure accessibility and a clean user experience.",
        body_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 3: ON THE AGENDA MODULE (Page 5) ------------------
    story.append(Paragraph("SECTION 3: \"ON THE AGENDA\" MODULE - CORE FEATURES", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "The <b>On The Agenda</b> module showcases upcoming training modules, academic masterclasses, "
        "coding bootcamps, and technical competitions. The goal is to provide a structured timeline of events "
        "that help students build skills, connect with industry experts, and prepare for placement rounds.",
        body_style
    ))
    story.append(Paragraph("Functional Capabilities:", h2_style))
    story.append(Paragraph(
        "• <b>Diverse Event Offerings</b>: Supports various event formats such as Hackathons, Expert Masterclasses, Guest Webinars, and Coding Competitions.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Static Card Configurations</b>: Leverages visual configurations mapping banner images to event category IDs. For example, Competitions category ID 8 links to <code>/img/others/Image17.png</code>, which is standard across the platform.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Filtering by Event Types</b>: Allows students to filter events by clicking on specific cards. This redirects the user to `agenda?category=...` to load targeted lists.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Registration Integration</b>: Integrates with the enCODE backend to check if the student is registered. It updates buttons from 'Register' to 'View Details' dynamically.",
        bullet_style
    ))
    story.append(Spacer(1, 5))
    story.append(Paragraph(
        "The frontend implements this section inside <code>src/views/collaborate/agenda/index.tsx</code>. It queries the active categories "
        "associated with the 'On the Agenda' group from the database. It renders them as cards inside an Embla carousel, complete with custom "
        "navigation controllers for slider paging. The layout is optimized to display multiple categories simultaneously on desktop "
        "viewports while scaling down to a single-card view on smaller mobile viewports.",
        body_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 4: ON THE AGENDA - TECHNICAL (Page 6) ------------------
    story.append(Paragraph("SECTION 4: \"ON THE AGENDA\" - TECHNICAL INTEGRATION & QUERIES", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "The agenda cards are powered by fetching category listings from the API. The category lists are filtered by a group name "
        "configured as 'On the Agenda'. We inspect the React Memo implementation driving this logic inside the codebase:",
        body_style
    ))
    
    agenda_code = """// Memoized mapping of category data from database
const agendaData = React.useMemo(() => categoryData
    .filter(cat => cat.group_name === 'On the Agenda')
    .map(cat => ({
        id: cat.id,
        type: cat.name,
        title: cat.name,
        description: cat.description,
        banner: resolveBanner(cat, agendaStaticConfig, '/img/others/image15.png'),
    })), [categoryData, resolveBanner]);"""
    story.append(Paragraph(agenda_code.replace("<", "&lt;").replace(">", "&gt;"), code_style))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("Event Detail & Registration States:", h2_style))
    story.append(Paragraph(
        "When a user selects an agenda category, the system routes them to <code>src/views/collaborate/agenda/details.tsx</code>. "
        "This details page fetches the detailed event description, duration, expert profile, and registration status. "
        "The system determines registration state through the <code>is_assigned</code> field returned in the API payload. "
        "If <code>is_assigned</code> is true, the UI displays a disabled 'Registered' state. If false, clicking the button triggers "
        "the <code>useEventApply</code> mutation to register the student, invalidates the query cache via React Query, and triggers "
        "a success toast notification using <code>sonner</code>.",
        body_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 5: MUST ATTEND MODULE (Page 7) ------------------
    story.append(Paragraph("SECTION 5: \"MUST ATTEND\" MODULE - CORE FEATURES", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "The <b>Must Attend</b> section showcases high-priority flagship gatherings, placement drives, and immersive academic events "
        "critical to the student’s career growth. While the 'On the Agenda' section focuses on learning, the 'Must Attend' section "
        "is focused on placement campaigns and flagship drives.",
        body_style
    ))
    story.append(Paragraph("Core Categories within Must Attend:", h2_style))
    story.append(Paragraph(
        "• <b>Career Drive</b>: Flagship campus recruitment programs connecting students with corporate job postings and interview rounds. This triggers the placement acknowledgement sub-system.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Creators Meetups</b>: Networking sessions bringing student designers and developers together with external creators and professional developers.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Flagship Events</b>: Grand hackathons, design symposiums, and coding events hosted by enCODE and academic partners.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Immersion Program</b>: Intensive, offline training programs held at industry locations or partner institutes.",
        bullet_style
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "Inside the <code>MustAttendList</code> component (<code>src/views/collaborate/must-attend/index.tsx</code>), categories are mapped "
        "to distinct themes. Each category features a styled badge using custom colors: Creators Meetups and Immersion Program use "
        "<code>bg-codeblue</code>, Career Drive uses <code>bg-codegreen</code>, and Flagship Events use <code>bg-codepink</code>. "
        "This visual cues help students quickly identify the category of each event in the list.",
        body_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 6: MUST ATTEND - CAREER DRIVE (Page 8) ------------------
    story.append(Paragraph("SECTION 6: \"MUST ATTEND\" - CAREER DRIVE MECHANICS", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "When a student opens a Career Drive event (Category ID 2) inside the <code>MustAttendCard</code> details component, "
        "the page renders a tabbed dashboard using the Radix UI Tabs component. The tabs vary dynamically based on the category "
        "of the event. For standard events (like meetups or webinars), the interface presents 'Overview', 'Expert Details', and 'Certificate' tabs. "
        "However, when the category is set to 'Career Drive' (Category ID 2), the system unlocks tabs for the placement funnel:",
        body_style
    ))
    
    tabs_data = [
        [Paragraph("<b>Tab Value</b>", table_header_style), Paragraph("<b>Functional Objective</b>", table_header_style), Paragraph("<b>Components Rendered</b>", table_header_style)],
        [Paragraph("overview", table_body_style), Paragraph("Renders details of the career drive, acquired skills, and preparation FAQs.", table_body_style), Paragraph("SafeHtml, Skills Badge Map", table_body_style)],
        [Paragraph("industries_participating", table_body_style), Paragraph("Lists cards of partner companies participating in the recruitment drive.", table_body_style), Paragraph("Participating Industries Card Grid", table_body_style)],
        [Paragraph("jobs_internships", table_body_style), Paragraph("Provides job openings with skill filters, search, and application status.", table_body_style), Paragraph("JobCard list with experiences/skills", table_body_style)],
        [Paragraph("drive_process", table_body_style), Paragraph("Displays a step-by-step visual path representing screening, coding tests, and HR rounds.", table_body_style), Paragraph("DriveProcess timeline component", table_body_style)],
        [Paragraph("acknowledgement", table_body_style), Paragraph("Placement reporting workflow to submit and verify offer letters or decline status.", table_body_style), Paragraph("AcknowledgementTab form engine", table_body_style)]
    ]
    
    tabs_table = Table(tabs_data, colWidths=[130, 230, 144])
    tabs_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1A1A1A')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D3D3D3')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F9F9F9')]),
    ]))
    story.append(tabs_table)
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "This custom tab structure isolates functional areas, keeping the student's workflow clear. "
        "The 'Acknowledgement' tab is the core of the placement outcomes system, allowing institutions to verify student placements "
        "and outcomes directly from the student's dashboard.",
        body_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 7: CAREER DRIVE - PLACEMENT FUNNEL (Page 9) ------------------
    story.append(Paragraph("SECTION 7: CAREER DRIVE - PLACEMENT FUNNEL & STATUS VERIFICATION", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "Collecting verified employment data is a major challenge for university placement cells and career offices. "
        "Traditionally, students are tracked via manual spreadsheets or emails, which often results in incomplete records, "
        "unverified salary packages, and delays. The enCODE Placement & Offer Letter Acknowledgement System automates "
        "and standardizes this tracking process.",
        body_style
    ))
    story.append(Paragraph("Placement Funnel Life-cycle:", h2_style))
    story.append(Paragraph(
        "1. <b>Drive Engagement</b>: The student registers for a Career Drive and applies for job listings through the Jobs/Internships tab.",
        bullet_style
    ))
    story.append(Paragraph(
        "2. <b>Interview & Selection</b>: Partner industries conduct coding tests and interviews on the enCODE platform.",
        bullet_style
    ))
    story.append(Paragraph(
        "3. <b>Status Reporting</b>: Upon completion of selection rounds, students report their placement outcomes in the Acknowledgement tab.",
        bullet_style
    ))
    story.append(Paragraph(
        "4. <b>Verification & Compliance</b>: The student uploads their offer letter PDF. The system verifies it in real-time, extracts keywords, formats compensation, and saves the data to the server.",
        bullet_style
    ))
    story.append(Paragraph(
        "5. <b>Triage & Counseling</b>: Students who decline placement support or report obstacles are flagged for administrative support.",
        bullet_style
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "By integrating this funnel directly into the event workspace, the platform ensures high compliance. "
        "Coordinators monitor outcomes in real-time, filtering reports by university departments and tracking metrics like average salary "
        "and placement rates automatically.",
        body_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 8: CAREER DRIVE - USE CASES 1 & 2 (Page 10) ------------------
    story.append(Paragraph("SECTION 8: CAREER DRIVE - USE CASES 1 & 2 (OFFER & DECLINE)", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "The placement acknowledgement system supports multiple use cases based on the student's status. "
        "Below are the functional workflows for Use Cases 1 and 2:",
        body_style
    ))
    story.append(Paragraph("USE CASE 1: Placement Offer Submitted & Verified", h2_style))
    story.append(Paragraph(
        "• <b>Goal</b>: Capture and verify a student's positive placement outcome.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Flow</b>: The student selects 'Yes, I have received the offer letter'. They search for the hiring company from a combobox. "
        "If not listed, they select 'Other' and input the company name. The student enters job type (Full-time, Part-time, Internship), Designation, "
        "Location, Company contact details (phone, email, address), and raw numerical Salary Package (e.g. 1200000). If it's a part-time/internship, "
        "duration values are requested. The student then uploads their offer letter PDF. The system runs client-side text verification, unlocks the "
        "submit button on success, and transmits the data to the backend.",
        bullet_style
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph("USE CASE 2: Opting Out / Declining Placement Support", h2_style))
    story.append(Paragraph(
        "• <b>Goal</b>: Document students who choose an alternate career path and exclude them from job email campaigns.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Flow</b>: The student selects 'No, I don't want any offer letter'. The system displays four options representing standard opt-out reasons: "
        "<i>Higher Education</i> (GRE/GATE prep, Masters), <i>Family Business</i>, <i>Own Startup</i>, or <i>No Job/Internship</i>. "
        "The student selects a reason and submits, updating their record to 'Opted Out' and excluding them from active job match email queues.",
        bullet_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 9: CAREER DRIVE - USE CASES 3, 4 & 5 (Page 11) ------------------
    story.append(Paragraph("SECTION 9: CAREER DRIVE - USE CASES 3, 4 & 5 (LOOKING, HELP, SURVEY)", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "To support students who have not yet secured an offer or who have feedback on the drive, the system provides three additional workflows:",
        body_style
    ))
    story.append(Paragraph("USE CASE 3: Active Search - Still Looking for Opportunities", h2_style))
    story.append(Paragraph(
        "• <b>Goal</b>: Allow students to flag that they have not secured an offer but are actively seeking one.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Flow</b>: The student selects 'No, I am still looking for Job/Internship Opportunities'. "
        "A text area appears where the student details their current status, technical preferences, or recent interview progress. "
        "Upon submission, the system flags their profile as 'Active Search' for placement coordinators.",
        bullet_style
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph("USE CASE 4: Direct Intervention - Requesting Support", h2_style))
    story.append(Paragraph(
        "• <b>Goal</b>: Open an escalation channel for students facing critical hurdles (e.g. visa issues, technical issues).",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Flow</b>: The student selects 'I, would require help from enCODE support'. "
        "They describe their problem in a text field and submit, flagging their profile for direct outreach by the support team.",
        bullet_style
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph("USE CASE 5: Career Drive Feedback Survey", h2_style))
    story.append(Paragraph(
        "• <b>Goal</b>: Collect feedback from participants regarding the overall execution of the drive.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Flow</b>: The student selects 'Share your valuable feedback for the Career Drive'. "
        "The sub-component loads the configured survey for the event, presenting MCQs (e.g. Rating: Poor to Excellent) and open text areas. "
        "Completed forms are submitted in bulk via multipart payload, closing the loop.",
        bullet_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 10: RESPONSE LOCK & OVERRIDE LIFECYCLE (Page 12) ------------------
    story.append(Paragraph("SECTION 10: CAREER DRIVE - RESPONSE LOCK & OVERRIDE LIFECYCLE", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "Once a student submits their response in the Acknowledgement tab, the system locks the state "
        "to prevent accidental double-submits. The UI updates dynamically based on the student's submission history:",
        body_style
    ))
    story.append(Paragraph("1. Read-Only Response Dashboard", h2_style))
    story.append(Paragraph(
        "Post-submission, the form inputs are hidden. The tab displays a 'Your Submitted Response' dashboard. "
        "This includes a confirmation card displaying their submission status, description text, and a listing "
        "of all uploaded offer letter PDFs. Clicking a PDF opens a secure PDF viewer modal, allowing the student "
        "to preview the file. The PDF file is rendered using an <code>iframe</code> target pointing to the file's path on the server.",
        body_style
    ))
    story.append(Paragraph("2. New Response Override Flow", h2_style))
    story.append(Paragraph(
        "If a student receives a revised job offer, a higher package, or changes their career path (e.g., transitioning from 'Still Looking' to 'Offer Received'), "
        "they can submit a new response. The dashboard displays a green 'Submit New' button. "
        "Clicking this button sets a local state flag (<code>showNewForm = true</code>), which resets the form and unlocks inputs. "
        "This lets the student submit a new response while preserving their historical records in the backend database for audits.",
        body_style
    ))
    story.append(Spacer(1, 10))
    
    state_table_headers = [
        Paragraph("Current UI State", table_header_style),
        Paragraph("Trigger / User Action", table_header_style),
        Paragraph("New UI State & System Behavior", table_header_style)
    ]
    st_row1 = [
        Paragraph("Empty Form Panel", table_body_style),
        Paragraph("Successful form submission to <code>saveJobLead</code> API", table_body_style),
        Paragraph("Displays <b>'Your Submitted Response'</b>. Form locks. PDF uploaded.", table_body_style)
    ]
    st_row2 = [
        Paragraph("Locked Response Dashboard", table_body_style),
        Paragraph("Clicks 'Submit New' button", table_body_style),
        Paragraph("Resets <code>showNewForm = true</code>. Unlocks all form inputs to compile a fresh response.", table_body_style)
    ]
    st_row3 = [
        Paragraph("PDF file selector", table_body_style),
        Paragraph("Uploads blank or invalid PDF", table_body_style),
        Paragraph("PDF.js keywords check fails. Toast displays warning, clears file, and locks submission.", table_body_style)
    ]
    
    state_table = Table([state_table_headers, st_row1, st_row2, st_row3], colWidths=[150, 150, 204])
    state_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1A1A1A')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D3D3D3')),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F9F9F9')]),
    ]))
    story.append(state_table)
    story.append(PageBreak())

    # ------------------ SECTION 11: CLIENT-SIDE PDF OCR (Page 13) ------------------
    story.append(Paragraph("SECTION 11: CLIENT-SIDE PDF TEXT EXTRACTION & OCR VERIFICATION", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "To prevent students from uploading blank pages, incorrect documents, or dummy files, "
        "the frontend implements a real-time verification process using <b>PDF.js</b> (<code>pdfjs-dist</code>). "
        "The text extraction runs inside the browser sandbox before any network requests are sent, protecting the server "
        "from processing invalid files.",
        body_style
    ))
    story.append(Paragraph("Heuristic Keyword Matching Rules:", h2_style))
    story.append(Paragraph(
        "When a student selects a PDF file, the system extracts the text content of up to the first 3 pages. "
        "It validates the extracted text (case-insensitively) against a list of keywords:",
        body_style
    ))
    story.append(Paragraph(
        "<b>Keywords List:</b> [ \"offer letter\", \"employment offer\", \"joining date\", \"annual ctc\", \"salary\", \"designation\", \"candidate name\" ]",
        code_style
    ))
    story.append(Paragraph(
        "If none of these keywords are matched in the text, the system rejects the file. It displays a warning toast: "
        "<i>\"The uploaded document does not appear to be an Offer Letter.\"</i> and clears the file input. "
        "This client-side check prevents database overhead and improves data quality.",
        body_style
    ))
    
    js_code = """// PDF.js Text Extraction Code Snippet
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
    story.append(Paragraph(js_code.replace("<", "&lt;").replace(">", "&gt;"), code_style))
    story.append(PageBreak())

    # ------------------ SECTION 12: BACKEND SCHEMAS (Page 14) ------------------
    story.append(Paragraph("SECTION 12: BACKEND INTEGRATION & DATA PAYLOAD SCHEMAS", h1_style))
    story.append(Spacer(1, 10))
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
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F9F9F9')]),
    ]))
    
    story.append(payloads_table)
    story.append(PageBreak())

    # ------------------ SECTION 13: SALARY ENGINE (Page 15) ------------------
    story.append(Paragraph("SECTION 13: SALARY SHORTHAND FORMATTING ENGINE", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "To standardize compensation figures inside the system and maintain database consistency, "
        "the frontend converts raw numeric values into human-readable Indian Numbering System shorthands "
        "(e.g., K, Lacs, Cr) on the fly. The logic runs reactively, rendering helper text beneath the input field "
        "and compiling the final package string dynamically.",
        body_style
    ))
    story.append(Paragraph("Formatting Rules:", h2_style))
    story.append(Paragraph("• Raw values &ge; 10,000,000 are formatted as <b>Cr</b> (Crores), truncated to 2 decimals.", bullet_style))
    story.append(Paragraph("• Raw values &ge; 100,000 are formatted as <b>Lacs</b> (Lakhs), truncated to 2 decimals.", bullet_style))
    story.append(Paragraph("• Raw values &ge; 1,000 are formatted as <b>K</b> (Thousands), truncated to 2 decimals.", bullet_style))
    story.append(Paragraph("• Selected multiplier (Yearly, Monthly, Fixed) is appended prior to API transmission (e.g. \"6.5 Lacs Yearly\").", bullet_style))
    story.append(Spacer(1, 10))
    
    formatting_code = """// Salary Formatter Implementation in React
const formatSalary = (value: string): string => {
  const num = parseFloat(value);
  if (isNaN(num) || num === 0) return '';
  if (num >= 10000000) return `${+(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `${+(num / 100000).toFixed(2)} Lacs`;
  if (num >= 1000) return `${+(num / 1000).toFixed(2)} K`;
  return num.toString();
};

// Example usage in input component
<input 
  type="text" 
  value={salaryPackage} 
  onChange={e => setSalaryPackage(e.target.value.replace(/[^0-9]/g, ''))} 
/>
{salaryPackage && (
  <div className="text-lime-green">
    {formatSalary(salaryPackage)}
  </div>
)}"""
    story.append(Paragraph(formatting_code.replace("<", "&lt;").replace(">", "&gt;"), code_style))
    story.append(PageBreak())

    # ------------------ SECTION 14: IN FOCUS MODULE (Page 16) ------------------
    story.append(Paragraph("SECTION 14: \"IN FOCUS\" MODULE - CREATORS DIRECTORY", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "The <b>In Focus</b> module acts as a talent catalog and networking directory. "
        "It provides a directory of student creators, partner companies, and academic collaborators. "
        "The primary goal is to help coordinators and industry experts discover qualified talent and view student portfolios.",
        body_style
    ))
    story.append(Paragraph("Creators Directory Functional Capabilities:", h2_style))
    story.append(Paragraph(
        "• <b>Portfolio Card Grid</b>: Renders student profile details (avatar, name, role, designations, and description).",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Skill Badges</b>: Displays custom skill tags (e.g. React, UX Design, Python) associated with the student profile.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Mentor Profiles</b>: Identifies mentors with a designated 'Mentor' role badge, helping students find academic support.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Interactive Profiles</b>: Links directly to details pages, allowing users to review student portfolios and contact details.",
        bullet_style
    ))
    story.append(Spacer(1, 5))
    story.append(Paragraph(
        "The directory loads active student profiles from the <code>useInFocus</code> API query. It maps the server models "
        "to uniform layouts and filters them dynamically. This catalog helps institutions showcase student portfolios "
        "and projects to corporate partners and visitors.",
        body_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 15: IN FOCUS - PARTNERS (Page 17) ------------------
    story.append(Paragraph("SECTION 15: \"IN FOCUS\" - PARTNER & ACADEMIC DIRECTORIES", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "Beyond student profiles, the <b>In Focus</b> module supports directories for partner companies and academic institutes. "
        "This facilitates collaborations between academia and industry partners.",
        body_style
    ))
    story.append(Paragraph("Partner Directories:", h2_style))
    story.append(Paragraph(
        "• <b>Industries Directory</b>: Profiles of hiring partners and recruiters. "
        "It displays company logos, descriptions, and active job openings. "
        "Students can learn about company work cultures and review positions before applying.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Institutes & Universities Directory</b>: Directory of academic partners. "
        "It displays logos, descriptions, and details of collaborative programs, "
        "facilitating cross-institute student exchanges and joint events.",
        bullet_style
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "Both directories share a visual card layout (<code>CreativeDirectory.tsx</code>). It includes a header banner "
        "for branding, an 'About' section, and navigation triggers linking to detailed organization pages. "
        "The grid is populated dynamically from the centralized cache, providing a fast and interactive experience.",
        body_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 16: IN FOCUS - TRANSFORMS (Page 18) ------------------
    story.append(Paragraph("SECTION 16: \"IN FOCUS\" - TECHNICAL DATA TRANSFORMATIONS", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "To support diverse data models (profiles, mentors, companies, and universities) in a single card viewer, "
        "the system implements a data transformation utility inside <code>src/views/collaborate/index.tsx</code>. "
        "This utility standardizes API payloads into a uniform interface before they are rendered by the UI.",
        body_style
    ))
    
    transform_code = """// Data transformation function mapping raw server state
const transformInFocusData = React.useCallback((data: any[]) => {
  return data.map((item: any) => {
    if (item.profiles && item.profiles.length > 0) {
      return item.profiles.map((profile: any) => {
        const orgType = profile.org_type || item.type;
        const finalName = item.display_name || profile?.name || item.name || 'Unknown';

        if (item.type === 'profile' || item.type === 'mentor') {
          return {
            type: 'profile',
            id: profile?.id || item?.id,
            name: finalName,
            designation: profile?.role || 'Creative Professional',
            description: item.placeholder || profile?.description || 'No description available',
            skills: profile?.skills?.map((s: any) => s.skill_name || s.name) || [],
            profile_image: profile?.profile_image || 'https://ui-avatars.com/api/?name=User',
            reference_id: item.reference_id
          };
        } else {
          return {
            type: orgType,
            name: finalName,
            about: profile?.org_description || item.placeholder || 'No description available',
            banner: profile?.logo || item.file || '/img/placeholder.png',
            id: String(item.id),
            reference_id: item.reference_id
          };
        }
      }).filter(Boolean);
    }
    return null;
  }).flat().filter(item => item !== null);
}, []);"""
    story.append(Paragraph(transform_code.replace("<", "&lt;").replace(">", "&gt;"), code_style))
    story.append(PageBreak())

    # ------------------ SECTION 17: OPPORTUNITIES MODULE (Page 19) ------------------
    story.append(Paragraph("SECTION 17: \"OPPORTUNITIES\" MODULE - JOB BOARDS", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "The <b>Opportunities</b> module (<code>src/views/collaborate/opportunities/index.tsx</code>) is the job board "
        "of the Collaborate workspace. It provides students with access to active placements and internships "
        "published by verified industry partners.",
        body_style
    ))
    story.append(Paragraph("Opportunities Functional Capabilities:", h2_style))
    story.append(Paragraph(
        "• <b>Dual Tab Layout</b>: Tabs separate full-time Job postings and Internship postings, allowing students "
        "to easily filter listings based on their career stage.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Detailed Opportunity Cards</b>: Each card displays company logo, role name, location, experience requirements, "
        "work mode (Remote, Hybrid, On-site), post date, and required skills.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Bookmarks</b>: Allows students to save opportunities for future reference by bookmarking cards.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Visual Application States</b>: Indicates application status dynamically. It shows a green 'Apply Now' button "
        "or a grey 'Applied' button based on the student's history.",
        bullet_style
    ))
    story.append(Spacer(1, 5))
    story.append(Paragraph(
        "The opportunities section fetches active postings from the <code>usePublishedJobs</code> custom query. "
        "Selecting a card routes the student to <code>/internship/:id</code> to review job responsibilities and apply. "
        "This centralized dashboard helps students find and apply for jobs efficiently.",
        body_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 18: OPPORTUNITIES INTEGRATION (Page 20) ------------------
    story.append(Paragraph("SECTION 18: \"OPPORTUNITIES\" - INTEGRATION & ACKNOWLEDGEMENT", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "To ensure compliance, the job and internship boards integrate directly with the placement acknowledgement system. "
        "This is managed by the <code>OpportunitiesAcknowledgement</code> component.",
        body_style
    ))
    story.append(Paragraph("How the Integration Works:", h2_style))
    story.append(Paragraph(
        "• <b>Workspace Banner Alert</b>: When a student opens the Opportunities page, the component checks if they have "
        "submitted their placement status. If no response is found, a prominent warning alert is displayed at the top of the page.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Embedded Action Forms</b>: The alert includes a button link that opens the Acknowledgement form directly, "
        "encouraging students to report their status without leaving the job board.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>Access Controls</b>: Administrators can configure the system to restrict job applications "
        "until the student submits their placement status. This ensures high compliance rates.",
        bullet_style
    ))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "This integration prevents students from bypassing placement reporting. It helps institutions "
        "maintain complete records by requesting data during the student's job search process.",
        body_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 19: SUPPORT & LAYOUT WIDGETS (Page 21) ------------------
    story.append(Paragraph("SECTION 19: SUPPORT & CORE LAYOUT WIDGETS", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "The Collaborate workspace includes several supporting widgets that provide a structured and helpful user experience:",
        body_style
    ))
    story.append(Paragraph("1. WeeklyCalendar Widget", h2_style))
    story.append(Paragraph(
        "Rendered in the right column sidebar, the WeeklyCalendar displays the student's daily schedule. "
        "It queries data from calendar service endpoints to display upcoming deadlines, assignments, hackathons, and webinars. "
        "This helps students manage their time and avoid scheduling conflicts.",
        body_style
    ))
    story.append(Paragraph("2. Announcements Ticker", h2_style))
    story.append(Paragraph(
        "This widget displays high-priority platform announcements, policy updates, and deadline changes. "
        "Coordinators post messages here to communicate time-sensitive information directly to students.",
        body_style
    ))
    story.append(Paragraph("3. Cat Assistant Bot", h2_style))
    story.append(Paragraph(
        "The Cat widget is an interactive support assistant. It provides answers to frequently asked questions, "
        "helps troubleshoot issues, and routes complex queries to the technical support team. "
        "This automated helper reduces administrative overhead and resolves simple issues instantly.",
        body_style
    ))
    story.append(Paragraph("4. Advertisements Panel", h2_style))
    story.append(Paragraph(
        "This panel features sponsored workshops, external certification programs, or corporate partner banner ads, "
        "introducing students to industry opportunities.",
        body_style
    ))
    story.append(PageBreak())

    # ------------------ SECTION 20: TECHNICAL SPECS - HOOKS & APIS (Page 22) ------------------
    story.append(Paragraph("SECTION 20: TECHNICAL SPECS - REACT HOOKS & REST APIS REFERENCE", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "The Collaborate module is driven by a series of custom React hooks and backend REST API endpoints. "
        "These manage state, coordinate user roles, and handles data transmission:",
        body_style
    ))
    story.append(Paragraph("React Query Custom Hooks:", h2_style))
    story.append(Paragraph(
        "• <b>useEvents(params)</b>: Fetches active events list from the database. It takes filtering parameters like category IDs or date ranges.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>useEventCategories()</b>: Fetches configured event categories, group names, descriptions, and icon mappings.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>useInFocus()</b>: Fetches profiles, partners, and universities for the In Focus directory.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>usePublishedJobs()</b>: Fetches active job and internship postings, including skill requirements and experience tags.",
        bullet_style
    ))
    story.append(Paragraph(
        "• <b>useStudentQueries()</b>: Fetches the student's submission history, including their placement reporting records.",
        bullet_style
    ))
    story.append(Spacer(1, 10))
    
    api_data = [
        [Paragraph("<b>API Endpoint Route</b>", table_header_style), Paragraph("<b>HTTP Method</b>", table_header_style), Paragraph("<b>Purpose & Payload Type</b>", table_header_style)],
        [Paragraph("<code>/api/job-leads/save</code>", table_body_style), Paragraph("POST", table_body_style), Paragraph("Saves placement outcomes (Multipart/form-data for Type 1 PDFs, JSON for Types 2-5).", table_body_style)],
        [Paragraph("<code>/api/events/list</code>", table_body_style), Paragraph("GET", table_body_style), Paragraph("Queries events list, filtered by category and date parameters.", table_body_style)],
        [Paragraph("<code>/api/jobs/published</code>", table_body_style), Paragraph("GET", table_body_style), Paragraph("Queries active jobs and internship postings.", table_body_style)],
        [Paragraph("<code>/api/student/queries</code>", table_body_style), Paragraph("GET", table_body_style), Paragraph("Queries placement submission records for the logged student.", table_body_style)]
    ]
    
    api_table = Table(api_data, colWidths=[180, 70, 254])
    api_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1A1A1A')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#D3D3D3')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F9F9F9')]),
    ]))
    story.append(api_table)
    story.append(PageBreak())

    # ------------------ SECTION 21: CLIENT OPERATIONS PLAYBOOK (Page 23) ------------------
    story.append(Paragraph("SECTION 21: CLIENT OPERATIONAL PLAYBOOK & BEST PRACTICES", h1_style))
    story.append(Spacer(1, 10))
    story.append(Paragraph(
        "For administrators and coordinators using the enCODE Collaborate module, "
        "we recommend the following processes to ensure smooth operations and high-quality data collection:",
        body_style
    ))
    story.append(Paragraph("1. Daily Review on Type 4 (Requires Help)", h2_style))
    story.append(Paragraph(
        "Students who select the 'Requires Help' option are facing obstacles. "
        "Placement coordinators should review these records daily to provide direct support, "
        "helping resolve issues with visas, coding tests, or system access.",
        body_style
    ))
    story.append(Paragraph("2. Analyze Decline Reasons (Type 2)", h2_style))
    story.append(Paragraph(
        "Analyze why students opt out of placement support. High volumes of family business or entrepreneurship "
        "selections indicate shifting student career preferences, while high volumes of 'no job' selections "
        "may highlight a need for additional counseling.",
        body_style
    ))
    story.append(Paragraph("3. Audit PDF Letters & Salaries", h2_style))
    story.append(Paragraph(
        "Although the system validates PDFs using client-side checks, administrators should "
        "periodically audit uploaded offer letters. Confirm that designation, company name, and salary package "
        "entered in the forms match the details in the PDF files.",
        body_style
    ))
    story.append(Paragraph("4. Survey Analysis", h2_style))
    story.append(Paragraph(
        "Use feedback survey data to improve career drives. Analyze MCQ ratings and qualitative feedback "
        "to evaluate coordinator performance and improve corporate relations.",
        body_style
    ))
    story.append(Spacer(1, 15))
    story.append(Paragraph(
        "<b>Document Sign-off</b><br/>"
        "This guide is compiled and verified by <b>Sanjay Maddheshiya, Full Stack Developer</b>. "
        "For technical questions or customization requests, please contact the development team at <b>Edulyst Ventures Pvt. Ltd.</b>",
        body_style
    ))

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {filename}")

if __name__ == '__main__':
    # Try downloading logo from URL
    url = "https://edulyst.ai/images/logo-full.png"
    logo_path = "/Volumes/Edulyst/Product/React/codeedu/scratch/logo-full.png"
    
    print("Attempting to download logo from URL...")
    try:
        # Set a standard User-Agent header to avoid HTTP blocks
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open(logo_path, 'wb') as out_file:
                out_file.write(response.read())
        print(f"Logo downloaded to: {logo_path}")
    except Exception as e:
        print(f"URL download failed ({e}), using local backup logo...")
        logo_path = "/Volumes/Edulyst/Product/React/codeedu/src/assets/images/New_Logo.png"
        
    output_pdf = "/Volumes/Edulyst/Product/React/codeedu/enCODE_Collaborate_Module_Implementation_Guide.pdf"
    build_pdf(output_pdf, logo_path)
