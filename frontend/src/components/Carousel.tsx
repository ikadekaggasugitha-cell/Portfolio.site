'use client'

import { useState, useEffect, useRef } from 'react'
import type { ProjectImage } from '@/types'

interface CarouselProps {
  images: ProjectImage[]
  autoRotate?: boolean
  rotationInterval?: number
}

export default function Carousel({ images, autoRotate = true, rotationInterval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!autoRotate || images.length <= 1) return

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, rotationInterval)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [autoRotate, rotationInterval, images.length])

  // Reset interval when user interacts
  const resetInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (autoRotate && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
      }, rotationInterval)
    }
  }

  const handlePrevWithReset = () => {
    handlePrev()
    resetInterval()
  }

  const handleNextWithReset = () => {
    handleNext()
    resetInterval()
  }

  const handleDotClickWithReset = (index: number) => {
    handleDotClick(index)
    resetInterval()
  }

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-canvas-parchment rounded-[11px] flex items-center justify-center border border-hairline">
        <p className="text-ink-muted-48 text-[14px] leading-[1.43] tracking-[-0.224px]">No images available</p>
      </div>
    )
  }

  const currentImage = images[currentIndex]

  return (
    <div className="relative w-full h-full bg-canvas-parchment rounded-[11px] border border-hairline overflow-hidden group">
      {/* Image Container */}
      <div className="relative w-full h-full">
        <img
          src={currentImage.image}
          alt={currentImage.caption || 'Project image'}
          className="w-full h-full object-cover"
        />

        {/* Caption */}
        {currentImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-body-on-dark text-[12px] leading-[1] tracking-[-0.12px] px-3 py-2">
            {currentImage.caption}
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevWithReset}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-body-on-dark p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <button
              onClick={handleNextWithReset}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-body-on-dark p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute top-2 right-2 bg-black/60 text-body-on-dark text-[12px] leading-[1] tracking-[-0.12px] px-2.5 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Indicator Dots */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClickWithReset(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary w-6'
                  : 'bg-ink-muted-48 w-2 hover:bg-ink-muted-64'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
