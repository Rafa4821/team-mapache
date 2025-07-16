import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Center, Spinner } from '@chakra-ui/react';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const { currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!currentUser) {
        router.push('/login');
      }
    }, [currentUser, router]);

    if (!currentUser) {
      return (
        <Center h="100vh">
          <Spinner size="xl" />
        </Center>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
