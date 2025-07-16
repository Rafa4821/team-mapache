import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Box, Heading, Text, Button, VStack, Spinner, Alert, AlertIcon, Divider, SimpleGrid, Image } from '@chakra-ui/react';
import Layout from '../components/layout/Layout';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const OrderConfirmationPage = () => {
  const router = useRouter();
  const { clearCart } = useCart();
  const { orderId, token } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId || !token) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/get-order?orderId=${orderId}&token=${token}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'No pudimos encontrar tu pedido.');
        }
        setOrder(data);
        clearCart(); // Clear the cart only after we have the order details
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token, clearCart]);

  if (loading) {
    return (
      <Layout>
        <VStack justify="center" align="center" h="60vh">
          <Spinner size="xl" />
          <Text mt={4}>Cargando los detalles de tu pedido...</Text>
        </VStack>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box textAlign="center" py={20} px={6}>
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
          <Link href="/" passHref>
            <Button as="a" colorScheme="red" mt={6}>Volver a la Tienda</Button>
          </Link>
        </Box>
      </Layout>
    );
  }

  if (!order) {
    return null; // Should not happen if not loading and no error, but good practice
  }

  return (
    <Layout>
      <Box maxW="container.md" mx="auto" py={10} px={4}>
        <VStack spacing={4} align="center" textAlign="center">
          <Heading as="h1" size="xl">¡Gracias por tu compra!</Heading>
          <Text fontSize="lg">Tu pedido <strong>#{order.id}</strong> ha sido confirmado.</Text>
          <Text>Hemos enviado una copia de esta confirmación a <strong>{order.customer_email}</strong>.</Text>
        </VStack>

        <Divider my={8} />

        <Heading as="h2" size="lg" mb={6}>Resumen del Pedido</Heading>
        <VStack spacing={4} align="stretch" borderWidth="1px" borderRadius="md" p={4}>
          {order.items.map((item) => (
            <SimpleGrid key={item.id} columns={{ base: 1, md: 3 }} spacing={4} align="center">
              <Image src={item.products?.imageUrl} alt={item.products?.name} boxSize="80px" objectFit="cover" borderRadius="md" />
              <Box textAlign={{ base: 'center', md: 'left' }}>
                <Text fontWeight="bold">{item.products?.name}</Text>
                <Text fontSize="sm" color="gray.500">Cantidad: {item.quantity}</Text>
              </Box>
              <Text fontWeight="bold" textAlign={{ base: 'center', md: 'right' }}>
                ${(item.price * item.quantity).toLocaleString('es-CL')}
              </Text>
            </SimpleGrid>
          ))}
          <Divider />
          <SimpleGrid columns={2} spacing={1}>
            <Text>Subtotal:</Text>
            <Text textAlign="right">${order.subtotal.toLocaleString('es-CL')}</Text>
            <Text>IVA (19%):</Text>
            <Text textAlign="right">${order.tax.toLocaleString('es-CL')}</Text>
            <Text fontWeight="bold" fontSize="lg">Total:</Text>
            <Text fontWeight="bold" fontSize="lg" textAlign="right">${order.total.toLocaleString('es-CL')}</Text>
          </SimpleGrid>
        </VStack>

        <Divider my={8} />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box>
            <Heading as="h3" size="md" mb={4}>Datos del Cliente</Heading>
            <Text><strong>Nombre:</strong> {order.customer_name}</Text>
            <Text><strong>RUT:</strong> {order.customer_rut}</Text>
            <Text><strong>Email:</strong> {order.customer_email}</Text>
            <Text><strong>Teléfono:</strong> {order.customer_phone}</Text>
          </Box>
          <Box>
            <Heading as="h3" size="md" mb={4}>Dirección de Despacho</Heading>
            <Text>{order.shipping_address.address}</Text>
            {order.shipping_address.address2 && <Text>{order.shipping_address.address2}</Text>}
            <Text>{order.shipping_address.commune}, {order.shipping_address.region}</Text>
          </Box>
        </SimpleGrid>

        <Divider my={8} />

        <Box borderWidth="1px" borderRadius="md" p={6} bg="gray.50">
          <Heading as="h3" size="md" mb={4}>Instrucciones de Pago</Heading>
          <Text mb={4}>Para completar tu compra, realiza una transferencia bancaria con los siguientes datos:</Text>
          <VStack align="start">
            <Text><strong>Banco:</strong> Banco Estado</Text>
            <Text><strong>Cuenta:</strong> Cuenta Corriente 123456789</Text>
            <Text><strong>Nombre:</strong> Mi Tienda SpA</Text>
            <Text><strong>RUT:</strong> 98.765.432-1</Text>
            <Text><strong>Monto a transferir:</strong> <Text as="span" fontWeight="bold">${order.total.toLocaleString('es-CL')}</Text></Text>
          </VStack>
          <Text mt={4}>Una vez realizada la transferencia, por favor envía el comprobante a nuestro correo de contacto.</Text>
        </Box>
        
        <Box textAlign="center" mt={8}>
          <Link href="/" passHref>
            <Button as="a" colorScheme="red" variant="solid" size="lg">
              Volver a la Tienda
            </Button>
          </Link>
        </Box>

      </Box>
    </Layout>
  );
};

export default OrderConfirmationPage;

