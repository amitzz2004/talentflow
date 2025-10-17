import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiGET } from '../../utils/api'

export default function Builder() {
  const navigate = useNavigate()

  // ✅ Fetch all assessments
  const { data, isLoading, isError } = useQuery({
    queryKey: ['allAssessments'],
    queryFn: async () => {
      const res: any = await apiGET('/api/assessments')
      return res.data || []
    },
  })

  if (isLoading) return <div>Loading assessments...</div>
  if (isError) return <div>Error loading assessments.</div>

  const assessments = Array.isArray(data) ? data : []

  return (
    <div style={{ padding: 24 }}>
      <h2>All Candidate Assessments</h2>

      {assessments.length === 0 ? (
        <p>No assessments found.</p>
      ) : (
        <table
          style={{
            borderCollapse: 'collapse',
            width: '80%',
            marginTop: 20,
            border: '1px solid #ddd',
          }}
        >
          <thead style={{ backgroundColor: '#f8f8f8' }}>
            <tr>
              <th style={thStyle}>Candidate</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Due Date</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((a: any) => (
              <tr key={a.id}>
                <td style={tdStyle}>{a.candidateName}</td>
                <td style={tdStyle}>{a.title}</td>
                <td style={tdStyle}>{a.dueDate || 'N/A'}</td>
                <td style={tdStyle}>{a.status}</td>
                <td style={tdStyle}>
                  {/* 👇 HR clicks Review → navigates to review page */}
                  <button
                    onClick={() => navigate(`/assessments/${a.id}/review`)}
                    style={{
                      background: 'none',
                      color: 'blue',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: 14,
                    }}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const thStyle = {
  border: '1px solid #ddd',
  padding: '8px 12px',
  textAlign: 'left' as const,
  fontWeight: 'bold',
}

const tdStyle = {
  border: '1px solid #ddd',
  padding: '8px 12px',
}
