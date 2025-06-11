'use client'

import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-islamic-navy to-islamic-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-islamic-gold to-yellow-400 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-islamic-navy" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold">مركز علم لإحياء التراث</h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              تمكين البحث العلمي الإسلامي من خلال أحدث تقنيات الذكاء الاصطناعي والحفظ الرقمي.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-islamic-gold transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-islamic-gold transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-islamic-gold transition-colors duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-islamic-gold transition-colors duration-300">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">أدوات البحث</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">استخراج النصوص</a></li>
              <li><a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">استخراج العناصر من النصوص</a></li>
              <li><a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">البحث المتقدم</a></li>
              <li><a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">سؤال و جواب</a></li>
              <li><a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">تشجير المعلومات</a></li>
              <li><a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">المتابعة الزمنية</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">شروحات</a></li>
              <li><a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">تفاصيل المشروع</a></li>
              <li><a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">التدريب والمتابعة</a></li>
              <li><a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">أبحاث ورقية</a></li>
              <li><a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">نماذج علمية</a></li>
              <li><a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">المدونة</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">تواصل معنا</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-islamic-gold" />
                <span className="text-gray-300">research@3lm.org</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-islamic-gold" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-islamic-gold" />
                <span className="text-gray-300">منصة علم لإحياء التراث<br/>المقطم شارع 83</span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="mt-8">
              <h5 className="font-semibold mb-3">قم بمتابعة كل جديد</h5>
              <div className=" flex">
                <input 
                  type="email" 
                  placeholder="أدخل بريدك الإلكتروني"
                  className="w-60 flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-islamic-gold"
                />
                <button className="px-2 py-2 bg-islamic-gold text-islamic-navy font-semibold rounded-r-lg hover:bg-yellow-400 transition-colors duration-300">
                  اشتراك 
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 mb-4 md:mb-0">
              © {currentYear} Islamic Research Hub. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">Cookie Policy</a>
              <a href="#" className="text-gray-300 hover:text-islamic-gold transition-colors duration-200">Support</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}