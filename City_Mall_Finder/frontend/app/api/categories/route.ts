import { NextResponse } from "next/server"
import { products } from "@/lib/mock-data"

export async function GET() {
  try {
    // Extract unique categories from products
    const categories = Array.from(new Set(products.map((product) => product.category))).sort()

    return NextResponse.json({
      success: true,
      count: categories.length,
      categories,
    })
  } catch (error) {
    console.error("[v0] Categories API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}
