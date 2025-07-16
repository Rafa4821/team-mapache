import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import {
  Box,
  Flex,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from '@chakra-ui/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({ title: 'Inicio de sesión exitoso', status: 'success', duration: 3000, isClosable: true });
      router.push('/admin');
    } catch (error) {
      toast({ title: 'Error al iniciar sesión', description: error.message, status: 'error', duration: 5000, isClosable: true });
    }
  };

  return (
    <Layout>
      <Flex align="center" justify="center">
        <Box w="full" maxW="md" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
          <Heading as="h1" size="lg" textAlign="center" mb={6}>Iniciar Sesión (Admin)</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" isRequired mt={4}>
              <FormLabel>Contraseña</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <Button type="submit" colorScheme="red" width="full" mt={8}>Entrar</Button>
          </form>
        </Box>
      </Flex>
    </Layout>
  );
}
