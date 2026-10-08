import { JobRequirement, Candidate } from '../types';

export const INITIAL_JOBS: JobRequirement[] = [
  {
    id: 'job-swe-101',
    title: 'Senior Full-Stack Software Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA (Hybrid / Remote Option)',
    employmentType: 'Full-time',
    experienceLevel: '4+ years',
    educationRequirement: "Bachelor's degree in Computer Science, Software Engineering, or related technical discipline",
    description: `We are seeking an experienced Full-Stack Software Engineer to build resilient distributed systems and intuitive enterprise user experiences. You will architect REST and GraphQL APIs, scale cloud microservices on AWS, and lead modern web frontends using React, TypeScript, and Tailwind CSS.
    
Responsibilities:
- Design, develop, and maintain web services using Node.js/TypeScript and Python.
- Build high-performance frontend interfaces in React and state management.
- Design database schemas and write optimized queries across PostgreSQL and Redis.
- Collaborate with product managers and UX designers to ship weekly releases.
- Mentor junior engineers and champion test coverage, CI/CD automation, and clean code principles.`,
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'REST APIs'],
    preferredSkills: ['Docker', 'Kubernetes', 'GraphQL', 'Redis', 'CI/CD Pipelines'],
    certifications: ['AWS Certified Solutions Architect (Optional)'],
    responsibilities: [
      'Architect full-stack web applications',
      'Optimize database queries and cache layers',
      'Maintain 99.9% uptime for core API endpoints',
      'Lead sprint technical designs and code reviews'
    ],
    technicalRequirements: [
      'Proficiency in React 18+ and TypeScript',
      'Hands-on experience with cloud infrastructure (AWS ECS, S3, RDS)',
      'Solid understanding of relational database schema design'
    ],
    softSkills: ['Problem Solving', 'Cross-functional Collaboration', 'Technical Mentorship', 'Clear Communication'],
    keywords: ['React', 'TypeScript', 'Python', 'AWS', 'PostgreSQL', 'Docker', 'Full-Stack'],
    seniority: 'Senior',
    status: 'Active',
    applicantsCount: 42,
    shortlistedCount: 8,
    createdAt: '2026-08-20'
  },
  {
    id: 'job-emb-102',
    title: 'Embedded Systems Engineer',
    department: 'Hardware & IoT',
    location: 'Boston, MA (On-site)',
    employmentType: 'Full-time',
    experienceLevel: '3+ years',
    educationRequirement: "Bachelor's or Master's in Electrical Engineering, Computer Engineering, or Robotics",
    description: `Join our next-generation IoT hardware team developing low-power medical telemetry devices and smart sensor modules. You will develop firmware for ARM Cortex-M microcontrollers, write low-level device drivers, and ensure compliance with medical safety standards.`,
    requiredSkills: ['C', 'C++', 'ARM Cortex-M', 'RTOS (FreeRTOS)', 'I2C / SPI / UART', 'Oscilloscopes & Logic Analyzers'],
    preferredSkills: ['BLE / Bluetooth Low Energy', 'PCB Design (KiCad/Altium)', 'Python Automation', 'Git'],
    certifications: ['Certified Embedded Systems Engineer'],
    responsibilities: [
      'Develop embedded firmware for ultra-low power microcontroller nodes',
      'Bring up bare-metal board hardware and troubleshoot timing issues',
      'Perform hardware-in-the-loop automated testing'
    ],
    technicalRequirements: [
      '3+ years writing C/C++ for resource-constrained microcontrollers',
      'Deep familiarity with peripheral bus protocols (SPI, I2C, CAN, UART)',
      'Experience reading board schematics and soldering rework'
    ],
    softSkills: ['Attention to Detail', 'Analytical Debugging', 'Safety Focus'],
    keywords: ['C', 'C++', 'FreeRTOS', 'ARM', 'Firmware', 'IoT', 'Hardware'],
    seniority: 'Mid-Level',
    status: 'Active',
    applicantsCount: 28,
    shortlistedCount: 5,
    createdAt: '2026-08-25'
  },
  {
    id: 'job-da-103',
    title: 'Lead Data Analyst',
    department: 'Data & Analytics',
    location: 'New York, NY (Hybrid)',
    employmentType: 'Full-time',
    experienceLevel: '5+ years',
    educationRequirement: "Bachelor's or Master's degree in Statistics, Mathematics, Economics, or Computer Science",
    description: `We are looking for a Lead Data Analyst to translate complex customer behavioral datasets into actionable commercial insights, predictive retention models, and executive executive reporting dashboards.`,
    requiredSkills: ['SQL (Advanced)', 'Python', 'Tableau / Power BI', 'Statistical Modeling', 'A/B Testing', 'Data Warehousing (Snowflake/BigQuery)'],
    preferredSkills: ['dbt', 'Pandas/NumPy', 'Airflow', 'Machine Learning Foundations'],
    certifications: ['Tableau Desktop Specialist', 'Snowflake SnowPro'],
    responsibilities: [
      'Lead enterprise metric modeling and KPI dashboards for executive stakeholders',
      'Run rigorous hypothesis testing and multivariate experimentation',
      'Collaborate with data engineers to optimize dimensional data marts'
    ],
    technicalRequirements: [
      '5+ years transforming large-scale tabular datasets with advanced SQL (window functions, CTEs)',
      'Proven expertise designing impactful visual analytics dashboards'
    ],
    softSkills: ['Executive Presentation', 'Data Storytelling', 'Strategic Thinking'],
    keywords: ['SQL', 'Python', 'Tableau', 'Snowflake', 'A/B Testing', 'Analytics'],
    seniority: 'Lead',
    status: 'Active',
    applicantsCount: 35,
    shortlistedCount: 6,
    createdAt: '2026-08-28'
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-001',
    jobId: 'job-swe-101',
    jobTitle: 'Senior Full-Stack Software Engineer',
    resumeFileName: 'Rahul_Sharma_Resume.pdf',
    resumeFileSize: '245 KB',
    uploadDate: '2026-09-01',
    pipelineStatus: 'Shortlisted',
    isDemo: true,
    structuredResume: {
      candidateName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Jose, CA',
      summary: 'Senior Software Engineer with 5+ years of full-stack engineering experience building cloud-native web applications using TypeScript, React, Node.js, and AWS.',
      totalExperienceYears: 5.2,
      education: [
        {
          degree: 'Bachelor of Science',
          field: 'Computer Science',
          institution: 'University of California, Davis',
          year: '2021',
          gpa: '3.8'
        }
      ],
      technicalSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS (S3, RDS, Lambda)', 'REST APIs', 'Docker', 'Git', 'Tailwind CSS'],
      softSkills: ['Team Mentorship', 'Agile Delivery', 'Problem Solving', 'System Design'],
      workExperience: [
        {
          company: 'CloudScale Technologies',
          role: 'Senior Software Engineer',
          period: '2023 - Present',
          years: 2.8,
          description: 'Architected customer-facing portals and microservices handling 4M daily transactions.',
          highlights: [
            'Migrated legacy frontend to React 18 and TypeScript, reducing page load latency by 38%.',
            'Implemented resilient asynchronous message queues with AWS SQS and Node.js microservices.',
            'Mentored 4 junior engineers on unit testing, pull request rigor, and CI/CD pipelines.'
          ]
        },
        {
          company: 'Apex Data Systems',
          role: 'Software Engineer',
          period: '2021 - 2023',
          years: 2.4,
          description: 'Developed Python backend APIs and React customer dashboards.',
          highlights: [
            'Designed PostgreSQL schemas and optimized queries, lowering query execution times by 45%.',
            'Integrated Stripe payment gateway and automated webhook event handlers.'
          ]
        }
      ],
      projects: [
        {
          name: 'Distributed Task Orchestrator',
          description: 'Open-source distributed background worker built with TypeScript, Redis, and Docker.',
          technologies: ['TypeScript', 'Redis', 'Docker', 'Node.js']
        }
      ],
      certifications: ['AWS Certified Developer - Associate (2024)'],
      achievements: ['Won Internal Hackathon 2024 for Real-time Collaborative Canvas'],
      languages: ['English', 'Hindi']
    },
    evaluation: {
      scores: {
        overall: 92,
        requiredSkills: 95,
        experience: 90,
        education: 100,
        preferredSkills: 85,
        projectRelevance: 90,
        certifications: 80
      },
      scoreEvidence: {
        requiredSkills: {
          dimension: 'Required Skills',
          score: 95,
          weight: 40,
          matchedRequirement: 'React 18+, TypeScript, Node.js, Python, PostgreSQL, AWS',
          evidenceFromResume: 'Evidenced across 5.2 years of engineering: migrated legacy frontend to React 18 & TS at CloudScale; designed PostgreSQL schemas and Python pipelines at Apex Data.',
          matchStatus: 'matched',
          missingRequirement: 'None',
          confidence: 96
        },
        experience: {
          dimension: 'Experience & Seniority',
          score: 90,
          weight: 25,
          matchedRequirement: '4+ years required for Senior Full-Stack Engineer',
          evidenceFromResume: '5.2 verified years as Senior Software Engineer (CloudScale Technologies) and Full Stack Developer (Apex Data Systems).',
          matchStatus: 'matched',
          missingRequirement: 'None - exceeds 4+ year requirement by 1.2 years',
          confidence: 98
        },
        education: {
          dimension: 'Education Alignment',
          score: 100,
          weight: 15,
          matchedRequirement: "B.S. in Computer Science or Software Engineering",
          evidenceFromResume: 'B.S. in Computer Science from University of Washington (2021).',
          matchStatus: 'matched',
          missingRequirement: 'None',
          confidence: 99
        },
        preferredSkills: {
          dimension: 'Preferred Competencies',
          score: 85,
          weight: 10,
          matchedRequirement: 'Docker, Kubernetes, Redis, CI/CD',
          evidenceFromResume: 'Docker and Redis integrated into Distributed Task Orchestrator project; automated GitHub Actions CI/CD workflows.',
          matchStatus: 'matched',
          missingRequirement: 'No direct enterprise Kubernetes production deployment record found.',
          confidence: 91
        },
        projectRelevance: {
          dimension: 'Project Depth & Scope',
          score: 90,
          weight: 5,
          matchedRequirement: 'Enterprise full-stack architecture and microservices',
          evidenceFromResume: 'Distributed Task Orchestrator (Node.js, Redis, Docker) processing asynchronous workloads with worker pooling.',
          matchStatus: 'matched',
          missingRequirement: 'None',
          confidence: 94
        },
        certifications: {
          dimension: 'Certifications & Credentials',
          score: 80,
          weight: 5,
          matchedRequirement: 'AWS or cloud provider certifications',
          evidenceFromResume: 'AWS Certified Developer – Associate (Issued 2023).',
          matchStatus: 'matched',
          missingRequirement: 'None',
          confidence: 98
        }
      },
      recommendation: 'Strongly Recommended',
      aiExplanation: 'Strong match. The candidate possesses 5.2 years of relevant software engineering experience, directly aligned with the required seniority. Demonstrates high proficiency in React, TypeScript, Node.js, Python, PostgreSQL, and AWS, corroborated by production metrics. Possesses Docker experience; only Kubernetes is unstated.',
      goodFitReasons: [
        'Exceeds 4+ years requirement with 5.2 years of continuous modern full-stack development.',
        'Production track record optimizing React 18 performance and architecting scalable AWS cloud services.',
        'Holds relevant AWS Certified Developer credential and CS degree from an accredited institution.'
      ],
      potentialConcerns: [
        'No direct mention of Kubernetes orchestrations in production (Docker is listed).'
      ],
      missingRequirements: [
        'Kubernetes container orchestration'
      ],
      resumeEvidence: [
        'CloudScale Technologies: "Migrated legacy frontend to React 18 and TypeScript, reducing page load latency by 38%."',
        'Apex Data Systems: "Designed PostgreSQL schemas and optimized queries, lowering execution times by 45%."'
      ],
      skillGaps: [
        { skill: 'React', matchedRequirement: 'React 18+ framework proficiency', status: 'matched', category: 'required', evidence: 'Led React 18 frontend migration at CloudScale', evidenceFromResume: 'CloudScale Technologies: "Migrated legacy frontend to React 18 and TypeScript, reducing page load latency by 38%."', missingRequirement: 'None', confidence: 97 },
        { skill: 'TypeScript', matchedRequirement: 'Strict typing and modern TypeScript architecture', status: 'matched', category: 'required', evidence: 'Primary language across 5 years of production stack', evidenceFromResume: 'Primary language across all CloudScale and Apex repositories', missingRequirement: 'None', confidence: 96 },
        { skill: 'Node.js', matchedRequirement: 'Backend API microservices development', status: 'matched', category: 'required', evidence: 'Built microservices and API gateways', evidenceFromResume: 'Engineered RESTful Node.js services handling authentication and routing', missingRequirement: 'None', confidence: 95 },
        { skill: 'Python', matchedRequirement: 'Data services and Python backend utilities', status: 'matched', category: 'required', evidence: 'Developed backend data pipelines at Apex Data', evidenceFromResume: 'Apex Data Systems: "Engineered automated data pipelines using Python and Celery"', missingRequirement: 'None', confidence: 92 },
        { skill: 'PostgreSQL', matchedRequirement: 'Relational database schema modeling & optimization', status: 'matched', category: 'required', evidence: 'Optimized relational schemas reducing latency by 45%', evidenceFromResume: 'Apex Data Systems: "Designed PostgreSQL schemas and optimized queries, lowering execution times by 45%"', missingRequirement: 'None', confidence: 96 },
        { skill: 'AWS', matchedRequirement: 'Cloud infrastructure (S3, Lambda, RDS, IAM)', status: 'matched', category: 'required', evidence: 'AWS Certified Developer; engineered S3/RDS/Lambda solutions', evidenceFromResume: 'Certified AWS Developer Associate (2023) and active cloud deployment lead', missingRequirement: 'None', confidence: 95 },
        { skill: 'REST APIs', matchedRequirement: 'API contract design and OpenAPI specification', status: 'matched', category: 'required', evidence: 'Developed internal and public customer APIs', evidenceFromResume: 'Defined RESTful endpoints and API versioning strategies', missingRequirement: 'None', confidence: 94 },
        { skill: 'Docker', matchedRequirement: 'Containerization and local runtime parity', status: 'matched', category: 'preferred', evidence: 'Containerized microservices in Distributed Task Orchestrator', evidenceFromResume: 'Distributed Task Orchestrator project: multi-container Docker compose setup', missingRequirement: 'None', confidence: 93 },
        { skill: 'Redis', matchedRequirement: 'In-memory caching and session queues', status: 'matched', category: 'preferred', evidence: 'Integrated Redis caching layer', evidenceFromResume: 'Applied Redis for job queues and session store in backend microservices', missingRequirement: 'None', confidence: 90 },
        { skill: 'Kubernetes', matchedRequirement: 'Container orchestration and cluster deployment', status: 'missing', category: 'preferred', evidence: 'Not mentioned in resume work history', evidenceFromResume: 'No explicit cluster orchestration or Helm manifest authoring identified in resume', missingRequirement: 'Verify production Kubernetes familiarity during interview screen', confidence: 91 }
      ],
      matchedCompetenciesCount: 9,
      totalCompetenciesCount: 10
    }
  },
  {
    id: 'cand-002',
    jobId: 'job-swe-101',
    jobTitle: 'Senior Full-Stack Software Engineer',
    resumeFileName: 'Priya_Patel_CV.docx',
    resumeFileSize: '310 KB',
    uploadDate: '2026-09-02',
    pipelineStatus: 'Shortlisted',
    isDemo: true,
    structuredResume: {
      candidateName: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+1 (555) 345-6789',
      location: 'Seattle, WA',
      summary: 'Full-Stack Engineer with 4.5 years specializing in React, TypeScript, GraphQL APIs, and cloud infrastructure on AWS and Docker.',
      totalExperienceYears: 4.5,
      education: [
        {
          degree: 'Bachelor of Science',
          field: 'Software Engineering',
          institution: 'University of Washington',
          year: '2022',
          gpa: '3.9'
        }
      ],
      technicalSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Jest'],
      softSkills: ['Code Quality', 'Cross-team Communication', 'Mentorship'],
      workExperience: [
        {
          company: 'Vanguard Digital Solutions',
          role: 'Full Stack Engineer',
          period: '2022 - Present',
          years: 3.5,
          description: 'Engineered high-throughput enterprise SaaS workflows using React, TypeScript, and AWS.',
          highlights: [
            'Built GraphQL federated subgraph APIs serving 150k monthly active users.',
            'Configured Docker and Kubernetes deployment manifests on AWS EKS.',
            'Maintained 94% unit and integration test coverage across core services.'
          ]
        }
      ],
      projects: [
        {
          name: 'GraphQL Schema Registry',
          description: 'Automated schema validation tool for microservice deployments.',
          technologies: ['React', 'TypeScript', 'Node.js', 'GraphQL']
        }
      ],
      certifications: ['AWS Solutions Architect Associate (2023)'],
      achievements: ['Dean’s Honor List 2020-2022'],
      languages: ['English', 'Gujarati']
    },
    evaluation: {
      scores: {
        overall: 89,
        requiredSkills: 90,
        experience: 88,
        education: 100,
        preferredSkills: 95,
        projectRelevance: 85,
        certifications: 80
      },
      recommendation: 'Strongly Recommended',
      aiExplanation: 'Strong match. The candidate meets the 4+ years requirement with 4.5 years in production full-stack engineering. Outstanding coverage on modern web stack: React, TypeScript, GraphQL, AWS, Docker, and Kubernetes. Minor gap: Python was not explicitly highlighted in recent roles.',
      goodFitReasons: [
        'Solid background in TypeScript, React, and Node.js microservices.',
        'Hands-on Kubernetes and AWS EKS production deployment experience.',
        'High focus on engineering rigor and automated test coverage.'
      ],
      potentialConcerns: [
        'Less evidence of Python scripting or backend work compared to JavaScript/TypeScript ecosystem.'
      ],
      missingRequirements: [
        'Deep Python backend service experience'
      ],
      resumeEvidence: [
        'Vanguard Digital: "Built GraphQL federated subgraph APIs serving 150k MAU."',
        'AWS Solutions Architect Associate certification verified.'
      ],
      skillGaps: [
        { skill: 'React', status: 'matched', category: 'required', evidence: '3.5 years building enterprise SaaS UI' },
        { skill: 'TypeScript', status: 'matched', category: 'required', evidence: 'Primary daily language at Vanguard Digital' },
        { skill: 'Node.js', status: 'matched', category: 'required', evidence: 'Backend API subgraph services' },
        { skill: 'PostgreSQL', status: 'matched', category: 'required', evidence: 'Designed relational schema for user access control' },
        { skill: 'AWS', status: 'matched', category: 'required', evidence: 'AWS Certified; managed AWS EKS workloads' },
        { skill: 'REST APIs', status: 'matched', category: 'required', evidence: 'Designed REST endpoints alongside GraphQL' },
        { skill: 'Python', status: 'partial', category: 'required', evidence: 'Used in academic coursework, not listed in recent commercial history' },
        { skill: 'Docker', status: 'matched', category: 'preferred', evidence: 'Containerized all microservices' },
        { skill: 'Kubernetes', status: 'matched', category: 'preferred', evidence: 'Managed AWS EKS deployment manifests' },
        { skill: 'GraphQL', status: 'matched', category: 'preferred', evidence: 'Built federated GraphQL subgraphs' }
      ],
      matchedCompetenciesCount: 9,
      totalCompetenciesCount: 10
    }
  },
  {
    id: 'cand-003',
    jobId: 'job-swe-101',
    jobTitle: 'Senior Full-Stack Software Engineer',
    resumeFileName: 'Amit_Shah_Resume.pdf',
    resumeFileSize: '190 KB',
    uploadDate: '2026-09-03',
    pipelineStatus: 'Screened',
    isDemo: true,
    structuredResume: {
      candidateName: 'Amit Shah',
      email: 'amit.shah@example.com',
      phone: '+1 (555) 456-7890',
      location: 'Austin, TX',
      summary: 'Backend-leaning Full Stack Software Developer with 4 years of experience writing Python (FastAPI/Django), PostgreSQL, and React frontends.',
      totalExperienceYears: 4.0,
      education: [
        {
          degree: 'Bachelor of Technology',
          field: 'Information Technology',
          institution: 'University of Texas at Dallas',
          year: '2022'
        }
      ],
      technicalSkills: ['Python', 'Django', 'FastAPI', 'PostgreSQL', 'React', 'JavaScript', 'AWS (EC2, S3)', 'Docker', 'Git'],
      softSkills: ['Analytical Mindset', 'Self-starter', 'Documentation'],
      workExperience: [
        {
          company: 'FinTrack Systems',
          role: 'Software Developer',
          period: '2022 - Present',
          years: 3.5,
          description: 'Built financial reporting APIs and analytics dashboards.',
          highlights: [
            'Created high-performance Python FastAPI services serving financial transaction reports.',
            'Wrote React dashboards with charting components for real-time portfolio tracking.'
          ]
        }
      ],
      projects: [
        {
          name: 'Personal Budget Sync',
          description: 'Full-stack application syncing bank feeds via Plaid API.',
          technologies: ['Python', 'React', 'PostgreSQL']
        }
      ],
      certifications: [],
      achievements: ['Promoted to Software Developer II in 18 months'],
      languages: ['English']
    },
    evaluation: {
      scores: {
        overall: 84,
        requiredSkills: 85,
        experience: 84,
        education: 90,
        preferredSkills: 75,
        projectRelevance: 85,
        certifications: 50
      },
      recommendation: 'Recommended',
      aiExplanation: 'Good match. Meets the 4-year experience requirement. Strong Python and relational database skills (PostgreSQL), with solid React fundamentals. TypeScript is not emphasized on the frontend (primarily JavaScript), and lacks Kubernetes or AWS certifications.',
      goodFitReasons: [
        'Robust Python API experience (FastAPI, Django) and PostgreSQL database optimization.',
        'Active full-stack experience shipping React consumer interfaces.'
      ],
      potentialConcerns: [
        'Uses vanilla JavaScript more than strict TypeScript in frontend work.',
        'Limited cloud infrastructure automation compared to senior peers.'
      ],
      missingRequirements: [
        'Extensive TypeScript frontend typing',
        'Advanced container orchestration (Kubernetes)'
      ],
      resumeEvidence: [
        'FinTrack Systems: "Created high-performance Python FastAPI services serving financial transaction reports."'
      ],
      skillGaps: [
        { skill: 'Python', status: 'matched', category: 'required', evidence: 'Core language in 3.5 years at FinTrack' },
        { skill: 'PostgreSQL', status: 'matched', category: 'required', evidence: 'Optimized financial ledger schemas' },
        { skill: 'React', status: 'matched', category: 'required', evidence: 'Built portfolio tracking frontend' },
        { skill: 'AWS', status: 'matched', category: 'required', evidence: 'Deployed on EC2 and configured S3 buckets' },
        { skill: 'REST APIs', status: 'matched', category: 'required', evidence: 'Designed REST endpoints using FastAPI' },
        { skill: 'TypeScript', status: 'partial', category: 'required', evidence: 'Used JavaScript primarily; basic TypeScript familiarity' },
        { skill: 'Node.js', status: 'partial', category: 'required', evidence: 'Basic utility scripting, Python is primary backend' },
        { skill: 'Docker', status: 'matched', category: 'preferred', evidence: 'Dockerized microservices locally' },
        { skill: 'Kubernetes', status: 'missing', category: 'preferred', evidence: 'No production Kubernetes experience listed' }
      ],
      matchedCompetenciesCount: 7,
      totalCompetenciesCount: 10
    }
  },
  {
    id: 'cand-004',
    jobId: 'job-swe-101',
    jobTitle: 'Senior Full-Stack Software Engineer',
    resumeFileName: 'Neha_Joshi_Resume.txt',
    resumeFileSize: '110 KB',
    uploadDate: '2026-09-04',
    pipelineStatus: 'Screened',
    isDemo: true,
    structuredResume: {
      candidateName: 'Neha Joshi',
      email: 'neha.joshi@example.com',
      phone: '+1 (555) 567-8901',
      location: 'Chicago, IL',
      summary: 'Frontend Engineer with 3 years of experience in React, JavaScript, HTML5/CSS3, and Node.js backend integrations.',
      totalExperienceYears: 3.0,
      education: [
        {
          degree: 'Bachelor of Science',
          field: 'Web Development & Informatics',
          institution: 'Illinois Institute of Technology',
          year: '2023'
        }
      ],
      technicalSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Node.js', 'REST APIs', 'Git'],
      softSkills: ['UI/UX Collaboration', 'Visual Design', 'Communication'],
      workExperience: [
        {
          company: 'PixelCraft Interactive',
          role: 'Frontend Developer',
          period: '2023 - Present',
          years: 2.8,
          description: 'Implemented responsive design systems and web applications in React.',
          highlights: [
            'Built 15+ marketing and customer portal web pages using React and Tailwind CSS.',
            'Collaborated with backend teams to consume REST APIs and handle error states.'
          ]
        }
      ],
      projects: [
        {
          name: 'Design System Library',
          description: 'Custom React UI component library with accessible components.',
          technologies: ['React', 'Storybook', 'Tailwind CSS']
        }
      ],
      certifications: [],
      achievements: ['Employee of the Month (Q1 2024)'],
      languages: ['English', 'Marathi']
    },
    evaluation: {
      scores: {
        overall: 76,
        requiredSkills: 75,
        experience: 70,
        education: 90,
        preferredSkills: 60,
        projectRelevance: 80,
        certifications: 50
      },
      recommendation: 'Consider',
      aiExplanation: 'Moderate match. Strong visual frontend acumen with React and modern CSS. However, total experience (3 years) is below the 4+ years required for a Senior position. Missing heavy backend requirements such as Python and deep PostgreSQL architecture, as well as AWS infrastructure.',
      goodFitReasons: [
        'Excellent React component development and CSS styling proficiency.',
        'High attention to UX details and responsive design.'
      ],
      potentialConcerns: [
        'Does not meet Senior tenure requirements (3 years vs 4+ requested).',
        'Lacks production cloud deployment (AWS) and relational database tuning (PostgreSQL).'
      ],
      missingRequirements: [
        'Senior level tenure (4+ years)',
        'Python backend engineering',
        'AWS infrastructure management',
        'PostgreSQL schema optimization'
      ],
      resumeEvidence: [
        'PixelCraft Interactive: "Built 15+ marketing and customer portal web pages using React and Tailwind CSS."'
      ],
      skillGaps: [
        { skill: 'React', status: 'matched', category: 'required', evidence: '2.8 years primary frontend framework' },
        { skill: 'REST APIs', status: 'matched', category: 'required', evidence: 'Integrated frontend with client REST services' },
        { skill: 'Node.js', status: 'partial', category: 'required', evidence: 'Basic API consumption and simple express stubs' },
        { skill: 'TypeScript', status: 'partial', category: 'required', evidence: 'Listed in coursework, primarily JavaScript in job description' },
        { skill: 'Python', status: 'missing', category: 'required', evidence: 'Not mentioned in resume' },
        { skill: 'PostgreSQL', status: 'missing', category: 'required', evidence: 'Not mentioned in resume' },
        { skill: 'AWS', status: 'missing', category: 'required', evidence: 'No cloud infrastructure experience listed' },
        { skill: 'Docker', status: 'missing', category: 'preferred', evidence: 'No containerization mentioned' }
      ],
      matchedCompetenciesCount: 4,
      totalCompetenciesCount: 10
    }
  },
  {
    id: 'cand-005',
    jobId: 'job-swe-101',
    jobTitle: 'Senior Full-Stack Software Engineer',
    resumeFileName: 'Elena_Rostova_Resume.pdf',
    resumeFileSize: '340 KB',
    uploadDate: '2026-08-30',
    pipelineStatus: 'Interviewing',
    isDemo: true,
    structuredResume: {
      candidateName: 'Elena Rostova',
      email: 'elena.rostova@example.com',
      phone: '+1 (555) 678-9012',
      location: 'Denver, CO',
      summary: 'Principal/Senior Full Stack Engineer with 7+ years of experience architecting cloud services, React web applications, and data pipelines on AWS.',
      totalExperienceYears: 7.5,
      education: [
        {
          degree: 'Master of Science',
          field: 'Computer Science',
          institution: 'University of Colorado Boulder',
          year: '2019'
        }
      ],
      technicalSkills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'Redis', 'GraphQL', 'CI/CD'],
      softSkills: ['Architecture Planning', 'Technical Leadership', 'Executive Reporting'],
      workExperience: [
        {
          company: 'Summit Enterprise Tech',
          role: 'Lead Full-Stack Engineer',
          period: '2021 - Present',
          years: 4.8,
          description: 'Headed core platform team powering B2B analytics platform on AWS.',
          highlights: [
            'Architected micro-frontend architecture in React 18 & TypeScript with automated bundle splitting.',
            'Scaled Python/FastAPI and Node.js backend services to 12k concurrent requests per second.',
            'Managed Kubernetes clusters on AWS EKS and reduced cloud infrastructure spending by 22%.'
          ]
        }
      ],
      projects: [
        {
          name: 'Distributed Event Broker',
          description: 'High performance event streaming connector on Redis and Node.',
          technologies: ['TypeScript', 'Redis', 'Kubernetes']
        }
      ],
      certifications: ['AWS Certified Solutions Architect - Professional (2024)'],
      achievements: ['US Patent Granted for Distributed Web Caching (2023)'],
      languages: ['English', 'German']
    },
    evaluation: {
      scores: {
        overall: 94,
        requiredSkills: 98,
        experience: 96,
        education: 100,
        preferredSkills: 95,
        projectRelevance: 92,
        certifications: 95
      },
      recommendation: 'Strongly Recommended',
      aiExplanation: 'Top tier candidate. 7.5 years of industry experience surpasses the 4+ year requirement. Flawless match across every required and preferred skill: React, TypeScript, Python, PostgreSQL, AWS, Docker, and Kubernetes. Holds AWS Solutions Architect Professional certification.',
      goodFitReasons: [
        'Extensive 7.5-year history leading scalable distributed systems and high-throughput web frontends.',
        'Demonstrated leadership in Kubernetes cluster management and cloud cost optimization.',
        'Holds AWS Professional certification and Master’s degree in Computer Science.'
      ],
      potentialConcerns: [
        'Candidate seniority (7.5 years, Lead title) may be overqualified or have compensation expectations higher than mid-senior band.'
      ],
      missingRequirements: [],
      resumeEvidence: [
        'Summit Enterprise: "Scaled Python/FastAPI and Node.js backend services to 12k concurrent requests/sec."',
        'Patent holder for Distributed Web Caching.'
      ],
      skillGaps: [
        { skill: 'React', status: 'matched', category: 'required', evidence: 'Led micro-frontend migration' },
        { skill: 'TypeScript', status: 'matched', category: 'required', evidence: 'Expert level typing across platforms' },
        { skill: 'Node.js', status: 'matched', category: 'required', evidence: 'High throughput backend services' },
        { skill: 'Python', status: 'matched', category: 'required', evidence: 'FastAPI microservices at scale' },
        { skill: 'PostgreSQL', status: 'matched', category: 'required', evidence: 'Advanced partitioning and index optimization' },
        { skill: 'AWS', status: 'matched', category: 'required', evidence: 'AWS Certified Solutions Architect Professional' },
        { skill: 'REST APIs', status: 'matched', category: 'required', evidence: 'Architected enterprise REST and GraphQL gateways' },
        { skill: 'Docker', status: 'matched', category: 'preferred', evidence: 'Automated container build pipeline' },
        { skill: 'Kubernetes', status: 'matched', category: 'preferred', evidence: 'Directly managed AWS EKS production clusters' },
        { skill: 'Redis', status: 'matched', category: 'preferred', evidence: 'Engineered caching layers and streaming connectors' }
      ],
      matchedCompetenciesCount: 10,
      totalCompetenciesCount: 10
    }
  },
  {
    id: 'cand-006',
    jobId: 'job-emb-102',
    jobTitle: 'Embedded Systems Engineer',
    resumeFileName: 'Marcus_Vance_Resume.pdf',
    resumeFileSize: '215 KB',
    uploadDate: '2026-08-27',
    pipelineStatus: 'Screened',
    isDemo: true,
    structuredResume: {
      candidateName: 'Marcus Vance',
      email: 'marcus.vance@example.com',
      phone: '+1 (555) 789-0123',
      location: 'Cambridge, MA',
      summary: 'Embedded Firmware Developer with 2.5 years of experience in C, ARM Cortex-M microcontrollers, and IoT sensor prototypes.',
      totalExperienceYears: 2.5,
      education: [
        {
          degree: 'Bachelor of Science',
          field: 'Electrical & Computer Engineering',
          institution: 'Northeastern University',
          year: '2023'
        }
      ],
      technicalSkills: ['C', 'C++', 'ARM Cortex-M', 'I2C', 'SPI', 'UART', 'Oscilloscopes', 'Git', 'Python'],
      softSkills: ['Lab Testing', 'Teamwork', 'Prototyping'],
      workExperience: [
        {
          company: 'Sensory Logic Inc',
          role: 'Junior Embedded Engineer',
          period: '2023 - Present',
          years: 2.5,
          description: 'Wrote C drivers for STM32 microcontrollers and tested sensor accuracy.',
          highlights: [
            'Implemented SPI communication driver for accelerometer and temperature sensors.',
            'Used oscilloscopes and logic analyzers to debug bus contention on prototype PCBs.'
          ]
        }
      ],
      projects: [
        {
          name: 'Home Weather Monitor',
          description: 'Low power battery operated environmental sensor node transmitting over BLE.',
          technologies: ['C', 'STM32', 'BLE']
        }
      ],
      certifications: [],
      achievements: ['Capstone Design 1st Place at Northeastern University'],
      languages: ['English']
    },
    evaluation: {
      scores: {
        overall: 81,
        requiredSkills: 86,
        experience: 78,
        education: 90,
        preferredSkills: 80,
        projectRelevance: 85,
        certifications: 50
      },
      recommendation: 'Recommended',
      aiExplanation: 'Solid match for Embedded Systems role. Possesses practical C/C++ experience with ARM Cortex-M microcontrollers and hardware laboratory equipment (oscilloscopes, logic analyzers). Slightly short of 3+ years experience requirement (2.5 years), but shows high technical aptitude.',
      goodFitReasons: [
        'Direct hands-on experience bringing up STM32 ARM Cortex boards and writing C bus drivers (SPI/I2C).',
        'Strong lab testing background with oscilloscopes and logic analyzers.'
      ],
      potentialConcerns: [
        'Experience is 2.5 years (slightly below target 3+ years).',
        'FreeRTOS real-time operating system experience is limited.'
      ],
      missingRequirements: [
        'Production FreeRTOS task scheduling'
      ],
      resumeEvidence: [
        'Sensory Logic: "Used oscilloscopes and logic analyzers to debug bus contention on prototype PCBs."'
      ],
      skillGaps: [
        { skill: 'C', status: 'matched', category: 'required', evidence: 'Primary daily language for STM32 firmware' },
        { skill: 'C++', status: 'matched', category: 'required', evidence: 'Object oriented sensor modeling' },
        { skill: 'ARM Cortex-M', status: 'matched', category: 'required', evidence: 'STM32 platform experience' },
        { skill: 'I2C / SPI / UART', status: 'matched', category: 'required', evidence: 'Wrote custom SPI accelerometer driver' },
        { skill: 'Oscilloscopes & Logic Analyzers', status: 'matched', category: 'required', evidence: 'Hardware lab bus debugging' },
        { skill: 'RTOS (FreeRTOS)', status: 'partial', category: 'required', evidence: 'Academic lab project, bare-metal in commercial work' },
        { skill: 'BLE', status: 'matched', category: 'preferred', evidence: 'Integrated BLE in personal IoT node' },
        { skill: 'PCB Design', status: 'missing', category: 'preferred', evidence: 'No schematic capture or layout work listed' }
      ],
      matchedCompetenciesCount: 6,
      totalCompetenciesCount: 8
    }
  },
  {
    id: 'cand-007',
    jobId: 'job-da-103',
    jobTitle: 'Lead Data Analyst',
    resumeFileName: 'Aisha_Al_Mansoor_Resume.pdf',
    resumeFileSize: '270 KB',
    uploadDate: '2026-08-29',
    pipelineStatus: 'Shortlisted',
    isDemo: true,
    structuredResume: {
      candidateName: 'Aisha Al-Mansoor',
      email: 'aisha.mansoor@example.com',
      phone: '+1 (555) 890-1234',
      location: 'New York, NY',
      summary: 'Data Analyst with 5.5 years of experience leading business intelligence, SQL modeling, Tableau dashboards, and A/B test experimentation in eCommerce.',
      totalExperienceYears: 5.5,
      education: [
        {
          degree: 'Bachelor of Science',
          field: 'Applied Mathematics & Statistics',
          institution: 'Columbia University',
          year: '2020'
        }
      ],
      technicalSkills: ['SQL (Postgres, Snowflake)', 'Python (Pandas, Scikit-learn)', 'Tableau', 'Power BI', 'A/B Testing', 'Snowflake', 'dbt', 'Git'],
      softSkills: ['Stakeholder Engagement', 'Data Storytelling', 'Strategic Roadmapping'],
      workExperience: [
        {
          company: 'OmniRetail Commerce',
          role: 'Senior Analytics Specialist',
          period: '2022 - Present',
          years: 3.5,
          description: 'Built enterprise data models and executive conversion reporting in Snowflake and Tableau.',
          highlights: [
            'Designed 20+ executive Tableau dashboards tracking $80M annual gross merchandise value.',
            'Spearheaded A/B testing framework across checkout flow, improving conversion by 14%.',
            'Implemented dbt data models in Snowflake, cutting query cost by 32%.'
          ]
        }
      ],
      projects: [
        {
          name: 'Customer Lifetime Value Predictor',
          description: 'Survival analysis and cohort retention model built in Python and Streamlit.',
          technologies: ['Python', 'SQL', 'Snowflake']
        }
      ],
      certifications: ['Tableau Desktop Certified Associate', 'SnowPro Core Certified'],
      achievements: ['Presenter at NYC Modern Data Stack Summit 2024'],
      languages: ['English', 'Arabic']
    },
    evaluation: {
      scores: {
        overall: 93,
        requiredSkills: 95,
        experience: 94,
        education: 95,
        preferredSkills: 90,
        projectRelevance: 90,
        certifications: 95
      },
      recommendation: 'Strongly Recommended',
      aiExplanation: 'Exceptional match for Lead Data Analyst role. Has 5.5 years of verified analytics experience. Expert command of advanced SQL, Snowflake, Tableau, statistical A/B testing, and Python. Holds both requested certifications: Tableau Certified and SnowPro Core.',
      goodFitReasons: [
        'Exceeds experience requirement with 5.5 years in high-impact commercial analytics.',
        'Proven commercial achievements: $80M GMV dashboarding, 14% conversion lift from experimentation.',
        'Fully certified in Tableau and Snowflake with modern dbt modeling skills.'
      ],
      potentialConcerns: [
        'Hybrid New York requirement aligns well; ensure expectation regarding in-office frequency is confirmed.'
      ],
      missingRequirements: [],
      resumeEvidence: [
        'OmniRetail: "Spearheaded A/B testing framework across checkout flow, improving conversion by 14%."',
        'SnowPro Core and Tableau Desktop certifications verified.'
      ],
      skillGaps: [
        { skill: 'SQL (Advanced)', status: 'matched', category: 'required', evidence: 'Advanced window functions and dbt transformations' },
        { skill: 'Python', status: 'matched', category: 'required', evidence: 'Pandas analysis and predictive modeling' },
        { skill: 'Tableau / Power BI', status: 'matched', category: 'required', evidence: 'Tableau Certified Associate; 20+ enterprise dashboards' },
        { skill: 'Statistical Modeling', status: 'matched', category: 'required', evidence: 'Applied Mathematics degree from Columbia' },
        { skill: 'A/B Testing', status: 'matched', category: 'required', evidence: 'Designed experimentation framework resulting in 14% lift' },
        { skill: 'Data Warehousing (Snowflake)', status: 'matched', category: 'required', evidence: 'Snowflake SnowPro Core certified' },
        { skill: 'dbt', status: 'matched', category: 'preferred', evidence: 'Implemented production dbt models' }
      ],
      matchedCompetenciesCount: 7,
      totalCompetenciesCount: 7
    }
  },
  {
    id: 'cand-008',
    jobId: 'job-swe-101',
    jobTitle: 'Senior Full-Stack Software Engineer',
    resumeFileName: 'David_Chen_Resume.pdf',
    resumeFileSize: '160 KB',
    uploadDate: '2026-09-05',
    pipelineStatus: 'Screened',
    isDemo: true,
    structuredResume: {
      candidateName: 'David Chen',
      email: 'david.chen@example.com',
      phone: '+1 (555) 901-2345',
      location: 'San Jose, CA',
      summary: 'Junior Web Developer with 1.5 years of experience building WordPress sites and basic PHP/HTML/CSS landing pages.',
      totalExperienceYears: 1.5,
      education: [
        {
          degree: 'Associate Degree',
          field: 'Web Design',
          institution: 'De Anza College',
          year: '2024'
        }
      ],
      technicalSkills: ['HTML5', 'CSS3', 'JavaScript', 'WordPress', 'PHP', 'MySQL'],
      softSkills: ['Curiosity', 'Quick Learner'],
      workExperience: [
        {
          company: 'BrightSpark Digital Agency',
          role: 'Junior Web Developer',
          period: '2024 - Present',
          years: 1.5,
          description: 'Maintained WordPress blogs and updated CSS stylesheets.',
          highlights: [
            'Updated styling on 20+ client marketing sites.',
            'Fixed HTML broken links and form validation bugs.'
          ]
        }
      ],
      projects: [],
      certifications: [],
      achievements: [],
      languages: ['English', 'Mandarin']
    },
    evaluation: {
      scores: {
        overall: 52,
        requiredSkills: 45,
        experience: 40,
        education: 60,
        preferredSkills: 30,
        projectRelevance: 40,
        certifications: 0
      },
      recommendation: 'Low Match',
      aiExplanation: 'Low match for Senior Full-Stack Software Engineer role. The candidate has 1.5 years of experience (vs 4+ years required) primarily in WordPress and basic PHP/HTML. Missing core required skills: React, TypeScript, Python, and AWS cloud infrastructure.',
      goodFitReasons: [
        'Familiar with web basics (HTML, CSS, JavaScript, MySQL).'
      ],
      potentialConcerns: [
        'Significant experience gap (1.5 years vs 4+ required).',
        'No production experience with React, TypeScript, or modern cloud microservices.',
        'Lacks required Bachelor’s degree in Computer Science.'
      ],
      missingRequirements: [
        'Senior level experience (4+ years)',
        'React and TypeScript proficiency',
        'Python backend engineering',
        'AWS cloud deployment',
        'Bachelor of Science in CS'
      ],
      resumeEvidence: [
        'BrightSpark Digital: "Maintained WordPress blogs and updated CSS stylesheets."'
      ],
      skillGaps: [
        { skill: 'React', status: 'missing', category: 'required', evidence: 'Not listed in resume' },
        { skill: 'TypeScript', status: 'missing', category: 'required', evidence: 'Not listed in resume' },
        { skill: 'Node.js', status: 'missing', category: 'required', evidence: 'Not listed in resume' },
        { skill: 'Python', status: 'missing', category: 'required', evidence: 'Not listed in resume' },
        { skill: 'PostgreSQL', status: 'partial', category: 'required', evidence: 'Has basic MySQL background' },
        { skill: 'AWS', status: 'missing', category: 'required', evidence: 'No cloud infrastructure' },
        { skill: 'REST APIs', status: 'partial', category: 'required', evidence: 'Basic form API submissions' }
      ],
      matchedCompetenciesCount: 1,
      totalCompetenciesCount: 10
    }
  }
];

export const SAMPLE_RESUME_TEXTS = [
  {
    title: 'Senior Full-Stack Resume (Simulated PDF text)',
    filename: 'Kavita_Deshmukh_Resume.txt',
    text: `KAVITA DESHMUKH
San Francisco, CA | kavita.deshmukh@example.com | (555) 777-8899 | linkedin.com/in/kavitad

PROFESSIONAL SUMMARY:
Accomplished Full-Stack Software Engineer with 6 years of experience building high-scale SaaS web applications with React, TypeScript, Node.js, Python, and AWS.

TECHNICAL SKILLS:
- Languages: TypeScript, JavaScript, Python, SQL, HTML5/CSS3
- Frameworks: React, Next.js, Node.js, Express, FastAPI, Tailwind CSS
- Databases: PostgreSQL, MongoDB, Redis
- Cloud & DevOps: AWS (EC2, ECS, Lambda, S3, RDS), Docker, Kubernetes, CI/CD (GitHub Actions)
- Methodologies: Agile/Scrum, Test-Driven Development (Jest, Cypress)

EXPERIENCE:
Staff Software Engineer | CloudVelocity Systems, San Francisco, CA | 2022 - Present
- Architected enterprise customer dashboard in React 18 and TypeScript with Tailwind CSS, supporting 500,000 monthly active users.
- Designed Python/FastAPI microservices and PostgreSQL database schemas, reducing average response latency by 35%.
- Implemented Docker containers and deployed to AWS ECS with auto-scaling policies.
- Mentored a team of 5 engineers, establishing pull request guidelines and unit testing standards (achieved 92% code coverage).

Software Engineer | NexaTech Labs, San Jose, CA | 2020 - 2022
- Developed REST APIs using Node.js and Express for billing and user authentication services.
- Migrated legacy frontend components to modern React functional hooks.
- Configured PostgreSQL relational tables and optimized slow queries.

EDUCATION:
Bachelor of Science in Computer Science | San Jose State University | 2020 | Magna Cum Laude

CERTIFICATIONS:
- AWS Certified Solutions Architect - Associate (2023)`
  },
  {
    title: 'Junior Frontend Resume (Skill Gap Demonstration)',
    filename: 'Alex_Rivera_Resume.txt',
    text: `ALEX RIVERA
Austin, TX | alex.rivera@example.com | (555) 123-9876

OBJECTIVE:
Enthusiastic Junior Developer seeking to build responsive user interfaces and learn modern web technologies.

SKILLS:
- HTML5, CSS3, JavaScript (ES6+), React basics, Git, Figma, Bootstrap

EXPERIENCE:
Junior Web Intern | Austin Digital Media | 2024 - Present
- Created landing pages for small business clients using HTML5, CSS3, and JavaScript.
- Built interactive navigation bars and mobile responsive layouts.
- Participated in weekly design reviews with product managers.

PROJECTS:
Recipe Finder App (React, CSS) - Web app querying public meal API to show recipes.
Portfolio Website (HTML, CSS, JS) - Personal responsive portfolio site.

EDUCATION:
Associate of Science in Web Development | Austin Community College | 2024`
  }
];
