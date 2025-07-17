import { useState, useMemo } from 'react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/ui/ProductCard';
import CategoryCarousel from '../components/ui/CategoryCarousel';
import FilterBar from '../components/ui/FilterBar';
import { createSupabaseClient } from '../lib/supabaseClient';

export default function HomePage({ products, categories }) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'price-asc', 'price-desc'
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let processedProducts = [...products];

    // 1. Filter by Category
    if (activeCategory !== 'Todos') {
      processedProducts = processedProducts.filter(p => p.category === activeCategory);
    }

    // 2. Filter by Stock
    if (showInStockOnly) {
      processedProducts = processedProducts.filter(p => p.stock > 0);
    }

    // 3. Sort
    switch (sortOrder) {
      case 'price-asc':
        processedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        processedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        processedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        processedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        processedProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    return processedProducts;
  }, [products, activeCategory, sortOrder, showInStockOnly]);

  const displayCategories = ['Todos', ...categories];

  return (
    <Layout>
      <Heading as="h1" size="xl" mb={8} textAlign="center">
        Nuestros Tesoros Descubiertos
      </Heading>

      <Box mb={8}>
        <CategoryCarousel 
          categories={displayCategories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </Box>

      <FilterBar 
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        showInStockOnly={showInStockOnly}
        setShowInStockOnly={setShowInStockOnly}
      />

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
        {filteredAndSortedProducts.map(product => (
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
