export interface ProductFormData {
  name: string
  price: string
  details: string
}

export interface ProductResponseData {
  product_id: string
  product_name: string
  product_price: number
  product_description: string | number
  created_at: string
}

