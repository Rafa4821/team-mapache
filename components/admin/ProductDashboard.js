import { useState, useEffect } from 'react';

import { useAuth } from '../../context/AuthContext';
import ProductModal from './ProductModal';
import ProductCard from './ProductCard';
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  useToast,
  Flex,
  Image,
  Text,
  VStack
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useBreakpointValue } from '@chakra-ui/react';

export default function ProductDashboard() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { logout, supabase, session } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toast = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      toast({ title: 'Error al cargar productos', description: error.message, status: 'error', duration: 5000, isClosable: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    onOpen();
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handleDelete = async (product) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
      try {
        // 1. Delete image from storage
        const { error: storageError } = await supabase.storage.from('product-images').remove([product.image_path]);
        if (storageError) {
            // Log error but proceed, maybe the file was already deleted
            console.error("Storage Error:", storageError.message)
        }

        // 2. Delete product from database
        const { error: dbError } = await supabase.from('products').delete().eq('id', product.id);
        if (dbError) throw dbError;

        toast({ title: 'Producto eliminado', status: 'success', duration: 3000, isClosable: true });
        fetchProducts(); // Refresh list
      } catch (error) {
        toast({ title: 'Error al eliminar', description: error.message, status: 'error', duration: 5000, isClosable: true });
      }
    }
  };

  return (
    <Box>
      <Flex 
        direction={{ base: 'column', md: 'row' }} 
        justify="space-between" 
        align={{ base: 'flex-start', md: 'center' }} 
        mb={8}
        width="100%"
      >
        <Box mb={{ base: 4, md: 0 }}>
            <Heading as="h1" size="xl">Gestionar Productos</Heading>
            <Text fontSize="sm">Conectado como: {session.user.email}</Text>
        </Box>
        <Flex 
          align="center" 
          width={{ base: '100%', md: 'auto' }} 
          justify={{ base: 'space-between', md: 'flex-end' }}
          gap={4}
        >
            <Button leftIcon={<FaPlus />} colorScheme="red" onClick={handleAdd}>
                {isMobile ? null : 'Añadir Producto'}
            </Button>
            <Button onClick={logout}>Cerrar Sesión</Button>
        </Flex>
      </Flex>

      <ProductModal isOpen={isOpen} onClose={onClose} product={selectedProduct} refreshProducts={fetchProducts} />

      {isMobile ? (
        <VStack spacing={4} align="stretch">
          {loading ? (
            <Text textAlign="center">Cargando...</Text>
          ) : (
            products.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
                supabase={supabase}
              />
            ))
          )}
        </VStack>
      ) : (
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Imagen</Th>
                <Th>Nombre</Th>
                <Th>Precio</Th>
                <Th>Stock</Th>
                <Th>Categoría</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr><Td colSpan={6} textAlign="center">Cargando...</Td></Tr>
              ) : (
                products.map(product => (
                  <Tr key={product.id}>
                    <Td><Image src={supabase.storage.from('product-images').getPublicUrl(product.image_path).data.publicUrl} alt={product.name} boxSize="50px" objectFit="cover" /></Td>
                    <Td>{product.name}</Td>
                    <Td>${product.price}</Td>
                    <Td>{product.stock}</Td>
                    <Td>{product.category}</Td>
                    <Td>
                      <IconButton icon={<FaEdit />} aria-label="Editar" onClick={() => handleEdit(product)} mr={2} />
                      <IconButton icon={<FaTrash />} aria-label="Eliminar" colorScheme="red" onClick={() => handleDelete(product)} />
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      )}

    </Box>
  );
}
