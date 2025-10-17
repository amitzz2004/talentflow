import React from 'react'
import { Link } from 'react-router-dom'
import { apiPATCH } from '../../utils/api'

export default function JobRow({ job, onEdit }: any){
  async function toggleArchive(){
    await apiPATCH(`/api/jobs/${job.id}`, { status: job.status==='active' ? 'archived' : 'active' })
    window.location.reload()
  }
  return (
    <div style={{ border: '1px solid #eee', padding:8, marginBottom:8, display:'flex', justifyContent:'space-between' }}>
      <div>
        <Link to={`/jobs/${job.id}`}>{job.title}</Link>
        <div style={{ fontSize:12 }}>{job.tags?.join(', ')}</div>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={()=>onEdit(job)}>Edit</button>
        <button onClick={toggleArchive}>{job.status==='active' ? 'Archive' : 'Unarchive'}</button>
      </div>
    </div>
  )
}
