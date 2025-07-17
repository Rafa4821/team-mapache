import {
  Box,
  Flex,
  Image,
  Text,
  Badge,
  IconButton,
  VStack,
  HStack,
  Divider,
  Heading
} from '@chakra-ui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const ProductCard = ({ product, onEdit, onDelete, supabase }) => {
  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} bg="white" boxShadow="md">
      <Flex direction={{ base: 'row', sm: 'row' }} gap={4}>
        <Image 
          src={supabase.storage.from('product-images').getPublicUrl(product.image_path).data.publicUrl} 
          alt={product.name} 
          boxSize="100px" 
          objectFit="cover"
          borderRadius="md"
        />
        <VStack align="stretch" flex="1">
          <Heading as="h3" size="md" noOfLines={2}>{product.name}</Heading>
          <Text fontSize="sm" color="gray.500">{product.category}</Text>
          <HStack justify="space-between" w="full">
            <Text fontWeight="bold" fontSize="lg" color="green.500">${product.price}</Text>
            <Badge colorScheme={product.stock > 0 ? 'green' : 'red'}>
              Stock: {product.stock}
            </Badge>
          </HStack>
        </VStack>
      </Flex>
      <Divider my={4} />
      <HStack justify="flex-end">
        <IconButton icon={<FaEdit />} aria-label="Editar" onClick={() => onEdit(product)} />
        <IconButton icon={<FaTrash />} aria-label="Eliminar" colorScheme="red" onClick={() => onDelete(product)} />
      </HStack>
    </Box>
  );
};

export default ProductCard;
