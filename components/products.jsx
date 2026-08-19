'use client'
import { useState } from 'react'
import useProducts from '../hooks/UseProducts'
import ProductCard from './productcard'

export default function Products() {
  const { products, loading, error, search } = useProducts()
  const [q, setQ] = useState('')

  return (
    <div>
      <h1>Products</h1>
      <div style={{ marginTop: 12 }}>
        <input placeholder="Search products" style={{ padding: 8, width: '100%', maxWidth: 400 }} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') search(q) }} />
        <button onClick={() => search(q)} style={{ marginLeft: 8 }}>Search</button>
      </div>

      <div style={{ marginTop: 16 }}>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>{String(error)}</div>}
        {!loading && !error && (
          <div style={{ display: 'grid', gap: 12 }}>
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
