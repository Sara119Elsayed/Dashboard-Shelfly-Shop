'use client'
import { useEffect, useState } from 'react'
import { getCategories } from '../services/CategoriesService'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    getCategories().then((data) => {
      if (!mounted) return
      setCategories(Array.isArray(data) ? data : [])
    }).catch(setError).finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  return { categories, loading, error }
}
