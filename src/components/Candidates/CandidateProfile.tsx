import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGET, apiPATCH } from "../../utils/api";
import {
  User,
  Mail,
  Calendar,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

export default function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  // ✅ Fetch candidate details
  const {
    data: candidate,
    isLoading: candidateLoading,
    isError: candidateError,
  } = useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      const res: any = await apiGET("/api/candidates?page=1&pageSize=1000");
      return res.data.find((c: any) => c.id === id) ?? null;
    },
    enabled: !!id,
    staleTime: 1000 * 60,
  });

  // ✅ Fetch candidate timeline
  const {
    data: timeline,
    isLoading: timelineLoading,
  } = useQuery({
    queryKey: ["timeline", id],
    queryFn: async () => {
      const res: any = await apiGET(`/api/candidates/${id}/timeline`);
      return res.data;
    },
    enabled: !!id,
  });

  // ✅ Mutation for moving candidate between stages
  const moveMut = useMutation({
    mutationFn: async (stage: string) => apiPATCH(`/api/candidates/${id}`, { stage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidate", id] });
      queryClient.invalidateQueries({ queryKey: ["timeline", id] });
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
  });

  if (candidateLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-indigo-600">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading candidate details...
      </div>
    );
  }
  if (candidateError || !candidate) {
    return (
      <div className="text-center text-red-500 mt-10 font-semibold">
        Candidate not found or failed to load.
      </div>
    );
  }

  const stages = [
    { key: "applied", label: "Applied", color: "bg-blue-500" },
    { key: "screen", label: "Screening", color: "bg-purple-500" },
    { key: "tech", label: "Technical", color: "bg-cyan-500" },
    { key: "offer", label: "Offer", color: "bg-yellow-500" },
    { key: "hired", label: "Hired", color: "bg-green-500" },
    { key: "rejected", label: "Rejected", color: "bg-red-500" },
  ];

  const currentStageObj = stages.find((s) => s.key === candidate.stage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-28 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-md flex items-center justify-center">
                <User className="w-10 h-10 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="pt-14 pb-8 px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{candidate.name}</h2>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Mail className="w-4 h-4" />
                <span>{candidate.email}</span>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-800 rounded-full shadow-sm">
                {currentStageObj && (
                  <div className={`w-3 h-3 rounded-full ${currentStageObj.color}`} />
                )}
                <span className="font-medium capitalize">
                  {candidate.stage}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/candidates/${id}/assign`)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <Award className="w-5 h-5" />
              Assign Assessment
            </button>
          </div>
        </div>

        {/* Stage Controls */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Change Candidate Stage
          </h3>

          <div className="flex flex-wrap gap-3">
            {stages.map((s) => (
              <button
                key={s.key}
                onClick={() => moveMut.mutate(s.key)}
                disabled={moveMut.isPending}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  candidate.stage === s.key
                    ? `${s.color} text-white border-transparent shadow-md`
                    : "bg-gray-100 text-gray-700 hover:bg-indigo-50 border-gray-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Activity Timeline
          </h3>

          {timelineLoading ? (
            <div className="text-gray-500">Loading timeline...</div>
          ) : !timeline || timeline.length === 0 ? (
            <div className="text-gray-500">No timeline events yet.</div>
          ) : (
            <div className="space-y-4">
              {timeline.map((t: any, idx: number) => (
                <div
                  key={idx}
                  className="border-l-4 border-indigo-600 pl-6 pb-4 relative hover:border-purple-600 transition-all"
                >
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-600 rounded-full"></div>
                  <div
                    onClick={() =>
                      setExpandedEvent(expandedEvent === idx ? null : idx)
                    }
                    className="cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                        <span className="text-sm font-medium text-gray-800 group-hover:text-indigo-600">
                          {new Date(t.at).toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {expandedEvent === idx ? "▲" : "▼"}
                      </span>
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        expandedEvent === idx ? "max-h-96 mt-2" : "max-h-0"
                      }`}
                    >
                      <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(t.changes, null, 2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
