import { getProductsByCategory } from '../../../../services/CategoriesService'
import Link from 'next/link'
import ProductCard from '../../../../components/productcard'

export default async function CategoryProductsPage({ params }) {
  const { name } = await params
  try {
    const data = await getProductsByCategory(name)
    const products = data.products || []
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5 pb-8">
        <header className="border-b border-[#dfe6e0] pb-5">
          <Link className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#68766e] hover:text-[#176b52]" href="/dashboard/categories">
            <span aria-hidden="true">←</span> Categories
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#368064]">Catalog / Categories</p>
          <h1 className="mt-1 text-2xl font-semibold capitalize text-[#17211d]">{name}</h1>
          <p className="mt-1 text-sm text-[#77827c]">Products filed under this category.</p>
        </header>

        <section className="overflow-hidden rounded-md border border-[#e2e8e3] bg-white shadow-[0_1px_2px_rgba(23,33,29,0.03)]" aria-label={`${name} products`}>
          <div className="flex items-center justify-between border-b border-[#e8ede8] px-4 py-3.5 sm:px-5">
            <h2 className="text-sm font-semibold text-[#17211d]">Products</h2>
            <span className="text-xs tabular-nums text-[#77827c]">{products.length.toLocaleString()} items</span>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[620px]">
              <div className="grid grid-cols-[minmax(220px,2fr)_minmax(120px,1fr)_100px_90px] gap-4 border-b border-[#e8ede8] bg-[#f8faf8] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#77827c]">
                <span>Product</span><span>Category</span><span>Stock</span><span className="text-right">Price</span>
              </div>
              {products.length ? products.map((product) => <ProductCard key={product.id} product={product} />) : (
                <p className="px-5 py-10 text-center text-sm text-[#77827c]">No products in this category.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    )
  } catch (err) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <p className="text-sm text-rose-700" role="alert">Could not load this category.</p>
        <Link className="mt-3 inline-flex text-sm font-medium text-[#176b52] hover:underline" href="/dashboard/categories">Back to categories</Link>
      </div>
    )
  }
}
