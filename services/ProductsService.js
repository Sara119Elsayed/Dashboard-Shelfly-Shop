import { apiFetch } from '../lib/api'

export async function getProducts(limit = 30, skip = 0) {
  return apiFetch(`/products?limit=${limit}&skip=${skip}`)
}

export async function getProduct(id) {
  return apiFetch(`/products/${id}`)
}

export async function searchProducts(q) {
  return apiFetch(`/products/search?q=${encodeURIComponent(q)}`)
}

export async function getCategories() {
  return apiFetch('/products/categories')
}

export async function getProductsByCategory(category) {
  return apiFetch(`/products/category/${encodeURIComponent(category)}`)
}

export async function addProduct(payload) {
  return apiFetch('/products/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function editProduct(id, payload) {
  return apiFetch(`/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function deleteProduct(id) {
  return apiFetch(`/products/${id}`, {
    method: 'DELETE',
  })
}
