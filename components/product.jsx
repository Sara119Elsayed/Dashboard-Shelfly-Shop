'use client'
import { useState } from 'react'

export default function ProductForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Save' }) {
  const [form, setForm] = useState({
    title: initial.title ?? '',
    price: initial.price ?? '',
    category: initial.category ?? '',
    brand: initial.brand ?? '',
    stock: initial.stock ?? '',
    description: initial.description ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const inputClass = 'mt-1.5 h-10 w-full rounded-md border border-[#d7dfd8] bg-white px-3 text-sm text-[#17211d] outline-none focus:border-[#368064] focus:ring-2 focus:ring-[#368064]/15'

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSubmit({
        ...form,
        title: form.title.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        brand: form.brand.trim(),
        stock: Number(form.stock),
        description: form.description.trim(),
      })
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not save product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-xs font-medium text-[#56635c]">
        Product name
        <input className={inputClass} value={form.title} onChange={(event) => updateField('title', event.target.value)} required />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-[#56635c]">
          Price
          <input className={inputClass} type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateField('price', event.target.value)} required />
        </label>
        <label className="block text-xs font-medium text-[#56635c]">
          Stock
          <input className={inputClass} type="number" min="0" step="1" value={form.stock} onChange={(event) => updateField('stock', event.target.value)} required />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-[#56635c]">
          Category
          <input className={inputClass} value={form.category} onChange={(event) => updateField('category', event.target.value)} required />
        </label>
        <label className="block text-xs font-medium text-[#56635c]">
          Brand
          <input className={inputClass} value={form.brand} onChange={(event) => updateField('brand', event.target.value)} />
        </label>
      </div>
      <label className="block text-xs font-medium text-[#56635c]">
        Description
        <textarea className="mt-1.5 min-h-24 w-full resize-y rounded-md border border-[#d7dfd8] bg-white px-3 py-2 text-sm text-[#17211d] outline-none focus:border-[#368064] focus:ring-2 focus:ring-[#368064]/15" value={form.description} onChange={(event) => updateField('description', event.target.value)} />
      </label>
      {error ? <p className="text-sm text-rose-700" role="alert">{error}</p> : null}
      <div className="flex justify-end gap-2 border-t border-[#eef1ee] pt-4">
        <button className="h-9 rounded-md border border-[#d7dfd8] px-3 text-sm font-medium text-[#56635c] hover:bg-[#f8faf8]" type="button" onClick={onCancel} disabled={saving}>Cancel</button>
        <button className="h-9 rounded-md bg-[#176b52] px-3.5 text-sm font-medium text-white hover:bg-[#12583f] disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
