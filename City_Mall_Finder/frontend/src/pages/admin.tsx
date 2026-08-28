import { malls, buildings, shops, products } from "@/lib/mock-data"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold text-white">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid gap-6 mb-8 md:grid-cols-4">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <div className="text-gray-400 text-sm mb-2">Total Malls</div>
            <div className="text-3xl font-bold text-white">{malls.length}</div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <div className="text-gray-400 text-sm mb-2">Total Buildings</div>
            <div className="text-3xl font-bold text-white">{buildings.length}</div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <div className="text-gray-400 text-sm mb-2">Total Shops</div>
            <div className="text-3xl font-bold text-white">{shops.length}</div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <div className="text-gray-400 text-sm mb-2">Total Products</div>
            <div className="text-3xl font-bold text-white">{products.length}</div>
          </div>
        </div>

        {/* Tables */}
        <div className="space-y-8">
          {/* Malls Table */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Malls</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-800 bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-400">Name</th>
                    <th className="px-6 py-3 text-left text-gray-400">Location</th>
                    <th className="px-6 py-3 text-left text-gray-400">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {malls.map((mall) => (
                    <tr key={mall._id} className="border-b border-gray-800">
                      <td className="px-6 py-4 text-white">{mall.name}</td>
                      <td className="px-6 py-4 text-gray-400">{mall.location}</td>
                      <td className="px-6 py-4 text-gray-400">{mall.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shops Table */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Shops</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-800 bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-400">Shop Name</th>
                    <th className="px-6 py-3 text-left text-gray-400">Category</th>
                    <th className="px-6 py-3 text-left text-gray-400">Phone</th>
                    <th className="px-6 py-3 text-left text-gray-400">Floor/Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {shops.map((shop) => (
                    <tr key={shop._id} className="border-b border-gray-800">
                      <td className="px-6 py-4 text-white">{shop.name}</td>
                      <td className="px-6 py-4 text-gray-400">{shop.category}</td>
                      <td className="px-6 py-4 text-gray-400">{shop.phoneNumber}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {shop.floor}/{shop.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Products Table */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Products</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-800 bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-400">Product Name</th>
                    <th className="px-6 py-3 text-left text-gray-400">Category</th>
                    <th className="px-6 py-3 text-left text-gray-400">Price (ETB)</th>
                    <th className="px-6 py-3 text-left text-gray-400">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-b border-gray-800">
                      <td className="px-6 py-4 text-white">{product.name}</td>
                      <td className="px-6 py-4 text-gray-400">{product.category}</td>
                      <td className="px-6 py-4 text-white font-medium">{product.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            product.inStock ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-gray-400"
                          }`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
