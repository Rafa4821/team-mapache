import { useState } from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, Text, useToast } from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';

export default function Auth() {
  const { supabase } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let error;
      if (isLoginView) {
        ({ error } = await supabase.auth.signInWithPassword({ email, password }));
      } else {
        ({ error } = await supabase.auth.signUp({ email, password }));
      }

      if (error) throw error;

      toast({
        title: isLoginView ? '¡Inicio de sesión exitoso!' : '¡Registro exitoso!',
        description: isLoginView
          ? 'Bienvenido de nuevo.'
          : 'Revisa tu correo para verificar tu cuenta.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: `Error en ${isLoginView ? 'el inicio de sesión' : 'el registro'}`,
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
    <Box maxW="sm" mx="auto" mt={10}>
      <Heading as="h1" size="lg" textAlign="center" mb={6}>
        {isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta de Administrador'}
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Correo Electrónico</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
          />
        </FormControl>
        <FormControl isRequired mt={4}>
          <FormLabel>Contraseña</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </FormControl>
        <Button
          mt={4}
          colorScheme="red"
          type="submit"
          isLoading={loading}
          width="full"
        >
          {isLoginView ? 'Iniciar Sesión' : 'Registrarse'}
        </Button>
      </form>
      <Text mt={4} textAlign="center">
        {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}{
' '}
        <Button variant="link" colorScheme="red" onClick={() => setIsLoginView(!isLoginView)}>
          {isLoginView ? 'Regístrate' : 'Inicia Sesión'}
        </Button>
      </Text>
    </Box>
  );
}
