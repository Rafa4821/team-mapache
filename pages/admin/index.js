import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Auth from '../../components/admin/Auth';
import { Box, Spinner } from '@chakra-ui/react';

// This page acts as a gatekeeper for the admin section.
export default function AdminIndexPage() {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the session is loaded and exists, redirect to the products dashboard.
    if (session) {
      router.replace('/admin/products');
    }
  }, [session, router]);

  // If there is no session, show the login component.
  if (!session) {
    return <Auth />;
  }

  // While waiting for the session to load and redirect, show a spinner.
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Spinner size="xl" />
    </Box>
  );
}
