import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext'; 
import theme from '../lib/theme';

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
