import { Flex, Box } from '@chakra-ui/react';
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
    </Flex>
  );
};

export default Layout;
