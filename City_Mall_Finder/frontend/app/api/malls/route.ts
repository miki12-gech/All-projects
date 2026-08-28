import { NextResponse } from "next/server"
import { malls } from "@/lib/mock-data"

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      count: malls.length,
      malls,
    })
  } catch (error) {
    console.error("[v0] Malls API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch malls" }, { status: 500 })
  }
}
