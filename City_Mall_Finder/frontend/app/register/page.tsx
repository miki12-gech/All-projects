"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Store, Package } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Mall {
  _id: string
  name: string
  location: string
}

interface Building {
  _id: string
  mallId: string
  name: string
  floor: string
}

interface Product {
  name: string
  category: string
  price: string
  description: string
  inStock: boolean
}

export default function RegisterShopPage() {
  const [malls, setMalls] = useState<Mall[]>([])
  const [buildings, setBuildings] = useState<Building[]>([])
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const [mallOption, setMallOption] = useState<"existing" | "new">("existing")
  const [buildingOption, setBuildingOption] = useState<"existing" | "new">("existing")
  const [customMallName, setCustomMallName] = useState("")
  const [customMallLocation, setCustomMallLocation] = useState("")
  const [customBuildingName, setCustomBuildingName] = useState("")

  // Shop form data
  const [shopName, setShopName] = useState("")
  const [category, setCategory] = useState("")
  const [mallId, setMallId] = useState("")
  const [buildingId, setBuildingId] = useState("")
  const [floor, setFloor] = useState("")
  const [unit, setUnit] = useState("")
  const [description, setDescription] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [ownerContact, setOwnerContact] = useState("")

  // Products
  const [products, setProducts] = useState<Product[]>([
    { name: "", category: "", price: "", description: "", inStock: true },
  ])

  // Fetch malls on mount
  useEffect(() => {
    fetch("/api/malls")
      .then((res) => res.json())
      .then((data) => {
        setMalls(data.malls || [])
        setBuildings(data.buildings || [])
      })
  }, [])

  // Filter buildings when mall changes
  useEffect(() => {
    if (mallId) {
      const filtered = buildings.filter((b) => b.mallId === mallId)
      setFilteredBuildings(filtered)
      setBuildingId("")
    } else {
      setFilteredBuildings([])
    }
  }, [mallId, buildings])

  useEffect(() => {
    if (mallOption === "new") {
      setBuildingOption("new")
      setMallId("")
      setBuildingId("")
    }
  }, [mallOption])

  const addProduct = () => {
    setProducts([...products, { name: "", category: "", price: "", description: "", inStock: true }])
  }

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index))
  }

  const updateProduct = (index: number, field: keyof Product, value: string | boolean) => {
    const updated = [...products]
    updated[index] = { ...updated[index], [field]: value }
    setProducts(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch("/api/register-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopName,
          category,
          mallId: mallOption === "existing" ? mallId : undefined,
          customMallName: mallOption === "new" ? customMallName : undefined,
          customMallLocation: mallOption === "new" ? customMallLocation : undefined,
          buildingId: buildingOption === "existing" ? buildingId : undefined,
          customBuildingName: buildingOption === "new" ? customBuildingName : undefined,
          floor,
          unit,
          description,
          ownerName,
          ownerContact,
          products: products.filter((p) => p.name && p.price),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Reset form
        setShopName("")
        setCategory("")
        setMallOption("existing")
        setBuildingOption("existing")
        setMallId("")
        setBuildingId("")
        setCustomMallName("")
        setCustomMallLocation("")
        setCustomBuildingName("")
        setFloor("")
        setUnit("")
        setDescription("")
        setOwnerName("")
        setOwnerContact("")
        setProducts([{ name: "", category: "", price: "", description: "", inStock: true }])
      } else {
        alert(data.error || "Failed to register shop")
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("Failed to register shop")
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Living",
    "Sports",
    "Books",
    "Beauty",
    "Food & Beverages",
    "Jewelry",
    "Toys",
    "Pharmacy",
    "Other",
  ]

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Register Your Shop</h1>
          <p className="text-lg text-neutral-400">Join Addis Ababa's premier mall product finder platform</p>
        </div>

        {success && (
          <Card className="mb-8 border-green-500/20 bg-green-500/10">
            <CardContent className="pt-6">
              <p className="text-green-400 text-center font-medium">
                ✓ Shop registered successfully! Your products are now searchable.
              </p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="border-neutral-800 bg-neutral-950 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Store className="h-5 w-5" />
                Shop Information
              </CardTitle>
              <CardDescription>Basic details about your shop</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shopName" className="text-neutral-200">
                    Shop Name *
                  </Label>
                  <Input
                    id="shopName"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g., TechZone Electronics"
                    required
                    className="bg-black border-neutral-800 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-neutral-200">
                    Category *
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="bg-black border-neutral-800 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-neutral-200">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your shop"
                  className="bg-black border-neutral-800 text-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-neutral-200">
                    Owner Name *
                  </Label>
                  <Input
                    id="ownerName"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Your full name"
                    required
                    className="bg-black border-neutral-800 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerContact" className="text-neutral-200">
                    Contact Number *
                  </Label>
                  <Input
                    id="ownerContact"
                    value={ownerContact}
                    onChange={(e) => setOwnerContact(e.target.value)}
                    placeholder="+251 XXX XXX XXX"
                    required
                    className="bg-black border-neutral-800 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-950 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Location Details</CardTitle>
              <CardDescription>Where is your shop located?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-neutral-200">Mall Selection *</Label>
                <RadioGroup value={mallOption} onValueChange={(value: "existing" | "new") => setMallOption(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="existing" id="existing-mall" />
                    <Label htmlFor="existing-mall" className="text-neutral-300 font-normal cursor-pointer">
                      Select from existing malls
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new-mall" />
                    <Label htmlFor="new-mall" className="text-neutral-300 font-normal cursor-pointer">
                      Add a new mall
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {mallOption === "existing" ? (
                <div className="space-y-2">
                  <Label htmlFor="mall" className="text-neutral-200">
                    Select Mall *
                  </Label>
                  <Select value={mallId} onValueChange={setMallId} required>
                    <SelectTrigger className="bg-black border-neutral-800 text-white">
                      <SelectValue placeholder="Select mall" />
                    </SelectTrigger>
                    <SelectContent>
                      {malls.map((mall) => (
                        <SelectItem key={mall._id} value={mall._id}>
                          {mall.name} - {mall.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customMallName" className="text-neutral-200">
                      Mall Name *
                    </Label>
                    <Input
                      id="customMallName"
                      value={customMallName}
                      onChange={(e) => setCustomMallName(e.target.value)}
                      placeholder="e.g., New Shopping Center"
                      required
                      className="bg-black border-neutral-800 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customMallLocation" className="text-neutral-200">
                      Mall Location *
                    </Label>
                    <Input
                      id="customMallLocation"
                      value={customMallLocation}
                      onChange={(e) => setCustomMallLocation(e.target.value)}
                      placeholder="e.g., Bole, Addis Ababa"
                      required
                      className="bg-black border-neutral-800 text-white"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Label className="text-neutral-200">Building Selection *</Label>
                <RadioGroup
                  value={buildingOption}
                  onValueChange={(value: "existing" | "new") => setBuildingOption(value)}
                  disabled={mallOption === "new"}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="existing" id="existing-building" disabled={mallOption === "new"} />
                    <Label
                      htmlFor="existing-building"
                      className={`font-normal cursor-pointer ${mallOption === "new" ? "text-neutral-600" : "text-neutral-300"}`}
                    >
                      Select from existing buildings
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new-building" />
                    <Label htmlFor="new-building" className="text-neutral-300 font-normal cursor-pointer">
                      Add a new building
                    </Label>
                  </div>
                </RadioGroup>
                {mallOption === "new" && (
                  <p className="text-sm text-neutral-500">New malls require a new building to be specified</p>
                )}
              </div>

              {buildingOption === "existing" && mallOption === "existing" ? (
                <div className="space-y-2">
                  <Label htmlFor="building" className="text-neutral-200">
                    Select Building *
                  </Label>
                  <Select value={buildingId} onValueChange={setBuildingId} required disabled={!mallId}>
                    <SelectTrigger className="bg-black border-neutral-800 text-white">
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredBuildings.map((building) => (
                        <SelectItem key={building._id} value={building._id}>
                          {building.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="customBuildingName" className="text-neutral-200">
                    Building Name *
                  </Label>
                  <Input
                    id="customBuildingName"
                    value={customBuildingName}
                    onChange={(e) => setCustomBuildingName(e.target.value)}
                    placeholder="e.g., North Tower, Main Building"
                    required
                    className="bg-black border-neutral-800 text-white"
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor" className="text-neutral-200">
                    Floor *
                  </Label>
                  <Input
                    id="floor"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder="e.g., 2nd Floor"
                    required
                    className="bg-black border-neutral-800 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-neutral-200">
                    Unit Number *
                  </Label>
                  <Input
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g., N-201"
                    required
                    className="bg-black border-neutral-800 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neutral-800 bg-neutral-950 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products
                </span>
                <Button type="button" onClick={addProduct} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Product
                </Button>
              </CardTitle>
              <CardDescription>List the products you sell</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {products.map((product, index) => (
                <div key={index} className="p-4 border border-neutral-800 rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-white">Product {index + 1}</h4>
                    {products.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeProduct(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-neutral-200">Product Name</Label>
                      <Input
                        value={product.name}
                        onChange={(e) => updateProduct(index, "name", e.target.value)}
                        placeholder="e.g., Wireless Headphones"
                        className="bg-black border-neutral-800 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-neutral-200">Category</Label>
                      <Input
                        value={product.category}
                        onChange={(e) => updateProduct(index, "category", e.target.value)}
                        placeholder="e.g., Audio"
                        className="bg-black border-neutral-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-neutral-200">Price (ETB)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={product.price}
                        onChange={(e) => updateProduct(index, "price", e.target.value)}
                        placeholder="0.00"
                        className="bg-black border-neutral-800 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-neutral-200">Stock Status</Label>
                      <Select
                        value={product.inStock ? "true" : "false"}
                        onValueChange={(value) => updateProduct(index, "inStock", value === "true")}
                      >
                        <SelectTrigger className="bg-black border-neutral-800 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">In Stock</SelectItem>
                          <SelectItem value="false">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-neutral-200">Description</Label>
                    <Textarea
                      value={product.description}
                      onChange={(e) => updateProduct(index, "description", e.target.value)}
                      placeholder="Product description"
                      className="bg-black border-neutral-800 text-white"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-white text-black hover:bg-neutral-200"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Shop"}
          </Button>
        </form>
      </div>
    </div>
  )
}
