'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface AwsNodeProps {
  id: string
  label: string
  iconSrc: string
  iconAlt: string
  x: number
  y: number
  isActive?: boolean
  status?: string
  glowColor?: string
}

export default function AwsNode({
  id,
  label,
  iconSrc,
  iconAlt,
  x,
  y,
  isActive = false,
  status,
  glowColor = 'rgba(255, 153, 0, 0.5)',
}: AwsNodeProps) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`
          relative bg-slate-800 border-2 rounded-lg p-4 min-w-[180px]
          shadow-lg backdrop-blur-sm
          ${isActive ? 'border-aws-orange' : 'border-slate-600'}
        `}
        animate={{
          boxShadow: isActive
            ? `0 0 20px 5px ${glowColor}`
            : '0 4px 6px rgba(0, 0, 0, 0.3)',
        }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
        }}
      >
        <div className="flex items-center justify-center mb-2">
          <Image
            src={iconSrc}
            alt={iconAlt}
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        <div className="text-center text-sm font-semibold text-white mb-1">
          {label}
        </div>

        {status && (
          <motion.div
            className="text-center text-xs text-green-400 mt-1 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {status}
          </motion.div>
        )}

      </motion.div>
    </motion.div>
  )
}

