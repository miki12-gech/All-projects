"use client"

import { useEffect, useState } from "react"
import { Building2, Store, Package, MapPin } from "lucide-react"

interface Stats {
  totalMalls: number
  totalShops: number
  totalProducts: number
  inStockProducts: number
}

export function StatsBar() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.stats)
      })
      .catch((error) => console.error("[v0] Failed to load stats:", error))
  }, [])

  if (!stats) return null

  const statItems = [
    { icon: MapPin, label: "Malls", value: stats.totalMalls },
    { icon: Building2, label: "Buildings", value: stats.totalShops },
    { icon: Store, label: "Shops", value: stats.totalShops },
    { icon: Package, label: "Products", value: stats.totalProducts },
  ]

  return (
    <div className="border-b border-gray-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {statItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="rounded-lg bg-gray-900 p-2">
                <item.icon className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{item.value}</div>
                <div className="text-sm text-gray-500">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
