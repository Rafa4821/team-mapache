import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      900: '#2D3142', // Dark text
      800: '#BFC0C0', // Secondary gray
      700: '#EF8354', // Primary accent
    },
  },
  fonts: {
    heading: `'Montserrat', sans-serif`,
    body: `'Montserrat', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: '#FFFFFF',
        color: 'brand.900',
      },
      a: {
        color: 'brand.700',
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  },
});

export default theme;
