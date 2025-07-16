import { Box, Heading } from '@chakra-ui/react';
import AdminLayout from '../../components/admin/AdminLayout';
import StockControlList from '../../components/admin/StockControlList';
import { createClient } from '@supabase/supabase-js';

// This should be the service role client for admin tasks
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const StockControlPage = ({ products }) => {
  return (
    <AdminLayout>
      <Box>
        <Heading as="h1" size="xl" mb={6}>
          Control de Stock
        </Heading>
        <StockControlList products={products} />
      </Box>
    </AdminLayout>
  );
};

export async function getServerSideProps(context) {
  // For this page, we fetch products directly on the server
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, name, stock, min_stock_level')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching products for stock control:', error);
    // Return empty array on error
    return { props: { products: [] } };
  }

  return {
    props: {
      products,
    },
  };
}

export default StockControlPage;
