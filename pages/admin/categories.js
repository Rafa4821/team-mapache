import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import Auth from '../../components/admin/Auth';
import CategoryManager from '../../components/admin/CategoryManager';

export default function AdminCategoriesPage() {
  const { session } = useAuth();

  if (!session) {
    return <Auth />;
  }

  return (
    <AdminLayout>
      <CategoryManager />
    </AdminLayout>
  );
}
