import { Flex, FormControl, FormLabel, Select, Switch, Spacer } from '@chakra-ui/react';

const FilterBar = ({ sortOrder, setSortOrder, showInStockOnly, setShowInStockOnly }) => {
  return (
    <Flex 
      mb={8} 
      p={4} 
      bg="gray.50" 
      borderRadius="md" 
      boxShadow="sm" 
      align="center" 
      wrap="wrap" 
      gap={6}
    >
      <FormControl display="flex" alignItems="center" w={{ base: '100%', md: 'auto' }}>
        <FormLabel htmlFor="in-stock-switch" mb="0" mr={3} whiteSpace="nowrap">
          Sólo en Stock
        </FormLabel>
        <Switch 
          id="in-stock-switch" 
          isChecked={showInStockOnly} 
          onChange={(e) => setShowInStockOnly(e.target.checked)} 
          colorScheme="red"
        />
      </FormControl>

      <Spacer display={{ base: 'none', md: 'block' }} />

      <FormControl w={{ base: '100%', md: 'auto' }} minW={{ md: '250px' }}>
        <Select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          bg="white"
        >
          <option value="newest">Más Nuevos</option>
          <option value="price-asc">Precio: de Menor a Mayor</option>
          <option value="price-desc">Precio: de Mayor a Menor</option>
          <option value="name-asc">Nombre: A-Z</option>
          <option value="name-desc">Nombre: Z-A</option>
        </Select>
      </FormControl>
    </Flex>
  );
};

export default FilterBar;
