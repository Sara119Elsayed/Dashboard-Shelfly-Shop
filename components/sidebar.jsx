'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FolderTree,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/categories', label: 'Categories', icon: FolderTree },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-full flex-none flex-col border-b border-[#e2e8e3] bg-white md:h-screen md:w-60 md:border-b-0 md:border-r">
      <div className="flex h-14 flex-none items-center gap-3 px-4 md:h-16 md:border-b md:border-[#e2e8e3] md:px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#176b52] text-sm font-semibold text-white">
          S
        </div>
        <div className="min-w-0">
          <span className="block text-sm font-semibold text-[#17211d]">Shelfy</span>
        </div>
      </div>

      <nav aria-label="Main navigation" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:gap-1 md:overflow-visible md:px-3 md:py-5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === href
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-10 flex-none items-center gap-2.5 rounded-md px-3 text-sm font-medium transition-colors md:w-full ${
                isActive
                  ? 'bg-[#eaf3ee] text-[#176b52]'
                  : 'text-[#56635c] hover:bg-[#f3f6f3] hover:text-[#17211d]'
              }`}
            >
              <Icon size={17} strokeWidth={1.9} aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="hidden border-t border-[#e2e8e3] p-4 md:block">
        <div className="flex items-center gap-2.5 rounded-md bg-[#f6f8f6] px-3 py-2.5">
          <span className="h-2 w-2 rounded-full bg-[#2c9b69]" aria-hidden="true" />
        </div>
      </div>
    </aside>
  )
}