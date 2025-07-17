import { Box, Flex, Icon, Link, Text, VStack, IconButton, Drawer, DrawerContent, useDisclosure, DrawerOverlay, DrawerCloseButton, DrawerHeader, DrawerBody } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { FiShoppingBag, FiFileText, FiGrid, FiClipboard, FiMenu } from 'react-icons/fi';

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

const SidebarContent = ({ ...rest }) => (
  <Box
    bg="white"
    borderRight="1px"
    borderColor="gray.200"
    w={{ base: 'full', md: 60 }}
    h="full"
    {...rest}
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
);

const MobileNav = ({ onOpen, ...rest }) => (
  <Flex
    ml={{ base: 0, md: 60 }}
    px={{ base: 4, md: 24 }}
    height="20"
    alignItems="center"
    bg="white"
    borderBottomWidth="1px"
    borderBottomColor="gray.200"
    justifyContent="flex-start"
    {...rest}
  >
    <IconButton
      variant="outline"
      onClick={onOpen}
      aria-label="open menu"
      icon={<FiMenu />}
      display={{ base: 'flex', md: 'none' }}
    />
    <Text fontSize="2xl" ml="8" fontWeight="bold" display={{ base: 'flex', md: 'none' }}>
      Tu Tienda
    </Text>
  </Flex>
);

const AdminLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
        <Flex minH="100vh" bg="white">
      <SidebarContent display={{ base: 'none', md: 'block' }} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent />
        </DrawerContent>
      </Drawer>
      
      <Box flex="1">
        <MobileNav onOpen={onOpen} />
        <Box p={{ base: 4, md: 8 }}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default AdminLayout;
