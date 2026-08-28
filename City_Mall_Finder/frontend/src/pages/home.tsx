"use client"

import { useState } from "react"
import { SearchHero, type SearchParams } from "@/components/search-hero"
import { ProductResults } from "@/components/product-results"
import { products, shops, buildings, malls } from "@/lib/mock-data"
import type { ProductSearchResult } from "@/lib/types"

export default function HomePage() {
  const [results, setResults] = useState<ProductSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (params: SearchParams) => {
    setIsLoading(true)
    setSearchQuery(params.query)

    // Simulate API call
    setTimeout(() => {
      let filtered = products

      // Filter by search query
      if (params.query) {
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(params.query.toLowerCase()) ||
            p.description?.toLowerCase().includes(params.query.toLowerCase()),
        )
      }

      // Filter by category
      if (params.category && params.category !== "all") {
        filtered = filtered.filter((p) => p.category.toLowerCase() === params.category?.toLowerCase())
      }

      // Filter by mall
      if (params.mallId && params.mallId !== "all") {
        filtered = filtered.filter((p) => {
          const shop = shops.find((s) => s._id === p.shopId)
          const building = buildings.find((b) => b._id === shop?.buildingId)
          return building?.mallId === params.mallId
        })
      }

      // Filter by stock
      if (params.inStock) {
        filtered = filtered.filter((p) => p.inStock)
      }

      // Map to search results with full hierarchy
      const searchResults: ProductSearchResult[] = filtered.map((product) => {
        const shop = shops.find((s) => s._id === product.shopId)!
        const building = buildings.find((b) => b._id === shop.buildingId)!
        const mall = malls.find((m) => m._id === building.mallId)!

        return {
          ...product,
          shop,
          building,
          mall,
        }
      })

      setResults(searchResults)
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-black">
      <SearchHero onSearch={handleSearch} isLoading={isLoading} />
      <ProductResults results={results} isLoading={isLoading} searchQuery={searchQuery} />
    </div>
  )
}
