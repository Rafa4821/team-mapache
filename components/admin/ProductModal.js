import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Button, Textarea, useToast, VStack, Select, NumberInput, 
  NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper
} from '@chakra-ui/react';

const BUCKET_NAME = 'products';

export default function ProductModal({ isOpen, onClose, product, refreshProducts }) {
  const { supabase } = useAuth();
  const [formState, setFormState] = useState({ name: '', price: 0, description: '', category: '', stock: 1 });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('name').order('name');
      if (!error) {
        setCategories(data.map(c => c.name));
      }
    };

    if (isOpen) {
      fetchCategories();
      if (product) {
        setFormState(product);
      } else {
        setFormState({ name: '', price: 0, description: '', category: '', stock: 1 });
      }
      setImageFile(null); // Reset file input on open
    }
  }, [product, isOpen, supabase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (value, name) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  }

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!formState.name || !formState.category) {
        toast({ title: 'Campos requeridos', description: 'Nombre y categoría son obligatorios.', status: 'error' });
        return;
    }
    if (!product && !imageFile) {
        toast({ title: 'Imagen requerida', description: 'Debes subir una imagen para un nuevo producto.', status: 'error' });
        return;
    }

    setIsLoading(true);
    try {
      let image_path = product?.image_path;

      // Handle file upload
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const newFileName = `${Date.now()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(newFileName, imageFile);

        if (uploadError) throw uploadError;

        // If updating and there was an old image, delete it
        if (product?.image_path) {
            await supabase.storage.from(BUCKET_NAME).remove([product.image_path]);
        }
        image_path = uploadData.path;
      }

      const productData = { 
          ...formState, 
          price: parseFloat(formState.price),
          stock: parseInt(formState.stock),
          image_path 
        };

      if (product) {
        // Update existing product
        const { error } = await supabase.from('products').update(productData).eq('id', product.id);
        if (error) throw error;
        toast({ title: 'Producto actualizado', status: 'success' });
      } else {
        // Add new product
        const { error } = await supabase.from('products').insert(productData);
        if (error) throw error;
        toast({ title: 'Producto añadido', status: 'success' });
      }

      refreshProducts();
      onClose();
    } catch (error) {
      toast({ title: 'Error', description: error.message, status: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <ModalHeader>{product ? 'Editar Producto' : 'Añadir Producto'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input name="name" value={formState.name} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Descripción</FormLabel>
              <Textarea name="description" value={formState.description} onChange={handleChange} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Precio</FormLabel>
              <NumberInput value={formState.price} onChange={(v) => handleNumberChange(v, 'price')} min={0} precision={2} step={0.01}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Stock</FormLabel>
               <NumberInput value={formState.stock} onChange={(v) => handleNumberChange(v, 'stock')} min={0}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Categoría</FormLabel>
              <Select name="category" placeholder="Selecciona una categoría" value={formState.category} onChange={handleChange}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </Select>
            </FormControl>

            <FormControl isRequired={!product}>
              <FormLabel>Imagen</FormLabel>
              <Input type="file" accept="image/*" onChange={handleFileChange} p={1} />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme="red" type="submit" isLoading={isLoading}>
            {product ? 'Actualizar' : 'Guardar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
