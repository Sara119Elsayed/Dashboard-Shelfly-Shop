'use client'
import Link from 'next/link'

export default function ProductCard({ product }) {
  return (
    <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
      <h3 style={{ margin: '0 0 8px' }}>
        <Link href={`/dashboard/products/${product.id}`}>{product.title}</Link>
      </h3>
      <div style={{ color: '#666' }}>{product.brand} · ${product.price}</div>
    </div>
  )
}
