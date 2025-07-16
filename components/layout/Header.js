import NextLink from 'next/link';
import { Box, Flex, Heading, Link, Icon, Badge, Image, Button } from '@chakra-ui/react';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const { session, logout } = useAuth();
  const { cartItems } = useCart();

  // Calculate total number of items in the cart
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1.5rem"
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

      <Box as="nav" display={{ base: 'none', md: 'flex' }} gap="8">
        <Link as={NextLink} href='/' _hover={{ textDecoration: 'none' }}>
          <Button variant="ghost" fontWeight="bold">Inicio</Button>
        </Link>
        {session ? (
          <Button variant="ghost" onClick={logout} fontWeight="bold">Cerrar Sesión</Button>
        ) : (
          <Link as={NextLink} href='/admin' _hover={{ textDecoration: 'none' }}>
            <Button variant="ghost" fontWeight="bold">Admin</Button>
          </Link>
        )}
      </Box>

      <Link as={NextLink} href='/cart'>
        <Button variant="ghost" position="relative">
          <Icon as={FaShoppingCart} w={6} h={6} />
          {totalItems > 0 && (
            <Badge
              colorScheme="red"
              borderRadius="full"
              px={2}
              position="absolute"
              top="-2px"
              right="-2px"
            >
              {totalItems}
            </Badge>
          )}
        </Button>
      </Link>
    </Flex>
  );
};

export default Header;
