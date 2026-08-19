'use client'
import { useState } from 'react'
import ProductForm from './product'
import { addProduct } from '../services/ProductsService'

export default function AddProductPage() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function handleSubmit(payload) {
    setLoading(true)
    try {
      const data = await addProduct(payload)
      setResult(data)
    } catch (err) {
      setResult({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Add Product</h1>
      <div style={{ maxWidth: 520 }}>
        <ProductForm onSubmit={handleSubmit} onCancel={() => { setTitle(''); setPrice(''); setCategory(''); setBrand(''); setStock(''); setDescription(''); setResult(null) }} submitLabel={loading ? 'Adding...' : 'Add Product'} />
      </div>

      {result && (
        <pre style={{ marginTop: 12, background: '#f7f7f7', padding: 8 }}>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  )
}
