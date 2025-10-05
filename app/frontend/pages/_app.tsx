'use client'

import type { AppProps } from 'next/app'
import '../pages/globals.css'
import NavigationLayout from './components/NavigationLayout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NavigationLayout>
      <Component {...pageProps} />
    </NavigationLayout>
  )
}


