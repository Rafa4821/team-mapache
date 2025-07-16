import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, VStack, IconButton, Collapse, useDisclosure, Select, useToast } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const StatusUpdater = ({ orderId, currentStatus }) => {
  const [status, setStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/update-order-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`,
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo actualizar el estado');
      }

      setStatus(newStatus);
      toast({
        title: 'Estado Actualizado',
        description: `El pedido #${orderId} ahora es "${newStatus}".`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select value={status} onChange={handleStatusChange} isDisabled={isLoading} size="sm">
      <option value="pending_payment">Pendiente de Pago</option>
      <option value="paid">Pagado</option>
      <option value="shipped">Enviado</option>
      <option value="completed">Completado</option>
      <option value="cancelled">Cancelado</option>
    </Select>
  );
};

const OrderRow = ({ order }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Tr>
        <Td>{order.id}</Td>
        <Td>{new Date(order.created_at).toLocaleDateString('es-CL')}</Td>
        <Td>{order.customer_name}</Td>
        <Td isNumeric>${new Intl.NumberFormat('es-CL').format(order.total)}</Td>
        <Td>
          <StatusUpdater orderId={order.id} currentStatus={order.status} />
        </Td>
        <Td>
          <IconButton
            onClick={onToggle}
            icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            aria-label={'Ver detalles'}
            size="sm"
          />
        </Td>
      </Tr>
      <Tr>
        <Td colSpan={6} p={0} border="none">
          <Collapse in={isOpen} animateOpacity>
            <Box p={4} bg="gray.50" borderBottom="1px solid" borderColor="gray.200">
              <VStack align="start" spacing={2}>
                <Text><strong>Email:</strong> {order.customer_email}</Text>
                <Text><strong>Teléfono:</strong> {order.customer_phone}</Text>
                <Text><strong>RUT:</strong> {order.customer_rut}</Text>
                <Text><strong>Dirección de Envío:</strong></Text>
                <Box pl={4}>
                  <Text>{order.shipping_address.address}, {order.shipping_address.address2}</Text>
                  <Text>{order.shipping_address.commune}, {order.shipping_address.region}</Text>
                </Box>
              </VStack>
            </Box>
          </Collapse>
        </Td>
      </Tr>
    </>
  );
};

const OrderList = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <Text>No se han encontrado pedidos.</Text>;
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID Pedido</Th>
            <Th>Fecha</Th>
            <Th>Cliente</Th>
            <Th isNumeric>Total</Th>
            <Th>Estado</Th>
            <Th>Detalles</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default OrderList;
