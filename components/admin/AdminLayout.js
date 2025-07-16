import { Box, Flex, Icon, Link, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FiShoppingBag, FiFileText, FiGrid, FiClipboard } from 'react-icons/fi';

const NavItem = ({ icon, href, children }) => {
  const router = useRouter();
  const isActive = router.pathname.startsWith(href);

  return (
    <NextLink href={href} passHref legacyBehavior>
      <Link as={Flex} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
        <Flex
          align="center"
          p={4}
          mx={4}
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={isActive ? 'gray.200' : 'transparent'}
          color={isActive ? 'black' : 'inherit'}
          _hover={{
            bg: 'gray.100',
          }}
        >
          {icon && (
            <Icon
              mr={4}
              fontSize="16"
              as={icon}
            />
          )}
          {children}
        </Flex>
      </Link>
    </NextLink>
  );
};

const AdminLayout = ({ children }) => {
  return (
    <Flex>
      <Box
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        w={{ base: 'full', md: 60 }}
        h="100vh"
        position="fixed"
        zIndex={1}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
            <Text fontSize="2xl" fontWeight="bold">
                Tu Tienda
            </Text>
        </Flex>
        <VStack align="stretch" spacing={1}>
          <NavItem icon={FiShoppingBag} href="/admin/products">Productos</NavItem>
          <NavItem icon={FiFileText} href="/admin/orders">Pedidos</NavItem>
          <NavItem icon={FiGrid} href="/admin/categories">Categorías</NavItem>
          <NavItem icon={FiClipboard} href="/admin/stock-control">Control de Stock</NavItem>
        </VStack>
      </Box>
      <Box ml={{ base: 0, md: 60 }} p="8" w="full">
        {children}
      </Box>
    </Flex>
  );
};

export default AdminLayout;
