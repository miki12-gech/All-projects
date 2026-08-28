export interface Mall {
  _id: string
  name: string
  location: string
  city: string
  description?: string
  googleMapsUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Building {
  _id: string
  mallId: string
  name: string
  floor?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface Shop {
  _id: string
  buildingId: string
  name: string
  category: string
  floor?: string
  unit?: string
  description?: string
  phoneNumber?: string
  googleMapsUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  _id: string
  shopId: string
  name: string
  category: string
  price: number
  description?: string
  inStock: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductSearchResult extends Product {
  shop: Shop
  building: Building
  mall: Mall
}
