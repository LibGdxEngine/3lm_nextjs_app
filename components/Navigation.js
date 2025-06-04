'use client'

import { useState } from 'react'
import { Search, Menu, X, Moon, Sun } from 'lucide-react'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 animate-slide-in-left">
            <div className="w-10 h-10 bg-gradient-to-br from-islamic-green to-islamic-teal rounded-lg flex items-center justify-center animate-glow">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              </svg>
            </div>
            <h1 className="font-arabic text-xl font-bold gradient-text">
               علم لإحياء التراث
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-islamic-green transition-colors duration-200 font-medium">
              القرآن
            </a>
            <a href="#" className="text-gray-700 hover:text-islamic-green transition-colors duration-200 font-medium">
              الحديث
            </a>
            <a href="#" className="text-gray-700 hover:text-islamic-green transition-colors duration-200 font-medium">
              التفسير
            </a>
            <a href="#" className="text-gray-700 hover:text-islamic-green transition-colors duration-200 font-medium">
              المكتبة
            </a>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center bg-gray-100 rounded-lg px-3 py-2 max-w-md">
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="ابحث..." 
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg mt-2 shadow-lg">
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-islamic-green hover:bg-gray-50 rounded-md transition-colors duration-200">
                القرآن
              </a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-islamic-green hover:bg-gray-50 rounded-md transition-colors duration-200">
                الحديث
              </a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-islamic-green hover:bg-gray-50 rounded-md transition-colors duration-200">
                التفسير
              </a>
              <a href="#" className="block px-3 py-2 text-gray-700 hover:text-islamic-green hover:bg-gray-50 rounded-md transition-colors duration-200">
                المكتبة
              </a>
              <div className="px-3 py-2">
                <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                  <Search className="w-4 h-4 text-gray-500 mr-2" />
                  <input 
                    type="text" 
                    placeholder="ابحث..." 
                    className="bg-transparent outline-none text-sm w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}