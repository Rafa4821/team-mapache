import {
  Box,
  Text,
  NumberInput,
  NumberInputField,
  Button,
  useToast,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Heading
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

const StockCard = ({ product, getStatusBadge }) => {
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
    <Box borderWidth="1px" borderRadius="lg" p={4} bg="white" boxShadow="md">
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <Heading as="h3" size="md" noOfLines={2}>{product.name}</Heading>
          {getStatusBadge(stock, minStock)}
        </HStack>
        
        <HStack spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm">Stock Actual</FormLabel>
            <NumberInput value={stock} onChange={(_, valueAsNumber) => setStock(isNaN(valueAsNumber) ? 0 : valueAsNumber)} min={0}>
              <NumberInputField />
            </NumberInput>
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm">Nivel Mínimo</FormLabel>
            <NumberInput value={minStock} onChange={(_, valueAsNumber) => setMinStock(isNaN(valueAsNumber) ? 0 : valueAsNumber)} min={0}>
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </HStack>

        <Button 
          colorScheme="teal" 
          onClick={handleSave} 
          isDisabled={!hasChanged || isLoading} 
          isLoading={isLoading}
          w="full"
        >
          Guardar Cambios
        </Button>
      </VStack>
    </Box>
  );
};

export default StockCard;
