// VirtualizedList.tsx
//--------------------------------------------
// High‑Performance Virtual Scroll Engine
//--------------------------------------------

"use client"

import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react"

export interface VirtualItem {
  index: number
  start: number
  size: number
}

export interface VirtualizedListProps {
  itemCount: number
  estimatedItemHeight?: number
  overscan?: number
  renderItem: (index: number) => React.ReactNode
}

/**
 * Virtualized list engine:
 * - Measures dynamic height
 * - Caches heights
 * - Renders only visible + overscan
 * - Supports thousands of items with low memory
 */
export const VirtualizedList: React.FC<VirtualizedListProps> = ({ itemCount, estimatedItemHeight = 48, overscan = 3, renderItem }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)

  // cache height per index
  const heights = useRef<{ [key: number]: number }>({})
  const totalHeightRef = useRef(itemCount * estimatedItemHeight)

  // measure viewport height
  useLayoutEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setViewportHeight(containerRef.current.clientHeight)
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  // scroll handler
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onScroll = () => setScrollTop(el.scrollTop)
    el.addEventListener("scroll", onScroll)
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  // calculate virtual range
  const startIndex = Math.max(0, Math.floor(scrollTop / estimatedItemHeight) - overscan)
  const endIndex = Math.min(itemCount - 1, Math.ceil((scrollTop + viewportHeight) / estimatedItemHeight) + overscan)

  // build virtual items
  const virtualItems: VirtualItem[] = []
  let offset = 0

  for (let i = 0; i < itemCount; i++) {
    const size = heights.current[i] || estimatedItemHeight

    if (i === 0) offset = 0
    else offset = offset + (heights.current[i - 1] || estimatedItemHeight)

    if (i >= startIndex && i <= endIndex) {
      virtualItems.push({
        index: i,
        start: offset,
        size,
      })
    }
  }

  // total height recalculation
  totalHeightRef.current = Object.values(heights.current).reduce((sum, h) => sum + h, 0) || itemCount * estimatedItemHeight

  // measure each item after render
  const measureRef = useCallback((index: number, el: HTMLElement | null) => {
    if (!el) return
    const newHeight = el.getBoundingClientRect().height
    if (heights.current[index] !== newHeight) {
      heights.current[index] = newHeight
      // trigger re-render
      requestAnimationFrame(() => {
        setScrollTop((x) => x)
      })
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        overflowY: "auto",
        height: "100%",
      }}
    >
      <div
        style={{
          height: totalHeightRef.current,
          position: "relative",
        }}
      >
        {virtualItems.map((item) => (
          <div
            key={item.index}
            ref={(el) => measureRef(item.index, el)}
            style={{
              position: "absolute",
              top: item.start,
              width: "100%",
            }}
          >
            {renderItem(item.index)}
          </div>
        ))}
      </div>
    </div>
  )
}
