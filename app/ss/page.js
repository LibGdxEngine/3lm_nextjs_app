'use client'
import React, { useState, useEffect } from 'react';
import { Search, Book, Users, Target, Star, Filter, ChevronDown, Globe, Calendar, User, BookOpen, TrendingUp, Download, Share2, Bookmark } from 'lucide-react';
import ApiService from '../api/ApiService';
let testData = [];
try {
  testData = require('../ss/utils/test.json');
} catch (e) {
  // fallback: empty array
  testData = [];
}

const api = new ApiService('http://localhost:8000');

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    source: '',
    author: '',
    period: '',
    topic: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [seedStatus, setSeedStatus] = useState('idle'); // idle | loading | success | error
  const [seedError, setSeedError] = useState('');
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    // Seed the backend with test.json data on first load, only if not already seeded
    const seedData = async () => {
      setSeedStatus('loading');
      setSeedError('');
      try {
        // Check if books exist
        const booksRes = await api.get('/books');
        if (Array.isArray(booksRes) && booksRes.length > 0) {
          setSeedStatus('success');
          return;
        }
        // If no books, upload test.json
        await api.post('/index', testData);
        setSeedStatus('success');
      } catch (err) {
        setSeedStatus('error');
        setSeedError('تعذر رفع البيانات الأساسية.');
      }
    };
    seedData();
  }, []);

  const categories = [
    { name: 'القرآن', count: 2500 },
    { name: 'الحديث', count: 1800 },
    { name: 'التفسير', count: 1200 },
    { name: 'المكتبة', count: 3200 }
  ];

  const handleSearch = async () => {
    setSearchError('');
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.post('/search', { query: searchQuery });
      if (res && Array.isArray(res.results)) {
        setSearchResults(res.results);
      } else {
        setSearchResults([]);
        setSearchError('لم يتم العثور على نتائج أو هناك مشكلة في البيانات.');
      }
    } catch (err) {
      setSearchResults([]);
      setSearchError('حدث خطأ أثناء البحث. يرجى المحاولة لاحقاً.');
    }
      setIsSearching(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Book className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">علم لإحياء التراث</span>
            </div>
            
            <nav className="hidden md:flex space-x-reverse space-x-8">
              {categories.map((category) => (
                <a key={category.name} href="#" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
                  {category.name}
                </a>
              ))}
            </nav>
            
            <div className="flex items-center space-x-reverse space-x-4">
              <Search className="h-5 w-5 text-gray-400" />
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="bg-green-600 p-4 rounded-2xl w-20 h-20 mx-auto mb-6 shadow-lg">
              <Book className="h-12 w-12 text-white mx-auto" />
              <div className="absolute -top-2 -right-2 text-2xl">✨</div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            أدوات البحث الشامل
            <br />
            <span className="text-green-600">في التراث</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            اكتشف كنوز التراث العلمي الإسلامي باستخدام أدوات الذكاء الاصطناعي المتقدمة
            المصممة للباحثين والعلماء والطلاب
          </p>

          {/* Search Interface */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-green-100">
            {/* Seed status messages */}
            {seedStatus === 'loading' && (
              <div className="mb-4 text-blue-600">جاري رفع البيانات الأساسية...</div>
            )}
            {seedStatus === 'success' && (
              <div className="mb-4 text-green-600">تم رفع البيانات الأساسية بنجاح.</div>
            )}
            {seedStatus === 'error' && (
              <div className="mb-4 text-red-600">{seedError}</div>
            )}
            {/* Search error message */}
            {searchError && (
              <div className="mb-4 text-red-600">{searchError}</div>
            )}
            <div className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="ابحث في ملايين الصفحات من التراث الإسلامي..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors pr-14"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            </div>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-reverse space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>فلترة متقدمة</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                بحث دلالي
              </button>
              
              <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                تحليل النصوص
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
                  <option>المصدر</option>
                  <option>القرآن الكريم</option>
                  <option>صحيح البخاري</option>
                  <option>تفسير ابن كثير</option>
                </select>
                
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
                  <option>المؤلف</option>
                  <option>ابن كثير</option>
                  <option>الطبري</option>
                  <option>النووي</option>
                </select>
                
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
                  <option>الحقبة الزمنية</option>
                  <option>القرن الأول</option>
                  <option>القرن الثاني</option>
                  <option>القرن الثالث</option>
                </select>
                
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500">
                  <option>الموضوع</option>
                  <option>العقيدة</option>
                  <option>الفقه</option>
                  <option>التفسير</option>
                </select>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-reverse space-x-2"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span>استكشف الأدوات الجديدة</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                نتائج البحث ({searchResults.length})
              </h2>
              <div className="flex items-center space-x-reverse space-x-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>ترتيب حسب الصلة</option>
                  <option>ترتيب حسب التاريخ</option>
                  <option>ترتيب حسب المؤلف</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {searchResults.map((result, idx) => (
                <div key={result.id || idx} className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-shadow">
                  <div className="mb-2">
                    <span className="text-gray-500 text-sm">الاسم:</span>
                    <span className="font-bold text-lg text-gray-900 ml-2">{result.name}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-500 text-sm">العنوان:</span>
                    <span className="font-bold text-lg text-green-700 ml-2">{result.title}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-500 text-sm">الملخص:</span>
                    <span className="text-gray-800 ml-2">{result.summary}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium">
                عرض المزيد من النتائج
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ميزات متقدمة للبحث العلمي
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              تقنيات حديثة مصممة خصيصاً لخدمة الباحثين في التراث الإسلامي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="bg-blue-600 p-3 rounded-xl w-12 h-12 mb-6">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">البحث الدلالي</h3>
              <p className="text-gray-700 leading-relaxed">
                فهم المعنى والسياق وراء النصوص للحصول على نتائج أكثر دقة ووثاقة
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
              <div className="bg-purple-600 p-3 rounded-xl w-12 h-12 mb-6">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">تحليل النصوص</h3>
              <p className="text-gray-700 leading-relaxed">
                استخراج المفاهيم والعلاقات والأنماط من النصوص التراثية تلقائياً
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
              <div className="bg-green-600 p-3 rounded-xl w-12 h-12 mb-6">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">مكتبة شاملة</h3>
              <p className="text-gray-700 leading-relaxed">
                الوصول إلى آلاف المراجع والكتب من مختلف العلوم الإسلامية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-reverse space-x-2 mb-4">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Book className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">علم لإحياء التراث</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                منصة متخصصة في البحث والتحليل في التراث الإسلامي باستخدام أحدث التقنيات
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">الأقسام</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">القرآن الكريم</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الحديث الشريف</a></li>
                <li><a href="#" className="hover:text-white transition-colors">التفسير</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الفقه</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">الأدوات</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">البحث المتقدم</a></li>
                <li><a href="#" className="hover:text-white transition-colors">تحليل النصوص</a></li>
                <li><a href="#" className="hover:text-white transition-colors">المقارنات</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الإحصائيات</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">تواصل معنا</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">حول المشروع</a></li>
                <li><a href="#" className="hover:text-white transition-colors">فريق العمل</a></li>
                <li><a href="#" className="hover:text-white transition-colors">الدعم الفني</a></li>
                <li><a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 علم لإحياء التراث. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;