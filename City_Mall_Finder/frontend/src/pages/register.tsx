"use client"

import type React from "react"

import { useState } from "react"
import { malls, buildings } from "@/lib/mock-data"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    shopName: "",
    category: "",
    phoneNumber: "",
    googleMapsUrl: "",
    floor: "",
    unit: "",
    mallId: "",
    customMall: "",
    buildingId: "",
    customBuilding: "",
    useExistingMall: true,
    useExistingBuilding: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "true",
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Shop registration:", formData)
    alert("Thank you for registering your shop! We will review and contact you soon.")
    setFormData({
      shopName: "",
      category: "",
      phoneNumber: "",
      googleMapsUrl: "",
      floor: "",
      unit: "",
      mallId: "",
      customMall: "",
      buildingId: "",
      customBuilding: "",
      useExistingMall: true,
      useExistingBuilding: true,
    })
  }

  const availableBuildings = formData.mallId ? buildings.filter((b) => b.mallId === formData.mallId) : []

  const categories = [
    "Electronics",
    "Clothing",
    "Home & Living",
    "Sports",
    "Books",
    "Beauty",
    "Food & Beverage",
    "Accessories",
  ]

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">Register Your Shop</h1>
          <p className="text-gray-400">Add your shop to Addis Mall Finder and start reaching customers today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-800 bg-gray-900 p-8">
          {/* Shop Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Shop Name *</label>
            <input
              type="text"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-800 bg-black text-white rounded-lg focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
              placeholder="Enter your shop name"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-800 bg-black text-white rounded-lg focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Mall Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white mb-3">Mall Location *</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="useExistingMall"
                  value="true"
                  checked={formData.useExistingMall}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
                <span className="text-gray-300">Select from existing malls</span>
              </label>
              {formData.useExistingMall && (
                <select
                  name="mallId"
                  value={formData.mallId}
                  onChange={handleChange}
                  required={formData.useExistingMall}
                  className="w-full px-4 py-2 border border-gray-800 bg-black text-white rounded-lg focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                >
                  <option value="">Select a mall</option>
                  {malls.map((mall) => (
                    <option key={mall._id} value={mall._id}>
                      {mall.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="useExistingMall"
                  value="false"
                  checked={!formData.useExistingMall}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
                <span className="text-gray-300">Add a new mall</span>
              </label>
              {!formData.useExistingMall && (
                <input
                  type="text"
                  name="customMall"
                  value={formData.customMall}
                  onChange={handleChange}
                  required={!formData.useExistingMall}
                  className="w-full px-4 py-2 border border-gray-800 bg-black text-white rounded-lg focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                  placeholder="Enter mall name and location"
                />
              )}
            </div>
          </div>

          {/* Building Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white mb-3">Building *</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="useExistingBuilding"
                  value="true"
                  checked={formData.useExistingBuilding}
                  onChange={handleChange}
                  className="cursor-pointer"
                  disabled={!formData.mallId && formData.useExistingMall}
                />
                <span className="text-gray-300">Select from existing buildings</span>
              </label>
              {formData.useExistingBuilding && formData.mallId && (
                <select
                  name="buildingId"
                  value={formData.buildingId}
                  onChange={handleChange}
                  required={formData.useExistingBuilding && !!formData.mallId}
                  className="w-full px-4 py-2 border border-gray-800 bg-black text-white rounded-lg focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                >
                  <option value="">Select a building</option>
                  {availableBuildings.map((building) => (
                    <option key={building._id} value={building._id}>
                      {building.name} ({building.floor})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="useExistingBuilding"
                  value="false"
                  checked={!formData.useExistingBuilding}
                  onChange={handleChange}
                  className="cursor-pointer"
                />
                <span className="text-gray-300">Add a new building</span>
              </label>
              {!formData.useExistingBuilding && (
                <input
                  type="text"
                  name="customBuilding"
                  value={formData.customBuilding}
                  onChange={handleChange}
                  required={!formData.useExistingBuilding}
                  className="w-full px-4 py-2 border border-gray-800 bg-black text-white rounded-lg focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                  placeholder="Enter building name"
                />
              )}
            </div>
          </div>

          {/* Floor and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Floor</label>
              <input
                type="text"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-800 bg-black text-white rounded-lg focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                placeholder="e.g., 2nd Floor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-800 bg-black text-white rounded-lg focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
                placeholder="e.g., N-201"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Phone Number *</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-800 bg-black text-white rounded-lg focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
              placeholder="+251 11 123 4567"
            />
          </div>

          {/* Google Maps URL */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Google Maps URL</label>
            <input
              type="url"
              name="googleMapsUrl"
              value={formData.googleMapsUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-800 bg-black text-white rounded-lg focus:border-gray-700 focus:ring-1 focus:ring-gray-700"
              placeholder="https://maps.google.com/?q=..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Register Shop
          </button>
        </form>
      </div>
    </div>
  )
}
