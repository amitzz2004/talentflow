import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGET } from "../../utils/api";
import {
  ClipboardList,
  User,
  Calendar,
  FileText,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2,
  Search,
  Filter,
} from "lucide-react";

export default function AssessmentsList() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["assignedAssessments"],
    queryFn: async () => {
      const res: any = await apiGET("/api/assigned");
      return res.data;
    },
  });

  const items = Array.isArray(data) ? data : [];

  // Filter logic
  const filteredItems = items.filter((item: any) => {
    const matchesSearch = 
      item.candidate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assessmentTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any; label: string }> = {
      pending: { 
        color: "bg-yellow-100 text-yellow-700 border-yellow-200", 
        icon: Clock, 
        label: "Pending" 
      },
      submitted: { 
        color: "bg-blue-100 text-blue-700 border-blue-200", 
        icon: CheckCircle2, 
        label: "Submitted" 
      },
      reviewed: { 
        color: "bg-green-100 text-green-700 border-green-200", 
        icon: Eye, 
        label: "Reviewed" 
      },
      incomplete: { 
        color: "bg-red-100 text-red-700 border-red-200", 
        icon: XCircle, 
        label: "Incomplete" 
      },
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading assigned assessments...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">Error loading assigned assessments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <ClipboardList className="w-10 h-10 text-indigo-600" />
            Assigned Assessments
          </h1>
          <p className="text-gray-600">
            Manage and review all assigned candidate assessments
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                placeholder="Search by candidate name or assessment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="reviewed">Reviewed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
            <div className="text-3xl font-bold text-gray-900">{items.length}</div>
            <div className="text-gray-600 text-sm">Total Assigned</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
            <div className="text-3xl font-bold text-gray-900">
              {items.filter((i: any) => i.status === "pending").length}
            </div>
            <div className="text-gray-600 text-sm">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-gray-900">
              {items.filter((i: any) => i.status === "submitted").length}
            </div>
            <div className="text-gray-600 text-sm">Submitted</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="text-3xl font-bold text-gray-900">
              {items.filter((i: any) => i.status === "reviewed").length}
            </div>
            <div className="text-gray-600 text-sm">Reviewed</div>
          </div>
        </div>

        {/* Assessment Cards */}
        {filteredItems.length === 0 ? (
          <div className="text-center bg-white p-20 rounded-xl shadow-md">
            <ClipboardList className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl mb-2">
              {searchTerm || filterStatus !== "all" 
                ? "No assessments match your filters" 
                : "No assessments assigned yet"}
            </p>
            <p className="text-gray-400">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Start by assigning assessments to candidates"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item: any, i: number) => {
              const statusConfig = getStatusConfig(item.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
                  style={{
                    animation: `fadeIn 0.4s ease-out ${i * 0.05}s both`,
                  }}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Left Section - Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">
                              {item.candidate}
                            </h2>
                            <p className="text-indigo-600 font-medium mb-2">
                              {item.assessmentTitle || "Untitled Assessment"}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>
                                  Due: {new Date(item.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  ID: {item.assessmentId?.substring(0, 8)}...
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {item.note && (
                          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">📋 Notes:</span> {item.note}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right Section - Actions */}
                      <div className="flex lg:flex-col gap-3 lg:items-end">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-medium text-sm ${statusConfig.color}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span>{statusConfig.label}</span>
                        </div>

                        <button
                          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
                          onClick={() => setSelected(item)}
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>

                        <button
                          onClick={() => navigate(`/assessments/${item.assessmentId}/review`)}
                          className="flex items-center gap-2 border-2 border-indigo-600 text-indigo-600 px-5 py-2.5 rounded-lg hover:bg-indigo-50 transition-all font-medium"
                        >
                          <ClipboardList className="w-4 h-4" />
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Viewing Assignment Details */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">
                Assignment Details
              </h2>
              <p className="text-indigo-100">{selected.assessmentTitle}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Candidate Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Candidate</p>
                  <p className="text-lg font-bold text-gray-900">{selected.candidate}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <p className="text-sm font-semibold text-blue-900">Due Date</p>
                  </div>
                  <p className="text-blue-700 font-medium">
                    {new Date(selected.dueDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <p className="text-sm font-semibold text-purple-900">Status</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const config = getStatusConfig(selected.status);
                      const Icon = config.icon;
                      return (
                        <>
                          <Icon className="w-4 h-4 text-purple-600" />
                          <p className="text-purple-700 font-medium capitalize">
                            {selected.status}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selected.note && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <p className="text-sm font-semibold text-amber-900">Notes</p>
                  </div>
                  <p className="text-amber-800">{selected.note}</p>
                </div>
              )}

              {/* Assessment ID */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Assessment ID</p>
                <code className="text-sm text-gray-700 font-mono">
                  {selected.assessmentId}
                </code>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    navigate(`/assessments/${selected.assessmentId}/review`);
                    setSelected(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg font-semibold"
                >
                  <ClipboardList className="w-5 h-5" />
                  Go to Review
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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