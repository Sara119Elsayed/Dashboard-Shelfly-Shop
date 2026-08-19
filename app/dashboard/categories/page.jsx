import Link from 'next/link'
import { getCategories } from '../../../services/CategoriesService'

export default async function CategoriesPage() {
	const categories = await getCategories()
	return (
		<div>
			<h1>Categories</h1>
			<ul style={{ listStyle: 'none', padding: 0 }}>
				{categories.map((c) => (
					<li key={c} style={{ padding: 8, borderBottom: '1px solid #eee' }}>
						<Link href={`/dashboard/categories/${encodeURIComponent(c)}`}>{c}</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
