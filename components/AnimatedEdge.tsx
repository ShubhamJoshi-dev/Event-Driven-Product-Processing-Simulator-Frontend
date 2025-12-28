'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedEdgeProps {
  x1: number
  y1: number
  x2: number
  y2: number
  isActive?: boolean
  delay?: number
  color?: string
}

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
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  const nodeWidth = 180
  const nodeHeight = 120
  const nodeRadius = Math.max(nodeWidth, nodeHeight) / 2
  
  const startOffset = nodeRadius + 10
  const startX = x1 + Math.cos(angle) * startOffset
  const startY = y1 + Math.sin(angle) * startOffset
  
  const endOffset = nodeRadius + 20
  const endX = x2 - Math.cos(angle) * endOffset
  const endY = y2 - Math.sin(angle) * endOffset

  return (
    <g>
      <defs>
        <marker
          id={`arrowhead-${color.replace('#', '')}`}
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon
            points="0 0, 12 4, 0 8"
            fill={isActive ? color : 'rgba(100, 116, 139, 0.3)'}
            stroke={isActive ? color : 'rgba(100, 116, 139, 0.3)'}
            strokeWidth="0.5"
          />
        </marker>
      </defs>

      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={isActive ? color : 'rgba(100, 116, 139, 0.3)'}
        strokeWidth={isActive ? 3 : 1}
        strokeDasharray={isActive ? 'none' : '5,5'}
        opacity={isActive ? 1 : 0.2}
        markerEnd={`url(#arrowhead-${color.replace('#', '')})`}
      />

      {showPacket && (
        <motion.g
          initial={{ x: startX, y: startY }}
          animate={{ x: endX, y: endY }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
            delay: delay / 1000,
          }}
        >
          <motion.circle
            r={10}
            fill={color}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [1, 0.9, 1],
            }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.circle
            r={16}
            fill={color}
            opacity={0.4}
            initial={{ scale: 0 }}
            animate={{
              scale: [1, 1.6, 1],
              opacity: [0.4, 0.1, 0.4],
            }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.g>
      )}
    </g>
  )
}

