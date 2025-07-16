import { Box, Heading, Text, HStack, Icon } from '@chakra-ui/react';
import { FaUniversity } from 'react-icons/fa';

const PaymentMethods = () => {
  return (
    <Box borderWidth="1px" borderRadius="md" p={6}>
      <Heading as="h2" size="lg" mb={6}>Método de Pago</Heading>
      <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.50">
        <HStack>
          <Icon as={FaUniversity} w={6} h={6} color="gray.600" />
          <Text fontWeight="bold">Transferencia Bancaria Directa</Text>
        </HStack>
        <Text mt={3} ml={9} fontSize="sm" color="gray.600">
          Una vez que confirmes tu pedido, recibirás un correo electrónico con los detalles de nuestra cuenta bancaria para que puedas realizar la transferencia.
        </Text>
      </Box>
    </Box>
  );
};

export default PaymentMethods;
