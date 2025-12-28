'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'

interface ProductData {
  name: string
  price: string
  details: string
}

interface AddProductFormProps {
  onSubmit: (data: ProductData) => void
  isLoading: boolean
}

export default function AddProductForm({
  onSubmit,
  isLoading,
}: AddProductFormProps) {
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    price: '',
    details: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.price && formData.details) {
      onSubmit(formData)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-xl p-8 shadow-2xl max-w-md w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Add Product
      </h2>

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Product Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-aws-orange focus:border-transparent"
          placeholder="Enter product name"
          required
          disabled={isLoading}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="price"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-aws-orange focus:border-transparent"
          placeholder="0.00"
          step="0.01"
          min="0"
          required
          disabled={isLoading}
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="details"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Details
        </label>
        <textarea
          id="details"
          value={formData.details}
          onChange={(e) =>
            setFormData({ ...formData, details: e.target.value })
          }
          rows={4}
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-aws-orange focus:border-transparent resize-none"
          placeholder="Enter product details"
          required
          disabled={isLoading}
        />
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full bg-aws-orange hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <motion.span
              className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            Processing...
          </span>
        ) : (
          'Add Product'
        )}
      </motion.button>
    </motion.form>
  )
}

