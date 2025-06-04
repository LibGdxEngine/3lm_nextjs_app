"use client";

import { BookOpen, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="font-kufi relative py-10 min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-30"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-16 h-16 bg-islamic-gold/20 rounded-full blur-xl"></div>
      </div>
      <div
        className="absolute bottom-32 right-16 animate-float"
        style={{ animationDelay: "1s" }}
      >
        <div className="w-12 h-12 bg-islamic-teal/20 rounded-full blur-lg"></div>
      </div>
      <div
        className="absolute top-1/3 right-1/4 animate-float"
        style={{ animationDelay: "2s" }}
      >
        <div className="w-8 h-8 bg-islamic-green/20 rounded-full blur-md"></div>
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Main Icon */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-islamic-green to-islamic-teal rounded-2xl flex items-center justify-center animate-glow shadow-2xl">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-8 h-8 text-islamic-gold animate-pulse-slow" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
          <span className="gradient-text font-arabic font-extrabold">
            أدوات البحث الشامل
          </span>
          <br />
          <span className="font-arabic text-gray-800">في التراث</span>
        </h1>

        {/* Subtitle */}
        <p
          className="font-kufi ext-xl md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          اكتشف كنوز التراث العلمي الإسلامي باستخدام أدوات الذكاء الاصطناعي
          المتقدمة المصممة للباحثين والعلماء والطلاب.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up"
          style={{ animationDelay: "0.6s" }}
        >
          <button className="px-8 py-4 bg-gradient-to-r from-islamic-green to-islamic-teal text-white font-semibold rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2">
            <span>استكشف الادوات الجديدة</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
          <button className="px-8 py-4 bg-white/80 backdrop-blur-sm text-islamic-green font-semibold rounded-xl border-2 border-islamic-green/20 hover:bg-islamic-green hover:text-white transition-all duration-300 transform hover:-translate-y-1">
            شاهد الفيديو التقديمي
          </button>
        </div>

        {/* Stats */}
        <div
          className=" mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in"
          style={{ animationDelay: "0.9s" }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">10K+</div>
            <div className="text-gray-600 mt-1">مستندات تمت معالجتها</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">50+</div>
            <div className="text-gray-600 mt-1">لغة مدعومة</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">1M+</div>
            <div className="text-gray-600 mt-1">نص مستخرج</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text">99%+</div>
            <div className="text-gray-600 mt-1">دقة تفوق</div>
          </div>
        </div>
      </div>
    </section>
  );
}
