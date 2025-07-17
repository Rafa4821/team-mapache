import { Box, Button, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCart } from '../../context/CartContext';

const CartSummary = () => {
  const { cartItems } = useCart();
  const router = useRouter();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = () => {
    // For now, it will just redirect to a placeholder checkout page.
    // Later, this will trigger the actual payment process.
    router.push('/checkout');
  };

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="gray.50">
      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="lg">Resumen del Pedido</Heading>
        <Flex justify="space-between">
          <Text fontSize="lg">Subtotal</Text>
          <Text fontSize="lg" fontWeight="bold">${subtotal.toFixed(2)}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text fontSize="lg">Envío</Text>
          <Text fontSize="lg" fontWeight="bold">Gratis</Text>
        </Flex>
        <Flex justify="space-between" borderTopWidth="1px" pt={4} mt={2}>
          <Text fontSize="xl" fontWeight="bold">Total</Text>
          <Text fontSize="xl" fontWeight="bold" color="brand.700">${subtotal.toFixed(2)}</Text>
        </Flex>
        <Button 
          colorScheme="red" 
          size="lg" 
          w="full" 
          onClick={handleCheckout}
          isDisabled={cartItems.length === 0}
        >
          Proceder al Pago
        </Button>
      </VStack>
    </Box>
  );
};

export default CartSummary;
