'use client'
import Link from 'next/link'
import { Package, Pencil } from 'lucide-react'
import DeleteProduct from './DeleteProduct'

export default function ProductCard({ product, onEdit, onDeleted }) {
  const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)
  const canManage = Boolean(onEdit && onDeleted)

  return (
    <div className={`grid ${canManage ? 'grid-cols-[minmax(220px,2fr)_minmax(120px,1fr)_70px_90px_72px]' : 'grid-cols-[minmax(220px,2fr)_minmax(120px,1fr)_100px_90px]'} items-center gap-4 border-b border-[#eef1ee] px-5 py-3.5 text-sm transition-colors last:border-b-0 hover:bg-[#f8faf8]`}>
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-[#edf4ef] text-[#368064]">
          <Package size={17} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <Link className="block truncate font-medium text-[#26342d] hover:text-[#176b52]" href={`/dashboard/products/${product.id}`}>{product.title}</Link>
          <span className="mt-0.5 block truncate text-xs text-[#89938d]">{product.brand || 'Unbranded'}</span>
        </span>
      </span>
      <span className="truncate capitalize text-[#56635c]">{product.category || '—'}</span>
      <span className="tabular-nums text-[#56635c]">{product.stock ?? '—'}</span>
      <span className="text-right font-medium tabular-nums text-[#26342d]">{price}</span>
      {canManage ? (
        <span className="flex items-center justify-end gap-1">
          <button
            aria-label={`Edit ${product.title}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#68766e] hover:bg-[#eaf3ee] hover:text-[#176b52] focus-visible:outline-2 focus-visible:outline-[#368064]"
            onClick={() => onEdit(product)}
            title="Edit product"
            type="button"
          >
            <Pencil size={15} aria-hidden="true" />
          </button>
          <DeleteProduct id={product.id} onDeleted={() => onDeleted(product)} skipApi={Boolean(product.clientKey)} />
        </span>
      ) : null}
    </div>
  )
}
