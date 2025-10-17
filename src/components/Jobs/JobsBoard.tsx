import React, { useState } from "react";
import {
  Briefcase,
  PlusCircle,
  Search,
  Tag,
  X,
  Edit2,
  Trash2,
  Check,
  MapPin,
  DollarSign,
  Clock,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Type definitions
interface Job {
  id: string;
  title: string;
  status: "active" | "inactive";
  tags: string[];
  order: number;
  location: string;
  salary: string;
  type: string;
  applicants: number;
  description: string;
}

type FormState = Omit<Job, "id" | "order" | "tags"> & { tags: string };

// ✅ Mock data generator
const generateMockJobs = (): Job[] => [
  {
    id: "1",
    title: "Senior React Developer",
    status: "active",
    tags: ["React", "TypeScript", "Remote"],
    order: 1,
    location: "Remote",
    salary: "$120k - $160k",
    type: "Full-time",
    applicants: 24,
    description: "Join our team to build cutting-edge web applications",
  },
  {
    id: "2",
    title: "UX/UI Designer",
    status: "active",
    tags: ["Figma", "Design Systems"],
    order: 2,
    location: "New York, NY",
    salary: "$90k - $130k",
    type: "Full-time",
    applicants: 18,
    description: "Create beautiful and intuitive user experiences",
  },
  {
    id: "3",
    title: "Product Manager",
    status: "inactive",
    tags: ["Strategy", "Agile"],
    order: 3,
    location: "San Francisco, CA",
    salary: "$140k - $180k",
    type: "Full-time",
    applicants: 31,
    description: "Lead product vision and drive business outcomes",
  },
  {
    id: "4",
    title: "DevOps Engineer",
    status: "active",
    tags: ["AWS", "Kubernetes", "CI/CD"],
    order: 4,
    location: "Remote",
    salary: "$130k - $170k",
    type: "Full-time",
    applicants: 12,
    description: "Build and maintain scalable infrastructure",
  },
];

export default function JobsBoard() {
  const [jobs, setJobs] = useState<Job[]>(generateMockJobs());
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">(
    "all"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<FormState>({
    title: "",
    status: "active",
    tags: "",
    location: "",
    salary: "",
    type: "Full-time",
    applicants: 0,
    description: "",
  });

  // ✅ Filter + Search logic
  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus =
        filterStatus === "all" || job.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.order - b.order);

  // ✅ Modal handlers
  const openModal = (job?: Job | null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title,
        status: job.status,
        tags: job.tags.join(", "),
        location: job.location,
        salary: job.salary,
        type: job.type,
        applicants: job.applicants,
        description: job.description,
      });
    } else {
      setEditingJob(null);
      setFormData({
        title: "",
        status: "active",
        tags: "",
        location: "",
        salary: "",
        type: "Full-time",
        applicants: 0,
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = () => {
    if (!formData.title || !formData.salary || !formData.location) {
      alert("Please fill all required fields");
      return;
    }

    if (editingJob) {
      setJobs(
        jobs.map((j) =>
          j.id === editingJob.id
            ? {
                ...j,
                ...formData,
                tags: formData.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              }
            : j
        )
      );
    } else {
      const newJob: Job = {
        id: Date.now().toString(),
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        order: jobs.length + 1,
      };
      setJobs([...jobs, newJob]);
    }
    closeModal();
  };

  const deleteJob = (id: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      setJobs(jobs.filter((j) => j.id !== id));
    }
  };

  const toggleStatus = (id: string) => {
    setJobs(
      jobs.map((j) =>
        j.id === id
          ? { ...j, status: j.status === "active" ? "inactive" : "active" }
          : j
      )
    );
  };

  // ✅ Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Briefcase className="w-10 h-10 text-indigo-600" />
              Job Openings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your openings with filters, animations & editing
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
          >
            <PlusCircle className="w-5 h-5" /> New Job
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-md p-4 rounded-xl flex flex-wrap gap-4 items-center mb-8">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              placeholder="Search by title or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg w-full focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
          {["all", "active", "inactive"].map((s) => (
            <button
              key={s}
              onClick={() =>
                setFilterStatus(s as "all" | "active" | "inactive")
              }
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === s
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Job Grid */}
        <AnimatePresence>
          {filteredJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white rounded-xl shadow-md"
            >
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No jobs found. Try changing filters.
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredJobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {job.title}
                    </h3>
                    <button
                      onClick={() => toggleStatus(job.id)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        job.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {job.status}
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="space-y-1 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      {job.salary}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      {job.type}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      {job.applicants} applicants
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openModal(job)}
                      className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-all flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition-all flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-y-auto"
            >
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingJob ? "Edit Job" : "Create Job"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Range *
                </label>
                <input
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
                />

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {editingJob ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
