import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function JobModal({
  open,
  onClose,
  job,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  job: any;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState("");
  const qc = useQueryClient();

  useEffect(() => {
    if (job) setTitle(job.title);
    else setTitle("");
  }, [job]);

  const saveMut = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] }); // ✅ Refresh job list
      onSaved();
    },
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-[380px]">
        <h2 className="text-xl font-semibold mb-4">
          {job ? "Edit Job" : "New Job"}
        </h2>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-600">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter job title"
            className="border w-full px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        <div className="flex justify-end mt-5 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => saveMut.mutate({ title })}
            disabled={!title.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
