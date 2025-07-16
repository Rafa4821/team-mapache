import { useCart } from '../context/CartContext';
import Layout from '../components/layout/Layout';
import NextLink from 'next/link';
import {
  Box, Flex, Heading, Text, Button, Image, IconButton, Link, VStack, HStack, Divider, useToast
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import QuantitySelector from '../components/ui/QuantitySelector';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const toast = useToast();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const handleClearCart = () => {
    clearCart();
    toast({ title: 'Carrito vaciado', status: 'info', duration: 2000, isClosable: true });
  };

  

  return (
    <Layout>
      <Heading as="h1" size="xl" mb={8}>Tu Carrito</Heading>
      {cartItems.length === 0 ? (
        <Text>Tu carrito está vacío. <NextLink href="/" passHref><Link color="brand.700">¡Mira nuestros productos!</Link></NextLink></Text>
      ) : (
        <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
          <VStack flex={3} spacing={4} align="stretch">
            {cartItems.map(item => (
              <Flex key={item.id} align="center" p={4} borderWidth="1px" borderRadius="md" w="full">
                <Image src={item.imageUrl} alt={item.name} boxSize={{ base: '60px', md: '100px' }} objectFit="cover" mr={4} borderRadius="md" />
                <VStack align="start" flex={1} spacing={1} overflow="hidden">
                  <NextLink href={`/product/${item.id}`} passHref>
                    <Link _hover={{ textDecoration: 'none' }}>
                      <Heading as="h3" size="md" noOfLines={1} title={item.name}>{item.name}</Heading>
                    </Link>
                  </NextLink>
                  <Text fontWeight="bold" color="brand.700">${item.price.toFixed(2)}</Text>
                </VStack>
                <HStack spacing={{ base: 2, md: 4 }}>
                  <QuantitySelector 
                    value={item.quantity} 
                    onChange={(newQuantity) => updateQuantity(item.id, newQuantity)} 
                    max={item.stock} // Set max value to available stock
                  />
                  <IconButton 
                    icon={<FaTrash />} 
                    aria-label="Eliminar producto" 
                    colorScheme="red" 
                    variant="ghost"
                    onClick={() => removeFromCart(item.id)}
                  />
                </HStack>
              </Flex>
            ))}
          </VStack>

          <Box flex={1} p={6} borderWidth="1px" borderRadius="md" h="fit-content">
            <Heading as="h2" size="lg" mb={6}>Resumen</Heading>
            <Flex justify="space-between" mb={4}>
              <Text fontWeight="bold">Subtotal</Text>
              <Text fontWeight="bold">${total}</Text>
            </Flex>
            <Divider mb={4} />
            <Flex justify="space-between" mb={6}>
              <Text fontSize="xl" fontWeight="extrabold">Total</Text>
              <Text fontSize="xl" fontWeight="extrabold">${total}</Text>
            </Flex>
            <VStack spacing={4}>
              <NextLink href="/checkout" passHref>
                <Button as="a" colorScheme="red" size="lg" w="full" isDisabled={cartItems.length === 0}>
                  Ir a Pagar
                </Button>
              </NextLink>
              <Button variant="outline" w="full" onClick={handleClearCart}>Vaciar Carrito</Button>
            </VStack>
          </Box>
        </Flex>
      )}
    </Layout>
  );
}
