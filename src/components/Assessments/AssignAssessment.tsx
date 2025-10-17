import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGET, apiPOST } from "../../utils/api";

export default function AssignAssessment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedAssessment, setSelectedAssessment] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");

  // ✅ Fetch candidate to verify it exists
  const { data: candidateData } = useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      console.log("🔍 Fetching candidate with ID:", id);
      const res: any = await apiGET("/api/candidates");
      console.log("📦 All candidates:", res.data);
      const found = res.data.find((c: any) => c.id === id);
      console.log("📦 Found candidate:", found);
      return found;
    },
    enabled: !!id,
  });

  // ✅ Fetch all assessments
  const { data, isLoading, isError } = useQuery({
    queryKey: ["assessments"],
    queryFn: async () => {
      console.log("🔍 Fetching assessments...");
      const res: any = await apiGET("/api/assessments");
      console.log("📦 Raw response:", res);
      console.log("📦 Response.data:", res.data);
      return res.data;
    },
  });

  // ✅ Mutation for assigning
  const assignMut = useMutation({
    mutationFn: async (payload: any) => {
      console.log("🚀 Starting assignment mutation");
      console.log("🔍 Candidate ID:", id);
      console.log("🔍 Endpoint:", `/api/candidates/${id}/assign`);
      console.log("📦 Payload:", JSON.stringify(payload, null, 2));
      
      try {
        const result = await apiPOST(`/api/candidates/${id}/assign`, payload);
        console.log("✅ POST result:", result);
        console.log("✅ Result type:", typeof result);
        console.log("✅ Result keys:", Object.keys(result || {}));
        console.log("✅ Full result structure:", JSON.stringify(result, null, 2));
        
        // Check if the result indicates success
        if (result && (result.success === false || result.error)) {
          throw new Error(result.error || "Assignment failed");
        }
        
        return result;
      } catch (error: any) {
        console.error("❌ POST error:", error);
        console.error("❌ Error message:", error.message);
        console.error("❌ Error response:", error.response);
        console.error("❌ Error response data:", error.response?.data);
        console.error("❌ Error status:", error.response?.status);
        console.error("❌ Error stack:", error.stack);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("🎉 Mutation onSuccess called");
      console.log("🎉 Success data:", data);
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      queryClient.invalidateQueries({ queryKey: ["assignedAssessments"] });
      alert("✅ Assessment assigned successfully!");
      navigate("/assessments");
    },
    onError: (error: any) => {
      console.error("💥 Mutation onError called");
      console.error("💥 Error object:", error);
      console.error("💥 Error message:", error.message);
      console.error("💥 Error name:", error.name);
      alert(`❌ Failed to assign assessment. Check console for details.`);
    },
  });

  if (isLoading) {
    console.log("⏳ Loading assessments...");
    return <div className="p-8 text-gray-700">Loading assessments...</div>;
  }
  
  if (isError || !data) {
    console.error("❌ Error loading assessments");
    return <div className="p-8 text-red-600">Error loading assessments.</div>;
  }

  // ✅ Check if candidate exists
  if (candidateData === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg border border-gray-100 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Candidate Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The candidate with ID <code className="bg-gray-100 px-2 py-1 rounded text-sm">{id}</code> does not exist in the database.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            This can happen if the database was reset. Please go back to the candidates list and try again.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                localStorage.removeItem("talentflow_db");
                window.location.href = "/candidates";
              }}
              className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
            >
              Reset Database & Go Back
            </button>
            <button
              onClick={() => navigate("/candidates")}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("📋 Available assessments data:", data);
  
  // ✅ FIXED: Convert assessments object to array with jobId included
  const list = Array.isArray(data) 
    ? data 
    : Object.entries(data).map(([jobId, assessment]: [string, any]) => ({
        ...assessment,
        jobId, // Ensure jobId is included in each assessment object
      }));
  
  console.log("📋 Assessments list:", list);

  const handleAssign = () => {
    console.log("🎯 === ASSIGN BUTTON CLICKED ===");
    console.log("Selected Assessment ID:", selectedAssessment);
    console.log("Due Date:", dueDate);
    console.log("Note:", note);

    if (!selectedAssessment || !dueDate) {
      console.warn("⚠️ Missing required fields");
      alert("⚠️ Please select an assessment and due date.");
      return;
    }

    // ✅ FIXED: Find assessment using jobId
    const selected = list.find((a: any) => a.jobId === selectedAssessment);
    console.log("📋 Found assessment object:", selected);

    if (!selected) {
      console.error("❌ Invalid assessment selection");
      alert("⚠️ Invalid assessment selection.");
      return;
    }

    // ✅ FIXED: Use jobId consistently
    const payload = {
      assessmentId: selected.jobId,
      assessmentTitle: selected.title ?? "Untitled Assessment",
      dueDate,
      note,
    };

    console.log("📤 Final payload to send:", payload);
    console.log("🚀 Calling assignMut.mutate()");
    assignMut.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-indigo-600">📋</span> Assign Assessment
        </h2>

        <p className="text-sm text-gray-600 mb-4 bg-blue-50 p-2 rounded">
          Candidate ID: <strong>{id}</strong>
        </p>

        {/* Select Assessment */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-sm font-medium">
            Select Assessment *
          </label>
          <select
            value={selectedAssessment}
            onChange={(e) => {
              console.log("✏️ Assessment selected:", e.target.value);
              setSelectedAssessment(e.target.value);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            <option value="">-- Choose an assessment --</option>
            {list.map((a: any) => (
              <option key={a.jobId} value={a.jobId}>
                {a.title}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 text-sm font-medium">
            Due Date *
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => {
              console.log("📅 Due date set:", e.target.value);
              setDueDate(e.target.value);
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 text-sm font-medium">
            Additional Notes
          </label>
          <textarea
            placeholder="Add instructions, notes, or special guidelines..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
          />
        </div>

        {/* Status indicators */}
        {assignMut.isPending && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
            ⏳ Assigning assessment...
          </div>
        )}

        {assignMut.isError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            ❌ {assignMut.error?.message || 'An error occurred'}
          </div>
        )}

        {/* Assign Button */}
        <button
          onClick={handleAssign}
          disabled={assignMut.isPending}
          className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
            assignMut.isPending
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {assignMut.isPending ? "Assigning..." : "Assign Assessment"}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full mt-3 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}