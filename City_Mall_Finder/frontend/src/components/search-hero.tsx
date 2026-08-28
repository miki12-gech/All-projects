"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin, Filter } from "lucide-react"
import { malls, products } from "@/lib/mock-data"

interface SearchHeroProps {
  onSearch: (params: SearchParams) => void
  isLoading?: boolean
}

export interface SearchParams {
  query: string
  category?: string
  mallId?: string
  inStock: boolean
}

export function SearchHero({ onSearch, isLoading }: SearchHeroProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string>()
  const [mallId, setMallId] = useState<string>()
  const [inStock, setInStock] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Extract unique categories from products
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category)))
    setCategories(uniqueCategories)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch({ query, category, mallId, inStock })
  }

  return (
    <div className="relative w-full bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        {/* Hero Text */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Find products across Addis Ababa malls.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 text-pretty sm:text-xl">
            Search thousands of products from Edna Mall, Ambassador Mall, Century Mall, and more. Discover what you need
            and where to find it in Addis Ababa.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-4">
            {/* Main Search Bar */}
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-14 w-full rounded-lg border border-gray-800 bg-gray-900 pl-12 pr-4 text-base text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide" : "Show"} Filters
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid gap-4 rounded-lg border border-gray-800 bg-gray-900 p-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm text-gray-400">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category || ""}
                    onChange={(e) => setCategory(e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-800 bg-black text-white rounded-lg focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mall Filter */}
                <div className="space-y-2">
                  <label htmlFor="mall" className="text-sm text-gray-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Mall Location
                  </label>
                  <select
                    id="mall"
                    value={mallId || ""}
                    onChange={(e) => setMallId(e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-800 bg-black text-white rounded-lg focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                  >
                    <option value="">All Malls</option>
                    {malls.map((mall) => (
                      <option key={mall._id} value={mall._id}>
                        {mall.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock Filter */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="rounded border-gray-700 cursor-pointer"
                  />
                  <label htmlFor="inStock" className="text-sm font-normal text-gray-400 cursor-pointer">
                    In stock only
                  </label>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
