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

  console.log('--- Connected to MongoDB Atlas. Seeding 21 Marketing, Finance, and HR Jobs ---');

  const salt = await bcrypt.genSalt(10);
  const commonPasswordHash = await bcrypt.hash('Elephant9k$', salt);

  // 1. Ayush Kumar (PulseTech Innovations)
  let ayushUser = await User.findOne({ email: 'ayush21929a@gmail.com' });
  let ayushCompany = await Company.findOne({ userId: ayushUser?._id });

  // 2. Neha Singhania (GrowthOrbit Media & Marketing)
  let nehaUser = await User.findOne({ email: 'neha.singhania@growthorbit.in' });
  let nehaCompany = await Company.findOne({ userId: nehaUser?._id });

  // 3. New Recruiter: Rohit Kapoor (Apex Capital & Financial Advisory)
  let rohitUser = await User.findOne({ email: 'rohit.kapoor@apexcapital.in' });
  if (!rohitUser) {
    rohitUser = await User.create({
      fullName: 'Rohit Kapoor',
      email: 'rohit.kapoor@apexcapital.in',
      phone: '9811223344',
      passwordHash: commonPasswordHash,
      role: 'company',
      isEmailVerified: true,
      accountStatus: 'active',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    });
    console.log('Created recruiter: rohit.kapoor@apexcapital.in');
  }

  let apexCompany = await Company.findOne({ userId: rohitUser._id });
  if (!apexCompany) {
    apexCompany = await Company.create({
      userId: rohitUser._id,
      companyName: 'Apex Capital & Financial Advisory',
      slug: 'apex-capital-advisory',
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&h=150&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=400&fit=crop&q=80',
      website: 'https://apexcapital.in',
      industry: 'Financial Services & Investment Advisory',
      companySize: '200-500 employees',
      companyType: 'Corporate / Consulting',
      foundedYear: '2016',
      description: 'Premier financial advisory providing M&A transaction diligence, capital restructuring, tax optimization, and wealth management services for fast-scaling Indian enterprises.',
      headquarters: 'Mumbai, India',
      contactEmail: 'rohit.kapoor@apexcapital.in',
      contactPhone: '9811223344',
      isVerified: true,
      isActive: true,
    });
    console.log('Created Apex Capital & Financial Advisory');
  }

  // 4. New Recruiter: Priya Malhotra (Zenith Talent & People Partners)
  let priyaUser = await User.findOne({ email: 'priya.malhotra@zenithhr.in' });
  if (!priyaUser) {
    priyaUser = await User.create({
      fullName: 'Priya Malhotra',
      email: 'priya.malhotra@zenithhr.in',
      phone: '9876543210',
      passwordHash: commonPasswordHash,
      role: 'company',
      isEmailVerified: true,
      accountStatus: 'active',
      profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    });
    console.log('Created recruiter: priya.malhotra@zenithhr.in');
  }

  let zenithCompany = await Company.findOne({ userId: priyaUser._id });
  if (!zenithCompany) {
    zenithCompany = await Company.create({
      userId: priyaUser._id,
      companyName: 'Zenith Talent & People Partners',
      slug: 'zenith-talent-partners',
      logo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&q=80',
      coverImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=400&fit=crop&q=80',
      website: 'https://zenithhr.in',
      industry: 'Human Resources & Executive Talent Search',
      companySize: '150-300 employees',
      companyType: 'Consulting / Agency',
      foundedYear: '2017',
      description: 'Nationwide HR consultancy delivering executive talent acquisition, campus recruitment programs, people operations design, and organizational culture benchmarking.',
      headquarters: 'New Delhi, India',
      contactEmail: 'priya.malhotra@zenithhr.in',
      contactPhone: '9876543210',
      isVerified: true,
      isActive: true,
    });
    console.log('Created Zenith Talent & People Partners');
  }

  // Define 21 Real Business Jobs (7 Marketing, 7 Finance, 7 HR)
  const businessJobs = [
    // ==========================================
    // MARKETING (7 JOBS)
    // ==========================================
    {
      companyId: nehaCompany._id,
      title: 'Performance Marketing Specialist',
      slug: 'performance-marketing-specialist-growthorbit-2026',
      description: 'Drive high-ROI customer acquisition campaigns across Google Ads, Meta Ads, and programmatic networks. Optimize ad spend, A/B test creatives, and collaborate with growth analytics.',
      responsibilities: [
        'Manage and scale monthly paid media budgets across Google Search, Performance Max, and Meta Ads',
        'Analyze CAC, LTV, ROAS, and conversion funnels to systematically improve campaign efficiency',
        'Execute multi-variant A/B testing on ad copies, landing pages, and creative hooks',
        'Partner with the design team to produce high-converting graphic and video assets',
      ],
      requirements: [
        '1-3 years of proven track record managing paid performance marketing campaigns',
        'Deep expertise in Google Ads, Meta Ads Manager, Google Analytics 4, and Conversion Rate Optimization',
        'Strong quantitative mindset with proficiency in Excel and campaign reporting',
      ],
      requiredSkills: ['Performance Marketing', 'Google Ads', 'Meta Ads', 'Conversion Rate Optimization', 'Google Analytics'],
      preferredSkills: ['SEM', 'A/B Testing', 'Growth Marketing', 'HubSpot'],
      experience: '1-3 years',
      salary: { min: 800000, max: 1400000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Mumbai, India',
      education: "Bachelor's or Master's Degree in Marketing, Business, or related discipline",
      openings: 2,
    },
    {
      companyId: ayushCompany._id,
      title: 'Digital Marketing & Content Lead',
      slug: 'digital-marketing-content-lead-pulsetech-2026',
      description: 'Lead inbound content marketing, SEO strategy, and thought leadership for PulseTech product launches. Create compelling case studies, blog posts, and whitepapers to drive organic pipeline.',
      responsibilities: [
        'Build and execute end-to-end SEO strategy to scale organic search traffic by 150%',
        'Draft engaging technical blogs, product feature release notes, and industry whitepapers',
        'Coordinate organic social distribution across LinkedIn, Twitter/X, and YouTube',
        'Monitor organic search keyword rankings, crawl errors, and backlink velocity',
      ],
      requirements: [
        '2-4 years of experience in B2B tech content marketing and SEO execution',
        'Hands-on expertise with SEO tooling: Ahrefs, SEMrush, Google Search Console',
        'Exceptional written English copywriting and storytelling abilities',
      ],
      requiredSkills: ['Digital Marketing', 'SEO', 'Content Marketing', 'Copywriting', 'Inbound Marketing'],
      preferredSkills: ['Social Media Marketing', 'Market Research', 'Google Analytics', 'Lead Generation'],
      experience: '2-4 years',
      salary: { min: 900000, max: 1500000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'remote',
      location: 'Bengaluru, India',
      education: "Bachelor's / Master's degree in Marketing, Mass Communication, or English Literature",
      openings: 2,
    },
    {
      companyId: nehaCompany._id,
      title: 'Brand Strategy & Communications Manager',
      slug: 'brand-strategy-communications-manager-growthorbit-2026',
      description: 'Shape brand narratives, corporate positioning, and public relations for high-growth tech clients. Oversee omnichannel brand campaigns and executive communication.',
      responsibilities: [
        'Define overarching brand identity, messaging frameworks, and style guidelines',
        'Coordinate public relations, press releases, and media outreach with top business journalists',
        'Oversee creative agencies in executing brand commercial campaigns across print and digital',
        'Conduct consumer sentiment surveys and competitive brand benchmarking',
      ],
      requirements: [
        '3-5 years of experience in brand management, advertising agency, or corporate communications',
        'Demonstrated portfolio of successful 360-degree brand launch campaigns',
        'Strong interpersonal and senior stakeholder presentation skills',
      ],
      requiredSkills: ['Brand Strategy', 'Public Relations', 'Campaign Management', 'Market Research'],
      preferredSkills: ['Content Marketing', 'Digital Marketing', 'Copywriting'],
      experience: '3-5 years',
      salary: { min: 1400000, max: 2200000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'on-site',
      location: 'Mumbai, India',
      education: 'MBA in Marketing / Communications from a recognized institute',
      openings: 1,
    },
    {
      companyId: ayushCompany._id,
      title: 'Growth Marketing & Funnel Optimization Associate',
      slug: 'growth-marketing-funnel-associate-pulsetech-2026',
      description: 'Specialize in product-led growth, conversion rate optimization (CRO), and user onboarding activation funnels for PulseTech SaaS applications.',
      responsibilities: [
        'Analyze user drop-offs across signup, onboarding, and checkout funnels using Mixpanel and Hotjar',
        'Implement automated email nurture sequences to activate and retain free-trial users',
        'Design growth experiments across referral loops, viral invites, and promotional pricing',
        'Collaborate with product and engineering to implement in-app growth widgets',
      ],
      requirements: [
        '1-3 years in product marketing, growth hacking, or conversion rate optimization',
        'Proficiency in product analytics tools (Mixpanel, Amplitude) and CRM platforms (HubSpot)',
        'Understanding of SaaS metrics: CAC, MRR, Churn rate, and Net Revenue Retention',
      ],
      requiredSkills: ['Growth Marketing', 'Conversion Rate Optimization', 'HubSpot', 'CRO', 'Lead Generation'],
      preferredSkills: ['Digital Marketing', 'Email Marketing', 'Google Analytics'],
      experience: '1-3 years',
      salary: { min: 750000, max: 1300000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Bengaluru, India',
      education: 'Degree in Marketing, Business Analytics, or Computer Science',
      openings: 2,
    },
    {
      companyId: nehaCompany._id,
      title: 'Product Marketing Specialist',
      slug: 'product-marketing-specialist-growthorbit-2026',
      description: 'Own go-to-market (GTM) launches, buyer persona research, competitive battlecards, and sales enablement collateral for enterprise SaaS solutions.',
      responsibilities: [
        'Develop product positioning, value proposition decks, and customer persona profiles',
        'Conduct win/loss analysis and maintain real-time competitor battlecards',
        'Create customer case studies, demo scripts, and sales one-pagers',
        'Lead quarterly product launch webinars and partner enablement sessions',
      ],
      requirements: [
        '2-4 years in B2B product marketing, solution marketing, or strategic consulting',
        'Deep empathy for enterprise buyers and technical software products',
        'Proven ability to translate technical features into clear business benefits',
      ],
      requiredSkills: ['Product Marketing', 'Market Research', 'Brand Strategy', 'Inbound Marketing'],
      preferredSkills: ['Digital Marketing', 'Content Marketing', 'HubSpot'],
      experience: '2-4 years',
      salary: { min: 1100000, max: 1800000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Pune, India',
      education: 'MBA in Marketing or Bachelor of Technology with marketing experience',
      openings: 2,
    },
    {
      companyId: nehaCompany._id,
      title: 'Social Media & Influencer Marketing Executive',
      slug: 'social-media-influencer-executive-growthorbit-2026',
      description: 'Manage creator partnerships, influencer seeding, and viral community engagement across Instagram, LinkedIn, and YouTube for major lifestyle and consumer tech brands.',
      responsibilities: [
        'Identify, vet, and contract nano-, micro-, and macro-influencers for brand endorsements',
        'Manage end-to-end influencer deliverable tracking, content approvals, and coupon codes',
        'Engage actively with social media communities and monitor brand sentiment',
        'Produce monthly social performance reports highlighting reach, engagement rate, and ROI',
      ],
      requirements: [
        '1-2 years managing social media channels and creator outreach campaigns',
        'Extensive knowledge of social media algorithms, trending audio, and viral content formats',
        'Strong negotiation and relationship management skills',
      ],
      requiredSkills: ['Social Media Marketing', 'Influencer Marketing', 'Content Marketing', 'Copywriting'],
      preferredSkills: ['Digital Marketing', 'Public Relations', 'Brand Strategy'],
      experience: '1-2 years',
      salary: { min: 550000, max: 950000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Mumbai, India',
      education: "Bachelor's degree in Marketing, Mass Media, or Advertising",
      openings: 3,
    },
    {
      companyId: ayushCompany._id,
      title: 'Email & CRM Retention Marketing Associate',
      slug: 'email-crm-retention-marketing-pulsetech-2026',
      description: 'Design lifecycle email campaigns, behavioral triggers, and customer segmentation to maximize user retention and reduce churn across PulseTech platforms.',
      responsibilities: [
        'Architect dynamic email workflows for welcome series, abandoned cart, and re-engagement',
        'Maintain high inbox deliverability, sender reputation, and SPF/DKIM compliance',
        'Segment customer lists based on behavior, purchase frequency, and engagement tier',
        'A/B test email subject lines, preview text, send times, and call-to-action buttons',
      ],
      requirements: [
        '1-3 years of hands-on experience with Klaviyo, Mailchimp, HubSpot, or ActiveCampaign',
        'Solid understanding of HTML/CSS email templates and responsive rendering',
        'Data-driven mindset with focus on open rates, click-through rates, and unsubscribes',
      ],
      requiredSkills: ['Email Marketing', 'HubSpot', 'Klaviyo', 'Mailchimp', 'Conversion Rate Optimization'],
      preferredSkills: ['Digital Marketing', 'Copywriting', 'Lead Generation'],
      experience: '1-3 years',
      salary: { min: 650000, max: 1100000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'remote',
      location: 'Bengaluru, India',
      education: "Bachelor's degree in Marketing, Business, or Computer Science",
      openings: 2,
    },

    // ==========================================
    // FINANCE (7 JOBS)
    // ==========================================
    {
      companyId: apexCompany._id,
      title: 'Financial Analyst & Valuation Associate',
      slug: 'financial-analyst-valuation-associate-apex-2026',
      description: 'Perform company valuations, three-statement financial modeling, DCF projections, and market multiples analysis for private equity and corporate client mandates.',
      responsibilities: [
        'Build detailed dynamic financial models (DCF, LBO, Comparable Company Analysis)',
        'Analyze quarterly financial statements, cash flow viability, and capital structure',
        'Prepare investor pitch books, confidential information memorandums (CIM), and board presentations',
        'Track macroeconomic indicators, industry trends, and equity market movements',
      ],
      requirements: [
        '1-3 years in financial analysis, corporate finance, or investment research',
        'Mastery of Advanced Excel, financial modeling formulas, and PowerPoint',
        'Strong conceptual clarity in Balance Sheet, P&L, and Cash Flow reconciliation',
      ],
      requiredSkills: ['Financial Analysis', 'Financial Modeling', 'Valuation', 'DCF', 'Advanced Excel'],
      preferredSkills: ['Corporate Finance', 'Budgeting', 'Financial Forecasting'],
      experience: '1-3 years',
      salary: { min: 1000000, max: 1600000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Mumbai, India',
      education: 'MBA in Finance / CA / CFA Level 1 or 2 / Master of Commerce',
      openings: 2,
    },
    {
      companyId: ayushCompany._id,
      title: 'Corporate Finance & Treasury Executive',
      slug: 'corporate-finance-treasury-executive-pulsetech-2026',
      description: 'Oversee working capital management, cash flow forecasting, MIS board reporting, and banking vendor relationships for PulseTech Innovations.',
      responsibilities: [
        'Manage daily cash flow positioning, liquidity planning, and treasury disbursements',
        'Generate monthly MIS operational reports comparing actual expenses vs annual budgets',
        'Coordinate with commercial banking partners for credit facilities and foreign exchange (FX) hedging',
        'Review corporate OPEX and CAPEX requests to ensure strict fiscal discipline',
      ],
      requirements: [
        '2-4 years in corporate treasury, financial planning & analysis (FP&A), or accounting',
        'Experience using ERP accounting software (Tally Prime, SAP, or QuickBooks)',
        'Strong analytical thinking and attention to fiscal governance details',
      ],
      requiredSkills: ['Corporate Finance', 'Cash Flow Management', 'Working Capital', 'MIS Reporting', 'Budgeting'],
      preferredSkills: ['Financial Analysis', 'Tally', 'Advanced Excel'],
      experience: '2-4 years',
      salary: { min: 850000, max: 1400000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Bengaluru, India',
      education: 'B.Com / M.Com / MBA in Finance or ICWA Inter',
      openings: 2,
    },
    {
      companyId: apexCompany._id,
      title: 'Investment Banking Analyst',
      slug: 'investment-banking-analyst-apex-2026',
      description: 'Support senior partners on buy-side and sell-side M&A transactions, capital raises, and private placements across technology and consumer sectors.',
      responsibilities: [
        'Perform thorough financial statement due diligence and historical earnings quality checks',
        'Conduct sector research, market sizing, and strategic buyer universe mapping',
        'Draft investment committee memorandums and transaction marketing teasers',
        'Manage virtual data rooms (VDR) and coordinate Q&A during client due diligence',
      ],
      requirements: [
        '1-3 years in boutique investment banking, corporate development, or transaction advisory',
        'Exceptional financial modeling and valuation capabilities',
        'Willingness to thrive in high-intensity, deal-driven transaction timelines',
      ],
      requiredSkills: ['Investment Banking', 'Financial Modeling', 'Valuation', 'Corporate Finance', 'Equity Research'],
      preferredSkills: ['Financial Analysis', 'DCF', 'Advanced Excel'],
      experience: '1-3 years',
      salary: { min: 1400000, max: 2400000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'on-site',
      location: 'Mumbai, India',
      education: 'Chartered Accountant (CA) or MBA Finance from Tier-1/2 B-School',
      openings: 2,
    },
    {
      companyId: apexCompany._id,
      title: 'Risk & Regulatory Compliance Officer',
      slug: 'risk-regulatory-compliance-officer-apex-2026',
      description: 'Ensure institutional adherence to RBI, SEBI, and corporate governance regulations. Evaluate credit risk, internal controls, and operational compliance.',
      responsibilities: [
        'Monitor statutory compliance under SEBI guidelines, Companies Act, and AML/KYC norms',
        'Conduct internal risk audits to identify control weaknesses and operational vulnerabilities',
        'Liaise with external auditors, legal counsels, and regulatory inspection teams',
        'Implement automated compliance tracking checklists across organizational business units',
      ],
      requirements: [
        '2-4 years experience in banking risk management, audit firm, or compliance division',
        'In-depth knowledge of Indian financial market regulations (SEBI, RBI, PMLA)',
        'High integrity, meticulous eye for detail, and objective judgment',
      ],
      requiredSkills: ['Compliance', 'Risk Management', 'Statutory Audit', 'Auditing'],
      preferredSkills: ['Accounting', 'Corporate Finance', 'Financial Analysis'],
      experience: '2-4 years',
      salary: { min: 900000, max: 1550000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'New Delhi, India',
      education: 'Company Secretary (CS) / LLB / Master of Commerce / MBA Finance',
      openings: 2,
    },
    {
      companyId: ayushCompany._id,
      title: 'FinTech Operations & Billing Specialist',
      slug: 'fintech-operations-billing-specialist-pulsetech-2026',
      description: 'Manage automated billing reconciliation, merchant payment settlement, chargebacks, and gateway integration across Stripe, Razorpay, and banks.',
      responsibilities: [
        'Reconcile daily payment gateway transaction logs against database subscriptions',
        'Investigate and resolve payment failures, dispute chargebacks, and handle refund requests',
        'Generate automated GST invoices for enterprise client billing cycles',
        'Coordinate with product engineering to optimize checkout authorization rates',
      ],
      requirements: [
        '1-3 years experience in payment operations, billing reconciliation, or fintech customer ops',
        'Familiarity with Indian payment ecosystems (UPI, Cards, NetBanking, e-Mandates)',
        'Strong spreadsheet analytical skills with high attention to ledger balance',
      ],
      requiredSkills: ['Accounting', 'Cash Flow Management', 'Compliance', 'Advanced Excel'],
      preferredSkills: ['Tally', 'Financial Analysis', 'GST'],
      experience: '1-3 years',
      salary: { min: 600000, max: 1050000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'remote',
      location: 'Bengaluru, India',
      education: 'B.Com / BBA in Finance / Bachelor of Commerce or Economics',
      openings: 3,
    },
    {
      companyId: apexCompany._id,
      title: 'Accounts & Direct Taxation Associate',
      slug: 'accounts-direct-taxation-associate-apex-2026',
      description: 'Manage full-cycle accounting, monthly book closing, GST return filing, TDS compliance, and balance sheet preparation for institutional client portfolios.',
      responsibilities: [
        'Prepare monthly financial statements, trial balances, and ledger scrutinies in Tally Prime',
        'Compute and file monthly GST (GSTR-1, GSTR-3B) and quarterly TDS returns (24Q, 26Q)',
        'Coordinate with statutory auditors during annual financial audits and tax assessments',
        'Ensure timely payment of advance taxes, professional tax, and statutory levies',
      ],
      requirements: [
        '2-4 years of experience in direct/indirect tax computation and bookkeeping',
        'Complete mastery of Tally Prime, GST portal filings, and TRACES compliance',
        'Thorough knowledge of Indian Income Tax Act regulations and TDS withholding rates',
      ],
      requiredSkills: ['Taxation', 'GST', 'Tally', 'Tally Prime', 'Statutory Audit', 'Direct Tax'],
      preferredSkills: ['Accounting', 'Financial Analysis', 'Auditing'],
      experience: '2-4 years',
      salary: { min: 700000, max: 1200000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'on-site',
      location: 'Mumbai, India',
      education: 'B.Com / M.Com / CA Inter / Semi-Qualified Chartered Accountant',
      openings: 2,
    },
    {
      companyId: apexCompany._id,
      title: 'Wealth Management & Equity Advisory Associate',
      slug: 'wealth-management-equity-advisory-associate-apex-2026',
      description: 'Advise high-net-worth individuals (HNIs) and family offices on strategic asset allocation, equity portfolios, debt funds, and wealth preservation.',
      responsibilities: [
        'Analyze client risk profiles, financial goals, and construct bespoke investment portfolios',
        'Review equity stock research, mutual fund performance, and fixed-income yields',
        'Conduct periodic portfolio rebalancing sessions and prepare client performance statements',
        'Network with wealth management prospects to expand firm Assets Under Management (AUM)',
      ],
      requirements: [
        '2-4 years in private wealth management, retail equity broking, or mutual fund distribution',
        'NISM Series V-A (Mutual Funds) and NISM Series X-A/B (Investment Adviser) preferred',
        'Polished executive presence with strong consultative client management abilities',
      ],
      requiredSkills: ['Wealth Management', 'Portfolio Management', 'Financial Analysis', 'Financial Forecasting'],
      preferredSkills: ['Equity Research', 'Corporate Finance', 'Valuation'],
      experience: '2-4 years',
      salary: { min: 900000, max: 1700000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Delhi NCR, India',
      education: 'MBA in Finance / CFP (Certified Financial Planner) / Master of Commerce',
      openings: 2,
    },

    // ==========================================
    // HR / HUMAN RESOURCES (7 JOBS)
    // ==========================================
    {
      companyId: zenithCompany._id,
      title: 'Talent Acquisition Specialist / Technical Recruiter',
      slug: 'talent-acquisition-specialist-zenith-2026',
      description: 'Lead full-lifecycle recruiting for high-growth tech startups. Source senior engineers, conduct competency screenings, manage offer negotiations, and reduce time-to-hire.',
      responsibilities: [
        'Source passive tech talent via LinkedIn Recruiter, GitHub, career portals, and network referrals',
        'Conduct initial behavioral and cultural screening calls to assess candidate alignment',
        'Manage end-to-end interview pipeline across hiring managers and tech panels in ATS',
        'Draft compelling offer letters, negotiate compensation packages, and ensure high joiner ratios',
      ],
      requirements: [
        '2-4 years in technical recruiting, talent acquisition, or executive search consultancy',
        'Proven track record closing niche engineering roles (React, Node, Cloud, AI)',
        'Mastery of modern ATS platforms (Greenhouse, Lever, Keka) and Boolean search techniques',
      ],
      requiredSkills: ['Talent Acquisition', 'Recruitment', 'Technical Recruiting', 'Campus Hiring'],
      preferredSkills: ['Human Resources', 'HR Management', 'Employee Onboarding'],
      experience: '2-4 years',
      salary: { min: 800000, max: 1450000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Bengaluru, India',
      education: 'MBA in Human Resources / Post Graduate Diploma in Management (HR)',
      openings: 3,
    },
    {
      companyId: ayushCompany._id,
      title: 'HR Generalist & Campus Hiring Lead',
      slug: 'hr-generalist-campus-hiring-lead-pulsetech-2026',
      description: 'Drive university campus placement relationships, manage employee onboarding, administer HR policies, and maintain institutional statutory compliance for PulseTech.',
      responsibilities: [
        'Plan and execute annual university campus recruitment drives across engineering & MBA colleges',
        'Manage seamless new hire orientation, documentation verification, and asset allocation',
        'Administer company leave policies, attendance tracking, and HRMS records maintenance',
        'Coordinate employee exit interviews, attrition analysis, and full-and-final settlement coordination',
      ],
      requirements: [
        '1-3 years in HR operations, campus relations, or generalist responsibilities',
        'Familiarity with HRMS software (Keka, Darwinbox, GreytHR) and college placement workflows',
        'Approachable, empathetic demeanor with exceptional organizational communication',
      ],
      requiredSkills: ['Campus Hiring', 'Employee Onboarding', 'HR Management', 'HR Policies', 'Human Resources'],
      preferredSkills: ['Employee Relations', 'Recruitment', 'Payroll Management'],
      experience: '1-3 years',
      salary: { min: 650000, max: 1150000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Bengaluru, India',
      education: 'MBA in HR / Masters in Human Resource Development / BBA',
      openings: 2,
    },
    {
      companyId: zenithCompany._id,
      title: 'People Operations & Culture Lead',
      slug: 'people-operations-culture-lead-zenith-2026',
      description: 'Champion company culture, employee engagement initiatives, performance evaluation cycles, and wellness programs to build a world-class workplace environment.',
      responsibilities: [
        'Design and roll out monthly employee engagement events, team offsites, and recognition awards',
        'Facilitate semi-annual 360-degree performance appraisal cycles, OKRs, and promotion reviews',
        'Run quarterly eNPS (Employee Net Promoter Score) surveys and implement action plans',
        'Develop internal culture handbooks, diversity & inclusion (D&I) initiatives, and wellness benefits',
      ],
      requirements: [
        '3-5 years in people operations, employee engagement, or organizational development',
        'Deep passion for building positive, transparent, and empathetic company cultures',
        'Experience with OKR tracking frameworks and modern performance management software',
      ],
      requiredSkills: ['People Operations', 'Employee Engagement', 'Performance Management', 'HR Policies'],
      preferredSkills: ['Human Resources', 'Employee Relations', 'HR Management'],
      experience: '3-5 years',
      salary: { min: 1100000, max: 1800000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Gurugram, India',
      education: 'MBA in HR / Organizational Psychology / Masters in Personnel Management',
      openings: 2,
    },
    {
      companyId: zenithCompany._id,
      title: 'HR Business Partner (HRBP)',
      slug: 'hr-business-partner-hrbp-zenith-2026',
      description: 'Serve as strategic advisor to business leaders on workforce planning, organizational restructuring, talent retention, leadership coaching, and change management.',
      responsibilities: [
        'Partner with department VPs to forecast headcount needs and design team capability structures',
        'Identify key flight risks and implement customized retention and compensation plans',
        'Coach middle managers on performance appraisal feedback, conflict resolution, and leadership',
        'Align HR programs directly with business revenue milestones and operational productivity',
      ],
      requirements: [
        '4-7 years in HRBP or strategic talent management roles within high-growth corporations',
        'Strong business acumen with ability to connect talent metrics with bottom-line business ROI',
        'Proven track record navigating complex organizational change and executive coaching',
      ],
      requiredSkills: ['HRBP', 'Workforce Planning', 'Employee Relations', 'Performance Management'],
      preferredSkills: ['Human Resources', 'HR Management', 'HR Analytics'],
      experience: '4-7 years',
      salary: { min: 1600000, max: 2600000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'New Delhi, India',
      education: 'MBA in Human Resource Management from a premier business school',
      openings: 1,
    },
    {
      companyId: zenithCompany._id,
      title: 'Compensation & Benefits (C&B) Analyst',
      slug: 'compensation-benefits-analyst-zenith-2026',
      description: 'Architect competitive compensation structures, industry salary benchmarking, ESOP equity grants, medical insurance plans, and statutory payroll governance.',
      responsibilities: [
        'Participate in annual Mercer and Aon Hewitt salary benchmarking surveys',
        'Design competitive salary bands, variable performance bonuses, and ESOP vesting schedules',
        'Oversee monthly payroll inputs, PF/ESI deductions, and statutory labor compliance audits',
        'Audit corporate benefits programs (Health Insurance, Wellness, Flexible Spending) for cost efficiency',
      ],
      requirements: [
        '2-4 years in compensation and benefits, total rewards, or payroll analytics',
        'Advanced proficiency in quantitative data modeling, Excel pivot tables, and statistical formulas',
        'Thorough understanding of Indian labor codes, EPF, ESIC, Gratuity, and Bonus Acts',
      ],
      requiredSkills: ['Compensation & Benefits', 'Payroll Management', 'Labor Laws', 'HR Policies'],
      preferredSkills: ['HR Analytics', 'Human Resources', 'Advanced Excel'],
      experience: '2-4 years',
      salary: { min: 950000, max: 1600000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Hyderabad, India',
      education: 'MBA in HR / Finance or Master of Commerce',
      openings: 2,
    },
    {
      companyId: zenithCompany._id,
      title: 'Employee Relations & Grievance Executive',
      slug: 'employee-relations-grievance-executive-zenith-2026',
      description: 'Oversee workplace dispute resolution, POSH compliance committee operations, employee grievance redressal, and legal adherence to Indian employment standards.',
      responsibilities: [
        'Investigate employee workplace grievances objectively and recommend decisive mediation',
        'Serve as executive coordinator on internal POSH (Prevention of Sexual Harassment) committees',
        'Review company employment contracts, non-disclosure agreements (NDAs), and severance terms',
        'Conduct periodic ethical awareness workshops and workplace conduct seminars',
      ],
      requirements: [
        '2-5 years experience in employee relations, labor law compliance, or industrial relations',
        'Deep working knowledge of POSH Act 2013, Industrial Disputes Act, and Indian employment laws',
        'High level of discretion, active listening capability, and calm dispute mediation skills',
      ],
      requiredSkills: ['Employee Relations', 'POSH Compliance', 'Labor Laws', 'HR Policies'],
      preferredSkills: ['Human Resources', 'HR Management', 'Employee Engagement'],
      experience: '2-5 years',
      salary: { min: 800000, max: 1350000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'on-site',
      location: 'New Delhi, India',
      education: 'LLB / Master of Social Work (MSW) / MBA in Personnel Management & Industrial Relations',
      openings: 2,
    },
    {
      companyId: ayushCompany._id,
      title: 'Learning & Development (L&D) Specialist',
      slug: 'learning-development-specialist-pulsetech-2026',
      description: 'Design training curriculums, employee upskilling bootcamps, leadership development academies, and competency assessments to accelerate internal promotions.',
      responsibilities: [
        'Conduct company-wide training needs analyses (TNA) across engineering, sales, and operations',
        'Curate e-learning modules, technical certification sponsorship tracks, and onboarding bootcamps',
        'Partner with external corporate trainers and university professors to run leadership masterclasses',
        'Evaluate training effectiveness using Kirkpatrick 4-level evaluation metrics',
      ],
      requirements: [
        '2-4 years in corporate learning & development, instructional design, or talent training',
        'Experience managing Learning Management Systems (LMS) and e-learning content authoring',
        'Dynamic facilitation, public speaking, and workshop moderation abilities',
      ],
      requiredSkills: ['Learning & Development', 'Training & Development', 'Workforce Planning', 'HR Policies'],
      preferredSkills: ['Human Resources', 'People Operations', 'Employee Engagement'],
      experience: '2-4 years',
      salary: { min: 750000, max: 1300000, currency: 'INR', period: 'per annum', isDisclosed: true },
      jobType: 'full-time',
      workMode: 'hybrid',
      location: 'Bengaluru, India',
      education: 'MBA in HR / Masters in Education / Post Graduate in Human Resource Management',
      openings: 2,
    },
  ];

  let insertedCount = 0;
  let updatedCount = 0;

  for (const jobData of businessJobs) {
    const existing = await Job.findOne({ slug: jobData.slug });
    if (existing) {
      Object.assign(existing, jobData);
      existing.status = 'published';
      existing.visibility = 'public';
      await existing.save();
      updatedCount++;
    } else {
      await Job.create({
        ...jobData,
        status: 'published',
        visibility: 'public',
        publishedAt: new Date(),
      });
      insertedCount++;
    }
  }

  const totalJobs = await Job.countDocuments({ status: 'published' });
  console.log(`\n========================================`);
  console.log(`Successfully Seeded Business Jobs!`);
  console.log(`- Inserted new: ${insertedCount}`);
  console.log(`- Updated: ${updatedCount}`);
  console.log(`- Total Published Jobs in Database: ${totalJobs}`);
  console.log(`========================================\n`);

  process.exit(0);
};

run().catch((err) => {
  console.error('Error seeding business jobs:', err);
  process.exit(1);
});
