import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Spinner } from '@chakra-ui/react';

const withAdminAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { session, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      // If loading is finished and there's no session, redirect to the admin login page.
      if (!loading && !session) {
        router.replace('/admin');
      }
    }, [session, loading, router]);

    // While the session is loading, show a full-screen spinner.
    if (loading || !session) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" />
        </Box>
      );
    }

    // If the session exists, render the wrapped component.
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAdminAuth;
