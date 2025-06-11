import { CartProvider } from "@/lib/CartContext";
import "@/styles/globals.css";
import { ClerkProvider } from '@clerk/nextjs'


export default function App({ Component, pageProps }) {
  return (
        <ClerkProvider>
            <CartProvider>
              <Component {...pageProps} />
            </ CartProvider>
        </ClerkProvider>
  );
}
