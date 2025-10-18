import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import { seedDatabase } from "./seed";

// === Local Storage Keys ===
const STORAGE_KEY = "talentflow_db";

// === Utility Functions ===
function loadDB() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      console.log("📦 Loading existing database from localStorage");
      return JSON.parse(saved);
    }
  } catch (error) {
    console.warn("⚠️ Failed to load from localStorage:", error);
  }
  
  console.log("🌱 Creating new database with seed data");
  const newDB = seedDatabase();
  saveDB(newDB);
  return newDB;
}

function saveDB(db: any) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    console.log("💾 Database saved to localStorage");
  } catch (error) {
    console.warn("⚠️ Failed to save to localStorage:", error);
  }
}

// === Initial Mock Database ===
let db = loadDB();

console.log("🔧 Initial DB loaded:");
console.log("  - Candidates:", db.candidates.length);
console.log("  - First candidate ID:", db.candidates[0]?.id);
console.log("  - Assessments:", Object.keys(db.assessments).length);

// ✅ Combined Handlers
const handlers = [
  // ======================
  // 1️⃣ GET /api/assessments
  // ======================
  http.get("/api/assessments", () => {
    console.log("📘 MSW: GET /api/assessments");
    db = loadDB(); // Reload from localStorage
    return HttpResponse.json({ data: db.assessments }, { status: 200 });
  }),

  // ======================
  // 2️⃣ GET /api/candidates
  // ======================
  http.get("/api/candidates", () => {
    console.log("📘 MSW: GET /api/candidates");
    db = loadDB(); // Reload from localStorage
    return HttpResponse.json({ data: db.candidates }, { status: 200 });
  }),

  // ======================
  // 3️⃣ POST /api/candidates/:id/assign
  // ======================
  http.post("/api/candidates/:id/assign", async ({ params, request }) => {
    console.log("📘 MSW: POST /api/candidates/:id/assign");
    
    const { id } = params;
    console.log("🔍 Looking for candidate ID:", id);
    
    const body = (await request.json()) as any;
    console.log("📦 Request body:", body);
    
    db = loadDB(); // Reload from localStorage
    console.log("📋 Total candidates in DB:", db.candidates.length);

    // ✅ Find candidate by ID
    const candidate = db.candidates.find((c: any) => String(c.id) === String(id));
    
    if (!candidate) {
      console.warn("⚠️ Candidate not found:", id);
      console.warn("⚠️ Available candidate IDs:", db.candidates.map((c: any) => c.id).slice(0, 5));
      return HttpResponse.json(
        { success: false, error: "Candidate not found" },
        { status: 404 }
      );
    }

    console.log("✅ Found candidate:", candidate);

    // Build the new assignment
    const newAssignment = {
      id: `assign-${Date.now()}`,
      candidateId: id,
      candidate: candidate.name,
      assessmentId: body.assessmentId,
      assessmentTitle: body.assessmentTitle || "Untitled Assessment",
      dueDate: body.dueDate,
      note: body.note || "",
      status: "pending",
      assignedAt: new Date().toISOString(),
    };

    // Save to mock DB
    if (!db.responses) db.responses = {};
    if (!db.responses[body.assessmentId]) db.responses[body.assessmentId] = [];
    db.responses[body.assessmentId].push(newAssignment);

    if (!db.timelines) db.timelines = {};
    if (!db.timelines[id]) db.timelines[id] = [];
    db.timelines[id].unshift({
      at: new Date().toISOString(),
      changes: {
        action: "Assessment Assigned",
        details: newAssignment,
      },
    });

    saveDB(db); // Save to localStorage
    console.log("✅ MSW: Assigned assessment to", candidate.name);
    return HttpResponse.json(
      { success: true, data: newAssignment },
      { status: 201 }
    );
  }),

  // ======================
  // 4️⃣ GET /api/assigned
  // ======================
  http.get("/api/assigned", () => {
    console.log("📘 MSW: GET /api/assigned");
    db = loadDB(); // Reload from localStorage
    const allAssigned = db.responses 
      ? Object.values(db.responses).flat() 
      : [];
    
    return HttpResponse.json({ data: allAssigned }, { status: 200 });
  }),

  // ======================
  // 5️⃣ GET /api/candidates/:id/timeline
  // ======================
  http.get("/api/candidates/:id/timeline", ({ params }) => {
    console.log("📘 MSW: GET /api/candidates/:id/timeline");
    const { id } = params;
    db = loadDB(); // Reload from localStorage
    const timeline = db.timelines?.[id as string] || [];
    return HttpResponse.json({ data: timeline }, { status: 200 });
  }),

  // ======================
  // 6️⃣ PATCH /api/candidates/:id
  // ======================
  http.patch("/api/candidates/:id", async ({ params, request }) => {
    console.log("📘 MSW: PATCH /api/candidates/:id");
    const { id } = params;
    const body = (await request.json()) as any;
    
    db = loadDB(); // Reload from localStorage

    const candidateIndex = db.candidates.findIndex((c: any) => String(c.id) === String(id));
    
    if (candidateIndex === -1) {
      return HttpResponse.json(
        { success: false, error: "Candidate not found" },
        { status: 404 }
      );
    }

    // Update candidate
    const oldStage = db.candidates[candidateIndex].stage;
    db.candidates[candidateIndex] = {
      ...db.candidates[candidateIndex],
      ...body,
    };

    // Add to timeline
    if (!db.timelines) db.timelines = {};
    if (!db.timelines[id as string]) db.timelines[id as string] = [];
    
    db.timelines[id as string].unshift({
      at: new Date().toISOString(),
      changes: {
        action: "Stage Changed",
        from: oldStage,
        to: body.stage,
      },
    });

    saveDB(db); // Save to localStorage
    console.log("✅ MSW: Updated candidate", id);
    return HttpResponse.json(
      { success: true, data: db.candidates[candidateIndex] },
      { status: 200 }
    );
  }),

  // ======================
  // 7️⃣ GET /api/assessments/:id
  // ======================
  http.get("/api/assessments/:id", ({ params }) => {
    console.log("📘 MSW: GET /api/assessments/:id");
    const { id } = params;
    db = loadDB(); // Reload from localStorage
    const assessment = db.assessments[id as string];
    
    if (!assessment) {
      return HttpResponse.json(
        { success: false, error: "Assessment not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json({ data: assessment }, { status: 200 });
  }),
];

// ✅ Setup worker
export const worker = setupWorker(...handlers);

console.log("🔧 MSW Handlers registered:", handlers.length);