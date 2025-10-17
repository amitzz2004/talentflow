import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGET, apiPATCH } from "../../utils/api";
import {
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Filter,
  X,
  ChevronDown,
  Star,
  ExternalLink,
  Download,
  Grid,
  AlignJustify,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

// Type definition for Candidate
type Candidate = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  jobId?: string;
  stage: string;
  skills?: string[];
  starred?: boolean;
  avatar?: string;
  experience?: number;
  salary?: string;
  appliedDate?: string;
};

export default function CandidatesList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // ✅ Fetch candidates from API
  const { data, isLoading, isError } = useQuery({
    queryKey: ["candidates"],
    queryFn: async () => {
      const res: any = await apiGET("/api/candidates");
      return res.data;
    },
  });

  const candidates = Array.isArray(data) ? data : [];

  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // ✅ Mutation for updating candidate stage
  const updateStageMut = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
      return apiPATCH(`/api/candidates/${id}`, { stage });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
    },
    onError: (error) => {
      console.error("Failed to update stage:", error);
      alert("Failed to update candidate stage. Please try again.");
    },
  });

  const stages = [
    { value: "applied", label: "Applied", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Clock },
    { value: "screening", label: "Screening", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: AlertCircle },
    { value: "technical", label: "Technical", color: "bg-purple-100 text-purple-700 border-purple-200", icon: Briefcase },
    { value: "offer", label: "Offer", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
    { value: "hired", label: "Hired", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
    { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700 border-red-200", icon: X },
  ];

  // Filtering and sorting logic
  const filteredCandidates = useMemo(() => {
    let result = candidates.filter((c: Candidate) => {
      const matchesSearch =
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        (c.skills || []).some((skill: string) =>
          skill.toLowerCase().includes(search.toLowerCase())
        );

      const matchesStage = filterStage === "all" || c.stage === filterStage;

      return matchesSearch && matchesStage;
    });

    if (sortBy === "name") {
      result.sort((a: Candidate, b: Candidate) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "recent") {
      result.sort(
        (a: Candidate, b: Candidate) =>
          new Date(b.appliedDate || 0).getTime() -
          new Date(a.appliedDate || 0).getTime()
      );
    } else if (sortBy === "starred") {
      result.sort((a: Candidate, b: Candidate) => Number(b.starred) - Number(a.starred));
    }

    return result;
  }, [candidates, search, filterStage, sortBy]);

  const getStageColor = (stage: string) => {
    const stageObj = stages.find(s => s.value === stage);
    return stageObj?.color || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStageIcon = (stage: string) => {
    const stageObj = stages.find(s => s.value === stage);
    return stageObj?.icon || Clock;
  };

  const handleStageChange = (candidateId: string, newStage: string) => {
    updateStageMut.mutate({ id: candidateId, stage: newStage });
    setActiveDropdown(null);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  const stats = useMemo(
    () => ({
      total: candidates.length,
      active: candidates.filter(
        (c: Candidate) => !["hired", "rejected"].includes(c.stage)
      ).length,
      interviewed: candidates.filter((c: Candidate) => c.stage === "technical").length,
      hired: candidates.filter((c: Candidate) => c.stage === "hired").length,
    }),
    [candidates]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error loading candidates</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                <Users className="w-10 h-10 text-indigo-600" />
                Candidates
              </h1>
              <p className="text-gray-600">
                Track and manage your recruitment pipeline
              </p>
            </div>

            <div className="flex items-center gap-3">
              
              <div className="flex bg-white rounded-lg shadow-md border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 ${
                    viewMode === "grid"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600"
                  } transition-colors rounded-l-lg`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 ${
                    viewMode === "list"
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600"
                  } transition-colors rounded-r-lg`}
                >
                  <AlignJustify className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-xl shadow-md space-y-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[300px]">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  placeholder="Search by name, email, or skills..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none transition-all"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  showFilters
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-white"
              >
                <option value="recent">Most Recent</option>
                <option value="name">Name (A-Z)</option>
                <option value="starred">Starred First</option>
              </select>
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 animate-fadeIn">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Stage
                  </label>
                  <select
                    value={filterStage}
                    onChange={(e) => setFilterStage(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none bg-white text-sm"
                  >
                    <option value="all">All Stages</option>
                    {stages.map((stage) => (
                      <option key={stage.value} value={stage.value}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </div>

                {filterStage !== "all" && (
                  <button
                    onClick={() => setFilterStage("all")}
                    className="self-end px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
            <div className="text-3xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-gray-600 text-sm">Total Candidates</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-gray-900">
              {stats.active}
            </div>
            <div className="text-gray-600 text-sm">Active Pipeline</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
            <div className="text-3xl font-bold text-gray-900">
              {stats.interviewed}
            </div>
            <div className="text-gray-600 text-sm">In Technical</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <div className="text-3xl font-bold text-gray-900">
              {stats.hired}
            </div>
            <div className="text-gray-600 text-sm">Hired</div>
          </div>
        </div>

        <div className="mb-4 text-gray-600">
          Showing <strong>{filteredCandidates.length}</strong> candidates
        </div>

        {/* Candidates Grid/List */}
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No candidates found</p>
            <p className="text-gray-400 text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate: Candidate, idx: number) => {
              const StageIcon = getStageIcon(candidate.stage);
              return (
                <div
                  key={candidate.id}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl border border-gray-100 transition-all group relative"
                  style={{
                    animation: `fadeIn 0.3s ease-out ${idx * 0.03}s both`,
                  }}
                >
                  <div 
                    onClick={() => setSelectedCandidate(candidate)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {candidate.name}
                          </h3>
                          <p className="text-xs text-gray-500">{candidate.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-indigo-500" />
                        <span className="truncate">{candidate.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-4 h-4 text-purple-500" />
                        Job ID: {candidate.jobId ? candidate.jobId.substring(0, 8) + "..." : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {/* Interactive Stage Dropdown */}
                    <div className="relative flex-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === candidate.id ? null : candidate.id);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs rounded-lg font-medium border-2 transition-all hover:shadow-md ${getStageColor(
                          candidate.stage
                        )}`}
                      >
                        <div className="flex items-center gap-2">
                          <StageIcon className="w-4 h-4" />
                          <span>{stages.find(s => s.value === candidate.stage)?.label || candidate.stage}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === candidate.id ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Dropdown Menu */}
                      {activeDropdown === candidate.id && (
                        <div 
                          className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden animate-fadeIn"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {stages.map((stage) => {
                            const Icon = stage.icon;
                            return (
                              <button
                                key={stage.value}
                                onClick={() => handleStageChange(candidate.id, stage.value)}
                                disabled={updateStageMut.isPending}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all hover:bg-gray-50 ${
                                  candidate.stage === stage.value ? 'bg-indigo-50 font-semibold' : ''
                                } ${updateStageMut.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                              >
                                <Icon className={`w-4 h-4 ${candidate.stage === stage.value ? 'text-indigo-600' : 'text-gray-500'}`} />
                                <span className={candidate.stage === stage.value ? 'text-indigo-600' : 'text-gray-700'}>
                                  {stage.label}
                                </span>
                                {candidate.stage === stage.value && (
                                  <CheckCircle2 className="w-4 h-4 text-indigo-600 ml-auto" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedCandidate(candidate)}
                      className="ml-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    </button>
                  </div>

                  {/* Loading Overlay */}
                  {updateStageMut.isPending && updateStageMut.variables?.id === candidate.id && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {filteredCandidates.map((candidate: Candidate, idx: number) => (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                className="flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group"
                style={{
                  animation: `fadeIn 0.2s ease-out ${idx * 0.02}s both`,
                }}
              >
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    {candidate.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {candidate.email}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium border-2 ${getStageColor(
                      candidate.stage
                    )}`}
                  >
                    {stages.find(s => s.value === candidate.stage)?.label || candidate.stage}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Candidate Modal */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start rounded-t-2xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Users className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCandidate.name}
                  </h2>
                  <p className="text-gray-600">{selectedCandidate.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Stage */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Current Stage
                </h3>
                <div className="flex items-center gap-2">
                  {(() => {
                    const StageIcon = getStageIcon(selectedCandidate.stage);
                    return (
                      <>
                        <StageIcon className="w-5 h-5" />
                        <span
                          className={`inline-block px-4 py-2 text-sm rounded-lg font-medium border-2 ${getStageColor(
                            selectedCandidate.stage
                          )}`}
                        >
                          {stages.find(s => s.value === selectedCandidate.stage)?.label || selectedCandidate.stage}
                        </span>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-indigo-500" />
                    <span className="text-gray-900">
                      {selectedCandidate.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-900">
                      Job ID: {selectedCandidate.jobId || "Not assigned"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assign Task Button */}
              <div className="pt-4">
                <button
                  onClick={() =>
                    navigate(`/candidates/${selectedCandidate.id}/assign-task`)
                  }
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-lg"
                >
                  Assign Task
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
            transform: translateY(10px);
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