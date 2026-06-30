/**
 * DMU Dubai Programme Matcher - Core Application Logic
 * Implements RIASEC (Holland Code) Scoring and Program Matching
 */

// 1. RIASEC Question Bank
const QUESTIONS = [
  // Realistic (R) - Doers
  { id: 1, text: "Repair or assemble electronic components, gadgets, or appliances.", category: "R" },
  { id: 2, text: "Build models, structures, or objects using physical tools and machinery.", category: "R" },
  { id: 4, text: "Operate heavy machinery, specialized laboratory gear, or mechanical equipment.", category: "R" },
  { id: 5, text: "Draft blueprints, assemble prototypes, or solve hardware problems.", category: "R" },

  // Investigative (I) - Thinkers
  { id: 6, text: "Solve complex mathematical puzzles, statistical models, or scientific equations.", category: "I" },
  { id: 7, text: "Analyze large datasets, identify patterns, and draw logical conclusions.", category: "I" },
  { id: 8, text: "Write computer programs, design algorithms, or develop database structures.", category: "I" },
  { id: 9, text: "Research scientific phenomena, biological systems, or human cognitive processes.", category: "I" },

  // Artistic (A) - Creators
  { id: 11, text: "Create original visual arts, digital illustrations, or graphic designs.", category: "A" },
  { id: 12, text: "Write creative copy, advertising slogans, stories, or journalistic articles.", category: "A" },
  { id: 13, text: "Design promotional layouts, visual merchandise, or multimedia content.", category: "A" },
  { id: 15, text: "Develop novel concepts, aesthetic styles, or creative campaign ideas.", category: "A" },

  // Social (S) - Helpers
  { id: 16, text: "Listen to people's emotional struggles and help them resolve mental hurdles.", category: "S" },
  { id: 17, text: "Teach, coach, or explain academic subjects and technical skills to others.", category: "S" },
  { id: 18, text: "Provide medical, therapeutic, or counseling support to individuals in need.", category: "S" },
  { id: 20, text: "Facilitate group discussions, counsel peers, or resolve interpersonal disputes.", category: "S" },

  // Enterprising (E) - Persuaders
  { id: 21, text: "Lead a high-performance team to execute a major project or launch a business.", category: "E" },
  { id: 22, text: "Pitch a commercial startup concept or negotiate a complex contract.", category: "E" },
  { id: 24, text: "Manage financial operations, project timelines, and operational strategies.", category: "E" },
  { id: 25, text: "Deliver persuasive presentations, speak in public, or represent an organization.", category: "E" },

  // Conventional (C) - Organizers
  { id: 26, text: "Establish organized databases, systematic files, and structural archives.", category: "C" },
  { id: 27, text: "Balance financial statements, balance sheets, and detailed ledger books.", category: "C" },
  { id: 28, text: "Review complex compliance standards, tax reports, or auditing guidelines.", category: "C" },
  { id: 29, text: "Work systematically using clear checklists, detailed steps, and instructions.", category: "C" },
  { id: 30, text: "Coordinate logistics, resource schedules, and structured project milestones.", category: "C" }
];

// Derived per-category score limits used by matching and chart rendering
const CATEGORY_SCORE_LIMITS = QUESTIONS.reduce((acc, question) => {
  if (!acc[question.category]) {
    acc[question.category] = { min: 0, max: 0, neutral: 0 };
  }

  acc[question.category].min += 1;
  acc[question.category].max += 5;
  acc[question.category].neutral += 3;
  return acc;
}, {});

// 2. DMU Dubai Programs Database (35 Programs mapped to RIASEC vectors)
const PROGRAMS = [
  // --- IYZ Pathway Programmes ---
  {
    name: "DMU International Year Zero: Art & Design",
    faculty: "IYZ Pathway Programmes",
    slug: "iyz-art-design",
    level: "iyz",
    description: "Launch your creative career. Build a stellar artistic portfolio and transition directly into prestigious graphic design, animation, and fashion undergraduate degrees.",
    skills: ["Creative Design", "Portfolio Presentation", "Visual Communication"],
    weights: { R: 3, I: 1, A: 10, S: 1, E: 3, C: 2 },
    link: "https://www.dmu.ac.uk/dubai/study/international-year-zero.aspx"
  },
  {
    name: "DMU International Year Zero: Business & Law",
    faculty: "IYZ Pathway Programmes",
    slug: "iyz-business-law",
    level: "iyz",
    description: "Equip yourself with fundamental principles of commerce, corporate law, and management, unlocking direct entry to top-tier commercial and legal degrees.",
    skills: ["Business Concepts", "Legal Reasoning", "Commercial Awareness"],
    weights: { R: 1, I: 2, A: 2, S: 3, E: 10, C: 8 },
    link: "https://www.dmu.ac.uk/dubai/study/international-year-zero.aspx"
  },
  {
    name: "DMU International Year Zero: Computing",
    faculty: "IYZ Pathway Programmes",
    slug: "iyz-computing",
    level: "iyz",
    description: "Gain a rock-solid foundation in logic, basic programming, and digital systems to seamlessly transition into advanced software development and IT degrees.",
    skills: ["Algorithmic Thinking", "Basic Coding", "Digital Problem Solving"],
    weights: { R: 4, I: 10, A: 2, S: 1, E: 3, C: 7 },
    link: "https://www.dmu.ac.uk/dubai/study/international-year-zero.aspx"
  },
  {
    name: "DMU International Year Zero: Social Science",
    faculty: "IYZ Pathway Programmes",
    slug: "iyz-social-science",
    level: "iyz",
    description: "Examine society, political theories, and human relations while building critical research skills for undergraduate studies in psychology and social science.",
    skills: ["Societal Analysis", "Critical Reading", "Research Methodologies"],
    weights: { R: 1, I: 5, A: 3, S: 10, E: 3, C: 2 },
    link: "https://www.dmu.ac.uk/dubai/study/international-year-zero.aspx"
  },
  {
    name: "DMU International Year Zero: Engineering",
    faculty: "IYZ Pathway Programmes",
    slug: "iyz-engineering",
    level: "iyz",
    description: "Master high-level mathematics, physical principles, and analytical mechanics to progress confidently into comprehensive engineering disciplines.",
    skills: ["Applied Mathematics", "Physical Science", "Technical Drawing"],
    weights: { R: 10, I: 8, A: 2, S: 1, E: 3, C: 4 },
    link: "https://www.dmu.ac.uk/dubai/study/international-year-zero.aspx"
  },

  // --- Faculty of Health and Life Sciences ---
  {
    name: "BSc (Hons) Psychology",
    faculty: "Faculty of Health and Life Sciences",
    slug: "bsc-psychology",
    level: "bachelors",
    description: "Unravel the science of human behavior, cognitive processes, and development. Gain strong research capabilities to understand why people act and feel the way they do.",
    skills: ["Behavioral Analysis", "Statistical Software", "Empathetic Listening"],
    weights: { R: 1, I: 8, A: 3, S: 10, E: 3, C: 4 },
    link: "https://www.dmu.ac.uk/dubai/study/undergraduate/psychology-bsc.aspx"
  },
  {
    name: "BSc (Hons) Psychology with Criminology",
    faculty: "Faculty of Health and Life Sciences",
    slug: "bsc-psychology-criminology",
    level: "bachelors",
    description: "Combine human behavioral insights with rigorous forensic study of crime, motivation, judicial response, and rehabilitation.",
    skills: ["Criminal Profiling", "Legal Psychology", "Research Design"],
    weights: { R: 2, I: 8, A: 2, S: 10, E: 4, C: 5 },
    link: "https://www.dmu.ac.uk/dubai/study/undergraduate/psychology-with-criminology-bsc.aspx"
  },
  {
    name: "BSc (Hons) Psychology with Health and Wellbeing in Society",
    faculty: "Faculty of Health and Life Sciences",
    slug: "bsc-psychology-health",
    level: "bachelors",
    description: "Focus on psychological principles driving health, preventive behaviors, mental health advocacy, and community wellness initiatives.",
    skills: ["Health Interventions", "Community Advocacy", "Wellness Strategies"],
    weights: { R: 2, I: 6, A: 3, S: 10, E: 3, C: 5 },
    link: "https://www.dmu.ac.uk/dubai/study/undergraduate/psychology-with-health-and-wellbeing-in-society.aspx"
  },
  {
    name: "MSc Mental Health and Wellbeing",
    faculty: "Faculty of Health and Life Sciences",
    slug: "msc-mental-health",
    level: "masters",
    description: "Advanced postgraduate program focusing on clinical frameworks, research pathways, and therapeutic strategies to champion mental wellness across communities.",
    skills: ["Therapeutic Frameworks", "Clinical Research", "Policy Formulation"],
    weights: { R: 1, I: 8, A: 2, S: 10, E: 4, C: 3 },
    link: "https://www.dmu.ac.uk/dubai/study/postgraduate/msc-mental-health.aspx"
  },

  // --- Faculty of Business & Law ---
  {
    name: "BA (Hons) Business Management",
    faculty: "Faculty of Business & Law",
    slug: "ba-business-management",
    level: "bachelors",
    description: "Master modern leadership, organizational strategy, and international commerce. Develop the executive mindset required to steer corporate organizations.",
    skills: ["Strategic Leadership", "Operations Management", "Decision Analysis"],
    weights: { R: 1, I: 3, A: 2, S: 5, E: 10, C: 7 },
    link: "https://www.dmu.ac.uk/dubai/study/undergraduate/business-management-ba.aspx"
  },
  {
    name: "BA (Hons) Advertising and Marketing Communications",
    faculty: "Faculty of Business & Law",
    slug: "ba-advertising-marketing",
    level: "bachelors",
    description: "Blend strategic business marketing with brilliant creative execution. Design stunning advertising campaigns and leverage cutting-edge digital media networks.",
    skills: ["Brand Copywriting", "Campaign Design", "Media Strategy"],
    weights: { R: 1, I: 2, A: 9, S: 5, E: 10, C: 4 },
    link: "https://www.dmu.ac.uk/dubai/study/undergraduate/advertising-and-marketing-communications-ba.aspx"
  },
  {
    name: "BSc (Hons) Accounting & Finance",
    faculty: "Faculty of Business & Law",
    slug: "bsc-accounting-finance",
    level: "bachelors",
    description: "Deep-dive into systematic corporate financial tracking, auditing, and tax strategies. Gain direct exemptions towards top global professional certifications.",
    skills: ["Corporate Auditing", "Financial Reporting", "Tax Optimization"],
    weights: { R: 1, I: 5, A: 1, S: 2, E: 7, C: 10 },
    link: "https://www.dmu.ac.uk/dubai/study/undergraduate/accounting-and-finance-bsc.aspx"
  },
  {
    name: "BSc (Hons) Finance and Investment",
    faculty: "Faculty of Business & Law",
    slug: "bsc-finance-investment",
    level: "bachelors",
    description: "Examine stock markets, equity portfolios, wealth management, and corporate financial risks. Perfect for aspiring investment bankers and risk analysts.",
    skills: ["Portfolio Management", "Market Valuations", "Risk Assessment"],
    weights: { R: 1, I: 5, A: 1, S: 2, E: 8, C: 10 },
    link: "https://www.dmu.ac.uk/dubai/study/undergraduate/finance-and-investment-bsc.aspx"
  },
  {
    name: "BSc (Hons) Economics",
    faculty: "Faculty of Business & Law",
    slug: "bsc-economics",
    level: "bachelors",
    description: "Study how resources, fiscal policies, and consumer behavior shape global markets. Develop sophisticated mathematical modeling capabilities.",
    skills: ["Macroeconomic Modeling", "Econometrics", "Trend Forecasting"],
    weights: { R: 1, I: 10, A: 2, S: 2, E: 6, C: 8 },
    link: "https://www.dmu.ac.uk/dubai/study/undergraduate/economics-bsc.aspx"
  },
  {
    name: "LLB (Hons) Law",
    faculty: "Faculty of Business & Law",
    slug: "llb-law",
    level: "bachelors",
    description: "Develop the sharp analytical research, legal drafting, and persuasive court-room advocacy required to excel in international legal practices.",
    skills: ["Courtroom Advocacy", "Legal Writing", "Case Assessment"],
    weights: { R: 1, I: 8, A: 3, S: 4, E: 10, C: 5 },
    link: "https://www.dmu.ac.uk/dubai/study/undergraduate/law-llb.aspx"
  },
  {
    name: "LLM (Master of Laws)",
    faculty: "Faculty of Business & Law",
    slug: "llm",
    level: "masters",
    description: "Advance your legal understanding. Specialise in complex international business law, maritime, intellectual property, or human rights legal structures.",
    skills: ["International Jurisprudence", "Legal Compliance", "Advanced Scholarship"],
    weights: { R: 1, I: 9, A: 2, S: 3, E: 10, C: 6 },
    link: "https://www.dmu.ac.uk/dubai/study/postgraduate/llm.aspx"
  },
  {
    name: "Global MBA",
    faculty: "Faculty of Business & Law",
    slug: "global-mba",
    level: "masters",
    description: "An elite executive MBA designed to broaden international leadership horizons, enhance management strategy, and build powerful corporate relationships.",
    skills: ["Global Stewardship", "Executive Negotiations", "Change Leadership"],
    weights: { R: 1, I: 4, A: 2, S: 6, E: 10, C: 6 },
    link: "https://www.dmu.ac.uk/dubai/study/postgraduate/global-mba.aspx"
  },
  {
    name: "MA Human Resource Management",
    faculty: "Faculty of Business & Law",
    slug: "ma-hrm",
    level: "masters",
    description: "Learn to build high-performance corporate cultures. Drive workplace engagement, talent acquisition strategies, and international employment laws.",
    skills: ["Conflict Management", "Talent Sourcing", "Strategic HR Policies"],
    weights: { R: 1, I: 3, A: 2, S: 9, E: 10, C: 5 },
    link: "https://www.dmu.ac.uk/dubai/study/postgraduate/human-resource-management-ma.aspx"
  },
  {
    name: "MSc International Business and Management",
    faculty: "Faculty of Business & Law",
    slug: "msc-ibm",
    level: "masters",
    description: "Postgraduate degree exploring global trade structures, cross-border corporate dynamics, supply chain systems, and multi-national logistics.",
    skills: ["Cross-Cultural Management", "Logistics Coordination", "Trade Auditing"],
    weights: { R: 1, I: 4, A: 2, S: 5, E: 10, C: 6 },
    link: "https://www.dmu.ac.uk/dubai/study/postgraduate/international-business-and-management-msc.aspx"
  },
  {
    name: "MSc Marketing Management",
    faculty: "Faculty of Business & Law",
    slug: "msc-marketing",
    level: "masters",
    description: "Harness modern strategic data analytics and creative brand management techniques to design high-impact global marketing plans.",
    skills: ["Market Analytics", "Strategic Branding", "Digital Positioning"],
    weights: { R: 1, I: 3, A: 6, S: 5, E: 10, C: 4 },
    link: "https://www.dmu.ac.uk/dubai/study/postgraduate/marketing-management-msc.aspx"
  },
  {
    name: "MSc Project Management",
    faculty: "Faculty of Business & Law",
    slug: "msc-project-management",
    level: "masters",
    description: "Acquire the structured skills to steer complex corporate projects. Learn agile execution methodologies, budget management, and operational logic.",
    skills: ["Agile Frameworks", "Budget Planning", "Resource Orchestration"],
    weights: { R: 3, I: 4, A: 2, S: 4, E: 10, C: 8 },
    link: "https://www.dmu.ac.uk/dubai/study/postgraduate/project-management-msc.aspx"
  },

  // --- Faculty of Technology, Arts and Culture ---
  {
    name: "BSc (Hons) Cyber Security",
    faculty: "Faculty of Technology, Arts and Culture",
    slug: "bsc-cyber-security",
    level: "bachelors",
    description: "Build robust security foundations in network defense, ethical hacking principles, and cyber risk management for modern digital environments.",
    skills: ["Network Security", "Threat Analysis", "Incident Response"],
    weights: { R: 3, I: 10, A: 1, S: 1, E: 5, C: 9 },
    link: "https://www.dmu.ac.uk/study/courses/undergraduate-courses/undergraduate-courses.aspx"
  },
  {
    name: "BSc (Hons) Computer Science",
    faculty: "Faculty of Technology, Arts and Culture",
    slug: "bsc-computer-science",
    level: "bachelors",
    description: "Develop advanced computing capability in software development, data structures, algorithms, and systems design for global technology careers.",
    skills: ["Programming", "Algorithms", "System Design"],
    weights: { R: 1, I: 10, A: 3, S: 1, E: 4, C: 8 },
    link: "https://www.dmu.ac.uk/study/courses/undergraduate-courses/undergraduate-courses.aspx"
  },
  {
    name: "BSc (Hons) Software Engineering",
    faculty: "Faculty of Technology, Arts and Culture",
    slug: "bsc-software-engineering",
    level: "bachelors",
    description: "Learn end-to-end software engineering from requirements to deployment, with focused pathways in mobile app development, embedded systems, and IoT engineering.",
    skills: ["Mobile App Development", "Embedded Systems", "IoT Engineering"],
    weights: { R: 5, I: 10, A: 2, S: 2, E: 5, C: 9 },
    link: "https://www.dmu.ac.uk/study/courses/undergraduate-courses/undergraduate-courses.aspx"
  },
  {
    name: "BEng (Hons) Mechanical Engineering",
    faculty: "Faculty of Technology, Arts and Culture",
    slug: "beng-mechanical-engineering",
    level: "bachelors",
    description: "Apply engineering science to design, manufacture, and optimize mechanical systems with strong foundations in materials, dynamics, and thermofluids.",
    skills: ["Mechanical Design", "CAD Modeling", "Engineering Analysis"],
    weights: { R: 10, I: 8, A: 2, S: 1, E: 4, C: 6 },
    link: "https://www.dmu.ac.uk/study/courses/undergraduate-courses/undergraduate-courses.aspx"
  },
  {
    name: "MSc Architecture and Sustainability",
    faculty: "Faculty of Technology, Arts and Culture",
    slug: "msc-architecture-sustainability",
    level: "masters",
    description: "Explore environmentally responsive architecture through sustainable materials, passive design, and evidence-based urban development strategies.",
    skills: ["Sustainable Design", "Urban Analysis", "Environmental Planning"],
    weights: { R: 4, I: 7, A: 9, S: 3, E: 4, C: 6 },
    link: "https://www.dmu.ac.uk/dubai/study/postgraduate/index.aspx"
  },
  {
    name: "MSc Artificial Intelligence",
    faculty: "Faculty of Technology, Arts and Culture",
    slug: "msc-artificial-intelligence",
    level: "masters",
    description: "Advance your expertise in intelligent systems, machine learning, and applied AI for automation, prediction, and decision support.",
    skills: ["Machine Learning", "Model Development", "AI Applications"],
    weights: { R: 1, I: 10, A: 3, S: 1, E: 5, C: 8 },
    link: "https://www.dmu.ac.uk/dubai/study/postgraduate/index.aspx"
  },
  {
    name: "MSc Data Analytics",
    faculty: "Faculty of Technology, Arts and Culture",
    slug: "msc-data-analytics",
    level: "masters",
    description: "Master advanced analytics, visualization, and statistical decision-making to transform complex datasets into high-value strategic insights.",
    skills: ["Data Modeling", "Statistical Analysis", "Data Visualization"],
    weights: { R: 1, I: 10, A: 2, S: 2, E: 6, C: 9 },
    link: "https://www.dmu.ac.uk/dubai/study/postgraduate/index.aspx"
  },
  {
    name: "MSc Energy and Sustainable Development",
    faculty: "Faculty of Technology, Arts and Culture",
    slug: "msc-energy-sustainable-development",
    level: "masters",
    description: "Study energy systems, policy, and sustainability frameworks to design resilient solutions for future-focused development agendas.",
    skills: ["Energy Systems", "Sustainability Policy", "Impact Assessment"],
    weights: { R: 5, I: 8, A: 3, S: 3, E: 5, C: 7 },
    link: "https://www.dmu.ac.uk/dubai/study/postgraduate/index.aspx"
  },
  {
    name: "MSc Engineering Management",
    faculty: "Faculty of Technology, Arts and Culture",
    slug: "msc-engineering-management",
    level: "masters",
    description: "Bridge engineering and leadership by combining technical decision-making with operations, project delivery, and organizational strategy.",
    skills: ["Technical Leadership", "Project Delivery", "Operations Strategy"],
    weights: { R: 4, I: 6, A: 1, S: 4, E: 10, C: 8 },
    link: "https://www.dmu.ac.uk/dubai/study/postgraduate/index.aspx"
  },
  {
    name: "BSc (Hons) Architecture",
    faculty: "Faculty of Technology, Arts and Culture",
    slug: "bsc-architecture",
    level: "bachelors",
    description: "Develop architectural thinking through studio practice, technical drawing, and contextual design for built environments.",
    skills: ["Architectural Design", "Studio Practice", "Technical Drawing"],
    weights: { R: 4, I: 6, A: 10, S: 2, E: 3, C: 5 },
    link: "https://www.dmu.ac.uk/study/courses/undergraduate-courses/undergraduate-courses.aspx"
  },
  {
    name: "BA (Hons) Interior Design",
    faculty: "Faculty of Technology, Arts and Culture",
    slug: "ba-interior-design",
    level: "bachelors",
    description: "Create functional and expressive interior spaces with strong grounding in spatial planning, materials, and human-centered design.",
    skills: ["Spatial Planning", "Material Selection", "Human-Centered Design"],
    weights: { R: 3, I: 4, A: 10, S: 4, E: 4, C: 5 },
    link: "https://www.dmu.ac.uk/study/courses/undergraduate-courses/undergraduate-courses.aspx"
  },
  {
    name: "BSc (Hons) Fashion Business",
    faculty: "Faculty of Technology, Arts and Culture",
    slug: "bsc-fashion-business",
    level: "bachelors",
    description: "Combine fashion industry insight with business strategy, brand development, and commercial planning for global market success.",
    skills: ["Fashion Marketing", "Brand Strategy", "Commercial Planning"],
    weights: { R: 1, I: 3, A: 8, S: 4, E: 10, C: 6 },
    link: "https://www.dmu.ac.uk/study/courses/undergraduate-courses/undergraduate-courses.aspx"
  },
  {
    name: "MA Fashion Management with Marketing",
    faculty: "Faculty of Technology, Arts and Culture",
    slug: "ma-fashion-management-marketing",
    level: "masters",
    description: "Advance fashion leadership through strategic marketing, consumer insight, and international brand management in competitive sectors.",
    skills: ["Consumer Insight", "Fashion Leadership", "Strategic Marketing"],
    weights: { R: 1, I: 3, A: 7, S: 5, E: 10, C: 5 },
    link: "https://www.dmu.ac.uk/dubai/study/postgraduate/index.aspx"
  },
  {
    name: "MA/MSc Design Innovation and Management",
    faculty: "Faculty of Technology, Arts and Culture",
    slug: "ma-msc-design-innovation-management",
    level: "masters",
    description: "Integrate creative innovation with managerial execution to lead multidisciplinary design projects from concept to strategic impact.",
    skills: ["Design Innovation", "Creative Strategy", "Project Leadership"],
    weights: { R: 2, I: 5, A: 10, S: 4, E: 9, C: 6 },
    link: "https://www.dmu.ac.uk/dubai/study/postgraduate/index.aspx"
  }
];

// 3. Application State Management
const STATE = {
  activeView: "welcome", // welcome, quiz, loading, results
  user: {
    name: "",
    email: "",
    role: "student", // student, parent
    level: "iyz" // iyz, bachelors, masters
  },
  answers: {}, // questionId: score (1-5)
  currentQuestionIndex: 0,
  scores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
  topMatches: [],
  allMatches: []
};

// 4. Initialization
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  // Show welcome view on load
  showView("welcome");
});

// 5. State Router / View Transitions
function showView(viewId) {
  STATE.activeView = viewId;
  
  // Hide all view elements
  document.querySelectorAll(".app-view").forEach(el => {
    el.classList.remove("active");
  });
  
  // Show target view
  const targetView = document.getElementById(`${viewId}-view`);
  if (targetView) {
    targetView.classList.add("active");
    window.scrollTo(0, 0);
  }
  
  // Custom actions per view transition
  if (viewId === "quiz") {
    renderQuestion();
  } else if (viewId === "loading") {
    startAnalysisLoader();
  } else if (viewId === "results") {
    renderResults();
  }
}

// 6. Event Listeners Binding
function setupEventListeners() {
  // A. Welcome Form Submission
  const welcomeForm = document.getElementById("welcome-form");
  if (welcomeForm) {
    welcomeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById("user-name");
      const emailInput = document.getElementById("user-email");
      const roleInput = document.querySelector('input[name="user-role"]:checked');
      const levelInput = document.querySelector('input[name="user-level"]:checked');
      
      STATE.user.name = nameInput ? nameInput.value.trim() : "Guest";
      STATE.user.email = emailInput ? emailInput.value.trim() : "";
      STATE.user.role = roleInput ? roleInput.value : "student";
      STATE.user.level = levelInput ? levelInput.value : "iyz";
      
      // Navigate to Quiz
      STATE.currentQuestionIndex = 0;
      STATE.answers = {};
      showView("quiz");
    });
  }

  // B. Quiz navigation
  const prevBtn = document.getElementById("prev-question-btn");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (STATE.currentQuestionIndex > 0) {
        STATE.currentQuestionIndex--;
        renderQuestion();
      }
    });
  }

  // C. Likert choices
  const likertButtons = document.querySelectorAll(".likert-choice-btn");
  likertButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const score = parseInt(btn.dataset.score);
      const activeQuestion = QUESTIONS[STATE.currentQuestionIndex];
      
      // Save answer
      STATE.answers[activeQuestion.id] = score;
      
      // Ripple & Proceed with a brief delay for a fluid feel
      btn.classList.add("tapped");
      setTimeout(() => {
        btn.classList.remove("tapped");
        
        if (STATE.currentQuestionIndex < QUESTIONS.length - 1) {
          STATE.currentQuestionIndex++;
          renderQuestion();
        } else {
          // Finished all questions!
          showView("loading");
        }
      }, 150);
    });
  });

  // D. Results Faculty Filters
  const filterTabs = document.querySelectorAll(".filter-tab-btn");
  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      
      const filter = tab.dataset.filter;
      filterProgramCards(filter);
    });
  });

  // E. Lead capture form at the bottom of Results
  const leadForm = document.getElementById("results-lead-form");
  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const phoneInput = document.getElementById("lead-phone");
      const nameInput = document.getElementById("lead-name");
      const emailInput = document.getElementById("lead-email");
      
      const data = {
        name: nameInput ? nameInput.value.trim() : STATE.user.name,
        email: emailInput ? emailInput.value.trim() : STATE.user.email,
        phone: phoneInput ? phoneInput.value.trim() : "",
        hollandCode: getHollandCodeString(),
        scores: STATE.scores,
        primaryMatches: STATE.topMatches.map(m => m.name)
      };
      
      // Mock saving to server/localStorage
      localStorage.setItem("dmu_lead_capture", JSON.stringify(data));
      
      // Show elegant success confirmation overlay
      const leadSection = document.getElementById("results-lead-section");
      if (leadSection) {
        leadSection.innerHTML = `
          <div class="lead-success-msg">
            <svg class="success-icon" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <h3>Thank You, ${data.name}!</h3>
            <p>Your comprehensive DMU Dubai Career Report has been generated and queued. An admissions representative will email you at <strong>${data.email}</strong> shortly.</p>
            <div class="lead-success-actions">
              <a href="https://www.dmu.ac.uk/dubai" target="_blank" class="dmu-btn dmu-btn-primary">Browse DMU Dubai Website</a>
              <button onclick="location.reload()" class="dmu-btn dmu-btn-outline">Start Over</button>
            </div>
          </div>
        `;
      }
    });
  }

  // F. Modal Closing
  const modalClose = document.querySelector(".dmu-modal-close");
  const modal = document.getElementById("dmu-program-modal");
  if (modalClose && modal) {
    modalClose.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.classList.remove("modal-open");
    });
    
    // Close on click outside modal content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
      }
    });
  }
}

// 7. Question Rendering
function renderQuestion() {
  const activeQuestion = QUESTIONS[STATE.currentQuestionIndex];
  
  // Set question numbers
  const progressText = document.getElementById("quiz-progress-text");
  if (progressText) {
    progressText.innerText = `STATEMENT ${STATE.currentQuestionIndex + 1} OF ${QUESTIONS.length}`;
  }
  
  // Set question statement
  const textEl = document.getElementById("question-text");
  if (textEl) {
    // Elegant transition effect using keyframes
    textEl.style.animation = "none";
    void textEl.offsetWidth; // Trigger reflow
    textEl.style.animation = "slideIn 0.3s ease forwards";
    textEl.innerText = activeQuestion.text;
  }
  
  // Update Visual Progress Bar
  const fillEl = document.getElementById("quiz-progress-fill");
  if (fillEl) {
    const percent = Math.round(((STATE.currentQuestionIndex) / QUESTIONS.length) * 100);
    fillEl.style.width = `${percent}%`;
  }
  
  // Toggle Back Button visibility
  const prevBtn = document.getElementById("prev-question-btn");
  if (prevBtn) {
    if (STATE.currentQuestionIndex > 0) {
      prevBtn.style.opacity = "1";
      prevBtn.style.pointerEvents = "auto";
    } else {
      prevBtn.style.opacity = "0";
      prevBtn.style.pointerEvents = "none";
    }
  }
  
  // Restore previous answer selection styling if available
  const existingAnswer = STATE.answers[activeQuestion.id];
  const likertButtons = document.querySelectorAll(".likert-choice-btn");
  likertButtons.forEach(btn => {
    btn.classList.remove("active");
    if (existingAnswer && parseInt(btn.dataset.score) === existingAnswer) {
      btn.classList.add("active");
    }
  });
}

// 8. Anticipation Building Loader Screen
function startAnalysisLoader() {
  const loaderText = document.getElementById("loader-status-text");
  const loaderProgress = document.getElementById("loader-ring-progress");
  
  const statuses = [
    { text: "Tallying Realistic traits...", progress: 15 },
    { text: "Assessing Investigative responses...", progress: 32 },
    { text: "Mapping Artistic priorities...", progress: 50 },
    { text: "Evaluating Social interests...", progress: 68 },
    { text: "Correlating Enterprising motives...", progress: 83 },
    { text: "Formatting Conventional codes...", progress: 94 },
    { text: "Matching DMU Dubai academic paths...", progress: 100 }
  ];
  
  let currentIdx = 0;
  
  const interval = setInterval(() => {
    if (currentIdx < statuses.length) {
      if (loaderText) loaderText.innerText = statuses[currentIdx].text;
      if (loaderProgress) loaderProgress.style.strokeDashoffset = 314 - (314 * statuses[currentIdx].progress / 100);
      currentIdx++;
    } else {
      clearInterval(interval);
      
      // Calculate scores and direct to Results
      calculateRIASECScores();
      calculateProgramMatches();
      showView("results");
    }
  }, 350);
}

// 9. RIASEC Scoring Computations
function calculateRIASECScores() {
  // Clear out
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  
  // Accumulate
  QUESTIONS.forEach(q => {
    const rating = STATE.answers[q.id] || 3; // Fallback to neutral
    scores[q.category] += rating;
  });
  
  STATE.scores = scores;
}

// Get the letters sorted by score, returning 3-letter code
function getHollandCodeString() {
  const sorted = Object.keys(STATE.scores).sort((a, b) => STATE.scores[b] - STATE.scores[a]);
  return sorted.slice(0, 3).join("");
}

// 10. Vector Dot Product Matching Logic
function calculateProgramMatches() {
  const scores = STATE.scores;
  
  // Filter programs to only evaluate the user's selected study level of interest
  const filteredPrograms = PROGRAMS.filter(prog => prog.level === STATE.user.level);
  
  const matches = filteredPrograms.map(prog => {
    // 1. Calculate Dot Product: sum(studentScore * programWeight)
    let dotProduct = 0;
    let maxWeightProduct = 0;
    let minWeightProduct = 0;
    
    Object.keys(prog.weights).forEach(key => {
      const weight = prog.weights[key];
      const limits = CATEGORY_SCORE_LIMITS[key];
      dotProduct += scores[key] * weight;
      maxWeightProduct += limits.max * weight;
      minWeightProduct += limits.min * weight;
    });
    
    // 2. Normalize and map to a highly positive, statistically sound scale (50% to 99%)
    let matchPercentage = 50;
    if (maxWeightProduct > minWeightProduct) {
      matchPercentage = 50 + Math.round(((dotProduct - minWeightProduct) / (maxWeightProduct - minWeightProduct)) * 49);
    }
    
    return {
      ...prog,
      matchPercentage: matchPercentage
    };
  });
  
  // Sort programs in descending order of compatibility
  matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
  
  STATE.topMatches = matches.slice(0, 3);
  STATE.allMatches = matches;
}

// 11. Results Display Rendering
function renderResults() {
  // A. Welcome name text
  const resultTitle = document.getElementById("results-user-title");
  if (resultTitle) {
    resultTitle.innerText = `YOUR RESULTS ARE IN, ${STATE.user.name.toUpperCase()}!`;
  }

  // B. Holland Code Code Box
  const codeStr = getHollandCodeString();
  const codeBox = document.getElementById("holland-code-badge");
  if (codeBox) {
    codeBox.innerText = codeStr;
  }

  // C. Personality Title & Description
  const personalityTitle = document.getElementById("personality-title");
  const personalityDesc = document.getElementById("personality-desc");
  
  const descriptionMap = {
    R: { name: "Realistic", description: "You are practical, direct, and hands-on. You love working with physical objects, machinery, technology, and applied physics. You enjoy seeing tangible results from your efforts." },
    I: { name: "Investigative", description: "You are intellectual, analytical, and curious. You enjoy exploring complex theoretical problems, coding logical software systems, reading academic journals, and researching scientific phenomena." },
    A: { name: "Artistic", description: "You are highly creative, expressive, and original. You prefer unstructured environments where you can experiment with digital designs, copywriting, advertising ideas, and innovative marketing campaigns." },
    S: { name: "Social", description: "You are supportive, empathetic, and communicative. You are energized by helping people, teaching complex topics, supporting wellbeing, and collaborating within teams to build societal success." },
    E: { name: "Enterprising", description: "You are highly persuasive, ambitious, and leader-like. You enjoy pitching startup ideas, managing financial timelines, presenting campaigns, and driving high-performance teams to achieve strategic goals." },
    C: { name: "Conventional", description: "You are extremely detail-oriented, systematic, and organized. You appreciate structured guidelines, data accuracy, balancing commercial spreadsheets, and managing complex administrative databases." }
  };

  const primaryType = codeStr[0];
  const secType = codeStr[1];
  const tertType = codeStr[2];
  
  if (personalityTitle && descriptionMap[primaryType]) {
    personalityTitle.innerText = `PRIMARY TYPE: ${descriptionMap[primaryType].name.toUpperCase()} (${primaryType})`;
  }
  if (personalityDesc && descriptionMap[primaryType]) {
    personalityDesc.innerHTML = `
      <p>Your primary interest theme is <strong>${descriptionMap[primaryType].name}</strong>: ${descriptionMap[primaryType].description}</p>
      <p class="secondary-types-paragraph">Your unique secondary profiles are <strong>${descriptionMap[secType].name} (${secType})</strong> and <strong>${descriptionMap[tertType].name} (${tertType})</strong>, creating a powerful blend that fuels your ideal academic pathway.</p>
    `;
  }

  // D. Render Scores Bar Chart
  const chartContainer = document.getElementById("riasec-bars-container");
  if (chartContainer) {
    chartContainer.innerHTML = ""; // Clear existing
    
    const colors = {
      R: "#737373", // Realistic - Steel Gray
      I: "#2563eb", // Investigative - Blue
      A: "#8b5cf6", // Artistic - Purple
      S: "#10b981", // Social - Emerald Green
      E: "#c8102e", // Enterprising - DMU Red
      C: "#d97706"  // Conventional - Amber Orange
    };
    
    const nameLabels = {
      R: "REALISTIC (R)",
      I: "INVESTIGATIVE (I)",
      A: "ARTISTIC (A)",
      S: "SOCIAL (S)",
      E: "ENTERPRISING (E)",
      C: "CONVENTIONAL (C)"
    };
    
    // Render in order of scores
    const sortedKeys = Object.keys(STATE.scores).sort((a, b) => STATE.scores[b] - STATE.scores[a]);
    
    sortedKeys.forEach(key => {
      const score = STATE.scores[key];
      const maxForCategory = CATEGORY_SCORE_LIMITS[key].max;
      const percentOfMax = Math.round((score / maxForCategory) * 100);
      
      const barItem = document.createElement("div");
      barItem.className = "chart-bar-item";
      barItem.innerHTML = `
        <div class="chart-bar-label">
          <span class="bar-name">${nameLabels[key]}</span>
          <span class="bar-score">${score}/${maxForCategory}</span>
        </div>
        <div class="chart-bar-track">
          <div class="chart-bar-fill" style="width: ${percentOfMax}%; background-color: ${colors[key]}"></div>
        </div>
      `;
      chartContainer.appendChild(barItem);
    });
  }

  // E. Render Top 3 Match Cards
  const topMatchesGrid = document.getElementById("top-matches-grid");
  if (topMatchesGrid) {
    topMatchesGrid.innerHTML = "";
    
    STATE.topMatches.forEach((match, idx) => {
      const rankText = idx === 0 ? "🥇 CRITICAL MATCH" : idx === 1 ? "🥈 STRONG MATCH" : "🥉 KEY MATCH";
      const card = document.createElement("div");
      card.className = "match-card premium-card";
      card.innerHTML = `
        <div class="card-rank-badge">${rankText}</div>
        <div class="match-percentage-badge">${match.matchPercentage}% MATCH</div>
        <div class="match-card-faculty">${match.faculty.toUpperCase()}</div>
        <h3 class="match-card-title">${match.name}</h3>
        <p class="match-card-desc">${match.description}</p>
        
        <div class="match-skills-block">
          <strong>Key Competencies:</strong>
          <div class="match-skills-tags">
            ${match.skills.map(s => `<span class="skill-tag">${s}</span>`).join("")}
          </div>
        </div>
        
        <div class="match-card-actions">
          <button class="dmu-btn dmu-btn-primary full-width view-program-detail" data-slug="${match.slug}">Program Details</button>
          <a href="${match.link}" target="_blank" class="dmu-btn dmu-btn-outline full-width text-center">Visit Official Webpage ↗</a>
        </div>
      `;
      
      topMatchesGrid.appendChild(card);
    });
  }

  // F. Render All Matches / List Section (below Top 3)
  renderAllMatchesList();

  // G. Preset Lead Intake Fields if already filled in Welcome
  const leadNameInput = document.getElementById("lead-name");
  const leadEmailInput = document.getElementById("lead-email");
  if (leadNameInput) leadNameInput.value = STATE.user.name;
  if (leadEmailInput) leadEmailInput.value = STATE.user.email;

  // H. Attach event listeners to dynamically rendered program details buttons
  attachDynamicCardEvents();
}

// 12. Render All Matches List
function renderAllMatchesList() {
  const container = document.getElementById("all-matches-list");
  if (!container) return;
  
  container.innerHTML = "";
  
  STATE.allMatches.forEach(match => {
    const isTop3 = STATE.topMatches.some(m => m.slug === match.slug);
    const topBadge = isTop3 ? `<span class="inline-rank-badge">Top Fit</span>` : "";
    
    const item = document.createElement("div");
    item.className = "all-match-row";
    item.dataset.faculty = match.faculty;
    item.innerHTML = `
      <div class="row-compatibility">
        <div class="compatibility-circle" style="border-color: ${match.matchPercentage >= 85 ? '#c8102e' : '#737373'}">
          <span class="circle-val">${match.matchPercentage}%</span>
        </div>
      </div>
      <div class="row-details">
        <div class="row-faculty-info">
          <span class="row-faculty">${match.faculty.toUpperCase()}</span>
          ${topBadge}
        </div>
        <h4 class="row-title">${match.name}</h4>
        <p class="row-desc-mobile">${match.description.slice(0, 100)}...</p>
      </div>
      <div class="row-action">
        <button class="dmu-btn dmu-btn-outline compact-btn view-program-detail" data-slug="${match.slug}">View</button>
      </div>
    `;
    
    container.appendChild(item);
  });
}

// 13. Dynamic Cards event binding for details modals
function attachDynamicCardEvents() {
  document.querySelectorAll(".view-program-detail").forEach(btn => {
    btn.addEventListener("click", () => {
      const slug = btn.dataset.slug;
      openProgramModal(slug);
    });
  });
}

// 14. Faculty Filtering Controller
function filterProgramCards(facultyFilter) {
  const rows = document.querySelectorAll(".all-match-row");
  
  rows.forEach(row => {
    const rowFaculty = row.dataset.faculty;
    if (facultyFilter === "all" || rowFaculty === facultyFilter) {
      row.style.display = "flex";
      row.style.animation = "fadeIn 0.25s ease forwards";
    } else {
      row.style.display = "none";
    }
  });
}

// 15. Program Detail Modal Handler
function openProgramModal(slug) {
  const program = PROGRAMS.find(p => p.slug === slug);
  if (!program) return;

  const modal = document.getElementById("dmu-program-modal");
  const mTitle = document.getElementById("modal-program-title");
  const mFaculty = document.getElementById("modal-program-faculty");
  const mDesc = document.getElementById("modal-program-desc");
  const mSkills = document.getElementById("modal-program-skills");
  const mLink = document.getElementById("modal-program-link");
  const mRiasecMatch = document.getElementById("modal-program-riasec-match");
  
  if (!modal) return;
  
  // Set contents
  if (mTitle) mTitle.innerText = program.name;
  if (mFaculty) mFaculty.innerText = program.faculty.toUpperCase();
  if (mDesc) mDesc.innerText = program.description;
  if (mLink) mLink.href = program.link;
  
  // Render Skills
  if (mSkills) {
    mSkills.innerHTML = program.skills.map(s => `<li>${s}</li>`).join("");
  }
  
  // Generate match details text
  if (mRiasecMatch) {
    const sortedWeights = Object.keys(program.weights)
      .filter(k => program.weights[k] > 0)
      .sort((a, b) => program.weights[b] - program.weights[a]);
    
    const riasecFullNames = {
      R: "Realistic (Hands-on)",
      I: "Investigative (Analytical)",
      A: "Artistic (Creative)",
      S: "Social (Helper/Teacher)",
      E: "Enterprising (Business/Leader)",
      C: "Conventional (Organized)"
    };
    
    const mappedTypes = sortedWeights.map(w => {
      const importance = program.weights[w] >= 8 ? "Primary Fit" : "Secondary Fit";
      return `<li><strong>${riasecFullNames[w]}</strong> - ${importance}</li>`;
    });
    
    mRiasecMatch.innerHTML = mappedTypes.join("");
  }
  
  // Open modal
  modal.classList.add("active");
  document.body.classList.add("modal-open");
}
