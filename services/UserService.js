import { apiFetch } from '../lib/api'

export async function getUsers(limit = 30, skip = 0) {
  return apiFetch(`/users?limit=${limit}&skip=${skip}`)
}

export async function getUser(id) {
  return apiFetch(`/users/${id}`)
}

export async function addUser(payload) {
  return apiFetch('/users/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function editUser(id, payload) {
  return apiFetch(`/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function deleteUser(id) {
  return apiFetch(`/users/${id}`, { method: 'DELETE' })
}
