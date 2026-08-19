"use client"
import { useEffect, useState } from 'react'
import * as ProductsService from '../services/ProductsService'

export default function useProducts(initialQuery = '') {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    ProductsService.getProducts()
      .then((data) => {
        if (!mounted) return
        setProducts(data.products || [])
      })
      .catch((err) => setError(err))
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  async function search(q) {
    setLoading(true)
    try {
      const data = await ProductsService.searchProducts(q)
      setProducts(data.products || [])
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, search }
}
