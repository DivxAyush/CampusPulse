import { getIsConnected } from '../../config/db.js';

const ticketsStore = [];

// If connected to MongoDB, we could also use a Mongoose model, but fallback ensures 100% uptime
export const createTicket = async (req, res, next) => {
  try {
    const { name, email, role, category, priority, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, and message are required fields.',
      });
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const ticketId = `CP-${randomSuffix}`;

    const newTicket = {
      _id: `tkt_${Date.now()}`,
      ticketId,
      name,
      email,
      role: role || 'candidate',
      category: category || 'General Inquiry',
      priority: priority || 'normal',
      subject,
      message,
      status: 'open',
      assignedTo: 'Campus Plus Support Tier 1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolutionNotes: 'Ticket acknowledged and assigned to support specialist queue. Expected turnaround: under 2 hours.',
    };

    ticketsStore.unshift(newTicket);

    res.status(201).json({
      success: true,
      message: 'Support ticket submitted successfully.',
      data: newTicket,
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketStatus = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const ticket = ticketsStore.find(
      (t) => t.ticketId.toUpperCase() === ticketId.trim().toUpperCase()
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `No ticket found with reference ID "${ticketId}". Please verify your ticket code.`,
      });
    }

    res.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const listFaqs = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    const allFaqs = [
      {
        id: 'faq_01',
        category: 'candidates',
        question: 'How does the PulseAI Resume Analyzer calculate my score?',
        answer: 'Our PulseAI engine parses your PDF/DOCX file, extracts structured data (skills, achievements, work history, projects), and evaluates them against 20+ enterprise ATS parameters. Scores above 80 represent high recruiter readability.',
      },
      {
        id: 'faq_02',
        category: 'candidates',
        question: 'Is Campus Plus completely free for students and job seekers?',
        answer: 'Yes! All job applications, AI resume scoring, interactive bullet suggestions, and application tracking are 100% free with no subscription or hidden charges.',
      },
      {
        id: 'faq_03',
        category: 'candidates',
        question: 'Can I upload and manage multiple resume variants?',
        answer: 'Yes. You can upload up to 5 targeted resumes tailored for distinct specializations (e.g., Frontend React vs Backend Node.js vs Full Stack) and choose which version to attach per job application.',
      },
      {
        id: 'faq_04',
        category: 'companies',
        question: 'How quickly are jobs published and made visible to applicants?',
        answer: 'Verified recruiters can publish jobs immediately without manual admin approval bottlenecks. Postings go live across the platform and candidate search feeds within seconds.',
      },
      {
        id: 'faq_05',
        category: 'companies',
        question: 'How does the AI applicant match score work for recruiters?',
        answer: 'When a candidate submits their application, our algorithm calculates a semantic fit score (0-100%) by comparing the candidate profile and resume bullets against your job requirements, highlighting matching and missing skills.',
      },
      {
        id: 'faq_06',
        category: 'companies',
        question: 'Can recruiters schedule live Google Meet or Zoom interviews?',
        answer: 'Yes! From the Applicants page, recruiters can click "Schedule Interview", enter the interview date/time, meeting link, and notes. Candidates immediately receive notifications in their dashboard.',
      },
      {
        id: 'faq_07',
        category: 'ai_tools',
        question: 'What AI model powers Campus Plus resume diagnostics?',
        answer: 'Campus Plus is powered by PulseAI—our advanced contextual intelligence engine configured with high-performance neural parameters to perform deep resume parsing, bullet rewriting, and ATS diagnostic evaluations.',
      },
      {
        id: 'faq_08',
        category: 'security',
        question: 'How are my personal data and resume files safeguarded?',
        answer: 'All uploaded resume files are stored on secure Cloudinary servers with signed URLs. We strictly comply with modern data privacy standards and never sell candidate data to third-party brokers.',
      },
    ];

    let filtered = allFaqs;

    if (category && category !== 'all') {
      filtered = filtered.filter((f) => f.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
};
