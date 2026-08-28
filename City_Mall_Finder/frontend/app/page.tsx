"use client"

import { useState } from "react"
import { SearchHero, type SearchParams } from "@/components/search-hero"
import { ProductResults } from "@/components/product-results"
import { StatsBar } from "@/components/stats-bar"
import type { ProductSearchResult } from "@/lib/types"

export default function HomePage() {
  const [results, setResults] = useState<ProductSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true)
    setSearchQuery(params.query)

    try {
      const searchParams = new URLSearchParams()
      if (params.query) searchParams.set("q", params.query)
      if (params.category && params.category !== "all") searchParams.set("category", params.category)
      if (params.mallId && params.mallId !== "all") searchParams.set("mallId", params.mallId)
      if (params.inStock) searchParams.set("inStock", "true")

      const response = await fetch(`/api/search?${searchParams.toString()}`)
      const data = await response.json()

      if (data.success) {
        setResults(data.results)
      } else {
        console.error("[v0] Search failed:", data.error)
        setResults([])
      }
    } catch (error) {
      console.error("[v0] Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <SearchHero onSearch={handleSearch} isLoading={isLoading} />
      <StatsBar />
      <ProductResults results={results} isLoading={isLoading} searchQuery={searchQuery} />
    </div>
  )
}
