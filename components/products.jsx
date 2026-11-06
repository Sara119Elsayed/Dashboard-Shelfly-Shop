'use client'
import { useState } from 'react'
import { Plus, Search, X } from 'lucide-react'
import useProducts from '../hooks/UseProducts'
import ProductCard from './productcard'
import ProductForm from './product'

export default function Products() {
  const { products, loading, error, search, createProduct, updateProduct, removeProductFromList } = useProducts()
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ open: false, product: null })

  async function saveProduct(payload) {
    if (form.product) await updateProduct(form.product, payload)
    else await createProduct(payload)
    setForm({ open: false, product: null })
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 pb-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#dfe6e0] pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#368064]">Catalog</p>
          <h1 className="mt-1 text-2xl font-semibold text-[#17211d]">Products</h1>
          <p className="mt-1 text-sm text-[#77827c]">Review and find items in your catalog.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <form className="flex min-w-0 flex-1 gap-2 sm:w-auto" onSubmit={(event) => { event.preventDefault(); search(q) }} role="search">
            <label className="sr-only" htmlFor="product-search">Search products</label>
            <div className="relative min-w-0 flex-1 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#89938d]" size={16} aria-hidden="true" />
              <input id="product-search" placeholder="Search products" className="h-10 w-full rounded-md border border-[#d7dfd8] bg-white pl-9 pr-3 text-sm text-[#17211d] outline-none placeholder:text-[#89938d] focus:border-[#368064] focus:ring-2 focus:ring-[#368064]/15" value={q} onChange={(event) => setQ(event.target.value)} />
            </div>
            <button className="h-10 rounded-md border border-[#d7dfd8] bg-white px-3 text-sm font-medium text-[#36443c] transition-colors hover:bg-[#f8faf8]" type="submit">Search</button>
          </form>
          <button className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#176b52] px-3.5 text-sm font-medium text-white transition-colors hover:bg-[#12583f]" onClick={() => setForm({ open: true, product: null })} type="button">
            <Plus size={16} aria-hidden="true" /> Add product
          </button>
        </div>
      </header>

      <section className="overflow-hidden rounded-md border border-[#e2e8e3] bg-white shadow-[0_1px_2px_rgba(23,33,29,0.03)]" aria-label="Product catalog">
        <div className="flex items-center justify-between border-b border-[#e8ede8] px-4 py-3.5 sm:px-5">
          <h2 className="text-sm font-semibold text-[#17211d]">All products</h2>
          <span className="text-xs tabular-nums text-[#77827c]">{products.length.toLocaleString()} shown</span>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid grid-cols-[minmax(220px,2fr)_minmax(120px,1fr)_70px_90px_72px] gap-4 border-b border-[#e8ede8] bg-[#f8faf8] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#77827c]">
              <span>Product</span><span>Category</span><span>Stock</span><span className="text-right">Price</span><span className="text-right">Actions</span>
            </div>
            {loading ? (
              <p className="px-5 py-10 text-center text-sm text-[#77827c]" role="status">Loading products…</p>
            ) : error ? (
              <p className="px-5 py-10 text-center text-sm text-rose-700" role="alert">{String(error)}</p>
            ) : products.length ? null : (
              <p className="px-5 py-10 text-center text-sm text-[#77827c]">No products found.</p>
            )}
            {!loading && !error ? products.map((product) => (
              <ProductCard key={product.clientKey || product.id} product={product} onEdit={(item) => setForm({ open: true, product: item })} onDeleted={removeProductFromList} />
            )) : null}
          </div>
        </div>
      </section>

      {form.open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17211d]/35 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setForm({ open: false, product: null }) }}>
          <section aria-labelledby="product-form-title" aria-modal="true" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md border border-[#e2e8e3] bg-white p-5 shadow-xl sm:p-6" role="dialog">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#17211d]" id="product-form-title">{form.product ? 'Edit product' : 'Add product'}</h2>
                <p className="mt-1 text-sm text-[#77827c]">Update the catalog record.</p>
              </div>
              <button aria-label="Close dialog" className="flex h-8 w-8 items-center justify-center rounded-md text-[#77827c] hover:bg-[#f3f6f3]" onClick={() => setForm({ open: false, product: null })} type="button">
                <X size={17} aria-hidden="true" />
              </button>
            </div>
            <ProductForm key={form.product?.clientKey || form.product?.id || 'new-product'} initial={form.product || {}} onSubmit={saveProduct} onCancel={() => setForm({ open: false, product: null })} submitLabel={form.product ? 'Save changes' : 'Create product'} />
          </section>
        </div>
      ) : null}
    </div>
  )
}
