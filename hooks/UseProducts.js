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
    setError(null)
    try {
      const data = await ProductsService.searchProducts(q)
      setProducts(data.products || [])
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  async function createProduct(payload) {
    setError(null)
    const response = await ProductsService.addProduct(payload)
    const product = {
      ...payload,
      ...response,
      clientKey: `${response.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }
    setProducts((current) => [product, ...current])
    return product
  }

  async function updateProduct(product, payload) {
    setError(null)
    const response = product.clientKey
      ? {}
      : await ProductsService.editProduct(product.id, payload)
    const updatedProduct = { ...product, ...payload, ...response, clientKey: product.clientKey }
    setProducts((current) => current.map((item) => {
      const isTarget = product.clientKey
        ? item.clientKey === product.clientKey
        : item.id === product.id
      return isTarget ? updatedProduct : item
    }))
    return updatedProduct
  }

  function removeProductFromList(product) {
    setProducts((current) => current.filter((item) => (
      product.clientKey ? item.clientKey !== product.clientKey : item.id !== product.id
    )))
  }

  return { products, loading, error, search, createProduct, updateProduct, removeProductFromList }
}
