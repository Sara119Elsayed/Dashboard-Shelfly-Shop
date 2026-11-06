import { apiFetch } from '../lib/api'

const STORAGE_KEY = 'shelfy.category-overrides.v1'

function emptyChanges() {
  return { added: [], renamed: {}, deleted: [] }
}

function readChanges() {
  if (typeof window === 'undefined') return emptyChanges()
  try {
    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      added: Array.isArray(stored.added) ? stored.added : [],
      renamed: stored.renamed && typeof stored.renamed === 'object' ? stored.renamed : {},
      deleted: Array.isArray(stored.deleted) ? stored.deleted : [],
    }
  } catch {
    return emptyChanges()
  }
}

function writeChanges(changes) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(changes))
}

function toCategory(category) {
  return typeof category === 'string'
    ? { slug: category, name: category }
    : category
}

export async function getCategories() {
  const response = await apiFetch('/products/categories')
  const categories = (Array.isArray(response) ? response : []).map(toCategory)
  const { added, renamed, deleted } = readChanges()
  const hidden = new Set(deleted)
  const merged = categories
    .filter((category) => !hidden.has(category.slug))
    .map((category) => ({ ...category, name: renamed[category.slug] || category.name }))
  const existing = new Set(merged.map((category) => category.slug))

  return [...merged, ...added.filter((category) => !existing.has(category.slug))]
}

export async function getProductsByCategory(category) {
  return apiFetch(`/products/category/${encodeURIComponent(category)}`)
}

export async function addCategory(category) {
  const changes = readChanges()
  if (changes.added.some((item) => item.slug === category.slug)) {
    throw new Error('A category with this name already exists.')
  }
  changes.added = [...changes.added, category]
  changes.deleted = changes.deleted.filter((slug) => slug !== category.slug)
  writeChanges(changes)
  return category
}

export async function editCategory(id, payload) {
  const changes = readChanges()
  const addedIndex = changes.added.findIndex((category) => category.slug === id)
  const updated = { slug: id, name: payload.name }
  if (addedIndex >= 0) {
    changes.added = changes.added.map((category, index) => index === addedIndex ? updated : category)
  } else {
    changes.renamed = { ...changes.renamed, [id]: payload.name }
  }
  writeChanges(changes)
  return updated
}

export async function deleteCategory(id) {
  const changes = readChanges()
  const isAdded = changes.added.some((category) => category.slug === id)
  changes.added = changes.added.filter((category) => category.slug !== id)
  changes.renamed = { ...changes.renamed }
  delete changes.renamed[id]
  if (!isAdded && !changes.deleted.includes(id)) changes.deleted = [...changes.deleted, id]
  writeChanges(changes)
}
