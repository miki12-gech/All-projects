"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MapPin, Store, Package, TrendingUp, CheckCircle2, XCircle } from "lucide-react"
import { malls, buildings, shops, products } from "@/lib/mock-data"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMalls: malls.length,
    totalBuildings: buildings.length,
    totalShops: shops.length,
    totalProducts: products.length,
    inStockProducts: products.filter((p) => p.inStock).length,
    outOfStockProducts: products.filter((p) => !p.inStock).length,
  })

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-gray-400">Manage malls, buildings, shops, and products</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Malls</CardTitle>
              <MapPin className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalMalls}</div>
              <p className="mt-1 text-xs text-gray-500">Across all locations</p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Shops</CardTitle>
              <Store className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalShops}</div>
              <p className="mt-1 text-xs text-gray-500">Active retail locations</p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Total Products</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalProducts}</div>
              <p className="mt-1 text-xs text-gray-500">In catalog</p>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">In Stock</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.inStockProducts}</div>
              <p className="mt-1 text-xs text-gray-500">
                {Math.round((stats.inStockProducts / stats.totalProducts) * 100)}% availability
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Tables */}
        <Tabs defaultValue="malls" className="space-y-6">
          <TabsList className="border-gray-800 bg-gray-900">
            <TabsTrigger value="malls" className="data-[state=active]:bg-black data-[state=active]:text-white">
              Malls
            </TabsTrigger>
            <TabsTrigger value="buildings" className="data-[state=active]:bg-black data-[state=active]:text-white">
              Buildings
            </TabsTrigger>
            <TabsTrigger value="shops" className="data-[state=active]:bg-black data-[state=active]:text-white">
              Shops
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-black data-[state=active]:text-white">
              Products
            </TabsTrigger>
          </TabsList>

          {/* Malls Table */}
          <TabsContent value="malls">
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Malls</CardTitle>
                <CardDescription className="text-gray-400">Manage shopping mall locations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-gray-800">
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">Location</TableHead>
                      <TableHead className="text-gray-400">City</TableHead>
                      <TableHead className="text-gray-400">Buildings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {malls.map((mall) => (
                      <TableRow key={mall._id} className="border-gray-800 hover:bg-gray-800">
                        <TableCell className="font-medium text-white">{mall.name}</TableCell>
                        <TableCell className="text-gray-400">{mall.location}</TableCell>
                        <TableCell className="text-gray-400">{mall.city}</TableCell>
                        <TableCell className="text-gray-400">
                          {buildings.filter((b) => b.mallId === mall._id).length}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buildings Table */}
          <TabsContent value="buildings">
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Buildings</CardTitle>
                <CardDescription className="text-gray-400">Manage mall buildings and wings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-gray-800">
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">Mall</TableHead>
                      <TableHead className="text-gray-400">Floors</TableHead>
                      <TableHead className="text-gray-400">Shops</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buildings.map((building) => {
                      const mall = malls.find((m) => m._id === building.mallId)
                      return (
                        <TableRow key={building._id} className="border-gray-800 hover:bg-gray-800">
                          <TableCell className="font-medium text-white">{building.name}</TableCell>
                          <TableCell className="text-gray-400">{mall?.name}</TableCell>
                          <TableCell className="text-gray-400">{building.floor || "N/A"}</TableCell>
                          <TableCell className="text-gray-400">
                            {shops.filter((s) => s.buildingId === building._id).length}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shops Table */}
          <TabsContent value="shops">
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Shops</CardTitle>
                <CardDescription className="text-gray-400">Manage retail shops and stores</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-gray-800">
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">Category</TableHead>
                      <TableHead className="text-gray-400">Building</TableHead>
                      <TableHead className="text-gray-400">Unit</TableHead>
                      <TableHead className="text-gray-400">Products</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shops.map((shop) => {
                      const building = buildings.find((b) => b._id === shop.buildingId)
                      return (
                        <TableRow key={shop._id} className="border-gray-800 hover:bg-gray-800">
                          <TableCell className="font-medium text-white">{shop.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-gray-700 text-gray-400">
                              {shop.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-400">{building?.name}</TableCell>
                          <TableCell className="text-gray-400">{shop.unit || "N/A"}</TableCell>
                          <TableCell className="text-gray-400">
                            {products.filter((p) => p.shopId === shop._id).length}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Table */}
          <TabsContent value="products">
            <Card className="border-gray-800 bg-gray-900">
              <CardHeader>
                <CardTitle className="text-white">Products</CardTitle>
                <CardDescription className="text-gray-400">Manage product inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-gray-800">
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">Category</TableHead>
                      <TableHead className="text-gray-400">Shop</TableHead>
                      <TableHead className="text-gray-400">Price</TableHead>
                      <TableHead className="text-gray-400">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const shop = shops.find((s) => s._id === product.shopId)
                      return (
                        <TableRow key={product._id} className="border-gray-800 hover:bg-gray-800">
                          <TableCell className="font-medium text-white">{product.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-gray-700 text-gray-400">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-400">{shop?.name}</TableCell>
                          <TableCell className="text-gray-400">${product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            {product.inStock ? (
                              <Badge className="bg-green-900/50 text-green-400">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                In Stock
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-gray-800 text-gray-400">
                                <XCircle className="mr-1 h-3 w-3" />
                                Out
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
