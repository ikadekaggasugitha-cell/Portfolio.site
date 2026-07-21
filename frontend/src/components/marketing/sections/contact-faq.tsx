'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { faqs } from '@/lib/marketing/content'

/** Accordion FAQ. Single-open, smooth height animation, keyboard accessible. */
export function ContactFaq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="mx-auto max-w-[760px]">
      {faqs.map((faq, i) => (
        <FaqItem
          key={faq.q}
          question={faq.q}
          answer={faq.a}
          open={open === i}
          onToggle={() => setOpen(open === i ? null : i)}
        />
      ))}
    </div>
  )
}

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string
  answer: string
  open: boolean
  onToggle: () => void
}) {
  const reduce = useReducedMotion()
  return (
    <div className="mb-3 overflow-hidden rounded-mk-sm border border-mk-hairline bg-mk-surface shadow-mk-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-[1rem] font-semibold"
      >
        {question}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduce ? 0 : 0.3 }} className="flex-none">
          <ChevronDown className="size-5 text-mk-accent" aria-hidden />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.32, ease: [0.22, 0.61, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-[0.96rem] text-mk-muted">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
