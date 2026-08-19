'use client'
import { useState } from 'react'

export default function ProductForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Save' }) {
  const [title, setTitle] = useState(initial.title || '')
  const [price, setPrice] = useState(initial.price || '')
  const [category, setCategory] = useState(initial.category || '')
  const [brand, setBrand] = useState(initial.brand || '')
  const [stock, setStock] = useState(initial.stock || '')
  const [description, setDescription] = useState(initial.description || '')

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ title, price: Number(price), category, brand, stock: Number(stock), description }) }} style={{ display: 'grid', gap: 8 }}>
      <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} required /></label>
      <label>Price<input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required /></label>
      <label>Category<input value={category} onChange={(e) => setCategory(e.target.value)} /></label>
      <label>Brand<input value={brand} onChange={(e) => setBrand(e.target.value)} /></label>
      <label>Stock<input type="number" value={stock} onChange={(e) => setStock(e.target.value)} /></label>
      <label>Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} /></label>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">{submitLabel}</button>
      </div>
    </form>
  )
}
