import { type NextRequest, NextResponse } from "next/server"
import { shops, products, malls, buildings } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      shopName,
      category,
      mallId,
      buildingId,
      floor,
      unit,
      description,
      ownerName,
      ownerContact,
      products: shopProducts,
    } = body

    // Validate required fields
    if (!shopName || !category || !mallId || !buildingId || !floor || !unit || !ownerName || !ownerContact) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify mall and building exist
    const mall = malls.find((m) => m._id === mallId)
    const building = buildings.find((b) => b._id === buildingId && b.mallId === mallId)

    if (!mall || !building) {
      return NextResponse.json({ error: "Invalid mall or building selection" }, { status: 400 })
    }

    // Create new shop
    const newShop = {
      _id: `shop${Date.now()}`,
      buildingId,
      name: shopName,
      category,
      floor,
      unit,
      description,
      ownerName,
      ownerContact,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Add shop to mock database
    shops.push(newShop)

    // Add products if provided
    const addedProducts = []
    if (shopProducts && Array.isArray(shopProducts)) {
      for (const product of shopProducts) {
        const newProduct = {
          _id: `prod${Date.now()}_${Math.random()}`,
          shopId: newShop._id,
          name: product.name,
          category: product.category,
          price: Number.parseFloat(product.price),
          description: product.description || "",
          inStock: product.inStock !== false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        products.push(newProduct)
        addedProducts.push(newProduct)
      }
    }

    return NextResponse.json({
      success: true,
      shop: newShop,
      products: addedProducts,
      message: "Shop registered successfully!",
    })
  } catch (error) {
    console.error("Shop registration error:", error)
    return NextResponse.json({ error: "Failed to register shop" }, { status: 500 })
  }
}
