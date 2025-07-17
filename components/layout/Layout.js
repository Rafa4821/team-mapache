import { Flex, Box, Link, Button } from '@chakra-ui/react';
import { FaWhatsapp } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <Flex direction="column" minHeight="100vh">
      <Header />
      <Box as="main" flex="1" p={8}>
        {children}
      </Box>
      <Footer />

      {/* Botón Flotante de WhatsApp Global */}
      <Link href="https://wa.me/56912345678" isExternal>
        <Button 
          position="fixed"
          bottom={{ base: '20px', md: '30px' }}
          right={{ base: '20px', md: '30px' }}
          colorScheme="whatsapp"
          borderRadius="full"
          boxShadow="lg"
          leftIcon={<FaWhatsapp />}
          zIndex="tooltip"
          size="lg"
        >
          ¡Chatea con nosotros!
        </Button>
      </Link>
    </Flex>
  );
};

export default Layout;
