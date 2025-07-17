import AdminLayout from '../../components/admin/AdminLayout';
import ProductDashboard from '../../components/admin/ProductDashboard';
import withAdminAuth from '../../components/admin/withAdminAuth';

const AdminProductsPage = () => {
  return (
    <AdminLayout>
      <ProductDashboard />
    </AdminLayout>
  );
};

export default withAdminAuth(AdminProductsPage);
