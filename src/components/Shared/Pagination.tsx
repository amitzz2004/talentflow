import React from 'react'
export default function Pagination({ page, total, pageSize, onPage }: any){
  const pages = Math.ceil(total / pageSize)
  return (
    <div style={{ display:'flex', gap:6 }}>
      <button disabled={page<=1} onClick={()=>onPage(page-1)}>Prev</button>
      <div>Page {page} / {pages}</div>
      <button disabled={page>=pages} onClick={()=>onPage(page+1)}>Next</button>
    </div>
  )
}
