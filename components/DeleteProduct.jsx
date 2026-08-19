'use client'
import { deleteProduct } from '../services/ProductsService'
import { useRouter } from 'next/navigation'

export default function DeleteProduct({ id }) {
  const router = useRouter()
  async function handleDelete() {
    if (!confirm('Delete product?')) return
    try {
      await deleteProduct(id)
      router.push('/dashboard/products')
    } catch (err) {
      alert('Delete failed: ' + String(err))
    }
  }

  return <button onClick={handleDelete} style={{ background: '#ffdddd' }}>Delete</button>
}
