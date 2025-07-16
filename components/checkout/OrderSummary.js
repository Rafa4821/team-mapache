import { useCart } from '../../context/CartContext';
import { Box, Heading, VStack, HStack, Text, Divider, Image } from '@chakra-ui/react';

const OrderSummary = () => {
  const { cartItems } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  return (
    <Box borderWidth="1px" borderRadius="md" p={6} h="fit-content">
      <Heading as="h2" size="lg" mb={6}>Resumen del Pedido</Heading>
      <VStack spacing={4} align="stretch">
        {cartItems.map(item => (
          <HStack key={item.id} justify="space-between">
            <HStack>
              <Image src={item.imageUrl} alt={item.name} boxSize="50px" objectFit="cover" borderRadius="md" />
              <Box>
                <Text fontWeight="bold">{item.name}</Text>
                <Text fontSize="sm" color="gray.500">Cantidad: {item.quantity}</Text>
              </Box>
            </HStack>
            <Text fontWeight="medium">${(item.price * item.quantity).toFixed(2)}</Text>
          </HStack>
        ))}
      </VStack>

      <Divider my={6} />

      <VStack spacing={3} align="stretch">
        <HStack justify="space-between">
          <Text>Subtotal</Text>
          <Text fontWeight="medium">${subtotal.toFixed(2)}</Text>
        </HStack>
        <HStack justify="space-between">
          <Text>IVA (19%)</Text>
          <Text fontWeight="medium">${iva.toFixed(2)}</Text>
        </HStack>
        <HStack justify="space-between" fontSize="xl" fontWeight="bold">
          <Text>Total</Text>
          <Text>${total.toFixed(2)}</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default OrderSummary;
