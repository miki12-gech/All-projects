import { NextResponse } from "next/server"
import { malls, buildings, shops, products } from "@/lib/mock-data"

export async function GET() {
  try {
    const stats = {
      totalMalls: malls.length,
      totalBuildings: buildings.length,
      totalShops: shops.length,
      totalProducts: products.length,
      inStockProducts: products.filter((p) => p.inStock).length,
      categories: Array.from(new Set(products.map((product) => product.category))).length,
    }

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("[v0] Stats API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 })
  }
}
