import React from 'react';
import { BookOpen } from 'lucide-react';

const Header = () => (
  <header className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="bg-green-600 p-2 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">أدوات البحث الشامل في التراث</h1>
        </div>
        <nav className="flex space-x-8 space-x-reverse">
          <a href="#" className="text-gray-600 hover:text-gray-900">القرآن</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">الحديث</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">التفسير</a>
          <a href="#" className="text-gray-600 hover:text-gray-900">المكتبة</a>
        </nav>
      </div>
    </div>
  </header>
);

export default Header; 