import { Box, Heading } from '@chakra-ui/react';
import AdminLayout from '../../components/admin/AdminLayout';
import CategoryManager from '../../components/admin/CategoryManager';
import withAdminAuth from '../../components/admin/withAdminAuth';

const AdminCategoriesPage = () => {
  return (
    <AdminLayout>
      <Box>
        <Heading as="h1" size="xl" mb={6}>
          Gestionar Categorías
        </Heading>
        <CategoryManager />
      </Box>
    </AdminLayout>
  );
};

export default withAdminAuth(AdminCategoriesPage);
