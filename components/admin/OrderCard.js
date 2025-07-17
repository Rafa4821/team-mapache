import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  IconButton,
  Collapse,
  useDisclosure,
  Divider,
  Heading
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

const OrderCard = ({ order, StatusUpdaterComponent }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} bg="white" boxShadow="md">
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Heading as="h3" size="sm">Pedido #{order.id}</Heading>
          <Text fontSize="sm" color="gray.500">{new Date(order.created_at).toLocaleDateString('es-CL')}</Text>
        </HStack>
        
        <Text><strong>Cliente:</strong> {order.customer_name}</Text>
        
        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="lg">Total: ${new Intl.NumberFormat('es-CL').format(order.total)}</Text>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            aria-label={'Ver detalles'}
            size="sm"
          />
        </HStack>

        <StatusUpdaterComponent orderId={order.id} currentStatus={order.status} />

      </VStack>

      <Collapse in={isOpen} animateOpacity>
        <Divider my={4} />
        <VStack align="start" spacing={2} p={2} bg="gray.50" borderRadius="md">
          <Text><strong>Email:</strong> {order.customer_email}</Text>
          <Text><strong>Teléfono:</strong> {order.customer_phone}</Text>
          <Text><strong>RUT:</strong> {order.customer_rut}</Text>
          <Text><strong>Dirección de Envío:</strong></Text>
          <Box pl={4}>
            <Text>{order.shipping_address.address}, {order.shipping_address.address2}</Text>
            <Text>{order.shipping_address.commune}, {order.shipping_address.region}</Text>
          </Box>
        </VStack>
      </Collapse>
    </Box>
  );
};

export default OrderCard;
