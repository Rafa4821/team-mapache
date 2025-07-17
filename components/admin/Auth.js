import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';

export default function Auth() {
  const { supabase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      toast({
        title: '¡Inicio de sesión exitoso!',
        description: 'Bienvenido de nuevo.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error en el inicio de sesión',
        description: error.error_description || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={10} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading as="h1" size="lg" textAlign="center" mb={6}>
        Acceso de Administrador
      </Heading>
      <form onSubmit={handleLogin}>
        <FormControl isRequired>
          <FormLabel>Correo Electrónico</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            autoComplete="email"
          />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel>Contraseña</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </FormControl>
        <Button
          mt={6}
          colorScheme="red"
          type="submit"
          isLoading={loading}
          width="full"
          size="lg"
        >
          Iniciar Sesión
        </Button>
      </form>
    </Box>
  );
}
