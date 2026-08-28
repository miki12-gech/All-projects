import { MapPin, Building2, Store, Package, CheckCircle2, XCircle, Phone, Navigation } from "lucide-react"
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
            <div key={i} className="animate-pulse border border-gray-800 bg-gray-900 rounded-lg p-6">
              <div className="h-6 w-3/4 rounded bg-gray-800 mb-2" />
              <div className="h-4 w-1/2 rounded bg-gray-800" />
            </div>
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
            <div
              key={result._id}
              className="group border border-gray-800 bg-gray-900 rounded-lg p-6 transition-all hover:border-gray-700 hover:bg-gray-800"
            >
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-xl font-semibold text-white group-hover:text-gray-100">{result.name}</h3>
                {result.inStock ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs">
                    <CheckCircle2 className="h-3 w-3" />
                    In Stock
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                    <XCircle className="h-3 w-3" />
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4">{result.description || "No description available"}</p>

              {/* Price */}
              <div className="text-2xl font-bold text-white mb-4">{result.price.toLocaleString()} ETB</div>

              {/* Location Hierarchy */}
              <div className="space-y-2 rounded-lg border border-gray-800 bg-black p-4 mb-4">
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

              {/* Contact Information */}
              <div className="space-y-2">
                {result.shop.phoneNumber && (
                  <a
                    href={`tel:${result.shop.phoneNumber}`}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors text-sm w-full text-center justify-center"
                  >
                    <Phone className="h-4 w-4" />
                    {result.shop.phoneNumber}
                  </a>
                )}
                {result.shop.googleMapsUrl && (
                  <a
                    href={result.shop.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors text-sm w-full text-center justify-center"
                  >
                    <Navigation className="h-4 w-4" />
                    View on Google Maps
                  </a>
                )}
              </div>

              {/* Categories */}
              <div className="flex items-center gap-2 mt-4">
                <span className="px-2 py-1 border border-gray-700 text-gray-400 rounded text-xs">
                  {result.category}
                </span>
                <span className="px-2 py-1 border border-gray-700 text-gray-400 rounded text-xs">
                  {result.shop.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
