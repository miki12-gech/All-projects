import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import HomePage from "@/pages/home"
import RegisterPage from "@/pages/register"
import AdminPage from "@/pages/admin"

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}
