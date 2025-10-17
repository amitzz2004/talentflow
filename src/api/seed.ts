import { v4 as uuidv4 } from "uuid";

// ===============================
// 📘 Type Definitions
// ===============================
export type Job = {
  id: string;
  title: string;
  slug: string;
  status: "active" | "archived";
  tags: string[];
  order: number;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  jobId?: string;
  stage: string;
};

export type Assessment = {
  jobId: string;
  title: string;
  sections: {
    id: string;
    title: string;
    questions: {
      id: string;
      type: "text" | "single" | "multi";
      label: string;
      required: boolean;
    }[];
  }[];
};

export type DB = {
  jobs: Job[];
  candidates: Candidate[];
  assessments: Record<string, Assessment>;
  timelines: Record<string, any[]>;
  responses: Record<string, any[]>;
};

// ===============================
// 🧠 Static Seed Data
// ===============================
const TAGS = ["frontend", "backend", "fullstack", "data", "design"];
const STAGES = ["applied", "screening", "technical", "offer", "hired", "rejected"];
const FIRST_NAMES = ["Amit", "Priya", "Rahul", "Neha", "Ravi", "Sneha", "Vikram", "Aisha", "Arjun", "Meera"];
const LAST_NAMES = ["Sharma", "Patel", "Reddy", "Singh", "Iyer", "Nair", "Gupta", "Das", "Joshi", "Kumar"];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===============================
// 🌱 Seed Function
// ===============================
export function seedDatabase(): DB {
  const jobs: Job[] = [];
  const jobTitles = [
    "Frontend Developer (React)",
    "Backend Engineer (Node.js)",
    "Fullstack Developer",
    "Data Analyst",
    "UI/UX Designer",
  ];

  // --- Generate realistic jobs ---
  jobTitles.forEach((title, i) => {
    const job: Job = {
      id: uuidv4(),
      title,
      slug: slugify(title),
      status: i % 5 === 0 ? "archived" : "active",
      tags: [randomFrom(TAGS)],
      order: i + 1,
    };
    jobs.push(job);
  });

  // --- Generate random candidates ---
  const candidates: Candidate[] = [];
  for (let i = 1; i <= 50; i++) {
    const name = `${randomFrom(FIRST_NAMES)} ${randomFrom(LAST_NAMES)}`;
    const email = `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`;
    const jobId = randomFrom(jobs).id;
    const stage = randomFrom(STAGES);

    candidates.push({
      id: uuidv4(),
      name,
      email,
      jobId,
      stage,
    });
  }

  // ===============================
  // 📋 Predefined Assessments
  // ===============================
  const assessments: Record<string, Assessment> = {};

  for (const job of jobs) {
    let questions: any[] = [];

    if (job.title.includes("Frontend")) {
      questions = [
        {
          id: "q1",
          type: "text",
          label: "Describe your experience with React and state management.",
          required: true,
        },
        {
          id: "q2",
          type: "single",
          label: "Which CSS framework do you prefer? (Tailwind, Bootstrap, etc.)",
          required: false,
        },
        {
          id: "q3",
          type: "multi",
          label: "Which frontend tools have you used before?",
          required: false,
        },
      ];
    } else if (job.title.includes("Backend")) {
      questions = [
        {
          id: "q1",
          type: "text",
          label: "Explain how you design RESTful APIs and handle authentication.",
          required: true,
        },
        {
          id: "q2",
          type: "multi",
          label: "Which databases and ORMs have you worked with?",
          required: true,
        },
      ];
    } else if (job.title.includes("Fullstack")) {
      questions = [
        {
          id: "q1",
          type: "text",
          label: "Describe a fullstack project you built and your main challenges.",
          required: true,
        },
        {
          id: "q2",
          type: "multi",
          label: "List the technologies you used for frontend and backend.",
          required: true,
        },
      ];
    } else if (job.title.includes("Data")) {
      questions = [
        {
          id: "q1",
          type: "text",
          label: "Explain your experience in data visualization and analytics tools.",
          required: true,
        },
        {
          id: "q2",
          type: "multi",
          label: "Which data processing libraries or frameworks have you used?",
          required: true,
        },
      ];
    } else if (job.title.includes("Designer")) {
      questions = [
        {
          id: "q1",
          type: "text",
          label: "Describe your design process and preferred tools (Figma, XD, etc.).",
          required: true,
        },
      ];
    }

    assessments[job.id] = {
      jobId: job.id,
      title: `${job.title} Assessment`,
      sections: [
        {
          id: "s1",
          title: "Core Evaluation",
          questions,
        },
      ],
    };
  }

  // --- Mock timeline + responses (empty initially) ---
  const timelines: Record<string, any[]> = {};
  const responses: Record<string, any[]> = {};

  return { jobs, candidates, assessments, timelines, responses };
}
