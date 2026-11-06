'use client'
import { useState } from 'react'

export default function CategoryForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Save', isSaving = false, error = '' }) {
  const [name, setName] = useState(initial.name ?? '')

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmit({ name: name.trim() }) }}>
      <label className="block text-xs font-medium text-[#56635c]">
        Category name
        <input className="mt-1.5 h-10 w-full rounded-md border border-[#d7dfd8] bg-white px-3 text-sm text-[#17211d] outline-none focus:border-[#368064] focus:ring-2 focus:ring-[#368064]/15" value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      {error ? <p className="text-sm text-rose-700" role="alert">{error}</p> : null}
      <div className="flex justify-end gap-2 border-t border-[#eef1ee] pt-4">
        <button className="h-9 rounded-md border border-[#d7dfd8] px-3 text-sm font-medium text-[#56635c] hover:bg-[#f8faf8]" type="button" onClick={onCancel} disabled={isSaving}>Cancel</button>
        <button className="h-9 rounded-md bg-[#176b52] px-3.5 text-sm font-medium text-white hover:bg-[#12583f] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
