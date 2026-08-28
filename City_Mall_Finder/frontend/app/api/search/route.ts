import { type NextRequest, NextResponse } from "next/server"
import { products, shops, buildings, malls } from "@/lib/mock-data"
import type { ProductSearchResult } from "@/lib/types"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")?.toLowerCase() || ""
  const category = searchParams.get("category")?.toLowerCase()
  const mallId = searchParams.get("mallId")
  const inStockOnly = searchParams.get("inStock") === "true"

  try {
    // Filter products based on search criteria
    const filteredProducts = products.filter((product) => {
      // Text search in product name and description
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)

      // Category filter
      const matchesCategory = !category || product.category.toLowerCase() === category

      // Stock filter
      const matchesStock = !inStockOnly || product.inStock

      return matchesQuery && matchesCategory && matchesStock
    })

    // Build complete search results with shop, building, and mall info
    const searchResults: ProductSearchResult[] = filteredProducts
      .map((product) => {
        const shop = shops.find((s) => s._id === product.shopId)
        if (!shop) return null

        const building = buildings.find((b) => b._id === shop.buildingId)
        if (!building) return null

        const mall = malls.find((m) => m._id === building.mallId)
        if (!mall) return null

        // Apply mall filter if specified
        if (mallId && mall._id !== mallId) return null

        return {
          ...product,
          shop,
          building,
          mall,
        }
      })
      .filter((result): result is ProductSearchResult => result !== null)

    // Sort by relevance (in stock first, then by name)
    searchResults.sort((a, b) => {
      if (a.inStock && !b.inStock) return -1
      if (!a.inStock && b.inStock) return 1
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json({
      success: true,
      count: searchResults.length,
      results: searchResults,
    })
  } catch (error) {
    console.error("[v0] Search API error:", error)
    return NextResponse.json({ success: false, error: "Failed to search products" }, { status: 500 })
  }
}
