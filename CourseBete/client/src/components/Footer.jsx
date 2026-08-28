import { Facebook, Twitter, Instagram, Mail, Phone, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-3xl font-heading font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">CourseBete</h3>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm mb-6">
            Preserving our heritage through digital education. Join thousands of students learning Geez, Zema, and Bible History online.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 group">
              <Facebook className="text-slate-400 group-hover:text-white transition-colors" size={20} />
            </a>
            <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-blue-400 transition-colors duration-300 group">
              <Twitter className="text-slate-400 group-hover:text-white transition-colors" size={20} />
            </a>
            <a href="#" className="bg-slate-800 p-2 rounded-lg hover:bg-pink-600 transition-colors duration-300 group">
              <Instagram className="text-slate-400 group-hover:text-white transition-colors" size={20} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-heading font-bold mb-6 text-slate-200">Quick Links</h3>
          <ul className="space-y-4 text-slate-400">
            <li><Link to="/" className="hover:text-blue-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">Home</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">About Us</Link></li>
            <li><Link to="/register" className="hover:text-blue-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">Register</Link></li>
            <li><Link to="/login" className="hover:text-blue-400 transition-colors flex items-center gap-2 hover:translate-x-1 duration-200">Student Login</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-heading font-bold mb-6 text-slate-200">Contact</h3>
          <div className="space-y-4 text-slate-400">
            <div className="flex items-start gap-3 group">
              <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-blue-900 transition-colors">
                <Mail size={18} className="text-blue-400" />
              </div>
              <span className="text-sm">contact@coursebete.com</span>
            </div>
            <div className="flex items-start gap-3 group">
              <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-blue-900 transition-colors">
                <Phone size={18} className="text-blue-400" />
              </div>
              <span className="text-sm">+251 988 278 015</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} CourseBete. All rights reserved.</p>
        <p className="flex items-center gap-1">Made with <Heart size={14} className="text-red-500 fill-red-500" /> for the Community</p>
      </div>
    </footer>
  );
}

export default Footer;