import { Box, Heading, Text, VStack, FormControl, FormLabel, Input, Textarea, Button, useToast, Flex, Icon, Link, HStack } from '@chakra-ui/react';
import { useState } from 'react';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Layout from '../components/layout/Layout';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Algo salió mal.');
      }

      toast({
        title: '¡Mensaje enviado!',
        description: 'Gracias por contactarnos. Te responderemos pronto.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast({
        title: 'Error al enviar.',
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
    <Layout>


      <Box maxW="container.lg" mx="auto" p={{ base: 6, md: 12 }}>
        <VStack spacing={8} textAlign="center">
          <Heading as="h1" size="3xl">Ponte en Contacto</Heading>
          <Text fontSize="xl" color="gray.600">
            ¿Tienes preguntas, sugerencias o simplemente quieres saludar? ¡Nos encantaría saber de ti!
          </Text>
        </VStack>

        <Flex direction={{ base: 'column', lg: 'row' }} gap={10} mt={12}>
          {/* Columna Izquierda: Formulario */}
          <Box flex={2} bg="white" p={8} borderRadius="lg" boxShadow="xl">
            <Heading as="h2" size="xl" mb={6}>Envíanos un Mensaje</Heading>
            <form onSubmit={handleSubmit}>
              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel>Tu Nombre</FormLabel>
                  <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Amigo Mapache" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Tu Email</FormLabel>
                  <Input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="tu.correo@ejemplo.com" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Tu Mensaje</FormLabel>
                  <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Cuéntanos en qué te podemos ayudar..." rows={6} />
                </FormControl>
                <Button type="submit" colorScheme="red" size="lg" w="full" isLoading={isLoading}>
                  Enviar Mensaje
                </Button>
              </VStack>
            </form>
          </Box>

          {/* Columna Derecha: Información de Contacto */}
          <VStack flex={1} spacing={6} align="stretch" bg="gray.50" p={8} borderRadius="lg" boxShadow="md">
            <Heading as="h3" size="lg">Información Directa</Heading>
            <HStack spacing={4}>
              <Icon as={FaEnvelope} w={6} h={6} color="brand.700" />
              <Text fontSize="lg">hola@teammapache.com</Text>
            </HStack>
            <HStack spacing={4}>
              <Icon as={FaMapMarkerAlt} w={6} h={6} color="brand.700" />
              <Text fontSize="lg">Nuestra Madriguera, Santiago, Chile</Text>
            </HStack>
            <Box h="200px" bg="gray.300" borderRadius="md" mt={4}>
              {/* Placeholder para un mapa interactivo */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.284132988126!2d-70.6482680848011!3d-33.4420999807754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a9a8d5c5b9%3A0x4d3a4b0b9f5b5f8!2sPlaza%20de%20Armas!5e0!3m2!1ses-419!2scl!4v1626894359731!5m2!1ses-419!2scl"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: 'inherit' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </Box>
          </VStack>
        </Flex>
      </Box>
    </Layout>
  );
};

export default ContactPage;
