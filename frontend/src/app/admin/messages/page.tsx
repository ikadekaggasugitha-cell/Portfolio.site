'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'
import type { Message } from '@/types'
import toast from 'react-hot-toast'

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Message | null>(null)

  function load() {
    api.get('/messages').then((res) => setMessages(res.data.data ?? []))
  }

  useEffect(() => { load(); setLoading(false) }, [])

  async function handleDelete(id: number) {
    if (!confirm('Delete this message?')) return
    try {
      await api.delete(`/messages/${id}`)
      toast.success('Message deleted')
      if (selected?.id === id) setSelected(null)
      load()
    } catch { toast.error('Failed to delete message') }
  }

  if (loading) return <div className="text-center py-12 text-ink-muted-48">Loading...</div>

  const unread = messages.filter((m) => !m.is_read)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-ink stitch-heading">
          Messages
          {unread.length > 0 && (
            <span className="ml-2 text-[14px] font-normal text-muted">
              ({unread.length} unread)
            </span>
          )}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-stitch overflow-hidden">
          <div className="divide-y divide-hairline max-h-[600px] overflow-y-auto">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setSelected(msg)}
                className={`w-full text-left p-4 hover:bg-canvas-parchment transition-colors ${
                  selected?.id === msg.id ? 'bg-canvas-parchment' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] ${!msg.is_read ? 'text-ink' : 'text-ink-muted-48'}`}>
                    {msg.name}
                    {!msg.is_read && <span className="ml-2 w-2 h-2 bg-primary rounded-full inline-block" />}
                  </span>
                  <span className="text-[12px] leading-[1] tracking-[-0.12px] text-ink-muted-48">{msg.created_at?.split('T')[0]}</span>
                </div>
                <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-ink-muted-48 truncate mt-1">{msg.subject}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="card-stitch p-6">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[17px] font-semibold leading-[1.24] tracking-[-0.374px] text-ink stitch-heading">{selected.subject}</h3>
                  <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-muted mt-1">{selected.name} &lt;{selected.email}&gt;</p>
                  <p className="text-[12px] leading-[1] tracking-[-0.12px] text-muted mt-1">{selected.created_at}</p>
                </div>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="btn-stitch text-danger"
                >
                  Delete
                </button>
              </div>
              <div className="border-t border-hairline pt-4">
                <p className="text-[14px] leading-[1.43] tracking-[-0.224px] text-ink-muted-48 whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          ) : (
            <p className="text-ink-muted-48 text-[17px] leading-[1.47] tracking-[-0.374px] text-center py-12">Select a message to read</p>
          )}
        </div>
      </div>
    </div>
  )
}
