import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGET, apiPOST } from '../../utils/api'

export default function RuntimeForm() {
  const { id } = useParams<{ id: string }>()
  const qc = useQueryClient()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')

  // ✅ Fetch candidate info
  const { data: candidate, isLoading: candidateLoading } = useQuery({
    queryKey: ['candidate', id],
    queryFn: async () => {
      const res: any = await apiGET('/api/candidates?page=1&pageSize=1000')
      return res.data.find((c: any) => c.id === id)
    },
    enabled: !!id,
  })

  // ✅ Fetch assigned assessments safely
  const { data: assignmentsData, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['assignments', id],
    queryFn: async () => {
      const res: any = await apiGET(`/api/candidates/${id}/assignments`)
      // Always return an array
      return Array.isArray(res.data) ? res.data : []
    },
    enabled: !!id,
  })

  const assignments = assignmentsData || [] // ✅ ensure it’s always an array

  // ✅ Mutation to assign a new assessment
  const assignMut = useMutation({
    mutationFn: async (payload: any) => {
      return apiPOST(`/api/candidates/${id}/assign`, payload)
    },
    onSuccess: () => {
      alert('Assessment assigned successfully!')
      setTitle('')
      setDescription('')
      setDueDate('')
      qc.invalidateQueries({ queryKey: ['assignments', id] })
    },
  })

  if (candidateLoading) return <div>Loading candidate...</div>
  if (!candidate) return <div>Candidate not found.</div>

  return (
    <div style={{ padding: '20px', maxWidth: 800, margin: 'auto' }}>
      <h2>Assign Assessment to {candidate.name}</h2>
      <p><strong>Email:</strong> {candidate.email}</p>
      <p><strong>Current Stage:</strong> {candidate.stage}</p>

      <hr />

      {/* Assign new assessment */}
      <h3>New Assessment</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Technical Coding Test"
            style={{ width: '100%', padding: 6 }}
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Complete the React component within 2 hours."
            style={{ width: '100%', minHeight: 80 }}
          />
        </label>

        <label>
          Due Date:
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ padding: 6 }}
          />
        </label>

        <button
          onClick={() => {
            if (!title || !description || !dueDate) {
              alert('Please fill all fields')
              return
            }
            assignMut.mutate({ title, description, dueDate })
          }}
          disabled={assignMut.isPending}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            padding: '8px 12px',
            cursor: 'pointer',
            width: 'fit-content',
          }}
        >
          {assignMut.isPending ? 'Assigning...' : 'Assign Assessment'}
        </button>
      </div>

      <hr style={{ margin: '20px 0' }} />

      {/* ✅ List assigned assessments safely */}
      <h3>Previously Assigned Assessments</h3>
      {assignmentsLoading ? (
        <div>Loading assessments...</div>
      ) : assignments.length === 0 ? (
        <div>No assessments assigned yet.</div>
      ) : (
        <div style={{ marginTop: 10 }}>
          {assignments.map((a: any, idx: number) => (
            <div
              key={idx}
              style={{
                border: '1px solid #ccc',
                borderRadius: 6,
                padding: 10,
                marginBottom: 8,
              }}
            >
              <div><strong>Title:</strong> {a.title}</div>
              <div><strong>Description:</strong> {a.description}</div>
              <div><strong>Due:</strong> {a.dueDate}</div>
              <div><strong>Status:</strong> {a.status || 'Pending'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
