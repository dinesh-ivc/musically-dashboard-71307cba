import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ 
  weight: ['400', '600', '700', '800'], 
  subsets: ['latin'] 
})

export const metadata = {
  title: 'Daccord - Community Discovery Platform',
  description: 'A Discord-like community discovery platform with integrated music player',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}