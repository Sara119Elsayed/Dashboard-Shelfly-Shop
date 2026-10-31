'use client'

import { useEffect, useState } from 'react'
import { FolderTree, Package, Users } from 'lucide-react'
import { getCategories } from '../../services/CategoriesService'
import { getProducts } from '../../services/ProductsService'
import { getUsers } from '../../services/UserService'

const AGE_GROUPS = [
  { label: 'Under 25', min: 0, max: 24, color: 'bg-emerald-500' },
  { label: '25–34', min: 25, max: 34, color: 'bg-sky-500' },
  { label: '35–44', min: 35, max: 44, color: 'bg-amber-500' },
  { label: '45+', min: 45, max: Infinity, color: 'bg-rose-500' },
]

function Metric({ label, value, icon: Icon, tone }) {
  return (
    <article className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-5">
      <div>
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        <p className="mt-2 text-3xl font-semibold tabular-nums text-neutral-950">
          {value === null ? '—' : value.toLocaleString()}
        </p>
      </div>
      <span className={`flex h-11 w-11 items-center justify-center rounded-md ${tone}`}>
        <Icon size={20} aria-hidden="true" />
      </span>
    </article>
  )
}

function BarChart({ items, color = 'bg-emerald-600', emptyLabel }) {
  const max = Math.max(...items.map((item) => item.value), 0)

  if (!items.length || max === 0) {
    return <p className="py-10 text-center text-sm text-neutral-500">{emptyLabel}</p>
  }

  return (
    <div className="space-y-4" role="img" aria-label={items.map(({ label, value }) => `${label}: ${value}`).join(', ')}>
      {items.map(({ label, value }) => (
        <div key={label}>
          <div className="mb-1.5 flex items-center justify-between gap-4 text-sm">
            <span className="truncate text-neutral-700">{label}</span>
            <span className="shrink-0 font-medium tabular-nums text-neutral-950">{value.toLocaleString()}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-sm bg-neutral-100">
            <div
              className={`h-full rounded-sm ${color}`}
              style={{ width: `${Math.max((value / max) * 100, 2)}%` }}
            />
          </div>
        </div>
      ))}
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
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-8">
      <header>
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Shelfy dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-neutral-950">Overview</h1>
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Store statistics">
        <Metric label="Products" value={overview?.productCount ?? null} icon={Package} tone="bg-emerald-50 text-emerald-700" />
        <Metric label="Categories" value={overview?.categoryCount ?? null} icon={FolderTree} tone="bg-amber-50 text-amber-700" />
        <Metric label="Users" value={overview?.userCount ?? null} icon={Users} tone="bg-sky-50 text-sky-700" />
      </section>

      <section className="grid gap-5 xl:grid-cols-2" aria-label="Store charts">
        <article className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-neutral-950">Products by category</h2>
            <p className="mt-1 text-sm text-neutral-500">Top categories by product count</p>
          </div>
          {overview ? (
            <BarChart items={overview.productsByCategory} emptyLabel="No product data available." />
          ) : (
            <p className="py-10 text-center text-sm text-neutral-500" role="status">Loading chart…</p>
          )}
        </article>

        <article className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-neutral-950">Users by age</h2>
            <p className="mt-1 text-sm text-neutral-500">User distribution across age groups</p>
          </div>
          {overview ? (
            <BarChart
              items={overview.usersByAge}
              color="bg-sky-600"
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