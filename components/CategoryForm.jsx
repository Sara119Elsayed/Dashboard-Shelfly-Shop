'use client'
import { useState } from 'react'

export default function CategoryForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Save' }) {
  const [name, setName] = useState(initial.name || '')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ name }) }} style={{ display: 'grid', gap: 8 }}>
      <label>Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">{submitLabel}</button>
      </div>
    </form>
  )
}
