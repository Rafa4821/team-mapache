import { useState } from 'react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/ui/ProductCard';
import CategoryCarousel from '../components/ui/CategoryCarousel';
import { createSupabaseClient } from '../lib/supabaseClient';

export default function HomePage({ products, categories }) {
  const [filter, setFilter] = useState('Todos');

  const filteredProducts = products.filter(product => 
    filter === 'Todos' || product.category === filter
  );

  const displayCategories = ['Todos', ...categories];

  return (
    <Layout>
      <Heading as="h1" size="xl" mb={8} textAlign="center">
        Nuestros Dibujos
      </Heading>

      <Box mb={8}>
        <CategoryCarousel 
          categories={displayCategories}
          activeCategory={filter}
          onSelectCategory={setFilter}
        />
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>
    </Layout>
  );
}

export async function getStaticProps() {
  const supabase = createSupabaseClient();

  // Fetch products and categories in parallel
  const [productsRes, categoriesRes] = await Promise.all([
    supabase.from('products').select('*'),
    supabase.from('categories').select('name').order('name', { ascending: true })
  ]);

  if (productsRes.error) {
    console.error('Error fetching products:', productsRes.error);
  }
  if (categoriesRes.error) {
    console.error('Error fetching categories:', categoriesRes.error);
  }

  const products = productsRes.data || [];
  const categories = categoriesRes.data || [];

  // Generate public URLs for images
  const productsWithImages = products.map(product => {
    const { data } = supabase
      .storage
      .from('products')
      .getPublicUrl(product.image_path);
    
    return {
      ...product,
      imageUrl: data.publicUrl,
    };
  });

  return {
    props: {
      products: productsWithImages,
      categories: categories.map(c => c.name), // Pass only the names
    },
    revalidate: 60, // Re-generate the page every 60 seconds
  };
};
