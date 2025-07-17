import { Box, Heading, Input, Select, HStack } from '@chakra-ui/react';
import AdminLayout from '../../components/admin/AdminLayout';
import OrderList from '../../components/admin/OrderList';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { fetchAdminOrders } from '../../lib/api/orders';

const AdminOrdersPage = ({ orders, initialSearch, initialStatus }) => {
  const router = useRouter();
  // Initialize state with values from the server
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  // This effect debounces the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      // Only trigger search if the term has actually changed from what the server rendered
      if (searchTerm !== initialSearch) {
        updateRoute({ search: searchTerm, status: statusFilter });
      }
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  
  // This effect syncs the input field if the URL changes (e.g., browser back button)
  useEffect(() => {
    setSearchTerm(initialSearch);
    setStatusFilter(initialStatus);
  }, [initialSearch, initialStatus]);


  const updateRoute = (query) => {
    const newQuery = {};
    if (query.search) newQuery.search = query.search;
    if (query.status && query.status !== 'all') newQuery.status = query.status;

    router.push({
      pathname: '/admin/orders',
      query: newQuery,
    }, undefined, { shallow: false }); // shallow: false re-runs getServerSideProps
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    updateRoute({ search: searchTerm, status: newStatus });
  };

  return (
    <AdminLayout>
      <Box>
        <Heading as="h1" size="xl" mb={6}>
          Gestión de Pedidos
        </Heading>
        
        <HStack spacing={4} mb={6}>
          <Input 
            placeholder="Buscar por nombre de cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onChange={handleStatusChange}>
            <option value="all">Todos los Estados</option>
            <option value="pending_payment">Pendiente de Pago</option>
            <option value="paid">Pagado</option>
            <option value="shipped">Enviado</option>
            <option value="completed">Completado</option>
            <option value="cancelled">Cancelado</option>
          </Select>
        </HStack>

        <OrderList orders={orders} />
      </Box>
    </AdminLayout>
  );
};

export async function getServerSideProps(context) {
  const { search = '', status = 'all' } = context.query;

  let orders = [];
  try {
    // Llamamos a la lógica directamente, eliminando la necesidad de una llamada fetch.
    // Esto es más rápido, más confiable y menos propenso a errores en Vercel.
    orders = await fetchAdminOrders({ search, status });
  } catch (error) {
    console.error('Error fetching admin orders in getServerSideProps:', error);
    // Devolvemos un array vacío para que la página no se rompa,
    // el error ya ha sido logueado en el servidor.
  }

  return {
    props: {
      orders,
      initialSearch: search,
      initialStatus: status,
    },
  };
}

export default AdminOrdersPage;
