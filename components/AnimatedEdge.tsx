'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { AnimatedEdgeProps } from '@/types'

export default function AnimatedEdge({
  x1,
  y1,
  x2,
  y2,
  isActive = false,
  delay = 0,
  color = '#FF9900',
}: AnimatedEdgeProps) {
  const [showPacket, setShowPacket] = useState(false)

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowPacket(true), delay)
      return () => clearTimeout(timer)
    } else {
      setShowPacket(false)
    }
  }, [isActive, delay])

  const dx = x2 - x1
  const dy = y2 - y1
  const angle = Math.atan2(dy, dx)
  
  const nodeWidth = 180
  const nodeHeight = 120
  const nodeHalfWidth = nodeWidth / 2
  const nodeHalfHeight = nodeHeight / 2
  
  let startX, startY, endX, endY
  
  if (Math.abs(dx) < 1) {
    const centerX = (x1 + x2) / 2
    startX = centerX
    startY = y1 + nodeHalfHeight + 10
    endX = centerX
    endY = y2 - nodeHalfHeight - 20
  } else if (Math.abs(dy) < 1) {
    const centerY = (y1 + y2) / 2
    if (dx > 0) {
      startX = x1 + nodeHalfWidth + 10
      startY = centerY
      endX = x2 - nodeHalfWidth - 20
      endY = centerY
    } else {
      startX = x1 - nodeHalfWidth - 10
      startY = centerY
      endX = x2 + nodeHalfWidth + 20
      endY = centerY
    }
  } else {
    const nodeRadius = Math.max(nodeHalfWidth, nodeHalfHeight)
    const startOffset = nodeRadius + 10
    const endOffset = nodeRadius + 20
    startX = x1 + Math.cos(angle) * startOffset
    startY = y1 + Math.sin(angle) * startOffset
    endX = x2 - Math.cos(angle) * endOffset
    endY = y2 - Math.sin(angle) * endOffset
  }

  return <g></g>
}

