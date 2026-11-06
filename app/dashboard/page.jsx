'use client'

import { useEffect, useState } from 'react'
import { FolderTree, Package, Users } from 'lucide-react'
import { getCategories } from '../../services/CategoriesService'
import { getProducts } from '../../services/ProductsService'
import { getUsers } from '../../services/UserService'

const AGE_GROUPS = [
  { label: 'Under 25', min: 0, max: 24 },
  { label: '25–34', min: 25, max: 34 },
  { label: '35–44', min: 35, max: 44 },
  { label: '45+', min: 45, max: Infinity },
]

const CHART_COLORS = ['#176b52', '#4f9d79', '#e6a543', '#e26b58', '#4e92a0', '#7689a7']

function Metric({ label, value, icon: Icon, tone }) {
  return (
    <article className="flex min-h-28 items-center justify-between rounded-md border border-[#e2e8e3] bg-white p-5 shadow-[0_1px_2px_rgba(23,33,29,0.03)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#77827c]">{label}</p>
        <p className="mt-2 text-3xl font-semibold tabular-nums text-[#17211d]">
          {value === null ? '—' : value.toLocaleString()}
        </p>
      </div>
      <span className={`flex h-10 w-10 items-center justify-center rounded-md ${tone}`}>
        <Icon size={20} aria-hidden="true" />
      </span>
    </article>
  )
}

function PieChart({ items, emptyLabel }) {
  const total = items.reduce((sum, item) => sum + item.value, 0)

  if (!items.length || total === 0) {
    return <p className="py-10 text-center text-sm text-neutral-500">{emptyLabel}</p>
  }

  let accumulated = 0
  const slices = items.map((item, index) => {
    const start = (accumulated / total) * 100
    accumulated += item.value

    return {
      ...item,
      color: CHART_COLORS[index % CHART_COLORS.length],
      start,
      end: (accumulated / total) * 100,
    }
  })
  const gradient = slices.map(({ color, start, end }) => `${color} ${start}% ${end}%`).join(', ')

  return (
    <div className="grid items-center gap-6 sm:grid-cols-[minmax(160px,180px)_minmax(0,1fr)]">
      <div
        className="mx-auto flex aspect-square w-40 items-center justify-center rounded-full"
        role="img"
        aria-label={items.map(({ label, value }) => `${label}: ${value.toLocaleString()}`).join(', ')}
        style={{ background: `conic-gradient(from -90deg, ${gradient})` }}
      >
        <div className="flex aspect-square w-[58%] flex-col items-center justify-center rounded-full bg-white">
          <span className="text-xl font-semibold tabular-nums text-[#17211d]">{total.toLocaleString()}</span>
          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#89938d]">Total</span>
        </div>
      </div>
      <ul className="min-w-0 space-y-3" aria-label="Chart legend">
        {slices.map(({ label, value, color }) => (
          <li key={label} className="grid grid-cols-[9px_minmax(0,1fr)_auto] items-center gap-2.5 text-xs">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} aria-hidden="true" />
            <span className="truncate text-[#56635c]">{label}</span>
            <span className="text-right font-medium tabular-nums text-[#17211d]">
              {value.toLocaleString()} <span className="font-normal text-[#89938d]">({((value / total) * 100).toFixed(0)}%)</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function DashboardOverview() {
  const [overview, setOverview] = useState(null)
  const [error, setError] = useState('')
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let active = true

    async function loadOverview() {
      setError('')
      try {
        const [productsResponse, categoriesResponse, usersResponse] = await Promise.all([
          getProducts(0),
          getCategories(),
          getUsers(0),
        ])
        if (!active) return

        const products = productsResponse.products || []
        const users = usersResponse.users || []
        const productsByCategory = products.reduce((counts, product) => {
          counts[product.category] = (counts[product.category] || 0) + 1
          return counts
        }, {})
        const usersByAge = AGE_GROUPS.map(({ label, min, max }) => ({
          label,
          value: users.filter((user) => user.age >= min && user.age <= max).length,
        }))

        setOverview({
          productCount: productsResponse.total ?? products.length,
          categoryCount: Array.isArray(categoriesResponse) ? categoriesResponse.length : 0,
          userCount: usersResponse.total ?? users.length,
          productsByCategory: Object.entries(productsByCategory)
            .map(([label, value]) => ({ label, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6),
          usersByAge,
        })
      } catch {
        if (active) setError('Unable to load overview data. Check your connection and try again.')
      }
    }

    loadOverview()
    return () => { active = false }
  }, [retryKey])

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 pb-8">
      <header className="border-b border-[#dfe6e0] pb-5">
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal text-[#17211d]">Overview</h1>
          </div>
          <p className="pb-0.5 text-xs font-medium text-[#77827c]">Store summary</p>
        </div>
      </header>

      {error ? (
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
          <span>{error}</span>
          <button
            className="font-semibold underline underline-offset-2"
            onClick={() => setRetryKey((key) => key + 1)}
          >
            Retry
          </button>
        </div>
      ) : null}

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Store statistics">
        <Metric label="Products" value={overview?.productCount ?? null} icon={Package} tone="bg-emerald-50 text-emerald-700" />
        <Metric label="Categories" value={overview?.categoryCount ?? null} icon={FolderTree} tone="bg-amber-50 text-amber-700" />
        <Metric label="Users" value={overview?.userCount ?? null} icon={Users} tone="bg-sky-50 text-sky-700" />
      </section>

      <section className="grid gap-4 xl:grid-cols-2" aria-label="Store charts">
        <article className="rounded-md border border-[#e2e8e3] bg-white p-5 shadow-[0_1px_2px_rgba(23,33,29,0.03)]">
          <div className="mb-6 border-b border-[#eef1ee] pb-4">
            <h2 className="text-sm font-semibold text-[#17211d]">Products by category</h2>
            <p className="mt-1 text-xs text-[#77827c]">Top categories by product count</p>
          </div>
          {overview ? (
            <PieChart items={overview.productsByCategory} emptyLabel="No product data available." />
          ) : (
            <p className="py-10 text-center text-sm text-neutral-500" role="status">Loading chart…</p>
          )}
        </article>

        <article className="rounded-md border border-[#e2e8e3] bg-white p-5 shadow-[0_1px_2px_rgba(23,33,29,0.03)]">
          <div className="mb-6 border-b border-[#eef1ee] pb-4">
            <h2 className="text-sm font-semibold text-[#17211d]">Users by age</h2>
            <p className="mt-1 text-xs text-[#77827c]">User distribution across age groups</p>
          </div>
          {overview ? (
            <PieChart
              items={overview.usersByAge}
              emptyLabel="No user data available."
            />
          ) : (
            <p className="py-10 text-center text-sm text-neutral-500" role="status">Loading chart…</p>
          )}
        </article>
      </section>
    </div>
  )
}