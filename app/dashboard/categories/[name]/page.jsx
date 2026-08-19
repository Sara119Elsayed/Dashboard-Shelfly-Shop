import { getProductsByCategory } from '../../../../services/CategoriesService'

export default async function CategoryProductsPage({ params }) {
  const { name } = params
  try {
    const data = await getProductsByCategory(name)
    const products = data.products || []
    return (
      <div>
        <h1>Category: {name}</h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {products.map((p) => (
            <li key={p.id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>{p.title} — ${p.price}</li>
          ))}
        </ul>
      </div>
    )
  } catch (err) {
    return <div>Could not load category</div>
  }
}
