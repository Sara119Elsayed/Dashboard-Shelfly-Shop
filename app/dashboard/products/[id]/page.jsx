import { getProduct } from '../../../../services/ProductsService'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const DeleteProduct = dynamic(() => import('../../../../components/DeleteProduct'), { ssr: false })

export default async function ProductPage({ params }) {
  const { id } = params
  try {
    const product = await getProduct(id)
    return (
      <div>
        <h1>{product.title}</h1>
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Brand:</strong> {product.brand}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p>{product.description}</p>
        <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <Link href={`/dashboard/products/${id}/edit`}><button>Edit</button></Link>
          <DeleteProduct id={id} />
        </div>
      </div>
    )
  } catch (err) {
    return <p>Product not found</p>
  }
}
