function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-800 bg-black text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3 mb-8">
          <div>
            <h3 className="mb-4 font-semibold text-white">Addis Mall Finder</h3>
            <p className="text-sm">Discover and find products across Addis Ababa's best malls.</p>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Search Products
                </a>
              </li>
              <li>
                <a href="/register" className="hover:text-white transition-colors">
                  Register Shop
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-white">Contact</h3>
            <p className="text-sm">Addis Ababa, Ethiopia</p>
            <p className="text-sm">Email: info@addismallfinder.com</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>© {currentYear} Addis Mall Finder. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
