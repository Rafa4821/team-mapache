import NextLink from 'next/link';
import { Box, Flex, Heading, Link, Icon, Badge, Image, Button, IconButton, Spacer, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, VStack } from '@chakra-ui/react';
import { FaShoppingCart } from 'react-icons/fa';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { session, logout } = useAuth();
  const { cartItems } = useCart();

  // The badge will show the number of unique items in the cart.
  const uniqueItemsCount = cartItems.length;

  return (
    <>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        padding={{ base: 4, md: "1.5rem" }}
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        boxShadow="sm"
      >
        <Link as={NextLink} href='/' _hover={{ textDecoration: 'none' }}>
          <Flex align="center" mr={5}>
            <Image src="https://aagjnwmkcudxsojjfqzm.supabase.co/storage/v1/object/public/products/Logo_72p_PNG.png" alt="Team Mapache Logo" boxSize="50px" />
            <Heading as="h1" size="lg" ml={3} letterSpacing={'tighter'}>
              team mapache
            </Heading>
          </Flex>
        </Link>

        <Spacer />

        <Box display={{ base: 'none', md: 'flex' }} alignItems="center" gap={4}>
          <Link as={NextLink} href='/' _hover={{ textDecoration: 'none' }}>
            <Button variant="ghost" fontWeight="bold">Inicio</Button>
          </Link>
          <Link as={NextLink} href='/about' _hover={{ textDecoration: 'none' }}>
            <Button variant="ghost" fontWeight="bold">Nosotros</Button>
          </Link>
          <Link as={NextLink} href='/contact' _hover={{ textDecoration: 'none' }}>
            <Button variant="ghost" fontWeight="bold">Contacto</Button>
          </Link>
          {session && (
            <Button variant="ghost" onClick={logout} fontWeight="bold">Cerrar Sesión</Button>
          )}
        </Box>

        <Flex align="center" gap={2}>
          <Link as={NextLink} href='/cart'>
            <Button variant="ghost" position="relative">
              <Icon as={FaShoppingCart} w={6} h={6} />
              {uniqueItemsCount > 0 && (
                <Badge
                  colorScheme="red"
                  borderRadius="full"
                  px={2}
                  position="absolute"
                  top="-2px"
                  right="-2px"
                >
                  {uniqueItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          <IconButton
            aria-label="Abrir menú"
            icon={<HamburgerIcon />}
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            variant="ghost"
          />
        </Flex>
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menú</DrawerHeader>
          <DrawerBody>
            <VStack as="nav" spacing={4} align="stretch">
              <Link as={NextLink} href='/' _hover={{ textDecoration: 'none' }} onClick={onClose}>
                <Button variant="ghost" w="100%">Inicio</Button>
              </Link>
              <Link as={NextLink} href='/about' _hover={{ textDecoration: 'none' }} onClick={onClose}>
                <Button variant="ghost" w="100%">Nosotros</Button>
              </Link>
              <Link as={NextLink} href='/contact' _hover={{ textDecoration: 'none' }} onClick={onClose}>
                <Button variant="ghost" w="100%">Contacto</Button>
              </Link>
              {session && (
                <Button variant="ghost" onClick={() => { logout(); onClose(); }} w="100%">Cerrar Sesión</Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
