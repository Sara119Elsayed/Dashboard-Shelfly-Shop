'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FolderTree, Pencil, Plus, Trash2, X } from 'lucide-react'
import CategoryForm from '../../../components/CategoryForm'
import { addCategory, deleteCategory, editCategory, getCategories } from '../../../services/CategoriesService'

function slugify(value) {
	return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function CategoriesPage() {
	const [categories, setCategories] = useState([])
	const [loading, setLoading] = useState(true)
	const [loadError, setLoadError] = useState('')
	const [actionError, setActionError] = useState('')
	const [dialog, setDialog] = useState(null)
	const [saving, setSaving] = useState(false)
	const [reloadKey, setReloadKey] = useState(0)

	useEffect(() => {
		let active = true
		setLoading(true)
		setLoadError('')
		getCategories()
			.then((data) => { if (active) setCategories(data) })
			.catch(() => { if (active) setLoadError('Categories could not be loaded. Check your connection and try again.') })
			.finally(() => { if (active) setLoading(false) })
		return () => { active = false }
	}, [reloadKey])

	async function saveCategory(payload) {
		const categoryName = payload.name.trim()
		const slug = dialog.category?.slug || slugify(categoryName) || `category-${Date.now()}`
		const duplicate = categories.some((category) => (
			category.slug !== dialog.category?.slug && (
				category.slug === slug || category.name.trim().toLowerCase() === categoryName.toLowerCase()
			)
		))
		if (duplicate) {
			setActionError('A category with this name already exists.')
			return
		}

		setSaving(true)
		setActionError('')
		try {
			const saved = dialog.category
				? await editCategory(dialog.category.slug, { name: categoryName })
				: await addCategory({ slug, name: categoryName })
			setCategories((current) => dialog.category
				? current.map((category) => category.slug === saved.slug ? saved : category)
				: [...current, saved])
			setDialog(null)
		} catch (error) {
			setActionError(error instanceof Error ? error.message : 'Could not save category.')
		} finally {
			setSaving(false)
		}
	}

	async function removeCategory(category) {
		if (!window.confirm(`Remove category "${category.name}" from this browser? Products will not be deleted.`)) return
		setActionError('')
		try {
			await deleteCategory(category.slug)
			setCategories((current) => current.filter((item) => item.slug !== category.slug))
		} catch (error) {
			setActionError(error instanceof Error ? error.message : 'Could not remove category.')
		}
	}

	return (
		<div className="mx-auto w-full max-w-7xl space-y-5 pb-8">
			<header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#dfe6e0] pb-5">
				<div>
					<p className="text-xs font-semibold uppercase tracking-wider text-[#368064]">Catalog</p>
					<h1 className="mt-1 text-2xl font-semibold text-[#17211d]">Categories</h1>
					<p className="mt-1 text-sm text-[#77827c]">Browse and organize products by category.</p>
				</div>
				<button className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#176b52] px-3.5 text-sm font-medium text-white transition-colors hover:bg-[#12583f]" onClick={() => { setActionError(''); setDialog({ category: null }) }} type="button">
					<Plus size={16} aria-hidden="true" /> Add category
				</button>
			</header>

			{actionError ? <p className="text-sm text-rose-700" role="alert">{actionError}</p> : null}
			{loadError ? (
				<div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800" role="alert">
					<span>{loadError}</span>
					<button className="font-medium underline underline-offset-2" onClick={() => setReloadKey((key) => key + 1)} type="button">Retry</button>
				</div>
			) : (
				<section className="overflow-hidden rounded-md border border-[#e2e8e3] bg-white shadow-[0_1px_2px_rgba(23,33,29,0.03)]" aria-label="Product categories">
					<div className="flex items-center justify-between border-b border-[#e8ede8] px-4 py-3.5 sm:px-5">
						<h2 className="text-sm font-semibold text-[#17211d]">All categories</h2>
						<span className="text-xs tabular-nums text-[#77827c]">{categories.length.toLocaleString()} total</span>
					</div>
					{loading ? <p className="px-5 py-10 text-center text-sm text-[#77827c]" role="status">Loading categories…</p> : categories.length ? (
						<ul>
							{categories.map((category) => (
								<li key={category.slug} className="flex min-h-16 items-center justify-between gap-3 border-b border-[#eef1ee] px-4 py-2.5 last:border-b-0 sm:px-5">
									<Link className="flex min-w-0 flex-1 items-center gap-3 text-sm font-medium text-[#26342d] hover:text-[#176b52]" href={`/dashboard/categories/${encodeURIComponent(category.slug)}`}>
										<span className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-[#edf4ef] text-[#368064]"><FolderTree size={17} aria-hidden="true" /></span>
										<span className="truncate">{category.name}</span>
									</Link>
									<div className="flex flex-none items-center gap-1">
										<button aria-label={`Edit ${category.name}`} className="flex h-8 w-8 items-center justify-center rounded-md text-[#68766e] hover:bg-[#eaf3ee] hover:text-[#176b52]" onClick={() => { setActionError(''); setDialog({ category }) }} title="Edit category" type="button">
											<Pencil size={15} aria-hidden="true" />
										</button>
										<button aria-label={`Delete ${category.name}`} className="flex h-8 w-8 items-center justify-center rounded-md text-[#a23d3d] hover:bg-[#fff5f4]" onClick={() => removeCategory(category)} title="Delete category" type="button">
											<Trash2 size={15} aria-hidden="true" />
										</button>
									</div>
								</li>
							))}
						</ul>
					) : <p className="px-5 py-10 text-center text-sm text-[#77827c]">No categories yet.</p>}
				</section>
			)}

			{dialog ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17211d]/35 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null) }}>
					<section aria-labelledby="category-form-title" aria-modal="true" className="w-full max-w-md rounded-md border border-[#e2e8e3] bg-white p-5 shadow-xl sm:p-6" role="dialog">
						<div className="mb-5 flex items-start justify-between gap-4">
							<div>
								<h2 className="text-lg font-semibold text-[#17211d]" id="category-form-title">{dialog.category ? 'Edit category' : 'Add category'}</h2>
								<p className="mt-1 text-sm text-[#77827c]">Category records are managed locally in this demo.</p>
							</div>
							<button aria-label="Close dialog" className="flex h-8 w-8 items-center justify-center rounded-md text-[#77827c] hover:bg-[#f3f6f3]" onClick={() => setDialog(null)} type="button">
								<X size={17} aria-hidden="true" />
							</button>
						</div>
						<CategoryForm key={dialog.category?.slug || 'new-category'} initial={dialog.category || {}} onSubmit={saveCategory} onCancel={() => setDialog(null)} submitLabel={dialog.category ? 'Save changes' : 'Create category'} isSaving={saving} error={actionError} />
					</section>
				</div>
			) : null}
		</div>
	)
}
