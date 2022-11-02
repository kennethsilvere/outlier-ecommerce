import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { CartContextProvider } from '../store/cart-context'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartContextProvider>
      <Component {...pageProps} />
    </CartContextProvider>
  )
}

export default MyApp
