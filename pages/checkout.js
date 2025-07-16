import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Heading, VStack, Button, useToast } from '@chakra-ui/react';
import Layout from '../components/layout/Layout';
import ShippingForm from '../components/checkout/ShippingForm';
import OrderSummary from '../components/checkout/OrderSummary';
import PaymentMethods from '../components/checkout/PaymentMethods';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    rut: '',
    phone: '',
    email: '',
    region: '',
    city: '', // Añadido
    postalCode: '', // Añadido
    address: '',
    address2: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shippingDetails: formData, items: cartItems }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Algo salió mal.');
      }

      toast({
        title: '¡Pedido confirmado!',
        description: 'Hemos enviado los detalles a tu correo.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      router.push(`/gracias?orderId=${data.orderId}&token=${data.token}`);

    } catch (error) {
      toast({
        title: 'Error al crear el pedido.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Redirect if cart is empty
    if (cartItems.length === 0) {
      router.push('/');
    }
  }, [cartItems, router]);

  if (cartItems.length === 0) {
    // Render nothing or a loading spinner while redirecting
    return null;
  }

  return (
    <Layout>
      <Box maxW="container.xl" mx="auto" p={5}>
        <Heading as="h1" mb={8} textAlign="center">Finalizar Compra</Heading>
        <Flex direction={{ base: 'column', lg: 'row' }} gap={10}>
          
          {/* Columna Izquierda: Formularios */}
          <VStack flex={2} spacing={8} align="stretch">
            <ShippingForm formData={formData} handleInputChange={handleInputChange} />
            <PaymentMethods />
            <Button 
              colorScheme="red" 
              size="lg" 
              w="full" 
              onClick={handleConfirmOrder}
              isLoading={isLoading}
              loadingText="Procesando..."
            >
              Confirmar Pedido
            </Button>
          </VStack>

          {/* Columna Derecha: Resumen del Pedido */}
          <Box flex={1} position={{ lg: 'sticky' }} top="10">
            <OrderSummary />
          </Box>

        </Flex>
      </Box>
    </Layout>
  );
};

export default CheckoutPage;
