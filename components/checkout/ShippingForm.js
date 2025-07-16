import { Box, FormControl, FormLabel, Input, Heading, VStack, SimpleGrid } from '@chakra-ui/react';

const ShippingForm = ({ formData, handleInputChange }) => {
  return (
    <Box borderWidth="1px" borderRadius="md" p={6}>
      <Heading as="h2" size="lg" mb={6}>Datos de Despacho</Heading>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Nombre Completo</FormLabel>
          <Input 
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Juan Pérez" 
          />
        </FormControl>

        <SimpleGrid columns={2} spacing={4} w="100%">
          <FormControl isRequired>
            <FormLabel>RUT</FormLabel>
            <Input 
            name="rut"
            value={formData.rut}
            onChange={handleInputChange}
            placeholder="12.345.678-9" 
          />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Teléfono</FormLabel>
            <Input 
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+56 9 1234 5678" 
          />
          </FormControl>
        </SimpleGrid>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="juan.perez@example.com" 
          />
        </FormControl>

        <SimpleGrid columns={2} spacing={4} w="100%">
          <FormControl isRequired>
            <FormLabel>Región</FormLabel>
            <Input 
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              placeholder="Metropolitana" 
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Ciudad</FormLabel>
            <Input 
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Santiago" 
            />
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel>Código Postal</FormLabel>
          <Input 
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            placeholder="1234567"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Dirección</FormLabel>
          <Input 
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Av. Siempre Viva 123" 
          />
        </FormControl>

        <FormControl>
          <FormLabel>Depto / Casa / Oficina (Opcional)</FormLabel>
          <Input 
            name="address2"
            value={formData.address2}
            onChange={handleInputChange}
            placeholder="Oficina 123" 
          />
        </FormControl>
      </VStack>
    </Box>
  );
};

export default ShippingForm;
