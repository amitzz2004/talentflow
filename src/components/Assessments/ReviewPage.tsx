import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGET, apiPATCH } from "../../utils/api";
import {
  ClipboardCheck,
  User,
  Calendar,
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Send,
  Loader2,
  Award,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [expandedResponse, setExpandedResponse] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<Record<string, any>>({});

  // ✅ Fetch the assessment
  const { data: assessment, isLoading, isError } = useQuery({
    queryKey: ["assessment", id],
    queryFn: async () => {
      const res: any = await apiGET(`/api/assessments/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // ✅ Fetch candidate responses
  const { data: responses, isLoading: loadingResponses } = useQuery({
    queryKey: ["responses", id],
    queryFn: async () => {
      const res: any = await apiGET(`/api/responses/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // ✅ Update review mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ responseId, update }: { responseId: string; update: any }) => {
      return apiPATCH(`/api/responses/${responseId}`, update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["responses", id] });
      // Clear the form data for this response
      setReviewData({});
    },
    onError: (error) => {
      console.error("Failed to save review:", error);
    },
  });

  const handleReviewChange = (responseId: string, field: string, value: any) => {
    setReviewData((prev) => ({
      ...prev,
      [responseId]: {
        ...prev[responseId],
        [field]: value,
      },
    }));
  };

  const handleSaveReview = (responseId: string) => {
    const review = reviewData[responseId];
    if (!review || !review.feedback || review.score === undefined) {
      alert("⚠️ Please fill in all required fields (feedback and score)");
      return;
    }
    reviewMutation.mutate({ responseId, update: review });
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any; label: string }> = {
      Pending: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock, label: "Pending Review" },
      Reviewed: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: Eye, label: "Reviewed" },
      Selected: { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2, label: "Selected" },
      Rejected: { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle, label: "Rejected" },
    };
    return configs[status] || configs.Pending;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (isError || !assessment) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg mb-4">Assessment not found</p>
          <button
            onClick={() => navigate("/assessments")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  const responsesArray = Array.isArray(responses) ? responses : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/assessments")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Assessments</span>
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ClipboardCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {assessment.title}
                  </h1>
                  <p className="text-gray-600">
                    Review candidate submissions and provide detailed feedback
                  </p>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-indigo-600" />
                      <span className="text-gray-700">
                        {responsesArray.length} Submission{responsesArray.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700">Assessment ID: {id?.substring(0, 8)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-7 h-7 text-indigo-600" />
              Candidate Submissions
            </h2>
          </div>

          {loadingResponses ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading responses...</p>
            </div>
          ) : responsesArray.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No submissions yet</p>
              <p className="text-gray-400 text-sm">
                Candidate responses will appear here once they submit the assessment
              </p>
            </div>
          ) : (
            responsesArray.map((response: any, idx: number) => {
              const statusConfig = getStatusConfig(response.status || reviewData[response.id]?.status || "Pending");
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedResponse === response.id;
              const currentReview = reviewData[response.id] || {};

              return (
                <div
                  key={response.id || idx}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all hover:shadow-xl"
                  style={{
                    animation: `fadeIn 0.4s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  {/* Response Header */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                          <User className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {response.candidateName || "Anonymous Candidate"}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Submitted {new Date(response.submittedAt).toLocaleDateString()} at{" "}
                              {new Date(response.submittedAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium text-sm ${statusConfig.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span>{statusConfig.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Response Content */}
                  <div className="p-6">
                    <button
                      onClick={() => setExpandedResponse(isExpanded ? null : response.id)}
                      className="w-full flex items-center justify-between text-left mb-4 group"
                    >
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        View Submission Details
                      </h4>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200 animate-fadeIn">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                          {JSON.stringify(response.response, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Review Form */}
                    <div className="border-t border-gray-200 pt-6 space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Star className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">Your Review</h4>
                      </div>

                      {/* Feedback */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Feedback *
                        </label>
                        <textarea
                          value={currentReview.feedback || ""}
                          onChange={(e) => handleReviewChange(response.id, "feedback", e.target.value)}
                          placeholder="Provide detailed feedback on the candidate's submission..."
                          rows={4}
                          className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all resize-none text-gray-700"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Score */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Score (0-100) *
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={currentReview.score || ""}
                              onChange={(e) => handleReviewChange(response.id, "score", Number(e.target.value))}
                              placeholder="Enter score"
                              min={0}
                              max={100}
                              className="w-full border-2 border-gray-200 rounded-xl p-4 pr-12 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all text-gray-700"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                              / 100
                            </div>
                          </div>
                          {currentReview.score !== undefined && (
                            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  currentReview.score >= 70
                                    ? "bg-green-500"
                                    : currentReview.score >= 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${Math.min(currentReview.score, 100)}%` }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Status */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Status
                          </label>
                          <select
                            value={currentReview.status || "Pending"}
                            onChange={(e) => handleReviewChange(response.id, "status", e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all text-gray-700 appearance-none cursor-pointer"
                          >
                            <option value="Pending">⏳ Pending Review</option>
                            <option value="Reviewed">👀 Reviewed</option>
                            <option value="Selected">✅ Selected</option>
                            <option value="Rejected">❌ Rejected</option>
                          </select>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            handleReviewChange(response.id, "status", "Selected");
                            handleReviewChange(response.id, "score", 90);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all border border-green-200"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm font-medium">Recommend</span>
                        </button>
                        <button
                          onClick={() => {
                            handleReviewChange(response.id, "status", "Rejected");
                            handleReviewChange(response.id, "score", 30);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all border border-red-200"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span className="text-sm font-medium">Not Suitable</span>
                        </button>
                      </div>

                      {/* Submit Button */}
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => handleSaveReview(response.id)}
                          disabled={reviewMutation.isPending}
                          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl ${
                            reviewMutation.isPending
                              ? "bg-indigo-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          }`}
                        >
                          {reviewMutation.isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              <span>Save Review</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setReviewData((prev) => {
                            const newData = { ...prev };
                            delete newData[response.id];
                            return newData;
                          })}
                          className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}