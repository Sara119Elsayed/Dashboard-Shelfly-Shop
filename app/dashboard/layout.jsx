import Sidebar from '../../components/sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
