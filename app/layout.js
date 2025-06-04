import { Noto_Kufi_Arabic } from 'next/font/google'
import './globals.css';

const notoKufiArabic = Noto_Kufi_Arabic({ 
  subsets: ['arabic'],
  weight: ['400', '700'], // Add desired weights
  variable: '--font-noto-kufi-arabic', // for Tailwind integration
  display: 'swap',
})

export const metadata = {
  title: 'منصة علم - لإحياء التراث',
  description: 'Comprehensive Islamic research tools and resources',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={notoKufiArabic.variable}>
      <head>
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}