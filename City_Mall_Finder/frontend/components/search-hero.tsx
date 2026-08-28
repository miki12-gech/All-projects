"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

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
  const [malls, setMalls] = useState<Array<{ _id: string; name: string }>>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    // Fetch categories and malls for filters
    Promise.all([fetch("/api/categories"), fetch("/api/malls")])
      .then(([catRes, mallRes]) => Promise.all([catRes.json(), mallRes.json()]))
      .then(([catData, mallData]) => {
        if (catData.success) setCategories(catData.categories)
        if (mallData.success) setMalls(mallData.malls)
      })
      .catch((error) => console.error("[v0] Failed to load filters:", error))
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
              <Input
                type="text"
                placeholder="Search for products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-14 w-full rounded-lg border-gray-800 bg-gray-900 pl-12 pr-4 text-base text-white placeholder:text-gray-500 focus:border-gray-700 focus:ring-gray-700"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-400 hover:text-white"
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
              <Button type="submit" size="lg" disabled={isLoading} className="bg-white text-black hover:bg-gray-200">
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid gap-4 rounded-lg border border-gray-800 bg-gray-900 p-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Category Filter */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm text-gray-400">
                    Category
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className="border-gray-800 bg-black text-white">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-800 bg-black text-white">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mall Filter */}
                <div className="space-y-2">
                  <Label htmlFor="mall" className="text-sm text-gray-400">
                    <MapPin className="mr-1 inline h-3 w-3" />
                    Mall Location
                  </Label>
                  <Select value={mallId} onValueChange={setMallId}>
                    <SelectTrigger id="mall" className="border-gray-800 bg-black text-white">
                      <SelectValue placeholder="All Malls" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-800 bg-black text-white">
                      <SelectItem value="all">All Malls</SelectItem>
                      {malls.map((mall) => (
                        <SelectItem key={mall._id} value={mall._id}>
                          {mall.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Stock Filter */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={inStock}
                    onCheckedChange={(checked) => setInStock(checked as boolean)}
                    className="border-gray-700 data-[state=checked]:bg-white data-[state=checked]:text-black"
                  />
                  <Label htmlFor="inStock" className="cursor-pointer text-sm font-normal text-gray-400">
                    In stock only
                  </Label>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
