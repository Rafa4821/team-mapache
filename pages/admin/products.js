import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import Auth from '../../components/admin/Auth';
import ProductDashboard from '../../components/admin/ProductDashboard';

export default function AdminProductsPage() {
  const { session } = useAuth();

  if (!session) {
    return <Auth />;
  }

  return (
    <AdminLayout>
      <ProductDashboard session={session} />
    </AdminLayout>
  );
}
