'use client'

import { BookOpen, Users, Award, TrendingUp } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'Extensive Library',
    description: 'Access to over 100,000 digitized Islamic manuscripts and texts',
    stat: '100K+',
    statLabel: 'Documents'
  },
  {
    icon: Users,
    title: 'Scholar Community',
    description: 'Connect with researchers and scholars from around the world',
    stat: '5K+',
    statLabel: 'Active Users'
  },
  {
    icon: Award,
    title: 'Academic Excellence',
    description: 'Trusted by universities and research institutions globally',
    stat: '150+',
    statLabel: 'Institutions'
  },
  {
    icon: TrendingUp,
    title: 'AI-Powered Insights',
    description: 'Advanced machine learning algorithms for deeper understanding',
    stat: '99.5%',
    statLabel: 'Accuracy'
  }
]

const testimonials = [
  {
    name: 'Dr. Ahmad Hassan',
    title: 'Professor of Islamic Studies',
    institution: 'Al-Azhar University',
    quote: 'This platform has revolutionized how I conduct my research. The OCR capabilities for ancient manuscripts are extraordinary.',
    avatar: '👨‍🏫'
  },
  {
    name: 'Dr. Fatima Al-Zahra',
    title: 'Research Fellow',
    institution: 'Oxford University',
    quote: 'The NER tool helped me identify connections between scholars that I never would have found manually. Incredible work!',
    avatar: '👩‍💼'
  },
  {
    name: 'Prof. Muhammad Ali',
    title: 'Department Head',
    institution: 'Islamic University of Medina',
    quote: 'The timeline generation feature has become an essential tool for my students. It makes complex historical relationships clear.',
    avatar: '👨‍🎓'
  }
]

export default function FeaturedContent() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built by researchers, for researchers - combining traditional scholarship with modern technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className="text-center group animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-islamic-green to-islamic-teal rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {feature.stat}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      {feature.statLabel}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Trusted by Scholars Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what leading researchers and academics are saying about our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
              >
                <div className="flex items-center mb-6">
                  <div className="text-4xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.title}
                    </p>
                    <p className="text-sm text-islamic-teal font-medium">
                      {testimonial.institution}
                    </p>
                  </div>
                </div>
                
                <blockquote className="text-gray-600 italic leading-relaxed">
                  {testimonial.quote}
                </blockquote>
                
                <div className="flex text-islamic-gold mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Islamic Heritage Section */}
        <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="bg-gradient-to-r from-islamic-green/10 to-islamic-teal/10 rounded-3xl p-12 border border-islamic-green/20">
            <div className="text-6xl mb-6 animate-float">
              📜
            </div>
            <h3 className="text-3xl font-bold gradient-text mb-6 font-arabic">
              Preserving Islamic Heritage Through Technology
            </h3>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Our mission is to make the vast treasures of Islamic scholarship accessible to researchers worldwide. 
              From the golden age manuscripts to contemporary works, we bridge the gap between traditional knowledge 
              and modern research methodologies.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-white/80 rounded-full text-islamic-green font-medium border border-islamic-green/20">
                Digital Preservation
              </span>
              <span className="px-4 py-2 bg-white/80 rounded-full text-islamic-green font-medium border border-islamic-green/20">
                AI-Enhanced Research
              </span>
              <span className="px-4 py-2 bg-white/80 rounded-full text-islamic-green font-medium border border-islamic-green/20">
                Global Accessibility
              </span>
              <span className="px-4 py-2 bg-white/80 rounded-full text-islamic-green font-medium border border-islamic-green/20">
                Scholarly Collaboration
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}