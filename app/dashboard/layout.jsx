import Sidebar from '../../components/sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col md:h-screen md:flex-row md:overflow-hidden">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  )
}
