"use client"

import { MapPin, Building2, Store, Package, CheckCircle2, XCircle, Phone, Navigation } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ProductSearchResult } from "@/lib/types"

interface ProductResultsProps {
  results: ProductSearchResult[]
  isLoading?: boolean
  searchQuery?: string
}

export function ProductResults({ results, isLoading, searchQuery }: ProductResultsProps) {
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse border-gray-800 bg-gray-900">
              <CardHeader>
                <div className="h-6 w-3/4 rounded bg-gray-800" />
                <div className="h-4 w-1/2 rounded bg-gray-800" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-gray-800" />
                  <div className="h-4 w-5/6 rounded bg-gray-800" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (results.length === 0 && searchQuery) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Package className="mx-auto mb-4 h-16 w-16 text-gray-600" />
        <h3 className="mb-2 text-2xl font-semibold text-white">No products found</h3>
        <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
      </div>
    )
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div className="bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">
            {results.length} {results.length === 1 ? "Product" : "Products"} Found
          </h2>
          {searchQuery && (
            <p className="mt-2 text-gray-400">
              Showing results for <span className="text-white">"{searchQuery}"</span>
            </p>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <Card
              key={result._id}
              className="group border-gray-800 bg-gray-900 transition-all hover:border-gray-700 hover:bg-gray-800"
            >
              <CardHeader>
                <div className="mb-2 flex items-start justify-between">
                  <CardTitle className="text-xl text-white group-hover:text-gray-100">{result.name}</CardTitle>
                  {result.inStock ? (
                    <Badge className="bg-green-900/50 text-green-400 hover:bg-green-900/70">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      In Stock
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-800 text-gray-400">
                      <XCircle className="mr-1 h-3 w-3" />
                      Out of Stock
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-gray-400">
                  {result.description || "No description available"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price */}
                <div className="text-2xl font-bold text-white">{result.price.toLocaleString()} ETB</div>

                {/* Location Hierarchy */}
                <div className="space-y-2 rounded-lg border border-gray-800 bg-black p-4">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                    <div>
                      <div className="font-medium text-white">{result.mall.name}</div>
                      <div className="text-gray-500">{result.mall.location}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <Building2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                    <div>
                      <div className="text-gray-400">{result.building.name}</div>
                      {result.building.floor && <div className="text-gray-600">{result.building.floor}</div>}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <Store className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                    <div>
                      <div className="text-gray-400">{result.shop.name}</div>
                      {result.shop.unit && <div className="text-gray-600">Unit {result.shop.unit}</div>}
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-2">
                  {result.shop.phoneNumber && (
                    <Button
                      variant="outline"
                      className="w-full border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                      asChild
                    >
                      <a href={`tel:${result.shop.phoneNumber}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        {result.shop.phoneNumber}
                      </a>
                    </Button>
                  )}
                  {result.shop.googleMapsUrl && (
                    <Button
                      variant="outline"
                      className="w-full border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                      asChild
                    >
                      <a href={result.shop.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <Navigation className="mr-2 h-4 w-4" />
                        View on Google Maps
                      </a>
                    </Button>
                  )}
                </div>

                {/* Category Badge */}
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-gray-700 text-gray-400">
                    {result.category}
                  </Badge>
                  <Badge variant="outline" className="border-gray-700 text-gray-400">
                    {result.shop.category}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
