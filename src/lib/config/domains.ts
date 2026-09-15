export interface CareerDomain {
  id: string;
  label: string;
  icon: string;
  description: string;
  defaultHeadline: string;
  defaultJobTitle: string;
  presetSkills: Array<{
    category: string;
    skills: string[];
  }>;
}

export const CAREER_DOMAINS: CareerDomain[] = [
  {
    id: "cs_it",
    label: "Computer Science & IT",
    icon: "💻",
    description: "Software engineering, web development, cloud, AI, and cybersecurity",
    defaultHeadline: "Full-Stack Engineer | Distributed Systems & Cloud Architect",
    defaultJobTitle: "Software Engineer",
    presetSkills: [
      {
        category: "Frontend Development",
        skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML5/CSS3", "JavaScript", "Vue.js", "Redux"],
      },
      {
        category: "Backend & Systems",
        skills: ["Node.js", "Express.js", "Python", "Go (Golang)", "REST APIs", "GraphQL", "Microservices", "Java"],
      },
      {
        category: "Databases & Storage",
        skills: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Prisma", "Sequelize ORM", "Supabase", "SQL"],
      },
      {
        category: "DevOps & Cloud",
        skills: ["Docker", "Kubernetes", "AWS", "Linux Administration", "CI/CD Pipelines", "Git", "Nginx", "Vercel"],
      },
    ],
  },
  {
    id: "healthcare_medicine",
    label: "Healthcare & Medicine",
    icon: "🩺",
    description: "Physicians, surgeons, nurses, medical specialists, and clinical researchers",
    defaultHeadline: "Clinical Specialist & Healthcare Practitioner | Patient Care & Medical Research",
    defaultJobTitle: "Medical Specialist",
    presetSkills: [
      {
        category: "Clinical Expertise",
        skills: ["Patient Diagnosis", "Treatment Planning", "Electronic Health Records (EHR)", "Clinical Procedures", "Emergency Medicine", "Pharmacotherapy"],
      },
      {
        category: "Medical Compliance & Safety",
        skills: ["HIPAA Compliance", "Infection Control", "Medical Ethics", "Patient Safety Protocols", "Quality Assurance", "Clinical Governance"],
      },
      {
        category: "Healthcare Tools & Systems",
        skills: ["Epic Systems", "Cerner EHR", "Medical Imaging (PACS)", "Diagnostic Software", "Telehealth Platforms"],
      },
      {
        category: "Research & Management",
        skills: ["Clinical Trials", "Medical Documentation", "Patient Communication", "Interdisciplinary Care", "Healthcare Administration"],
      },
    ],
  },
  {
    id: "engineering",
    label: "Engineering (Civil, Mech, Elec, etc.)",
    icon: "🏗️",
    description: "Civil, mechanical, electrical, structural, chemical, and industrial engineering",
    defaultHeadline: "Senior Systems & Project Engineer | Infrastructure, Design & Optimization",
    defaultJobTitle: "Professional Engineer",
    presetSkills: [
      {
        category: "Engineering Design & CAD",
        skills: ["AutoCAD", "SolidWorks", "Revit (BIM)", "MATLAB", "Finite Element Analysis (FEA)", "ANSYS"],
      },
      {
        category: "Project & Operations",
        skills: ["Project Management", "Quality Control & Assurance", "Root Cause Analysis", "Cost Estimation", "Site Supervision", "Technical Documentation"],
      },
      {
        category: "Standards & Compliance",
        skills: ["ISO 9001 Standards", "OSHA Safety Compliance", "Structural Analysis", "Building Codes", "Environmental Compliance"],
      },
      {
        category: "Technical Disciplines",
        skills: ["Fluid Mechanics", "Thermodynamics", "Circuit Design", "PLC Programming", "Materials Science"],
      },
    ],
  },
  {
    id: "accounting_finance",
    label: "Accounting, Finance & Banking",
    icon: "📊",
    description: "Chartered accountants, auditors, financial analysts, and tax specialists",
    defaultHeadline: "Financial Analyst & Senior Accountant | Audit, Budgeting & Risk Management",
    defaultJobTitle: "Senior Accountant / Financial Analyst",
    presetSkills: [
      {
        category: "Accounting & Auditing",
        skills: ["Financial Accounting", "External & Internal Audit", "Taxation & Compliance", "General Ledger", "IFRS & GAAP Standards", "Account Reconciliation"],
      },
      {
        category: "Financial Planning & Analysis",
        skills: ["Financial Modeling", "Budgeting & Forecasting", "Variance Analysis", "Cash Flow Management", "Cost Accounting", "Valuation"],
      },
      {
        category: "ERP & Financial Software",
        skills: ["QuickBooks", "SAP Financials", "Oracle ERP", "Excel (Advanced / VBA)", "Power BI", "Xero"],
      },
      {
        category: "Risk & Strategy",
        skills: ["Risk Assessment", "Corporate Finance", "Mergers & Acquisitions", "Regulatory Reporting", "Internal Controls"],
      },
    ],
  },
  {
    id: "law_legal",
    label: "Law, Legal & Compliance",
    icon: "⚖️",
    description: "Attorneys, legal consultants, corporate counsel, and compliance officers",
    defaultHeadline: "Corporate Legal Counsel | Contract Negotiation, Compliance & Litigation",
    defaultJobTitle: "Legal Counsel / Attorney",
    presetSkills: [
      {
        category: "Legal Practice",
        skills: ["Contract Drafting & Negotiation", "Corporate Law", "Litigation Support", "Intellectual Property", "Employment Law", "Regulatory Compliance"],
      },
      {
        category: "Research & Analysis",
        skills: ["Legal Research (Westlaw / LexisNexis)", "Case Analysis", "Statutory Interpretation", "Risk Mitigation", "Due Diligence"],
      },
      {
        category: "Client & Advocacy",
        skills: ["Client Advisory", "Arbitration & Mediation", "Dispute Resolution", "Courtroom Advocacy", "Legal Writing"],
      },
    ],
  },
  {
    id: "creative_design",
    label: "Creative, Design & Media",
    icon: "🎨",
    description: "UI/UX designers, graphic designers, art directors, and media creators",
    defaultHeadline: "Lead Product & Graphic Designer | UI/UX, Visual Brand & Design Systems",
    defaultJobTitle: "UI/UX & Product Designer",
    presetSkills: [
      {
        category: "UI/UX & Product Design",
        skills: ["Figma", "User Research & Usability Testing", "Wireframing & Prototyping", "Design Systems", "Information Architecture", "Adobe XD"],
      },
      {
        category: "Visual & Graphic Arts",
        skills: ["Adobe Illustrator", "Adobe Photoshop", "Brand Identity", "Typography", "Layout Design", "Vector Graphics"],
      },
      {
        category: "Motion & Media",
        skills: ["Adobe After Effects", "Adobe Premiere Pro", "Video Editing", "3D Modeling (Blender)", "Motion Graphics"],
      },
    ],
  },
  {
    id: "marketing_sales",
    label: "Marketing, Sales & Communications",
    icon: "📣",
    description: "Marketing directors, SEO specialists, sales managers, and PR officers",
    defaultHeadline: "Digital Marketing & Growth Strategist | SEO, Performance Campaigns & B2B Sales",
    defaultJobTitle: "Marketing Manager",
    presetSkills: [
      {
        category: "Digital Marketing",
        skills: ["Search Engine Optimization (SEO)", "Pay-Per-Click (PPC) Advertising", "Social Media Strategy", "Content Marketing", "Email Marketing Campaigns", "Copywriting"],
      },
      {
        category: "Analytics & Growth",
        skills: ["Google Analytics (GA4)", "Conversion Rate Optimization (CRO)", "A/B Testing", "Market Research", "HubSpot CRM", "Google Ads"],
      },
      {
        category: "Sales & Account Management",
        skills: ["B2B Sales", "Lead Generation", "Salesforce CRM", "Client Relationship Management", "Negotiation", "Pipeline Management"],
      },
    ],
  },
  {
    id: "humanities_education",
    label: "Humanities, Education & Social Sciences",
    icon: "📚",
    description: "Teachers, university lecturers, academic researchers, psychologists, and writers",
    defaultHeadline: "Educator & Academic Researcher | Curriculum Development & Educational Strategy",
    defaultJobTitle: "Educator / Lecturer",
    presetSkills: [
      {
        category: "Pedagogy & Teaching",
        skills: ["Curriculum Design", "Classroom Management", "E-Learning & Distance Education", "Student Assessment", "Instructional Design", "Academic Mentorship"],
      },
      {
        category: "Research & Writing",
        skills: ["Qualitative & Quantitative Research", "Academic Writing & Publishing", "Data Analysis (SPSS)", "Literature Review", "Grant Writing"],
      },
      {
        category: "Social Sciences & Care",
        skills: ["Counseling & Psychology", "Community Outreach", "Public Policy Analysis", "Cross-Cultural Communication"],
      },
    ],
  },
  {
    id: "business_management",
    label: "Business Administration & Management",
    icon: "💼",
    description: "Project managers, operations directors, business analysts, and HR leads",
    defaultHeadline: "Operations & Senior Project Manager | Agile Delivery, Process Optimization & Leadership",
    defaultJobTitle: "Project & Operations Manager",
    presetSkills: [
      {
        category: "Project & Process Management",
        skills: ["Agile & Scrum Methodologies", "Jira & Confluence", "PMP Framework", "Process Optimization", "Change Management", "Vendor Management"],
      },
      {
        category: "Business Analysis",
        skills: ["Requirements Gathering", "Stakeholder Management", "Business Process Mapping", "KPI Tracking", "Strategic Planning"],
      },
      {
        category: "Human Resources & People",
        skills: ["Talent Acquisition", "Performance Management", "Employee Engagement", "HR Policies", "Conflict Resolution"],
      },
    ],
  },
  {
    id: "skilled_trades",
    label: "Skilled Trades & Operations",
    icon: "🔧",
    description: "Technicians, electricians, mechanics, logistics supervisors, and site managers",
    defaultHeadline: "Senior Operations Specialist & Technical Specialist | Equipment Maintenance & Safety",
    defaultJobTitle: "Operations Specialist",
    presetSkills: [
      {
        category: "Operations & Maintenance",
        skills: ["Equipment Maintenance & Repair", "Preventive Maintenance", "Troubleshooting & Diagnostics", "Inventory Management", "Logistics & Supply Chain"],
      },
      {
        category: "Safety & Quality",
        skills: ["Workplace Safety Protocols", "Quality Inspection", "Hazard Assessment", "Regulatory Compliance", "Tool Calibration"],
      },
    ],
  },
  {
    id: "custom_field",
    label: "Custom Domain / Other Field",
    icon: "✨",
    description: "Specify any custom professional field or specialized domain",
    defaultHeadline: "Professional Specialist | Strategic Execution & Domain Expertise",
    defaultJobTitle: "Professional Specialist",
    presetSkills: [
      {
        category: "Core Professional Skills",
        skills: ["Strategic Planning", "Project Execution", "Domain Research", "Client Relations", "Technical Writing", "Quality Assurance"],
      },
    ],
  },
];

export function getDomainById(id?: string): CareerDomain {
  return CAREER_DOMAINS.find((d) => d.id === id) || CAREER_DOMAINS[0];
}
