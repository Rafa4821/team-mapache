import { Table, Thead, Tbody, Tr, Th, Td, Badge, Text, NumberInput, NumberInputField, Button, useToast, HStack, useBreakpointValue, VStack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import StockCard from './StockCard';

const getStatusBadge = (stock, minStock) => {
    if (stock === 0) {
        return <Badge colorScheme="red">Sin Stock</Badge>;
    }
    if (stock <= minStock) {
      return <Badge colorScheme="orange">Stock Bajo</Badge>;
    }
    return <Badge colorScheme="green">OK</Badge>;
};

const StockRow = ({ product }) => {
    const [stock, setStock] = useState(product.stock || 0);
    const [minStock, setMinStock] = useState(product.min_stock_level || 0);
    const [hasChanged, setHasChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    useEffect(() => {
        const isChanged = stock !== product.stock || minStock !== (product.min_stock_level || 0);
        setHasChanged(isChanged);
    }, [stock, minStock, product]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/update-stock', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_SECRET}`,
                },
                body: JSON.stringify({ 
                    productId: product.id, 
                    stock: stock, 
                    min_stock_level: minStock 
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Error al guardar');
            }

            toast({ title: 'Guardado', description: `${product.name} actualizado.`, status: 'success', duration: 2000, isClosable: true });
            // This is a trick to update the product prop to the new saved values
            product.stock = stock;
            product.min_stock_level = minStock;
            setHasChanged(false);
        } catch (error) {
            toast({ title: 'Error', description: error.message, status: 'error', duration: 5000, isClosable: true });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Tr key={product.id}>
            <Td>{product.name}</Td>
            <Td>
                <NumberInput size="sm" maxW={24} value={stock} onChange={(_, valueAsNumber) => setStock(isNaN(valueAsNumber) ? 0 : valueAsNumber)} min={0}>
                    <NumberInputField />
                </NumberInput>
            </Td>
            <Td>
                <NumberInput size="sm" maxW={24} value={minStock} onChange={(_, valueAsNumber) => setMinStock(isNaN(valueAsNumber) ? 0 : valueAsNumber)} min={0}>
                    <NumberInputField />
                </NumberInput>
            </Td>
            <Td>{getStatusBadge(stock, minStock)}</Td>
            <Td>
                <Button colorScheme="teal" size="sm" onClick={handleSave} isDisabled={!hasChanged || isLoading} isLoading={isLoading}>
                    Guardar
                </Button>
            </Td>
        </Tr>
    );
}

const StockControlList = ({ products }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!products || products.length === 0) {
    return <Text>No se encontraron productos.</Text>;
  }

  if (isMobile) {
    return (
      <VStack spacing={4} align="stretch">
        {products.map((product) => (
          <StockCard key={product.id} product={product} getStatusBadge={getStatusBadge} />
        ))}
      </VStack>
    );
  }

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Producto</Th>
          <Th>Stock Actual</Th>
          <Th>Nivel Mínimo</Th>
          <Th>Estado</Th>
          <Th>Acciones</Th>
        </Tr>
      </Thead>
      <Tbody>
        {products.map((product) => (
          <StockRow key={product.id} product={product} />
        ))}
      </Tbody>
    </Table>
  );
};

export default StockControlList;
