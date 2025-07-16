import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { createSupabaseClient } from '../../lib/supabaseClient';
import { Box, Flex, Heading, Text, Button, Image, useToast } from '@chakra-ui/react';
import { useCart } from '../../context/CartContext';

export default function ProductPage({ product }) {
  const toast = useToast();
  const { addToCart } = useCart();

  if (!product) {
    return <Layout><Text>Producto no encontrado.</Text></Layout>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: '¡Añadido!',
      description: `${product.name} ha sido añadido a tu carrito.`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Layout>
      <Head>
        <title>{product.name} | team mapache</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.imageUrl} />
      </Head>
      <Flex direction={{ base: 'column', md: 'row' }} gap={10}>
        <Box flex={1}>
          <Image src={product.imageUrl} alt={product.name} borderRadius="lg" boxShadow="lg" width="100%" maxH="500px" objectFit="cover" />
        </Box>
        <Flex flex={1} direction="column" justify="center">
          <Heading as="h1" size="xl" mb={4}>{product.name}</Heading>
          <Text fontSize="2xl" color="brand.700" fontWeight="bold" mb={6}>${product.price}</Text>
          <Text fontSize="md" mb={6}>{product.description}</Text>
          {product.stock > 0 ? (
            <Button colorScheme="red" size="lg" onClick={handleAddToCart}>
              Añadir al carrito
            </Button>
          ) : (
            <Button colorScheme="red" size="lg" isDisabled>
              Agotado
            </Button>
          )}
        </Flex>
      </Flex>
    </Layout>
  );
}

export async function getStaticPaths() {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase.from('products').select('id');
  
  if (error) {
    console.error('Error fetching product ids:', error.message);
    return { paths: [], fallback: 'blocking' };
  }

  const paths = data.map(product => ({
    params: { id: product.id.toString() },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps(context) {
  const { id } = context.params;
  const supabase = createSupabaseClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    console.error(`Error fetching product ${id}:`, error);
    return { notFound: true };
  }

  const { data } = supabase
    .storage
    .from('products')
    .getPublicUrl(product.image_path);

  const productWithImage = {
    ...product,
    imageUrl: data.publicUrl,
  };

  return {
    props: {
      product: productWithImage,
    },
    revalidate: 60,
  };
}
