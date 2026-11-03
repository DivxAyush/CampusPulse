import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../modules/users/user.model.js';
import { Candidate } from '../modules/candidates/candidate.model.js';
import { Company } from '../modules/companies/company.model.js';
import { Job } from '../modules/jobs/job.model.js';
import { Application } from '../modules/applications/application.model.js';
import { Resume } from '../modules/resumes/resume.model.js';
import { ResumeAnalysis } from '../modules/ai/resumeAnalysis.model.js';
import { Interview } from '../modules/interviews/interview.model.js';

export const seedDatabase = async () => {
  try {
    const existingUsersCount = await User.countDocuments();
    if (existingUsersCount > 0) {
      console.log('[Seed]: Database already contains data. Skipping seeding.');
      return;
    }

    console.log('[Seed]: Seeding realistic Campus Plus initial data...');

    const salt = await bcrypt.genSalt(10);
    const candidateHash = await bcrypt.hash('password123', salt);
    const recruiterHash = await bcrypt.hash('password123', salt);
    const adminHash = await bcrypt.hash('admin123', salt);

    // 1. Create Users
    const candidateUser = await User.create({
      fullName: 'Ayush Sharma',
      email: 'candidate@campusplus.com',
      phone: '+91 98765 43210',
      passwordHash: candidateHash,
      role: 'candidate',
      isEmailVerified: true,
      accountStatus: 'active',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });

    const recruiterUser = await User.create({
      fullName: 'Priya Verma',
      email: 'recruiter@nexus.com',
      phone: '+91 98111 22334',
      passwordHash: recruiterHash,
      role: 'company',
      isEmailVerified: true,
      accountStatus: 'active',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    });

    const recruiterUser2 = await User.create({
      fullName: 'Rohan Mehta',
      email: 'talent@finpulse.io',
      phone: '+91 98222 33445',
      passwordHash: recruiterHash,
      role: 'company',
      isEmailVerified: true,
      accountStatus: 'active',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    });

    const adminUser = await User.create({
      fullName: 'System Administrator',
      email: 'admin@campusplus.com',
      phone: '+91 99999 00000',
      passwordHash: adminHash,
      role: 'admin',
      isEmailVerified: true,
      accountStatus: 'active',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    });

    // 2. Candidate Profile
    const candidate = await Candidate.create({
      userId: candidateUser._id,
      headline: 'Full Stack Engineer | React, Node.js & Cloud Architectures',
      bio: 'Enthusiastic software engineer with a track record of architecting scalable web applications, optimizing API latency, and crafting accessible user interfaces.',
      location: 'Bengaluru, India',
      experienceLevel: 'junior',
      totalExperience: '1.5 years',
      expectedSalary: '14,00,000 INR',
      preferredLocations: ['Bengaluru', 'Hyderabad', 'Remote'],
      skills: ['React.js', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'Tailwind CSS', 'Redux Toolkit', 'REST APIs', 'Git', 'Docker'],
      education: [
        {
          institution: 'National Institute of Technology Karnataka',
          degree: 'Bachelor of Technology',
          fieldOfStudy: 'Computer Science and Engineering',
          startYear: '2020',
          endYear: '2024',
          grade: '8.85 CGPA',
        },
      ],
      experience: [
        {
          company: 'HyperDrive Technologies',
          role: 'Associate Software Engineer',
          location: 'Bengaluru, India',
          startDate: 'Jul 2024',
          endDate: 'Present',
          current: true,
          description: 'Engineered high-throughput GraphQL and REST endpoints serving 50,000 daily active users with sub-80ms p95 latencies.',
        },
      ],
      projects: [
        {
          title: 'Campus Plus Recruitment Portal',
          description: 'Full stack recruitment marketplace featuring AI resume parsing, ATS scoring, and recruiter workflows.',
          link: 'https://github.com/ayush/campus-plus',
          techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
        },
      ],
      certifications: [
        {
          name: 'AWS Certified Solutions Architect Associate',
          issuer: 'Amazon Web Services',
          issueDate: '2023',
          credentialUrl: 'https://aws.amazon.com',
        },
      ],
      profileCompletion: 92,
    });

    // 3. Companies
    const nexusCompany = await Company.create({
      userId: recruiterUser._id,
      companyName: 'Nexus Cloud Systems',
      slug: 'nexus-cloud-systems',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      website: 'https://nexuscloud.io',
      industry: 'Enterprise Cloud & DevOps',
      companySize: '250-500 employees',
      companyType: 'Product',
      foundedYear: '2019',
      description: 'Nexus Cloud Systems builds next-generation Kubernetes orchestration platforms and developer productivity infrastructure for enterprise teams.',
      headquarters: 'Bengaluru, India',
      contactEmail: 'careers@nexuscloud.io',
      contactPhone: '+91 80 4123 4567',
      isVerified: true,
      isActive: true,
    });

    const finpulseCompany = await Company.create({
      userId: recruiterUser2._id,
      companyName: 'FinPulse Technologies',
      slug: 'finpulse-technologies',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      website: 'https://finpulse.tech',
      industry: 'Fintech & Digital Banking',
      companySize: '500-1000 employees',
      companyType: 'Fintech Unicorn',
      foundedYear: '2017',
      description: 'Powering automated algorithmic payments, fraud detection, and instant UPI cross-border settlements across Southeast Asia.',
      headquarters: 'Mumbai, India',
      contactEmail: 'talent@finpulse.tech',
      contactPhone: '+91 22 6123 9999',
      isVerified: true,
      isActive: true,
    });

    // 4. Jobs
    const jobsData = [
      {
        companyId: nexusCompany._id,
        title: 'Senior Frontend Engineer (React & TypeScript)',
        slug: 'senior-frontend-engineer-react-nexus-01',
        description: 'Join our core platform frontend team to design and build our flagship cloud governance dashboard. You will own architecture, design system consistency, and end-to-end user experience.',
        responsibilities: [
          'Architect and maintain mission-critical React web applications with complex state workflows',
          'Collaborate with UI/UX designers to translate Figma design systems into reusable components',
          'Conduct comprehensive code reviews and mentor junior engineering team members',
          'Profile browser performance and drive Web Vital metrics toward 99th percentile',
        ],
        requirements: [
          '3+ years of professional experience building enterprise web applications with React',
          'Deep proficiency in modern JavaScript, HTML5 semantic elements, and Tailwind CSS',
          'Demonstrated experience with state management libraries (Redux Toolkit, Zustand, or TanStack Query)',
          'Familiarity with CI/CD deployment pipelines, automated testing (Jest, Playwright), and Git',
        ],
        requiredSkills: ['React.js', 'JavaScript', 'Tailwind CSS', 'Redux Toolkit', 'REST APIs'],
        preferredSkills: ['TypeScript', 'Docker', 'GraphQL', 'Next.js'],
        experience: '2-5 years',
        salary: { min: 1400000, max: 2400000, currency: 'INR', period: 'per annum', isDisclosed: true },
        jobType: 'full-time',
        workMode: 'hybrid',
        location: 'Bengaluru, India',
        education: "Bachelor's Degree in Computer Science, IT, or equivalent practical experience",
        openings: 3,
        status: 'published',
        viewsCount: 342,
        applicantsCount: 18,
      },
      {
        companyId: nexusCompany._id,
        title: 'Backend Systems Developer (Node.js & Microservices)',
        slug: 'backend-systems-developer-nodejs-nexus-02',
        description: 'We are seeking an experienced Node.js engineer to build scalable distributed backend services, high-throughput message streams, and robust security integrations.',
        responsibilities: [
          'Design and maintain fault-tolerant REST and gRPC microservices in Node.js & Express',
          'Optimize database queries and schema designs across MongoDB and Redis cache clusters',
          'Implement OAuth2, JWT authentication, and fine-grained role-based access control',
          'Participate in on-call rotation and improve service observability with OpenTelemetry',
        ],
        requirements: [
          '2+ years of backend engineering experience with Node.js, Express, and NoSQL databases',
          'Strong understanding of async paradigms, event-driven design, and API rate limiting',
          'Working knowledge of containerization using Docker and Docker Compose',
        ],
        requiredSkills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git'],
        preferredSkills: ['Redis', 'Docker', 'AWS', 'Microservices'],
        experience: '1-3 years',
        salary: { min: 1200000, max: 2000000, currency: 'INR', period: 'per annum', isDisclosed: true },
        jobType: 'full-time',
        workMode: 'remote',
        location: 'Remote (India)',
        education: "Bachelor's Degree in Engineering or MCA",
        openings: 2,
        status: 'published',
        viewsCount: 280,
        applicantsCount: 12,
      },
      {
        companyId: finpulseCompany._id,
        title: 'Full Stack Engineer (React, Node & Fintech API)',
        slug: 'full-stack-engineer-finpulse-03',
        description: 'FinPulse is hiring a Full Stack Engineer to lead new payment gateway integrations, instant settlement dashboards, and fraud analytics consoles.',
        responsibilities: [
          'Build end-to-end features spanning React frontend consoles and Node.js microservices',
          'Integrate banking APIs and Webhooks with idempotent transaction handling',
          'Ensure strict compliance with financial security standards and data encryption',
        ],
        requirements: [
          'Proficiency with full stack JavaScript development (React, Node.js, MongoDB/PostgreSQL)',
          'Experience building responsive, mobile-first dashboards with clean CSS/Tailwind',
          'Strong problem-solving ability and grasp of data structures and algorithms',
        ],
        requiredSkills: ['React.js', 'Node.js', 'MongoDB', 'JavaScript', 'Tailwind CSS'],
        preferredSkills: ['PostgreSQL', 'Docker', 'Stripe API', 'Kafka'],
        experience: '0-2 years',
        salary: { min: 1000000, max: 1800000, currency: 'INR', period: 'per annum', isDisclosed: true },
        jobType: 'full-time',
        workMode: 'hybrid',
        location: 'Mumbai, India',
        education: "B.Tech / B.E. in Computer Science or related degree",
        openings: 4,
        status: 'published',
        viewsCount: 410,
        applicantsCount: 29,
      },
      {
        companyId: finpulseCompany._id,
        title: 'Software Development Engineer Intern (Frontend)',
        slug: 'sde-intern-frontend-finpulse-04',
        description: 'Kickstart your engineering career with FinPulse. As an SDE Intern, you will work side-by-side with senior developers to ship real-world customer-facing UI features.',
        responsibilities: [
          'Develop reusable UI components adhering strictly to design guidelines',
          'Write unit and integration tests using Vitest and React Testing Library',
          'Participate in daily standups, sprint planning, and design reviews',
        ],
        requirements: [
          'Strong foundation in JavaScript, React, and CSS fundamentals',
          'Familiarity with Git version control and collaborative workflows',
          'Eagerness to learn production engineering standards',
        ],
        requiredSkills: ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
        preferredSkills: ['Tailwind CSS', 'Redux'],
        experience: '0-1 years',
        salary: { min: 360000, max: 600000, currency: 'INR', period: 'per annum', isDisclosed: true },
        jobType: 'internship',
        workMode: 'on-site',
        location: 'Mumbai, India',
        education: 'Enrolled in or completed B.Tech / BCA / MCA in 2024 or 2025',
        openings: 5,
        status: 'published',
        viewsCount: 620,
        applicantsCount: 54,
      },
    ];

    const createdJobs = await Job.insertMany(jobsData);

    // 5. Sample Resume
    const resume = await Resume.create({
      candidateId: candidate._id,
      fileName: 'Ayush_Sharma_FullStack_Resume.pdf',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      publicId: 'campusplus/resumes/sample-resume-01',
      fileType: 'application/pdf',
      fileSize: 184520,
      version: 1,
      isPrimary: true,
      parsingStatus: 'completed',
    });

    // 6. Resume Analysis record
    await ResumeAnalysis.create({
      resumeId: resume._id,
      candidateId: candidate._id,
      overallScore: 89,
      extractedData: {
        name: 'Ayush Sharma',
        email: 'candidate@campusplus.com',
        phone: '+91 98765 43210',
        summary: 'Performance-driven Full Stack Engineer with expertise in React 18, Node.js microservices, and MongoDB Atlas. Proven track record of architecting scalable web applications and reducing latency by 32%.',
        skills: candidate.skills,
        education: candidate.education,
        experience: candidate.experience,
        projects: candidate.projects,
        certifications: candidate.certifications,
      },
      analysis: {
        structureScore: 92,
        summaryScore: 85,
        skillsScore: 90,
        experienceScore: 87,
        readabilityScore: 94,
      },
      strengths: [
        'Comprehensive alignment with modern web standards (React 18, Node.js, Tailwind CSS)',
        'Clear distinction of quantifiable metrics in project bullet points',
        'Strong academic background with 8.85 CGPA from a premier institute',
        'Demonstrated cloud and containerization awareness (AWS, Docker)',
      ],
      weaknesses: [
        'Could include more details on automated unit testing frameworks (Jest, Vitest)',
        'Professional summary could detail specific industry domain knowledge',
      ],
      missingSections: [
        'Open Source Contributions',
        'Public Technical Writing / Articles',
      ],
      careerRecommendations: [
        'Ideal candidate for Full Stack Developer & Frontend Engineer roles',
        'Target product tech companies and high-growth fintech startups',
        'Highlight API latency optimizations during technical rounds',
      ],
      suggestions: [
        {
          section: 'Professional Summary',
          original: 'Enthusiastic software engineer with a track record of architecting scalable web applications.',
          improved: 'Performance-focused Full Stack Engineer specializing in React, Node.js, and cloud architectures, with a track record of architecting web apps serving 50k+ active users.',
          reason: 'Quantifies application scale and highlights architectural leadership.',
        },
        {
          section: 'Work Experience',
          original: 'Engineered high-throughput GraphQL and REST endpoints.',
          improved: 'Engineered high-throughput GraphQL and REST endpoints serving 50,000 daily active users with sub-80ms p95 latencies, improving throughput by 40%.',
          reason: 'Specifies concrete p95 latency benchmarks and overall throughput gains.',
        },
      ],
      model: 'gemini-1.5-flash',
    });

    // 7. Applications
    const app1 = await Application.create({
      jobId: createdJobs[0]._id,
      candidateId: candidate._id,
      companyId: nexusCompany._id,
      resumeId: resume._id,
      coverLetter: 'I am excited to apply for the Senior Frontend Engineer position at Nexus Cloud Systems. With extensive React and Tailwind expertise, I look forward to contributing to your cloud platform.',
      status: 'interview_scheduled',
      aiMatch: {
        overallScore: 94,
        matchedSkills: ['React.js', 'JavaScript', 'Tailwind CSS', 'Redux Toolkit', 'REST APIs'],
        missingSkills: ['TypeScript', 'GraphQL'],
        explanation: 'Exceptional skill alignment. Candidate matches 100% of required core skills and brings strong state management experience.',
      },
      recruiterNotes: 'Top-tier candidate. Strong portfolio and clean project code. Moving to technical interview.',
    });

    const app2 = await Application.create({
      jobId: createdJobs[2]._id,
      candidateId: candidate._id,
      companyId: finpulseCompany._id,
      resumeId: resume._id,
      coverLetter: 'Applying for the Full Stack Engineer role at FinPulse. Eager to build robust fintech experiences.',
      status: 'shortlisted',
      aiMatch: {
        overallScore: 88,
        matchedSkills: ['React.js', 'Node.js', 'MongoDB', 'JavaScript', 'Tailwind CSS'],
        missingSkills: ['Kafka', 'Stripe API'],
        explanation: 'Strong match across the entire MERN stack. Ready for initial screening.',
      },
    });

    // 8. Interview
    await Interview.create({
      applicationId: app1._id,
      candidateId: candidate._id,
      companyId: nexusCompany._id,
      jobId: createdJobs[0]._id,
      roundName: 'Technical Round 1: React Architecture & Live Coding',
      scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      mode: 'video',
      meetingLink: 'https://meet.google.com/cmp-nexus-intv',
      interviewerName: 'Priya Verma (Engineering Lead)',
      notes: 'Prepare to discuss component design systems and state architecture.',
      status: 'scheduled',
    });

    console.log('[Seed]: Successfully seeded database with realistic Campus Plus portal data!');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
};
