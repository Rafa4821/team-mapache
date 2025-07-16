import { Box, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box as="footer" bg="brand.900" color="white" py={8} textAlign="center">
      <Text>&copy; {new Date().getFullYear()} team mapache. Todos los derechos reservados.</Text>
    </Box>
  );
};

export default Footer;
