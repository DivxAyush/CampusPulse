import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../backend/.env') });

const run = async () => {
  const { connectDB } = await import('../../../backend/src/config/db.js');
  await connectDB();

  const { User } = await import('../../../backend/src/modules/users/user.model.js');
  const { Company } = await import('../../../backend/src/modules/companies/company.model.js');
  const { Job } = await import('../../../backend/src/modules/jobs/job.model.js');

  console.log('--- Connected to MongoDB Atlas. Seeding real recruiters and jobs ---');

  const salt = await bcrypt.genSalt(10);
  const commonPasswordHash = await bcrypt.hash('Elephant9k$', salt);
  const adminPasswordHash = await bcrypt.hash('admin@123', salt);

  // 0. Dedicated Admin: CampusPulse Administrator (admin@campuspulse.com)
  let adminUser = await User.findOne({ email: 'admin@campuspulse.com' });
  if (adminUser) {
    adminUser.passwordHash = adminPasswordHash;
    adminUser.role = 'admin';
    adminUser.fullName = 'CampusPulse Administrator';
    adminUser.isEmailVerified = true;
    adminUser.accountStatus = 'active';
    await adminUser.save();
    console.log('Updated admin user admin@campuspulse.com with password admin@123');
  } else {
    adminUser = await User.create({
      fullName: 'CampusPulse Administrator',
      email: 'admin@campuspulse.com',
      phone: '',
      passwordHash: adminPasswordHash,
      role: 'admin',
      isEmailVerified: true,
      accountStatus: 'active',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    });
    console.log('Created admin user admin@campuspulse.com with password admin@123');
  }

  // 1. Recruiter: Ayush Kumar (ayush21929a@gmail.com)
  let ayushUser = await User.findOne({ email: 'ayush21929a@gmail.com' });
  if (ayushUser) {
    ayushUser.passwordHash = commonPasswordHash;
    ayushUser.role = 'company';
    ayushUser.fullName = 'Ayush Kumar';
    ayushUser.isEmailVerified = true;
    ayushUser.accountStatus = 'active';
    await ayushUser.save();
    console.log('Updated existing user ayush21929a@gmail.com to company recruiter with password Elephant9k$');
  } else {
    ayushUser = await User.create({
      fullName: 'Ayush Kumar',
      email: 'ayush21929a@gmail.com',
      phone: '6387689391',
      passwordHash: commonPasswordHash,
      role: 'company',
      isEmailVerified: true,
      accountStatus: 'active',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    });
    console.log('Created user ayush21929a@gmail.com');
  }

  let ayushCompany = await Company.findOne({ userId: ayushUser._id });
  if (!ayushCompany) {
    ayushCompany = await Company.create({
      userId: ayushUser._id,
      companyName: 'PulseTech Innovations',
      slug: 'pulsetech-innovations',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop&q=80',
      website: 'https://pulsetech.ai',
      industry: 'AI Products & Cloud Solutions',
      companySize: '100-250 employees',
      companyType: 'Product',
      foundedYear: '2021',
      description: 'PulseTech Innovations develops high-throughput talent intelligence systems, autonomous AI agents, and enterprise web solutions for high-velocity tech startups.',
      headquarters: 'Bengaluru, India',
      contactEmail: 'ayush21929a@gmail.com',
      contactPhone: '6387689391',
      isVerified: true,
      isActive: true,
    });
    console.log('Created PulseTech Innovations for Ayush Kumar');
  }

  // 2. Recruiter: Neha Singhania (GrowthOrbit Digital)
  let nehaUser = await User.findOne({ email: 'neha.singhania@growthorbit.in' });
  if (!nehaUser) {
    nehaUser = await User.create({
      fullName: 'Neha Singhania',
      email: 'neha.singhania@growthorbit.in',
      phone: '9820154321',
      passwordHash: commonPasswordHash,
      role: 'company',
      isEmailVerified: true,
      accountStatus: 'active',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
    });
  }
  let nehaCompany = await Company.findOne({ userId: nehaUser._id });
  if (!nehaCompany) {
    nehaCompany = await Company.create({
      userId: nehaUser._id,
      companyName: 'GrowthOrbit Media & Marketing',
      slug: 'growthorbit-media',
      logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=400&fit=crop&q=80',
      website: 'https://growthorbit.in',
      industry: 'Digital Marketing & Growth Media',
      companySize: '50-150 employees',
      companyType: 'Agency / Consulting',
      foundedYear: '2019',
      description: 'Leading digital growth engine managing omnichannel performance marketing, SEO, brand positioning, and demand generation for top consumer brands in India.',
      headquarters: 'Mumbai, India',
      contactEmail: 'neha.singhania@growthorbit.in',
      contactPhone: '9820154321',
      isVerified: true,
      isActive: true,
    });
  }

  // 3. Recruiter: Vikramaditya Rao (NexusCloud Systems)
  let vikramUser = await User.findOne({ email: 'vikram.rao@nexuscloud.io' });
  if (!vikramUser) {
    vikramUser = await User.create({
      fullName: 'Vikramaditya Rao',
      email: 'vikram.rao@nexuscloud.io',
      phone: '9845012345',
      passwordHash: commonPasswordHash,
      role: 'company',
      isEmailVerified: true,
      accountStatus: 'active',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    });
  }
  let vikramCompany = await Company.findOne({ userId: vikramUser._id });
  if (!vikramCompany) {
    vikramCompany = await Company.create({
      userId: vikramUser._id,
      companyName: 'NexusCloud Systems',
      slug: 'nexuscloud-systems',
      logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&h=150&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=400&fit=crop&q=80',
      website: 'https://nexuscloud.io',
      industry: 'Enterprise Software & Cloud Platforms',
      companySize: '250-500 employees',
      companyType: 'Product',
      foundedYear: '2018',
      description: 'NexusCloud engineers ultra-scalable cloud architectures, distributed microservices, and reactive full-stack web applications for global financial institutions.',
      headquarters: 'Bengaluru, India',
      contactEmail: 'vikram.rao@nexuscloud.io',
      contactPhone: '9845012345',
      isVerified: true,
      isActive: true,
    });
  }

  // 4. Recruiter: Dr. Ananya Sen (DataPeak Analytics)
  let ananyaUser = await User.findOne({ email: 'ananya.sen@datapeak.ai' });
  if (!ananyaUser) {
    ananyaUser = await User.create({
      fullName: 'Dr. Ananya Sen',
      email: 'ananya.sen@datapeak.ai',
      phone: '9910234567',
      passwordHash: commonPasswordHash,
      role: 'company',
      isEmailVerified: true,
      accountStatus: 'active',
      profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    });
  }
  let ananyaCompany = await Company.findOne({ userId: ananyaUser._id });
  if (!ananyaCompany) {
    ananyaCompany = await Company.create({
      userId: ananyaUser._id,
      companyName: 'DataPeak AI & Analytics',
      slug: 'datapeak-ai',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=400&fit=crop&q=80',
      website: 'https://datapeak.ai',
      industry: 'Artificial Intelligence & Predictive Analytics',
      companySize: '100-200 employees',
      companyType: 'Product',
      foundedYear: '2020',
      description: 'DataPeak delivers automated predictive intelligence, real-time data pipelines, and machine learning models for retail, logistics, and healthcare enterprises.',
      headquarters: 'Gurugram, India',
      contactEmail: 'ananya.sen@datapeak.ai',
      contactPhone: '9910234567',
      isVerified: true,
      isActive: true,
    });
  }

  // Create a dedicated Candidate account for testing candidate logins:
  let testCandidate = await User.findOne({ email: 'candidate.ayush@gmail.com' });
  if (!testCandidate) {
    testCandidate = await User.create({
      fullName: 'Ayush Candidate',
      email: 'candidate.ayush@gmail.com',
      phone: '6387689391',
      passwordHash: commonPasswordHash,
      role: 'candidate',
      isEmailVerified: true,
      accountStatus: 'active',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    });
    const { Candidate } = await import('../../../backend/src/modules/candidates/candidate.model.js');
    await Candidate.create({
      userId: testCandidate._id,
      headline: 'Software Engineer & Full Stack Developer',
      location: 'Bengaluru, India',
      skills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'REST APIs', 'Git'],
      experienceLevel: 'mid',
      totalExperience: '2 years',
      profileCompletion: 80,
    });
    console.log('Created dedicated candidate account: candidate.ayush@gmail.com (Password: Elephant9k$)');
  }

  // Now, create the 18 Real Jobs
  // Clean existing jobs if any to prevent duplicate slugs
  await Job.deleteMany({});
  console.log('Cleared previous jobs collection.');

  const jobsData = [
    // --- 1. MARKETING & MBA / BUSINESS DEVELOPMENT (8 Positions) ---
    {
      companyId: ayushCompany._id,
      title: 'Senior Performance Marketing Lead',
      slug: 'senior-performance-marketing-lead-bengaluru',
      description: 'We are seeking an analytical and growth-obsessed Senior Performance Marketing Lead to manage seven-figure monthly media budgets across Meta, Google Ads, and programmatic networks to drive scalable user acquisition and ROAS.',
      responsibilities: [
        'Architect, launch, and optimize high-converting paid acquisition campaigns on Meta Ads Manager, Google Search, Performance Max, and YouTube.',
        'Conduct rigorous multivariate creative A/B testing on ad copies, visual creatives, video hooks, and landing page funnels.',
        'Collaborate with data and analytics teams to track CAC, LTV, ROAS, and cohort retention through GA4 and Mixpanel.',
        'Formulate bidding strategies, budget allocation, and audience segmentation to scale acquisition efficiency by 30%+.'
      ],
      requirements: [
        'Bachelor’s or Master’s in Marketing, Business Administration, or related discipline.',
        '3-5 years of proven hands-on track record managing paid performance ad spend.',
        'In-depth mastery of Google Ads, Meta Ads Manager, GA4, and conversion rate optimization (CRO).',
        'Strong numerical acumen, data-driven mindset, and proficiency with Excel/Sheets cohort analysis.'
      ],
      requiredSkills: ['Performance Marketing', 'Google Ads', 'Meta Ads', 'Google Analytics 4', 'ROAS Optimization'],
      preferredSkills: ['Mixpanel', 'Conversion Rate Optimization', 'Copywriting', 'AppsFlyer'],
      experience: '2-5 years',
      salary: { min: 1200000, max: 2000000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Bengaluru, India',
      education: 'MBA / BBA / Graduate in Marketing or Business',
      openings: 2,
      status: 'published',
      visibility: 'public',
      viewsCount: 142,
    },
    {
      companyId: nehaCompany._id,
      title: 'Digital Marketing & Growth Specialist',
      slug: 'digital-marketing-growth-specialist-mumbai',
      description: 'GrowthOrbit is looking for a versatile Digital Marketing Specialist to lead multi-channel acquisition, customer journey automation, and paid social campaigns for high-growth DTC and consumer tech brands.',
      responsibilities: [
        'Plan and execute end-to-end digital marketing campaigns across paid search, social media, email marketing, and influencer channels.',
        'Set up automated email drip sequences, retention workflows, and WhatsApp marketing campaigns using tools like Klaviyo and WebEngage.',
        'Analyze campaign performance data weekly, identifying conversion bottlenecks and scaling top-performing assets.',
        'Work closely with graphic designers and copywriters to produce high-impact thumb-stopping ad creatives.'
      ],
      requirements: [
        '2-4 years of experience in digital marketing, paid social, or growth hacking.',
        'Expertise in Facebook Ads, Google Ads, SEO basics, and email marketing workflows.',
        'Strong copywriting capabilities with an understanding of consumer psychology.',
        'Familiarity with Google Tag Manager, pixels, and web analytics tools.'
      ],
      requiredSkills: ['Digital Marketing', 'Social Media Marketing', 'Google Ads', 'Email Marketing', 'Content Strategy'],
      preferredSkills: ['Klaviyo', 'WebEngage', 'SEO', 'HubSpot'],
      experience: '1-3 years',
      salary: { min: 800000, max: 1400000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Mumbai, India',
      education: 'Bachelor’s Degree in Marketing, Mass Media, or Business',
      openings: 3,
      status: 'published',
      visibility: 'public',
      viewsCount: 98,
    },
    {
      companyId: ayushCompany._id,
      title: 'Business Development Manager (MBA / MBD)',
      slug: 'business-development-manager-mba-bengaluru',
      description: 'PulseTech is hiring an energetic Business Development Manager with an MBA background to drive strategic B2B enterprise partnerships, lead pipeline qualification, and negotiate contract agreements.',
      responsibilities: [
        'Identify and prospect high-potential enterprise tech clients, hiring heads, and CTOs across Tier-1 IT services and tech startups.',
        'Lead solution presentations, pitch commercial proposals, and negotiate contract terms with corporate CXOs.',
        'Collaborate with product and delivery teams to ensure customer onboarding and retention SLA standards.',
        'Achieve quarterly ARR revenue quotas and expand existing account value through strategic upsells.'
      ],
      requirements: [
        'MBA in Marketing, Sales, or International Business from a recognized institution.',
        '1-3 years of proven experience in B2B corporate sales, SaaS business development, or institutional partnerships.',
        'Exceptional verbal presentation, consultative storytelling, and relationship management capabilities.',
        'Proficiency in CRM tools like Salesforce, HubSpot, or Zoho CRM.'
      ],
      requiredSkills: ['Business Development', 'B2B Sales', 'Client Acquisition', 'Negotiation', 'CRM'],
      preferredSkills: ['Salesforce', 'Enterprise Sales', 'SaaS', 'Account Management'],
      experience: '1-3 years',
      salary: { min: 1000000, max: 1800000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'on-site',
      location: 'Bengaluru, India',
      education: 'MBA in Marketing / Sales / General Management',
      openings: 2,
      status: 'published',
      visibility: 'public',
      viewsCount: 164,
    },
    {
      companyId: nehaCompany._id,
      title: 'Brand Strategist & Content Marketing Lead',
      slug: 'brand-strategist-content-marketing-lead-mumbai',
      description: 'Craft compelling brand narratives, omni-channel editorial calendars, and viral brand marketing initiatives for India’s fastest-growing lifestyle and tech companies.',
      responsibilities: [
        'Develop brand positioning frameworks, messaging pillars, and creative campaign themes across LinkedIn, Instagram, and YouTube.',
        'Direct content creation workflows: thought leadership blogs, whitepapers, social threads, case studies, and corporate podcasts.',
        'Coordinate with external influencers, PR agencies, and media publications for brand features.',
        'Measure and report organic brand awareness lift, audience sentiment, and social engagement metrics.'
      ],
      requirements: [
        '2-4 years in brand marketing, advertising agency, or digital content strategy.',
        'Outstanding written and verbal communication with a distinctive brand tone.',
        'Proven portfolio of successful brand campaigns or published thought leadership content.',
        'Familiarity with Figma, Canva, and social scheduling suites.'
      ],
      requiredSkills: ['Brand Strategy', 'Content Marketing', 'Copywriting', 'Social Media Strategy', 'PR'],
      preferredSkills: ['Influencer Marketing', 'Figma', 'SEO Content', 'Podcasting'],
      experience: '2-4 years',
      salary: { min: 900000, max: 1500000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Mumbai, India',
      education: 'Master’s / Bachelor’s in Mass Communication, Media, or Marketing',
      openings: 1,
      status: 'published',
      visibility: 'public',
      viewsCount: 88,
    },
    {
      companyId: nehaCompany._id,
      title: 'SEO & Organic Growth Strategist',
      slug: 'seo-organic-growth-strategist-remote',
      description: 'Lead technical SEO audits, programmatic keyword architecture, and backlink outreach to rank top-tier tech portals on Page 1 of Google globally.',
      responsibilities: [
        'Conduct deep technical SEO audits (Core Web Vitals, crawl budget, schema markup, and site structure).',
        'Build high-intent keyword clustering strategies to generate thousands of daily inbound organic visits.',
        'Oversee high-authority digital PR link building and editorial outreach initiatives.',
        'Track rankings, clicks, and impressions via Google Search Console, Ahrefs, and Semrush.'
      ],
      requirements: [
        '2-4 years of experience as an SEO Specialist or Organic Growth Manager.',
        'Hands-on expertise with Ahrefs, Semrush, Screaming Frog, and Google Search Console.',
        'Strong knowledge of HTML, structured data, canonicalization, and technical crawl optimization.'
      ],
      requiredSkills: ['SEO', 'Technical SEO', 'Keyword Research', 'Google Search Console', 'Ahrefs'],
      preferredSkills: ['Semrush', 'Link Building', 'Core Web Vitals', 'WordPress'],
      experience: '2-4 years',
      salary: { min: 700000, max: 1200000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'remote',
      location: 'Remote (India)',
      education: 'Graduate in IT, Marketing, or Business',
      openings: 2,
      status: 'published',
      visibility: 'public',
      viewsCount: 75,
    },
    {
      companyId: ayushCompany._id,
      title: 'Product Marketing Manager (MBA / Tech)',
      slug: 'product-marketing-manager-mba-bengaluru',
      description: 'Own product launch go-to-market (GTM) execution, customer positioning, sales enablement decks, and feature adoption campaigns for enterprise AI products.',
      responsibilities: [
        'Define product messaging hierarchy, value propositions, and target customer personas.',
        'Spearhead quarterly product launches with coordinated PR, email drips, social announcements, and webinars.',
        'Produce high-converting sales collateral: battlecards, product demo scripts, customer case studies, and ROI calculators.',
        'Analyze product adoption telemetry to reduce onboarding churn and optimize user time-to-value.'
      ],
      requirements: [
        'MBA in Marketing / Product Management or equivalent experience.',
        '2-4 years experience in B2B SaaS or technology product marketing.',
        'Deep empathy for technical buyers with ability to distill complex features into crisp commercial value.'
      ],
      requiredSkills: ['Product Marketing', 'Go-To-Market (GTM)', 'Market Research', 'Competitive Analysis', 'Content Strategy'],
      preferredSkills: ['Sales Enablement', 'Customer Journey Mapping', 'Mixpanel', 'HubSpot'],
      experience: '2-5 years',
      salary: { min: 1400000, max: 2400000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Bengaluru, India',
      education: 'MBA in Marketing / Strategy / Product',
      openings: 1,
      status: 'published',
      visibility: 'public',
      viewsCount: 110,
    },
    {
      companyId: nehaCompany._id,
      title: 'Social Media & Community Associate',
      slug: 'social-media-community-associate-mumbai',
      description: 'Be the social voice of our brand across X (Twitter), LinkedIn, and Instagram. Engage with tech founders, run creative memes, and manage campus student ambassador circles.',
      responsibilities: [
        'Create and publish engaging daily social content calendars across Twitter/X, LinkedIn, and Instagram.',
        'Engage actively with industry conversations, trending topics, and community discussions.',
        'Manage community groups on Discord, Telegram, and WhatsApp, answering queries and sharing updates.',
        'Report monthly engagement analytics, follower velocity, and brand mention trends.'
      ],
      requirements: [
        '0-2 years experience in social media management, campus marketing, or community building.',
        'Keen eye for modern internet culture, tech trends, and clean visual aesthetics.',
        'Strong copywriting skills with rapid turnaround time.'
      ],
      requiredSkills: ['Social Media Marketing', 'Community Management', 'Content Creation', 'Copywriting', 'Canva'],
      preferredSkills: ['Figma', 'Discord Moderation', 'Video Editing', 'Twitter/X Growth'],
      experience: '0-2 years',
      salary: { min: 450000, max: 750000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Mumbai, India',
      education: 'Graduate in any discipline',
      openings: 3,
      status: 'published',
      visibility: 'public',
      viewsCount: 135,
    },
    {
      companyId: ayushCompany._id,
      title: 'Strategic Alliances & Partnership Associate',
      slug: 'strategic-alliances-partnership-associate-gurgaon',
      description: 'Identify, negotiate, and operationalize high-leverage partnerships with colleges, training institutes, corporate vendors, and technology aggregators.',
      responsibilities: [
        'Map potential educational and corporate partners across key tech hubs in India.',
        'Structure joint go-to-market programs, MoUs, and revenue-sharing affiliate agreements.',
        'Monitor partnership health metrics, partner-sourced lead quality, and monthly revenue targets.',
        'Coordinate with marketing and legal teams for MoU reviews and partner press releases.'
      ],
      requirements: [
        'MBA or Master’s in Business, Marketing, or Commercial Operations.',
        '1-3 years of partnership, business alliance, or account management experience.',
        'Polished contract negotiation and executive relationship stewardship.'
      ],
      requiredSkills: ['Strategic Partnerships', 'Business Development', 'Negotiation', 'Account Management', 'B2B Sales'],
      preferredSkills: ['Contract Review', 'SaaS Affiliates', 'Public Speaking', 'HubSpot'],
      experience: '1-3 years',
      salary: { min: 900000, max: 1600000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Gurugram, India',
      education: 'MBA in Marketing / Business Administration',
      openings: 2,
      status: 'published',
      visibility: 'public',
      viewsCount: 92,
    },

    // --- 2. REACT & FRONTEND ENGINEERING (3 Positions) ---
    {
      companyId: ayushCompany._id,
      title: 'Frontend React Developer (UI/UX Engineering)',
      slug: 'frontend-react-developer-ui-ux-bengaluru',
      description: 'Build responsive, accessible, and high-performance web applications using modern React 18, Next.js, and Tailwind CSS for enterprise recruitment platforms.',
      responsibilities: [
        'Develop pixel-perfect web interfaces from Figma designs using React, Tailwind CSS, and Framer Motion.',
        'Integrate client-side state management using Redux Toolkit and React Query for low-latency server sync.',
        'Optimize bundle size, code-splitting, lazy-loading, and Lighthouse Core Web Vitals to score 95+.',
        'Write robust component unit tests using Vitest, Jest, and React Testing Library.'
      ],
      requirements: [
        'Strong hands-on proficiency in JavaScript (ES6+), TypeScript, React, and CSS3 / Tailwind CSS.',
        '1-3 years of dedicated frontend engineering experience with modern SPA / SSR frameworks.',
        'Experience consuming RESTful microservices, handling JWT sessions, and file upload pipelines.',
        'Demonstrable understanding of web performance, browser rendering lifecycles, and responsive design.'
      ],
      requiredSkills: ['React', 'JavaScript', 'Tailwind CSS', 'Redux Toolkit', 'REST APIs', 'Git'],
      preferredSkills: ['TypeScript', 'Next.js', 'Framer Motion', 'Jest'],
      experience: '1-3 years',
      salary: { min: 800000, max: 1500000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Bengaluru, India',
      education: 'B.Tech / B.E. / BCA / MCA in Computer Science or related engineering field',
      openings: 2,
      status: 'published',
      visibility: 'public',
      viewsCount: 220,
    },
    {
      companyId: vikramCompany._id,
      title: 'Senior Frontend & Next.js Architect',
      slug: 'senior-frontend-nextjs-architect-remote',
      description: 'Architect modular micro-frontend ecosystems, high-scale SSR portals, and real-time dashboard visualizations for millions of concurrent users.',
      responsibilities: [
        'Architect maintainable frontend design systems and reusable component libraries in TypeScript and Next.js App Router.',
        'Implement real-time WebSocket feeds, chart visualizations (Chart.js / Recharts), and dynamic UI rendering.',
        'Establish automated CI/CD pipeline checks, bundle analysis, and accessibility (WCAG) compliance.',
        'Mentor junior frontend engineers through code reviews and architectural workshops.'
      ],
      requirements: [
        '3-6 years of professional frontend engineering experience with strong architectural ownership.',
        'Deep expertise in React, Next.js, TypeScript, State Management, and Node.js build tooling.',
        'Proven track record of optimizing client-side performance for high-traffic web applications.'
      ],
      requiredSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'WebSockets', 'REST APIs'],
      preferredSkills: ['GraphQL', 'Micro-frontends', 'CI/CD', 'Docker'],
      experience: '3-6 years',
      salary: { min: 1800000, max: 3000000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'remote',
      location: 'Remote (India)',
      education: 'B.Tech / B.E. / M.Tech in Computer Science or equivalent',
      openings: 1,
      status: 'published',
      visibility: 'public',
      viewsCount: 195,
    },
    {
      companyId: ayushCompany._id,
      title: 'React & Frontend Engineering Intern',
      slug: 'react-frontend-engineering-intern-bengaluru',
      description: 'Launch your engineering career with our fast-paced product engineering team. You will build interactive dashboards, refine candidate portal UX, and ship production code.',
      responsibilities: [
        'Build and style new reusable components in React and Tailwind CSS.',
        'Connect frontend views with Node.js REST API endpoints and manage form validations.',
        'Identify UI glitches, fix cross-browser compatibility issues, and assist in documentation.'
      ],
      requirements: [
        'Fresh graduate or final year student in B.Tech / BCA / MCA.',
        'Demonstrated skills in React, JavaScript, HTML5, and CSS3 through personal projects or prior internships.',
        'Active GitHub profile showcasing web projects with clean code commits.'
      ],
      requiredSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git'],
      preferredSkills: ['Tailwind CSS', 'Redux Toolkit', 'REST APIs'],
      experience: '0-1 years',
      salary: { min: 350000, max: 600000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'internship',
      workMode: 'hybrid',
      location: 'Bengaluru, India',
      education: 'B.Tech / BCA / B.Sc Computer Science',
      openings: 3,
      status: 'published',
      visibility: 'public',
      viewsCount: 310,
    },

    // --- 3. BACKEND SOFTWARE ENGINEERING (4 Positions) ---
    {
      companyId: vikramCompany._id,
      title: 'Backend Node.js & Cloud Platform Engineer',
      slug: 'backend-nodejs-cloud-engineer-bengaluru',
      description: 'Design and deploy robust RESTful APIs, distributed MongoDB clusters, and asynchronous queue consumers handling tens of thousands of requests per minute.',
      responsibilities: [
        'Architect scalable REST & GraphQL APIs using Node.js, Express, and TypeScript.',
        'Design optimized MongoDB schemas, indexing strategies, and caching layers with Redis.',
        'Implement resilient authentication, JWT token rotation, and role-based access control (RBAC).',
        'Deploy and monitor microservices on AWS (ECS, Lambda, S3) with Docker containerization.'
      ],
      requirements: [
        '2-4 years of backend development experience with Node.js, Express, and MongoDB / PostgreSQL.',
        'Solid foundation in system design, data structures, algorithms, and RESTful architectural principles.',
        'Experience with Redis caching, message brokers (RabbitMQ/Kafka), and containerization (Docker).'
      ],
      requiredSkills: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker', 'REST APIs'],
      preferredSkills: ['TypeScript', 'AWS', 'Kafka', 'Microservices', 'GraphQL'],
      experience: '2-4 years',
      salary: { min: 1200000, max: 2200000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Bengaluru, India',
      education: 'B.Tech / B.E. / M.Tech in Computer Science or Software Engineering',
      openings: 2,
      status: 'published',
      visibility: 'public',
      viewsCount: 185,
    },
    {
      companyId: vikramCompany._id,
      title: 'Python & FastAPI Backend Services Engineer',
      slug: 'python-fastapi-backend-engineer-pune',
      description: 'Build high-performance asynchronous API microservices, data ingest pipelines, and AI model serving gateways in Python, FastAPI, and PostgreSQL.',
      responsibilities: [
        'Develop lightning-fast async backend endpoints using Python 3.11+, FastAPI, and Pydantic.',
        'Maintain high-throughput PostgreSQL database connections with async SQLAlchemy and Alembic migrations.',
        'Integrate LLM gateways, streaming endpoints, and Celery background workers.',
        'Write automated Pytest suites and configure GitHub Actions CI/CD pipelines.'
      ],
      requirements: [
        '2-4 years of backend development experience in Python with FastAPI or Django.',
        'Strong database engineering skills with PostgreSQL / MySQL, query profiling, and index optimization.',
        'Hands-on experience with asynchronous I/O (asyncio), Docker, and cloud deployment.'
      ],
      requiredSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Git', 'REST APIs'],
      preferredSkills: ['Celery', 'Redis', 'AWS', 'Pytest', 'AsyncIO'],
      experience: '2-4 years',
      salary: { min: 1100000, max: 1900000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Pune, India',
      education: 'B.Tech / B.E. in Computer Science or related degree',
      openings: 2,
      status: 'published',
      visibility: 'public',
      viewsCount: 140,
    },
    {
      companyId: ayushCompany._id,
      title: 'Full Stack Engineer (MERN / TypeScript)',
      slug: 'full-stack-engineer-mern-typescript-noida',
      description: 'Own end-to-end features from database schema design in MongoDB to responsive React frontend components and production deployment.',
      responsibilities: [
        'Develop end-to-end features across our core recruitment web applications using the MERN stack.',
        'Build secure REST APIs in Express with input sanitization, rate limiting, and JWT authentication.',
        'Craft responsive, visually appealing user interfaces in React with Tailwind CSS.',
        'Participate in daily agile standups, sprint planning, and automated testing.'
      ],
      requirements: [
        '1-3 years of proven experience across both frontend (React) and backend (Node.js/Express).',
        'Strong proficiency in JavaScript, MongoDB, Express, React, Node.js, and Git.',
        'Ability to rapidly prototype and ship clean, bug-free production code.'
      ],
      requiredSkills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'REST APIs'],
      preferredSkills: ['TypeScript', 'Tailwind CSS', 'Docker', 'AWS'],
      experience: '1-3 years',
      salary: { min: 900000, max: 1600000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Noida, India',
      education: 'B.Tech / BCA / MCA in Computer Science',
      openings: 2,
      status: 'published',
      visibility: 'public',
      viewsCount: 175,
    },
    {
      companyId: vikramCompany._id,
      title: 'Java & Spring Boot Microservices Architect',
      slug: 'java-spring-boot-microservices-architect-gurgaon',
      description: 'Lead the architecture of enterprise-grade distributed banking and transaction processing systems built on Java 17, Spring Boot, Kafka, and Kubernetes.',
      responsibilities: [
        'Design resilient microservice contracts and event-driven architectures with Apache Kafka.',
        'Implement fault tolerance, circuit breakers (Resilience4j), and distributed tracing (OpenTelemetry).',
        'Optimize multi-tenant Oracle / PostgreSQL databases handling massive transaction throughput.',
        'Lead code quality reviews, architectural governance, and security hardening.'
      ],
      requirements: [
        '4-7 years of backend engineering experience with Java, Spring Boot, and Microservices.',
        'Solid mastery of concurrency, design patterns, Kafka event streaming, and Docker / Kubernetes.',
        'Deep knowledge of enterprise security (OAuth2, TLS, OWASP standards).'
      ],
      requiredSkills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'PostgreSQL', 'Docker'],
      preferredSkills: ['Kubernetes', 'Redis', 'AWS', 'CI/CD', 'OpenTelemetry'],
      experience: '4-7 years',
      salary: { min: 2000000, max: 3500000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'on-site',
      location: 'Gurugram, India',
      education: 'B.Tech / M.Tech in Computer Science / IT',
      openings: 1,
      status: 'published',
      visibility: 'public',
      viewsCount: 160,
    },

    // --- 4. DATA SCIENCE & ANALYTICS (3 Positions) ---
    {
      companyId: ananyaCompany._id,
      title: 'Data Scientist (Machine Learning & Predictive Modeling)',
      slug: 'data-scientist-machine-learning-gurgaon',
      description: 'Build predictive machine learning models, customer churn predictors, and recommendation engines deploying to production for millions of enterprise users.',
      responsibilities: [
        'Formulate, train, and validate supervised and unsupervised machine learning algorithms in Python.',
        'Perform exploratory data analysis (EDA), feature engineering, and statistical hypothesis testing.',
        'Deploy production inference endpoints using Docker, FastAPI, and AWS SageMaker.',
        'Present actionable insights, model evaluation metrics (ROC-AUC, F1), and business ROI to executive stakeholders.'
      ],
      requirements: [
        'Master’s or Bachelor’s in Data Science, Statistics, Computer Science, or Mathematics.',
        '2-4 years of experience building and productionizing machine learning models in Python.',
        'Mastery of Scikit-Learn, Pandas, NumPy, XGBoost, and SQL query optimization.'
      ],
      requiredSkills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'Deep Learning'],
      preferredSkills: ['TensorFlow', 'PyTorch', 'AWS SageMaker', 'FastAPI', 'Tableau'],
      experience: '2-4 years',
      salary: { min: 1400000, max: 2500000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Gurugram, India',
      education: 'Master’s / B.Tech in Data Science, Statistics, or CS',
      openings: 2,
      status: 'published',
      visibility: 'public',
      viewsCount: 205,
    },
    {
      companyId: ananyaCompany._id,
      title: 'Business Intelligence & Data Analyst',
      slug: 'business-intelligence-data-analyst-bengaluru',
      description: 'Transform complex multi-source data warehouses into actionable executive BI dashboards, revenue attribution models, and operational KPI trackers.',
      responsibilities: [
        'Write complex SQL queries, window functions, and CTEs to aggregate data across millions of transactional records.',
        'Build interactive executive dashboards in Power BI and Tableau with automated data refreshes.',
        'Collaborate with marketing, product, and finance leadership to define unified business metrics.',
        'Perform cohort retention, funnel drop-off, and customer lifetime value (LTV) analyses.'
      ],
      requirements: [
        '1-3 years of experience as a Data Analyst or BI Specialist in high-growth tech or consulting.',
        'Advanced SQL expertise (PostgreSQL / Snowflake / BigQuery) and proficiency in Power BI or Tableau.',
        'Experience with Python for data manipulation (Pandas) and automated ETL reporting.'
      ],
      requiredSkills: ['SQL', 'PowerBI', 'Tableau', 'Python', 'Pandas'],
      preferredSkills: ['Snowflake', 'BigQuery', 'Excel Modeling', 'ETL'],
      experience: '1-3 years',
      salary: { min: 750000, max: 1350000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Bengaluru, India',
      education: 'Degree in Engineering, Statistics, Economics, or Mathematics',
      openings: 2,
      status: 'published',
      visibility: 'public',
      viewsCount: 165,
    },
    {
      companyId: ananyaCompany._id,
      title: 'AI & NLP Applied Machine Learning Engineer',
      slug: 'ai-nlp-applied-ml-engineer-remote',
      description: 'Engineer generative AI workflows, fine-tune transformer models, and architect retrieval-augmented generation (RAG) pipelines for automated resume and candidate scoring.',
      responsibilities: [
        'Fine-tune open-source LLMs (Llama 3, Qwen 2.5, Mistral) for domain-specific NLP parsing tasks.',
        'Build scalable RAG vector search pipelines using LangChain, LlamaIndex, and Pinecone / Qdrant.',
        'Optimize model inference latency, quantization (vLLM / TensorRT), and GPU cost efficiency.',
        'Implement evaluation benchmarks for hallucination prevention and scoring consistency.'
      ],
      requirements: [
        '2-5 years experience developing NLP, text extraction, or deep learning systems.',
        'Hands-on expertise with PyTorch, Hugging Face transformers, and vector databases.',
        'Strong software engineering practices in Python, Docker, and API deployment.'
      ],
      requiredSkills: ['Python', 'NLP', 'PyTorch', 'Generative AI', 'LLM', 'Docker'],
      preferredSkills: ['Hugging Face', 'LangChain', 'Vector Databases', 'vLLM'],
      experience: '2-5 years',
      salary: { min: 1800000, max: 3200000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'remote',
      location: 'Remote (India)',
      education: 'B.Tech / M.Tech in Computer Science / AI / Data Science',
      openings: 1,
      status: 'published',
      visibility: 'public',
      viewsCount: 240,
    },
  ];

  for (const job of jobsData) {
    await Job.create(job);
  }

  console.log(`Successfully inserted ${jobsData.length} genuine job postings into MongoDB Atlas!`);

  // Verification counts
  const totalJobs = await Job.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalCompanies = await Company.countDocuments();

  console.log('--- VERIFICATION SUMMARY ---');
  console.log(`Total Users in DB: ${totalUsers}`);
  console.log(`Total Companies in DB: ${totalCompanies}`);
  console.log(`Total Published Jobs in DB: ${totalJobs}`);
  console.log('Recruiter Login: ayush21929a@gmail.com | Password: Elephant9k$');
  console.log('Candidate Login: candidate.ayush@gmail.com | Password: Elephant9k$');

  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});

