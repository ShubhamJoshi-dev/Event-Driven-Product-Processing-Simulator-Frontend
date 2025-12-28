import { ProductFormData } from './product.types'

export interface AddProductFormProps {
  onSubmit: (data: ProductFormData) => void
  isLoading: boolean
}

export interface AwsNodeProps {
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

export interface AnimatedEdgeProps {
  x1: number
  y1: number
  x2: number
  y2: number
  isActive?: boolean
  delay?: number
  color?: string
}

