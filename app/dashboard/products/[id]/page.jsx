import { getProduct } from '../../../../services/ProductsService'
import Link from 'next/link'
import { ArrowLeft, Pencil } from 'lucide-react'
import DeleteProduct from '../../../../components/DeleteProduct'

export default async function ProductPage({ params }) {
  const { id } = await params
  try {
    const product = await getProduct(id)
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5 pb-8">
        <header className="border-b border-[#dfe6e0] pb-5">
          <Link className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#68766e] hover:text-[#176b52]" href="/dashboard/products">
            <ArrowLeft size={14} aria-hidden="true" /> Products
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#368064]">Catalog / Products</p>
              <h1 className="mt-1 text-2xl font-semibold text-[#17211d]">{product.title}</h1>
              <p className="mt-1 text-sm text-[#77827c]">{product.brand || 'Unbranded'}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link className="inline-flex h-9 items-center gap-2 rounded-md border border-[#d7dfd8] bg-white px-3 text-sm font-medium text-[#36443c] transition-colors hover:bg-[#f8faf8]" href={`/dashboard/products/${id}/edit`}>
                <Pencil size={15} aria-hidden="true" /> Edit
              </Link>
              <DeleteProduct id={id} />
            </div>
          </div>
        </header>

        <section className="rounded-md border border-[#e2e8e3] bg-white shadow-[0_1px_2px_rgba(23,33,29,0.03)]" aria-label="Product details">
          <div className="grid gap-6 p-5 sm:grid-cols-3 sm:p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#89938d]">Price</p>
              <p className="mt-2 text-xl font-semibold tabular-nums text-[#17211d]">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#89938d]">Brand</p>
              <p className="mt-2 text-sm font-medium text-[#36443c]">{product.brand || 'Unbranded'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#89938d]">Category</p>
              <Link className="mt-2 inline-flex text-sm font-medium capitalize text-[#176b52] hover:underline" href={`/dashboard/categories/${encodeURIComponent(product.category)}`}>
                {product.category}
              </Link>
            </div>
          </div>
          <div className="border-t border-[#eef1ee] px-5 py-5 sm:px-6">
            <h2 className="text-sm font-semibold text-[#17211d]">Description</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#56635c]">{product.description}</p>
          </div>
        </section>
      </div>
    )
  } catch (err) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-sm text-rose-700" role="alert">Product not found.</p>
        <Link className="mt-3 inline-flex text-sm font-medium text-[#176b52] hover:underline" href="/dashboard/products">Back to products</Link>
      </div>
    )
  }
}
