import { Box, Heading, Text, Image, Button, Flex, useToast, Center, Spinner } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import { createSupabaseClient } from '../../lib/supabaseClient';
import { useCart } from '../../context/CartContext';
import QuantitySelector from '../../components/ui/QuantitySelector';

const ProductDetailPage = ({ product }) => {
  const router = useRouter();
  const { addToCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();

  // Show a loading state while the page is being generated
  if (router.isFallback) {
    return (
      <Layout>
        <Center h="50vh">
          <Spinner size="xl" />
        </Center>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <Center h="50vh">
          <Heading>Producto no encontrado</Heading>
        </Center>
      </Layout>
    );
  }
  
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
    <Layout>
      <Flex direction={{ base: 'column', md: 'row' }} maxW="container.lg" mx="auto" p={8} gap={8}>
        <Box flex={1}>
          <Image src={product.imageUrl} alt={product.name} borderRadius="lg" boxShadow="xl" objectFit="cover" w="full" h="auto" />
        </Box>
        <Flex flex={1} direction="column" justify="center">
          <Heading as="h1" size="2xl" mb={4}>{product.name}</Heading>
          <Text fontSize="lg" color="gray.600" mb={6}>{product.description}</Text>
          <Text fontSize="3xl" fontWeight="bold" color="brand.700" mb={6}>${product.price.toFixed(2)}</Text>
          
          <Flex align="center" gap={4} mb={6}>
            <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} />
            <Button 
              colorScheme="red" 
              size="lg"
              onClick={handleAddToCart}
              isDisabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  const supabase = createSupabaseClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    console.error('Error fetching product:', error);
    return { notFound: true }; // This will render a 404 page
  }

  // Generate public URL for the image
  const { data: publicUrlData } = supabase
    .storage
    .from('products')
    .getPublicUrl(product.image_path);

  return {
    props: {
      product: {
        ...product,
        imageUrl: publicUrlData.publicUrl,
      },
    },
  };
}

export default ProductDetailPage;
