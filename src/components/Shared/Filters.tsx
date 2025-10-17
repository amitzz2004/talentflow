import React from 'react'
export default function Filters({ value, onChange }: any){
  return (
    <div>
      <input placeholder="Filter" value={value} onChange={e=>onChange(e.target.value)} />
    </div>
  )
}
