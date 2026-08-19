import { apiFetch } from '../lib/api'

export async function getCategories() {
  return apiFetch('/products/categories')
}

export async function getProductsByCategory(category) {
  return apiFetch(`/products/category/${encodeURIComponent(category)}`)
}

export async function addCategory(payload) {
  throw new Error('Adding categories is not supported by DummyJSON')
}

export async function editCategory(id, payload) {
  throw new Error('Editing categories is not supported by DummyJSON')
}

export async function deleteCategory(id) {
  throw new Error('Deleting categories is not supported by DummyJSON')
}
