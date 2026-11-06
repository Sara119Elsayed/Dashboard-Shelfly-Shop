'use client'
import { useState } from 'react'
import { deleteProduct } from '../services/ProductsService'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteProduct({ id, onDeleted, skipApi = false }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete product?')) return
    setDeleting(true)
    try {
      if (!skipApi) await deleteProduct(id)
      if (onDeleted) onDeleted()
      else router.push('/dashboard/products')
    } catch (err) {
      alert('Delete failed: ' + String(err))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <button
      aria-label="Delete product"
      className="inline-flex h-8 items-center justify-center rounded-md border border-[#edcaca] bg-white px-2 text-sm font-medium text-[#a23d3d] transition-colors hover:bg-[#fff5f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a23d3d] disabled:opacity-60"
      onClick={handleDelete}
      type="button"
      disabled={deleting}
      title={deleting ? 'Deleting product' : 'Delete product'}
    >
      <Trash2 size={15} aria-hidden="true" />
    </button>
  )
}
