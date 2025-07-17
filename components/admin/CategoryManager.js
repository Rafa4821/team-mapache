import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, Heading, Input, Button, VStack, HStack, Text, IconButton, useToast, Flex } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

export default function CategoryManager() {
  const { supabase } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      toast({ title: 'Error al cargar categorías', description: error.message, status: 'error' });
    } else {
      setCategories(data);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast({ title: 'El nombre no puede estar vacío', status: 'warning' });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('categories')
      .insert([{ name: newCategoryName.trim() }]);
    
    setLoading(false);
    if (error) {
      toast({ title: 'Error al añadir categoría', description: error.message, status: 'error' });
    } else {
      toast({ title: 'Categoría añadida', status: 'success' });
      setNewCategoryName('');
      fetchCategories(); // Refresh the list
    }
  };

  const handleDeleteCategory = async (id) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error al eliminar categoría', description: error.message, status: 'error' });
    } else {
      toast({ title: 'Categoría eliminada', status: 'success' });
      fetchCategories(); // Refresh the list
    }
  };

  return (
    <Box mt={10}>
      <Heading as="h2" size="lg" mb={6}>Gestionar Categorías</Heading>
      <VStack spacing={4} align="stretch">
        <Box as="form" onSubmit={handleAddCategory}>
          <Flex direction={{ base: 'column', sm: 'row' }} gap={4}>
            <Input 
              placeholder="Nombre de la nueva categoría" 
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button type="submit" colorScheme="red" isLoading={loading} width={{ base: '100%', sm: 'auto' }}>Añadir</Button>
          </Flex>
        </Box>
        <VStack align="stretch" borderWidth="1px" borderRadius="lg" p={4}>
          {categories.length > 0 ? (
            categories.map(category => (
              <HStack key={category.id} justify="space-between">
                <Text>{category.name}</Text>
                <IconButton 
                  icon={<DeleteIcon />} 
                  size="sm"
                  aria-label={`Eliminar ${category.name}`}
                  onClick={() => handleDeleteCategory(category.id)}
                />
              </HStack>
            ))
          ) : (
            <Text>No hay categorías.</Text>
          )}
        </VStack>
      </VStack>
    </Box>
  );
}
