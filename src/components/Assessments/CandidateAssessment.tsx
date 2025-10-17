import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGET, apiPOST } from "../../utils/api";

export default function CandidateAssessment() {
  const { id } = useParams<{ id: string }>(); // candidate id
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // ✅ Fetch candidate details
  const { data: candidate, isLoading: candidateLoading } = useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      const res: any = await apiGET("/api/candidates?page=1&pageSize=1000");
      return res.data.find((c: any) => c.id === id);
    },
    enabled: !!id,
  });

  // ✅ Fetch related job’s assessment
  const {
    data: assessment,
    isLoading: assessmentLoading,
    isError,
  } = useQuery({
    queryKey: ["assessment", candidate?.jobId],
    queryFn: async () => {
      const res: any = await apiGET(`/api/assessments/${candidate?.jobId}`);
      return res.data;
    },
    enabled: !!candidate?.jobId,
  });

  // ✅ Submit answers mutation
  const submitMut = useMutation({
    mutationFn: async (payload: any) =>
      apiPOST(`/api/assessments/${candidate?.jobId}/submit`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment", candidate?.jobId] });
      alert("✅ Assessment submitted successfully!");
      navigate(`/candidates/${id}`);
    },
    onError: () => {
      alert("❌ Failed to submit assessment. Please try again.");
    },
  });

  // ✅ Change handler
  const handleChange = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  // --- Loading states ---
  if (candidateLoading || assessmentLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
        <p className="text-indigo-600 text-lg animate-pulse">
          Loading assessment...
        </p>
      </div>
    );

  if (isError || !assessment)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          No assessment found for this candidate.
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );

  // --- Render ---
  return (
    <div className="max-w-3xl mx-auto mt-8 bg-white/90 shadow-xl rounded-2xl p-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-4">
        {assessment.title}
      </h1>
      <p className="text-gray-500 mb-8">
        Please complete all questions before submitting.
      </p>

      {assessment.sections?.map((section: any) => (
        <div key={section.id} className="mb-8">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">
            {section.title}
          </h2>

          {section.questions.map((q: any) => (
            <div
              key={q.id}
              className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-sm transition"
            >
              <label className="block font-medium text-gray-700 mb-2">
                {q.label}
                {q.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {/* Text question */}
              {q.type === "text" && (
                <input
                  type="text"
                  placeholder="Type your answer..."
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}

              {/* Single-choice (simulate with textarea for now) */}
              {q.type === "single" && (
                <textarea
                  placeholder="Your single-choice answer..."
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}

              {/* Multi-choice */}
              {q.type === "multi" && (
                <textarea
                  placeholder="List multiple answers (comma-separated)..."
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      {/* --- Buttons --- */}
      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={() => submitMut.mutate(answers)}
          disabled={submitMut.isPending}
          className={`px-6 py-2 rounded-md text-white ${
            submitMut.isPending
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {submitMut.isPending ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
