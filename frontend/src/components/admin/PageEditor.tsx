'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import type { Page, PageBlock, Media } from '@/types'
import dynamic from 'next/dynamic'

const MediaPicker = dynamic(() => import('./MediaPicker'), { ssr: false })

interface PageEditorProps {
  id: string
}

export default function PageEditor({ id }: PageEditorProps) {
  const router = useRouter()
  const isNew = id === 'new'
  const [page, setPage] = useState<Partial<Page>>({ title: '', slug: '', content: '', is_published: false, blocks: [] })
  const [loading, setLoading] = useState(false)
  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(null)
  const [blockDraft, setBlockDraft] = useState<string>('')
  const [blockForm, setBlockForm] = useState<Record<string, unknown>>({})
  const [newBlockType, setNewBlockType] = useState<string>('text')
  const [showMediaPicker, setShowMediaPicker] = useState(false)

  useEffect(() => {
    if (!isNew) load()
  }, [id])

  async function load() {
    setLoading(true)
    try {
      const res = await api.get(`/pages/${id}`)
      setPage(res.data.data ?? res.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load page')
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    setLoading(true)
    try {
      if (isNew) {
        const res = await api.post('/pages', page)
        toast.success('Page created')
        router.push('/admin/pages')
      } else {
        await api.put(`/pages/${id}`, page)
        toast.success('Page saved')
        load()
      }
    } catch (err) {
      console.error(err)
      toast.error('Save failed')
    } finally {
      setLoading(false)
    }
  }

  async function publish() {
    try {
      await api.post(`/pages/${id}/publish`, { is_published: !page.is_published })
      toast.success('Publish state updated')
      load()
    } catch (err) {
      console.error(err)
      toast.error('Publish failed')
    }
  }

  function addBlock() {
    const blocks: PageBlock[] = page.blocks ? [...page.blocks] : []
    const newBlock: PageBlock = { type: newBlockType, data: {} }
    blocks.push(newBlock)
    setPage({ ...page, blocks })
    // automatically open editor for the new block
    setEditingBlockIndex(blocks.length - 1)
    setBlockDraft(JSON.stringify(newBlock.data || {}, null, 2))
  }

  function moveBlockUp(idx: number) {
    if (!page.blocks) return
    if (idx <= 0) return
    const blocks = [...page.blocks]
    const tmp = blocks[idx - 1]
    blocks[idx - 1] = blocks[idx]
    blocks[idx] = tmp
    setPage({ ...page, blocks })
  }

  function moveBlockDown(idx: number) {
    if (!page.blocks) return
    if (idx >= (page.blocks || []).length - 1) return
    const blocks = [...page.blocks]
    const tmp = blocks[idx + 1]
    blocks[idx + 1] = blocks[idx]
    blocks[idx] = tmp
    setPage({ ...page, blocks })
  }

  function removeBlock(idx: number) {
    if (!page.blocks) return
    const blocks = [...page.blocks]
    blocks.splice(idx, 1)
    setPage({ ...page, blocks })
    // close editor if that was the one
    if (editingBlockIndex === idx) {
      setEditingBlockIndex(null)
      setBlockDraft('')
    }
  }

  function startEditBlock(idx: number) {
    setEditingBlockIndex(idx)
    const b = (page.blocks || [])[idx]
    const initialData = b?.data || {}
    setBlockForm({ ...(initialData as Record<string, unknown>) })
    setBlockDraft(JSON.stringify(initialData || {}, null, 2))
  }

  function cancelEdit() {
    setEditingBlockIndex(null)
    setBlockDraft('')
    setBlockForm({})
  }

  function saveBlockEdit() {
    if (editingBlockIndex === null) return
    try {
      // For typed blocks, use blockForm. For unknown/raw blocks, fall back to blockDraft JSON
      const current = (page.blocks || [])[editingBlockIndex]
      let data: Record<string, unknown>

      if (current?.type === 'hero' || current?.type === 'recent-projects' || current?.type === 'text' || current?.type === 'cta') {
        data = { ...blockForm }
      } else {
        data = JSON.parse(blockDraft)
      }

      const blocks = [...(page.blocks || [])]
      blocks[editingBlockIndex] = { ...(blocks[editingBlockIndex] || {}), data }
      setPage({ ...page, blocks })
      setEditingBlockIndex(null)
      setBlockDraft('')
      setBlockForm({})
      toast.success('Block updated')
    } catch (err) {
      toast.error('Invalid JSON: ' + (err as Error).message)
    }
  }

  if (loading) return <div className="py-8 text-center">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[28px] font-semibold stitch-heading">{isNew ? 'New Page' : page.title}</h1>
        <div className="flex gap-2">
          {!isNew && <button onClick={publish} className="btn-stitch">{page.is_published ? 'Unpublish' : 'Publish'}</button>}
          <button onClick={save} className="btn-stitch btn-primary">Save</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card-stitch p-4">
          <label className="block mb-2 font-semibold">Title</label>
          <input value={page.title || ''} onChange={(e) => setPage({ ...page, title: e.target.value })} className="w-full mb-3 px-3 py-2 border rounded" />

          <label className="block mb-2 font-semibold">Slug</label>
          <input value={page.slug || ''} onChange={(e) => setPage({ ...page, slug: e.target.value })} className="w-full mb-3 px-3 py-2 border rounded" />

          <label className="block mb-2 font-semibold">Content (HTML)</label>
          <textarea value={page.content || ''} onChange={(e) => setPage({ ...page, content: e.target.value })} rows={12} className="w-full px-3 py-2 border rounded" />

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold stitch-heading">Page Blocks</h2>
              <div className="flex items-center gap-2">
                <select value={newBlockType} onChange={(e) => setNewBlockType(e.target.value)} className="px-2 py-1 stitch-input">
                  <option value="hero">Hero</option>
                  <option value="recent-projects">Recent Projects</option>
                  <option value="text">Text</option>
                  <option value="cta">CTA</option>
                </select>
                <button onClick={() => addBlock()} className="btn-stitch btn-primary">Add Block</button>
              </div>
            </div>

            <div className="space-y-2">
              {(page.blocks || []).length === 0 && <div className="text-sm text-muted">No blocks added yet.</div>}
 
              {(page.blocks || []).map((b, idx) => (
                <div key={String(b.id ?? idx)} className="p-3 card-stitch flex items-start justify-between">
                  <div>
                    <div className="font-medium text-ink stitch-heading">{b?.type}</div>
                    <div className="text-sm text-muted">{JSON.stringify(b?.data || {})}</div>
                  </div>
 
                  <div className="flex gap-2">
                    <button onClick={() => moveBlockUp(idx)} disabled={idx === 0} className="btn-stitch">↑</button>
                    <button onClick={() => moveBlockDown(idx)} disabled={idx === (page.blocks || []).length - 1} className="btn-stitch">↓</button>
                    <button onClick={() => startEditBlock(idx)} className="btn-stitch">Edit</button>
                    <button onClick={() => removeBlock(idx)} className="btn-stitch text-danger">Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {editingBlockIndex !== null && (() => {
              const current = (page.blocks || [])[editingBlockIndex!]
              const type = current?.type

              return (
                <div className="mt-4 p-3 card-stitch">
                  <h3 className="font-medium mb-2 stitch-heading">Edit Block: {type}</h3>

                  {type === 'hero' && (
                    <div>
                      <label className="block mb-1 font-semibold">Heading</label>
                      <input value={(blockForm['heading'] as string) || ''} onChange={(e) => setBlockForm({ ...blockForm, heading: e.target.value })} className="w-full px-2 py-1 border rounded mb-2" />

                      <label className="block mb-1 font-semibold">Subheading</label>
                      <input value={(blockForm['subheading'] as string) || ''} onChange={(e) => setBlockForm({ ...blockForm, subheading: e.target.value })} className="w-full px-2 py-1 border rounded mb-2" />

                      <label className="block mb-1 font-semibold">Background image</label>

                      <div className="flex gap-2 items-start mb-2">
                        <div className="flex-1">
                          <div className="mb-2">
                            <button onClick={() => setShowMediaPicker(true)} className="btn-stitch">Choose from Media</button>
                            <button onClick={() => { setBlockForm({ ...blockForm, background_url: undefined, background_media_id: undefined, background_caption: undefined, background_alt: undefined }); }} className="btn-stitch text-danger">Clear</button>
                          </div>

                          {(blockForm['background_url'] as string) ? (
                            <div className="mb-2">
                              <img src={String(blockForm['background_url'])} alt={String(blockForm['background_alt'] || 'bg')} className="w-full h-28 object-cover rounded" />
                            </div>
                          ) : (
                            <div className="mb-2 text-sm text-muted">No background selected</div>
                          )}
 
                          <label className="block mb-1 font-semibold">Image caption</label>
                          <input value={(blockForm['background_caption'] as string) || ''} onChange={(e) => setBlockForm({ ...blockForm, background_caption: e.target.value })} className="w-full px-2 py-1 stitch-input mb-2" />
 
                          <label className="block mb-1 font-semibold">Alt text</label>
                          <input value={(blockForm['background_alt'] as string) || ''} onChange={(e) => setBlockForm({ ...blockForm, background_alt: e.target.value })} className="w-full px-2 py-1 stitch-input mb-2" />
                        </div>

                        {showMediaPicker && (
                          <MediaPicker onClose={() => setShowMediaPicker(false)} onSelect={(m: Media) => {
                            setBlockForm({ ...blockForm, background_url: m.url, background_media_id: m.id, background_caption: m.caption || '', background_alt: m.alt || '' })
                            setShowMediaPicker(false)
                          }} />
                        )}
                      </div>

                      <div className="text-sm text-muted">Tip: Upload images in Media (Admin → Media) and choose one here. Caption and alt will be saved with the block.</div>
                    </div>
                  )}

                  {type === 'recent-projects' && (
                    <div>
                      <label className="block mb-1 font-semibold">Number of items</label>
                      <input type="number" value={(blockForm['count'] as number) ?? 4} onChange={(e) => setBlockForm({ ...blockForm, count: Number(e.target.value) })} className="w-full px-2 py-1 border rounded mb-2" />

                      <label className="block mb-1 font-semibold">Filter (skill/tag)</label>
                      <input value={(blockForm['filter'] as string) || ''} onChange={(e) => setBlockForm({ ...blockForm, filter: e.target.value })} className="w-full px-2 py-1 border rounded mb-2" />

                      <label className="flex items-center gap-2 mb-2">
                        <input type="checkbox" checked={!!blockForm['carousel']} onChange={(e) => setBlockForm({ ...blockForm, carousel: e.target.checked })} />
                        <span className="ml-1">Show as carousel</span>
                      </label>

                      <label className="flex items-center gap-2 mb-2">
                        <input type="checkbox" checked={!!blockForm['autoplay']} onChange={(e) => setBlockForm({ ...blockForm, autoplay: e.target.checked })} />
                        <span className="ml-1">Autoplay carousel</span>
                      </label>

                      <div className="text-sm text-muted">Leave filter empty to show all recent projects.</div>
                    </div>
                  )}

                  {type === 'text' && (
                    <div>
                      <label className="block mb-1 font-semibold">Text content (HTML)</label>
                      <textarea value={(blockForm['content'] as string) || ''} onChange={(e) => setBlockForm({ ...blockForm, content: e.target.value })} rows={6} className="w-full px-2 py-1 border rounded mb-2" />
                    </div>
                  )}

                  {type === 'cta' && (
                    <div>
                      <label className="block mb-1 font-semibold">CTA text</label>
                      <input value={(blockForm['text'] as string) || ''} onChange={(e) => setBlockForm({ ...blockForm, text: e.target.value })} className="w-full px-2 py-1 border rounded mb-2" />

                      <label className="block mb-1 font-semibold">CTA URL</label>
                      <input value={(blockForm['url'] as string) || ''} onChange={(e) => setBlockForm({ ...blockForm, url: e.target.value })} className="w-full px-2 py-1 border rounded mb-2" />
                    </div>
                  )}

                  {/* fallback: raw JSON editor for unknown types */}
                  {!(type === 'hero' || type === 'recent-projects' || type === 'text' || type === 'cta') && (
                    <>
                      <label className="block mb-1">Block JSON data</label>
                      <textarea value={blockDraft} onChange={(e) => setBlockDraft(e.target.value)} rows={8} className="w-full px-2 py-1 border rounded font-mono text-sm mb-2" />
                    </>
                  )}

                  <div className="flex gap-2 mt-2">
                    <button onClick={() => saveBlockEdit()} className="btn-stitch btn-primary">Save Block</button>
                    <button onClick={() => cancelEdit()} className="btn-stitch">Cancel</button>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

        <aside className="card-stitch p-4">
          <div className="mb-4">
            <label className="block font-semibold mb-1">SEO Title</label>
            <input value={(page.meta as Record<string, string> | undefined)?.seo_title || ''} onChange={(e) => setPage({ ...page, meta: { ...(page.meta || {}), seo_title: e.target.value } })} className="w-full px-2 py-1 border rounded" />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">SEO Description</label>
            <input value={(page.meta as Record<string, string> | undefined)?.seo_description || ''} onChange={(e) => setPage({ ...page, meta: { ...(page.meta || {}), seo_description: e.target.value } })} className="w-full px-2 py-1 border rounded" />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">Published</label>
            <input type="checkbox" checked={!!page.is_published} onChange={(e) => setPage({ ...page, is_published: e.target.checked })} />
          </div>

          {!isNew && (
            <div className="mt-4">
              <a target="_blank" rel="noreferrer" className="btn-stitch text-primary inline-block" href={`/pages/${(page as Page).slug}`}>View on site</a>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
