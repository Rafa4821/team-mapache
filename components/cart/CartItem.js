import { Box, Flex, Image, Text, IconButton, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaTrash } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import QuantitySelector from '../ui/QuantitySelector';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item.id, newQuantity);
  };

  return (
    <Flex 
      direction={{ base: 'column', md: 'row' }} 
      align="center" 
      justify="space-between" 
      p={4} 
      borderBottomWidth="1px"
    >
      <Flex align="center" width={{ base: '100%', md: '50%' }}>
        <Image src={item.imageUrl} alt={item.name} boxSize="100px" objectFit="cover" borderRadius="md" mr={4} />
        <Box>
          <NextLink href={`/products/${item.id}`} passHref>
            <Link fontWeight="bold" fontSize="lg">{item.name}</Link>
          </NextLink>
          <Text fontSize="sm" color="gray.500">${item.price.toFixed(2)} c/u</Text>
        </Box>
      </Flex>

      <Flex 
        align="center" 
        justify={{ base: 'space-between', md: 'flex-end' }} 
        width={{ base: '100%', md: '50%' }} 
        mt={{ base: 4, md: 0 }}
      >
        <QuantitySelector value={item.quantity} onChange={handleQuantityChange} max={item.stock} />
        <Text fontWeight="bold" mx={6} minW="80px" textAlign="center">
          ${(item.price * item.quantity).toFixed(2)}
        </Text>
        <IconButton
          icon={<FaTrash />}
          aria-label="Eliminar del carrito"
          variant="ghost"
          colorScheme="red"
          onClick={() => removeFromCart(item.id)}
        />
      </Flex>
    </Flex>
  );
};

export default CartItem;
