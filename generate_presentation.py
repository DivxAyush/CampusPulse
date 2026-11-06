import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Color Palette (CampusPulse Brand)
    COLOR_NAVY = RGBColor(6, 45, 50)        # #062D32
    COLOR_NAVY_DARK = RGBColor(4, 28, 31)   # #041C1F
    COLOR_TEAL = RGBColor(21, 155, 121)     # #159B79
    COLOR_MINT_LIGHT = RGBColor(221, 243, 232) # #DDF3E8
    COLOR_WHITE = RGBColor(255, 255, 255)
    COLOR_GRAY_BG = RGBColor(248, 248, 242) # #F8F8F2
    COLOR_CARD_BORDER = RGBColor(227, 233, 229) # #E3E9E5
    COLOR_TEXT_MAIN = RGBColor(16, 42, 50)  # #102A32
    COLOR_TEXT_MUTED = RGBColor(113, 129, 127) # #71817F
    COLOR_ACCENT_AMBER = RGBColor(217, 119, 6) # #D97706

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category="CAMPUSPULSE • COLLEGE MAJOR PROJECT"):
        # Header banner text box
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(1.1))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p0 = tf.paragraphs[0]
        p0.text = category.upper()
        p0.font.size = Pt(10)
        p0.font.bold = True
        p0.font.color.rgb = COLOR_TEAL

        p1 = tf.add_paragraph()
        p1.text = title_text
        p1.font.size = Pt(24)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_NAVY
        p1.space_before = Pt(4)

        # Thin divider line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.65), Inches(11.733), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = COLOR_CARD_BORDER
        line.line.fill.background()

    def add_card(slide, left, top, width, height, bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(1.5)
        else:
            card.line.fill.background()
        return card

    # =========================================================================
    # SLIDE 1: Title Slide (Dark Navy Hero)
    # =========================================================================
    blank_layout = prs.slide_layouts[6]
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, COLOR_NAVY)

    # Accent decorative shape
    accent = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.2), Inches(0.15), Inches(4.5))
    accent.fill.solid()
    accent.fill.fore_color.rgb = COLOR_TEAL
    accent.line.fill.background()

    t_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.2), Inches(11.0), Inches(5.0))
    tf = t_box.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "MAJOR PROJECT PRESENTATION • 2026"
    p.font.size = Pt(13)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEAL

    p2 = tf.add_paragraph()
    p2.text = "CampusPulse AI"
    p2.font.size = Pt(44)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_WHITE
    p2.space_before = Pt(12)

    p3 = tf.add_paragraph()
    p3.text = "Smart Job Search. Smarter Resumes. Better Opportunities."
    p3.font.size = Pt(20)
    p3.font.color.rgb = COLOR_MINT_LIGHT
    p3.space_before = Pt(8)

    p4 = tf.add_paragraph()
    p4.text = "An End-to-End Campus Recruitment & PulseAI™ ATS Resume Optimization Platform"
    p4.font.size = Pt(13)
    p4.font.color.rgb = RGBColor(190, 210, 205)
    p4.space_before = Pt(8)

    # Project metadata card inside slide 1
    add_card(s1, Inches(1.2), Inches(4.5), Inches(10.5), Inches(1.8), bg_color=COLOR_NAVY_DARK, border_color=COLOR_TEAL)
    meta_box = s1.shapes.add_textbox(Inches(1.5), Inches(4.7), Inches(10.0), Inches(1.4))
    mtf = meta_box.text_frame
    mtf.word_wrap = True

    mp1 = mtf.paragraphs[0]
    mp1.text = "Presented By: Ayush Kumar & Project Team | B.Tech Computer Science & Engineering"
    mp1.font.size = Pt(14)
    mp1.font.bold = True
    mp1.font.color.rgb = COLOR_WHITE

    mp2 = mtf.add_paragraph()
    mp2.text = "Under the Guidance of: Department of Computer Science & Engineering"
    mp2.font.size = Pt(12)
    mp2.font.color.rgb = COLOR_MINT_LIGHT
    mp2.space_before = Pt(4)

    mp3 = mtf.add_paragraph()
    mp3.text = "Tech Stack: React 18, Vite, Node.js, Express, MongoDB Atlas, Qwen 2.5 27B LLM / Gemini"
    mp3.font.size = Pt(11)
    mp3.font.color.rgb = RGBColor(160, 185, 180)
    mp3.space_before = Pt(4)

    # =========================================================================
    # SLIDE 2: Problem Statement & Motivation
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, COLOR_GRAY_BG)
    add_header(s2, "Problem Statement & Industry Motivation")

    problems = [
        ("Traditional Keyword ATS Failures",
         "Over 75% of student resumes are rejected by legacy keyword checkers because they don't understand synonyms, project context, or semantic equivalents (e.g., MERN vs React/Node)."),
        ("Asymmetric Placement Information",
         "Students blindly apply to hundreds of openings without knowing their actual job match percentage, missing skills, or why their applications get ignored."),
        ("Recruiter Burnout & Overload",
         "Campus recruiters receive 1,000+ unverified resumes per role. Manual shortlisting is subjective, slow, and prone to human cognitive fatigue."),
        ("Lack of Real-time Actionable Feedback",
         "Standard job portals act like black holes. Candidates never receive instant diagnostic scores, section improvements, or quantified bullet point suggestions.")
    ]

    for i, (title, desc) in enumerate(problems):
        row = i // 2
        col = i % 2
        l = Inches(0.8 + col * 5.95)
        t = Inches(2.0 + row * 2.5)
        add_card(s2, l, t, Inches(5.75), Inches(2.25))

        tb = s2.shapes.add_textbox(l + Inches(0.3), t + Inches(0.25), Inches(5.15), Inches(1.8))
        ptf = tb.text_frame
        ptf.word_wrap = True

        p1 = ptf.paragraphs[0]
        p1.text = f"0{i+1}.  {title}"
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_NAVY

        p2 = ptf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = COLOR_TEXT_MUTED
        p2.space_before = Pt(8)

    # =========================================================================
    # SLIDE 3: Proposed Solution - CampusPulse Ecosystem
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, COLOR_GRAY_BG)
    add_header(s3, "The Proposed Solution – CampusPulse Ecosystem")

    pillars = [
        ("Candidate Intelligence",
         "PulseAI™ Neural Engine",
         ["Instant binary document parsing (PDF, DOCX, TXT)",
          "5-Dimensional ATS scoring benchmark (0-100%)",
          "Extracted DNA: Verified skills, experience & location",
          "Side-by-side phrasing revisions to quantify impact"]),
        ("Recruiter Hub",
         "Verified Hiring Pipeline",
         ["Job publishing with required skills & compensation",
          "Automated tiered candidate affinity scoring",
          "1-Click applicant screening & resume inspection",
          "Elimination of unqualified cold applications"]),
        ("Autonomous Matching",
         "Precision Synergy Algorithm",
         ["Algorithmic matching across live database vacancies",
          "Dynamic skill overlap & missing gap analysis",
          "Instant 1-Click application directly to MongoDB",
          "Zero dummy data — 100% verified real job postings"])
    ]

    for i, (col_tag, col_title, points) in enumerate(pillars):
        l = Inches(0.8 + i * 3.98)
        t = Inches(2.0)
        add_card(s3, l, t, Inches(3.78), Inches(4.9))

        tb = s3.shapes.add_textbox(l + Inches(0.25), t + Inches(0.25), Inches(3.28), Inches(4.4))
        ptf = tb.text_frame
        ptf.word_wrap = True

        p0 = ptf.paragraphs[0]
        p0.text = col_tag.upper()
        p0.font.size = Pt(10)
        p0.font.bold = True
        p0.font.color.rgb = COLOR_TEAL

        p1 = ptf.add_paragraph()
        p1.text = col_title
        p1.font.size = Pt(15)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_NAVY
        p1.space_before = Pt(4)

        for pt in points:
            pp = ptf.add_paragraph()
            pp.text = f"•  {pt}"
            pp.font.size = Pt(11)
            pp.font.color.rgb = COLOR_TEXT_MUTED
            pp.space_before = Pt(8)

    # =========================================================================
    # SLIDE 4: System Architecture
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, COLOR_GRAY_BG)
    add_header(s4, "Multi-Tier System Architecture")

    tiers = [
        ("Presentation Layer (Client)", "React 18 + Vite SPA",
         "Tailwind CSS, Plus Jakarta Sans, Framer Motion animations, Lucide Iconography, Responsive Mobile & Desktop Layout."),
        ("Application & Security Layer", "Node.js + Express.js API",
         "JWT Stateless Authentication, Bcrypt Password Hashing, RBAC (Candidate/Company/Admin), Multer Binary Streaming, CORS."),
        ("AI Intelligence Engine", "Dataman Qwen 2.5 27B / Gemini",
         "Semantic document tokenization, regex taxonomy normalization, multi-dimensional score computation, JSON structuring."),
        ("Data Persistence Layer", "MongoDB Atlas (Cloud NoSQL)",
         "Normalized Schemas: Users, Companies, Jobs, Resumes, Applications, and AI Diagnostics with Mongoose ODM.")
    ]

    for i, (name, tech, detail) in enumerate(tiers):
        t = Inches(2.0 + i * 1.25)
        add_card(s4, Inches(0.8), t, Inches(11.733), Inches(1.1))

        tb = s4.shapes.add_textbox(Inches(1.1), t + Inches(0.12), Inches(11.1), Inches(0.85))
        ptf = tb.text_frame
        ptf.word_wrap = True

        p1 = ptf.paragraphs[0]
        p1.text = f"Tier 0{i+1}:  {name}  [{tech}]"
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_NAVY

        p2 = ptf.add_paragraph()
        p2.text = detail
        p2.font.size = Pt(11)
        p2.font.color.rgb = COLOR_TEXT_MUTED
        p2.space_before = Pt(3)

    # =========================================================================
    # SLIDE 5: PulseAI™ Neural Engine – How AI Resume Analysis Works
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, COLOR_GRAY_BG)
    add_header(s5, "PulseAI™ Neural Engine – Diagnostic Workflow")

    steps = [
        ("Step 1: Document Ingestion",
         "PDF / DOCX binary is streamed into memory via Multer. Text buffers are extracted without disk clutter using pdf-parse and docx parser."),
        ("Step 2: Semantic NLP Inspection",
         "Payload is processed by Qwen 2.5 27B / Gemini with an instruction-tuned system prompt enforcing strict structured JSON output schema."),
        ("Step 3: 5-D ATS Scoring",
         "Evaluates Structure (20%), Summary (15%), Skills Depth (25%), Quantified Experience (25%), and Readability (15%) into an aggregate 0-100 index."),
        ("Step 4: Phrasing Diff Generator",
         "Identifies passive bullets and suggests active, metric-driven phrasing (e.g., 'Built API' -> 'Architected REST API reducing latency by 35%').")
    ]

    for i, (st_title, st_desc) in enumerate(steps):
        row = i // 2
        col = i % 2
        l = Inches(0.8 + col * 5.95)
        t = Inches(2.0 + row * 2.5)
        add_card(s5, l, t, Inches(5.75), Inches(2.25))

        tb = s5.shapes.add_textbox(l + Inches(0.3), t + Inches(0.2), Inches(5.15), Inches(1.85))
        ptf = tb.text_frame
        ptf.word_wrap = True

        p1 = ptf.paragraphs[0]
        p1.text = st_title
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_NAVY

        p2 = ptf.add_paragraph()
        p2.text = st_desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = COLOR_TEXT_MUTED
        p2.space_before = Pt(6)

    # =========================================================================
    # SLIDE 6: Job-Candidate Matching Algorithm
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, COLOR_GRAY_BG)
    add_header(s6, "Precision Job Matching Algorithm")

    # Left card: Formula explanation
    add_card(s6, Inches(0.8), Inches(2.0), Inches(6.8), Inches(4.9))
    tb_l = s6.shapes.add_textbox(Inches(1.1), Inches(2.2), Inches(6.2), Inches(4.5))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    p.text = "Mathematical Affinity Formulation"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY

    formula_points = [
        ("Skill Match Ratio (Weight: 60%)",
         "Computes exact intersection between candidate verified skills and job required skills: S_ratio = |CandidateSkills ∩ JobSkills| / |JobSkills|"),
        ("Experience Fit Synergy (Weight: 25%)",
         "Compares candidate's verified years of experience with job seniority tier (Fresher vs Experienced) to reward optimal tenure alignment."),
        ("Baseline Context Score (Weight: 15%)",
         "Evaluates domain relevance, location compatibility, and overall ATS document structure."),
        ("Final Synergy Score",
         "MatchScore = (S_ratio * 60) + (Exp_Synergy * 25) + 15\nOutputs a clean 0-100% affinity rating with identified missing skill gaps.")
    ]

    for title, desc in formula_points:
        p_t = tf_l.add_paragraph()
        p_t.text = f"•  {title}"
        p_t.font.size = Pt(12)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_TEAL
        p_t.space_before = Pt(8)

        p_d = tf_l.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = COLOR_TEXT_MUTED
        p_d.space_before = Pt(2)

    # Right card: Key Highlights
    add_card(s6, Inches(7.8), Inches(2.0), Inches(4.733), Inches(4.9), bg_color=COLOR_NAVY, border_color=None)
    tb_r = s6.shapes.add_textbox(Inches(8.1), Inches(2.2), Inches(4.133), Inches(4.5))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True

    pr = tf_r.paragraphs[0]
    pr.text = "Why It Outperforms Keyword Search"
    pr.font.size = Pt(15)
    pr.font.bold = True
    pr.font.color.rgb = COLOR_WHITE

    highlights = [
        "100% Real Live MongoDB Openings (Zero dummy mock jobs).",
        "Categorized vacancies across Frontend, React, Backend, Data Science, and Marketing/MBA.",
        "Transparent explanations: Tells candidate exactly WHY they matched.",
        "Identifies missing skills so students know what technologies to learn next.",
        "Instant 1-Click application directly linked to candidate's parsed resume."
    ]

    for h in highlights:
        ph = tf_r.add_paragraph()
        ph.text = f"✔  {h}"
        ph.font.size = Pt(11)
        ph.font.color.rgb = COLOR_MINT_LIGHT
        ph.space_before = Pt(12)

    # =========================================================================
    # SLIDE 7: Key Features - Candidate Portal
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, COLOR_GRAY_BG)
    add_header(s7, "Candidate Experience & Portal Features")

    cand_features = [
        ("AI Resume Diagnostic Scanner",
         "Upload PDF/DOCX to get immediate ATS score gauge, structural benchmark, and verified profile breakdown."),
        ("Extracted Candidate DNA",
         "Auto-detects location, total years of experience, academic degree, and verified technical skills matrix."),
        ("Targeted Opportunities Hub",
         "Dynamic feed of verified jobs ranked by affinity score with instant 1-Click apply capability."),
        ("Interactive Diff Viewer",
         "Side-by-side comparison of original bullet points vs PulseAI quantifiable high-impact phrasing with 1-click copy."),
        ("Application Tracker",
         "Real-time pipeline tracking: Applied, Under Review, Shortlisted, Interview Scheduled, and Accepted status."),
        ("Profile & Document Locker",
         "Store multiple resumes, portfolio links, and personal credentials in a secure cloud document vault.")
    ]

    for i, (title, desc) in enumerate(cand_features):
        row = i // 3
        col = i % 3
        l = Inches(0.8 + col * 3.98)
        t = Inches(2.0 + row * 2.5)
        add_card(s7, l, t, Inches(3.78), Inches(2.25))

        tb = s7.shapes.add_textbox(l + Inches(0.2), t + Inches(0.2), Inches(3.38), Inches(1.85))
        ptf = tb.text_frame
        ptf.word_wrap = True

        p1 = ptf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_NAVY

        p2 = ptf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = COLOR_TEXT_MUTED
        p2.space_before = Pt(6)

    # =========================================================================
    # SLIDE 8: Key Features - Recruiter & Admin Portals
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, COLOR_GRAY_BG)
    add_header(s8, "Recruiter & Campus Admin Portals")

    features_admin = [
        ("Job Creation & Lifecycle Management",
         "Recruiters can publish roles with department, required technical stack, workplace mode (Remote/Onsite), and salary ranges."),
        ("Automated Applicant Fit Ranking",
         "Applicants appear auto-sorted by their PulseAI synergy score, allowing recruiters to review top 10% talent in seconds."),
        ("1-Click Candidate Evaluation",
         "Recruiters inspect parsed candidate DNA, matched vs missing skills, and original resume files without leaving the portal."),
        ("Application Stage Progression",
         "Move candidates seamlessly between 'Under Review', 'Shortlisted', 'Interviewing', and 'Hired' with instant notifications."),
        ("Platform Moderation & Security",
         "Admin controls to verify recruiting organizations, prevent fraudulent postings, and moderate candidate accounts."),
        ("Placement Analytics & Reporting",
         "Real-time institutional metrics: total active jobs, applicant volume by department, and recruitment conversion rates.")
    ]

    for i, (title, desc) in enumerate(features_admin):
        row = i // 3
        col = i % 3
        l = Inches(0.8 + col * 3.98)
        t = Inches(2.0 + row * 2.5)
        add_card(s8, l, t, Inches(3.78), Inches(2.25))

        tb = s8.shapes.add_textbox(l + Inches(0.2), t + Inches(0.2), Inches(3.38), Inches(1.85))
        ptf = tb.text_frame
        ptf.word_wrap = True

        p1 = ptf.paragraphs[0]
        p1.text = title
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_NAVY

        p2 = ptf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = COLOR_TEXT_MUTED
        p2.space_before = Pt(6)

    # =========================================================================
    # SLIDE 9: Technology Stack & Implementation Details
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, COLOR_GRAY_BG)
    add_header(s9, "Full-Stack Technology Architecture")

    tech_blocks = [
        ("Frontend Technology",
         "React 18 & Modern SPA",
         ["Vite build tooling for rapid HMR",
          "Tailwind CSS with Custom Design Tokens",
          "Plus Jakarta Sans Google Typography",
          "Framer Motion for fluid micro-interactions",
          "Lucide React unified iconography suite"]),
        ("Backend Services",
         "Node.js & Express.js REST API",
         ["Modular MVC directory architecture",
          "JWT stateless token authentication",
          "Bcrypt password hashing (10 salt rounds)",
          "Multer in-memory stream handling",
          "Standardized API error & response handlers"]),
        ("AI / ML Pipeline",
         "Dataman Qwen 2.5 27B / Gemini",
         ["Structured JSON prompt engineering",
          "Regex fallback parser for high resilience",
          "Custom user-agent & header authorization",
          "Deterministic ATS scoring benchmarks",
          "Semantic keyword synergy taxonomy"]),
        ("Database & DevOps",
         "MongoDB Atlas & Production Build",
         ["Cloud-hosted multi-node cluster",
          "Indexed foreign key relations",
          "Mongoose Schema validation rules",
          "Git version controlled & modular codebase",
          "Optimized static build chunking"])
    ]

    for i, (tag, title, bullets) in enumerate(tech_blocks):
        l = Inches(0.8 + i * 2.98)
        t = Inches(2.0)
        add_card(s9, l, t, Inches(2.8), Inches(4.9))

        tb = s9.shapes.add_textbox(l + Inches(0.18), t + Inches(0.2), Inches(2.44), Inches(4.5))
        ptf = tb.text_frame
        ptf.word_wrap = True

        p0 = ptf.paragraphs[0]
        p0.text = tag.upper()
        p0.font.size = Pt(9.5)
        p0.font.bold = True
        p0.font.color.rgb = COLOR_TEAL

        p1 = ptf.add_paragraph()
        p1.text = title
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_NAVY
        p1.space_before = Pt(3)

        for b in bullets:
            pb = ptf.add_paragraph()
            pb.text = f"• {b}"
            pb.font.size = Pt(10)
            pb.font.color.rgb = COLOR_TEXT_MUTED
            pb.space_before = Pt(6)

    # =========================================================================
    # SLIDE 10: Database Schema & Entity Relationships
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10, COLOR_GRAY_BG)
    add_header(s10, "Database Entity Relationship (MongoDB)")

    entities = [
        ("User Schema",
         ["_id: ObjectId (PK)",
          "fullName: String",
          "email: String (Unique, Indexed)",
          "passwordHash: String (Bcrypt)",
          "role: Enum ('candidate','company','admin')",
          "isEmailVerified: Boolean",
          "accountStatus: String"]),
        ("Company Schema",
         ["_id: ObjectId (PK)",
          "userId: ObjectId (Ref: User)",
          "companyName: String",
          "industry: String",
          "location: String",
          "website: String",
          "logo: String (URL)"]),
        ("Job Schema",
         ["_id: ObjectId (PK)",
          "companyId: ObjectId (Ref: Company)",
          "title: String",
          "description: String",
          "requiredSkills: Array[String]",
          "salaryRange: String",
          "workplaceMode: Enum",
          "status: Enum ('active','closed')"]),
        ("Application Schema",
         ["_id: ObjectId (PK)",
          "jobId: ObjectId (Ref: Job)",
          "candidateId: ObjectId (Ref: User)",
          "resumeId: ObjectId (Ref: Resume)",
          "matchScore: Number (0-100)",
          "status: Enum ('applied','shortlisted')",
          "appliedAt: Date"])
    ]

    for i, (model_name, fields) in enumerate(entities):
        l = Inches(0.8 + i * 2.98)
        t = Inches(2.0)
        add_card(s10, l, t, Inches(2.8), Inches(4.9))

        tb = s10.shapes.add_textbox(l + Inches(0.2), t + Inches(0.2), Inches(2.4), Inches(4.5))
        ptf = tb.text_frame
        ptf.word_wrap = True

        p1 = ptf.paragraphs[0]
        p1.text = model_name
        p1.font.size = Pt(14)
        p1.font.bold = True
        p1.font.color.rgb = COLOR_NAVY

        p_sub = ptf.add_paragraph()
        p_sub.text = "COLLECTION SCHEMA"
        p_sub.font.size = Pt(9)
        p_sub.font.bold = True
        p_sub.font.color.rgb = COLOR_TEAL

        for fld in fields:
            pf = ptf.add_paragraph()
            pf.text = fld
            pf.font.size = Pt(10)
            pf.font.color.rgb = COLOR_TEXT_MUTED
            pf.space_before = Pt(5)

    # =========================================================================
    # SLIDE 11: Real-World Testing & Results
    # =========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11, COLOR_GRAY_BG)
    add_header(s11, "Validation, Testing & Performance Results")

    metrics = [
        ("Sub-4s", "AI Processing Latency", "End-to-end binary parsing, neural LLM tokenization, and dynamic job matching executed in under 4 seconds."),
        ("100%", "Real Seeded Vacancies", "No dummy mock IDs. Tested across 18 real openings in Marketing, MBA, React, Node.js, and Data Science."),
        ("92%+", "Precision Synergy", "Tiered mathematical formula accurately scores affinity without false keyword inflation."),
        ("0 Security Breaches", "RBAC & Hash Security", "JWT authentication with bcrypt 10-salt hashing completely prevents unauthorized role elevation.")
    ]

    for i, (stat, title, desc) in enumerate(metrics):
        l = Inches(0.8 + i * 2.98)
        t = Inches(2.0)
        add_card(s11, l, t, Inches(2.8), Inches(4.9))

        tb = s11.shapes.add_textbox(l + Inches(0.2), t + Inches(0.3), Inches(2.4), Inches(4.3))
        ptf = tb.text_frame
        ptf.word_wrap = True

        p_stat = ptf.paragraphs[0]
        p_stat.text = stat
        p_stat.font.size = Pt(28)
        p_stat.font.bold = True
        p_stat.font.color.rgb = COLOR_TEAL

        p_t = ptf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = COLOR_NAVY
        p_t.space_before = Pt(6)

        p_d = ptf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(10.5)
        p_d.font.color.rgb = COLOR_TEXT_MUTED
        p_d.space_before = Pt(8)

    # =========================================================================
    # SLIDE 12: Future Scope & Conclusion
    # =========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12, COLOR_NAVY)

    # Header in white
    tb = s12.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.7), Inches(1.2))
    tf = tb.text_frame
    tf.word_wrap = True
    p0 = tf.paragraphs[0]
    p0.text = "LOOKING AHEAD • CONCLUSION".upper()
    p0.font.size = Pt(11)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_TEAL

    p1 = tf.add_paragraph()
    p1.text = "Future Roadmap & Project Conclusion"
    p1.font.size = Pt(26)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_WHITE
    p1.space_before = Pt(4)

    # Future scope card
    add_card(s12, Inches(0.8), Inches(2.2), Inches(5.7), Inches(4.5), bg_color=COLOR_NAVY_DARK, border_color=COLOR_TEAL)
    tb_f = s12.shapes.add_textbox(Inches(1.1), Inches(2.4), Inches(5.1), Inches(4.1))
    tf_f = tb_f.text_frame
    tf_f.word_wrap = True

    pf = tf_f.paragraphs[0]
    pf.text = "Future Roadmap Enhancements"
    pf.font.size = Pt(16)
    pf.font.bold = True
    pf.font.color.rgb = COLOR_WHITE

    future_items = [
        "AI Mock Video Interviewer: Real-time audio-visual evaluation using WebRTC and multimodal LLMs.",
        "Institutional TPO Portal: Dedicated dashboard for Training & Placement Officers to track college batch statistics.",
        "Adaptive Coding Assessments: Dynamic coding challenges tailored to candidate's missing skill gaps.",
        "Automated Offer Letter Generation: Digital signing workflow for campus placement compliance."
    ]

    for item in future_items:
        pi = tf_f.add_paragraph()
        pi.text = f"➤  {item}"
        pi.font.size = Pt(11)
        pi.font.color.rgb = COLOR_MINT_LIGHT
        pi.space_before = Pt(10)

    # Conclusion card
    add_card(s12, Inches(6.8), Inches(2.2), Inches(5.7), Inches(4.5), bg_color=COLOR_NAVY_DARK, border_color=COLOR_TEAL)
    tb_c = s12.shapes.add_textbox(Inches(7.1), Inches(2.4), Inches(5.1), Inches(4.1))
    tf_c = tb_c.text_frame
    tf_c.word_wrap = True

    pc = tf_c.paragraphs[0]
    pc.text = "Project Summary & Impact"
    pc.font.size = Pt(16)
    pc.font.bold = True
    pc.font.color.rgb = COLOR_WHITE

    concl_items = [
        "CampusPulse solves the critical problem of placement matching and resume rejection.",
        "Replaces black-box recruitment with explainable, transparent AI diagnostics.",
        "Empowers students with quantifiable feedback to build competitive, ATS-ready careers.",
        "Delivers end-to-end recruitment efficiency for corporate campus hiring teams.",
        "Thank you! Questions & Discussion are welcomed."
    ]

    for c in concl_items:
        pic = tf_c.add_paragraph()
        pic.text = f"✔  {c}"
        pic.font.size = Pt(11)
        pic.font.color.rgb = COLOR_MINT_LIGHT
        pic.space_before = Pt(10)

    # Save presentation
    output_path = "CampusPulse_College_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation successfully created at: {os.path.abspath(output_path)}")

if __name__ == "__main__":
    create_deck()

