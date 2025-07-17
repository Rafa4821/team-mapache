import { Box, Flex, Heading, Text, Button, Link, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const CartPage = () => {
  const { cartItems, clearCart } = useCart();

  return (
    <Layout>
      <Box maxW="container.xl" mx="auto" p={{ base: 4, md: 8 }}>
        <Heading as="h1" size="2xl" mb={8}>Tu Carrito</Heading>
        {cartItems.length === 0 ? (
          <VStack spacing={6} align="center" justify="center" h="50vh">
            <Text fontSize="2xl">Tu carrito está vacío.</Text>
            <NextLink href="/" passHref>
              <Button as={Link} colorScheme="red" size="lg">¡Mira nuestros productos!</Button>
            </NextLink>
          </VStack>
        ) : (
          <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
            <VStack flex={{ base: '1', lg: '2.5' }} spacing={4} align="stretch">
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
              <Button variant="outline" onClick={clearCart} mt={4} align-self="flex-end">
                Vaciar Carrito
              </Button>
            </VStack>

            <Box flex={{ base: '1', lg: '1' }} position={{ lg: 'sticky' }} top={{ lg: '8rem' }} h="fit-content">
              <CartSummary />
            </Box>
          </Flex>
        )}
      </Box>
    </Layout>
  );
};

export default CartPage;
