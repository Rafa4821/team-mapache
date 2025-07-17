import { useState } from 'react';
import NextLink from 'next/link';
import { Box, Image, Text, Link, HStack, VStack, useToast, IconButton } from '@chakra-ui/react';
import { FaCartPlus } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import QuantitySelector from './QuantitySelector';

const ProductCard = ({ product }) => {
  const { id, name, description, price, imageUrl, category, stock } = product;
  const { cartItems, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();

  const handleAddToCart = () => {
    const itemInCart = cartItems.find(item => item.id === product.id);
    const currentQuantityInCart = itemInCart ? itemInCart.quantity : 0;

    if (quantity + currentQuantityInCart > product.stock) {
      toast({
        title: 'Stock insuficiente',
        description: `No puedes añadir más. Solo quedan ${product.stock - currentQuantityInCart} en stock.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    addToCart(product, quantity);
    toast({
      title: '¡Añadido!',
      description: `${quantity} x ${product.name} se ha(n) añadido al carrito.`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <VStack 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      boxShadow="md"
      _hover={{ boxShadow: 'xl', transform: 'translateY(-5px)' }}
      transition="all 0.2s ease-in-out"
      spacing={0}
      align="stretch"
      height="100%" // Ensures cards in a grid have the same height
    >
      <NextLink href={`/products/${product.id}`} passHref>
        <Link>
          <Image src={product.imageUrl} alt={product.name} height="250px" width="100%" objectFit="cover" />
        </Link>
      </NextLink>
      
      <VStack p={4} align="stretch" flex={1}>
        <NextLink href={`/products/${product.id}`} passHref>
          <Link _hover={{ textDecoration: 'none' }}>
            <Text fontWeight="bold" fontSize="xl" noOfLines={1} title={product.name}>
              {product.name}
            </Text>
          </Link>
        </NextLink>
        
        <Text fontSize="lg" color="brand.700" mt="auto" pt={2}>
          ${product.price.toFixed(2)}
        </Text>

        <HStack mt={4} justify="space-between">
          <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} />
          <IconButton
            icon={<FaCartPlus />}
            colorScheme="red"
            aria-label="Añadir al carrito"
            onClick={(e) => {
              e.preventDefault(); // Prevent link navigation if something is misconfigured
              handleAddToCart();
            }}
            isDisabled={product.stock === 0}
          />
        </HStack>
      </VStack>
    </VStack>
  );
};

export default ProductCard;
