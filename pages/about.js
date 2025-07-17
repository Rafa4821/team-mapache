import { Box, Heading, Text, VStack, Flex, Image, Icon, SimpleGrid } from '@chakra-ui/react';
import { FaBinoculars, FaHeart, FaStar } from 'react-icons/fa';
import Layout from '../components/layout/Layout';

const FeatureCard = ({ icon, title, children }) => (
  <VStack spacing={4} align="center" textAlign="center" p={6} bg="gray.50" borderRadius="lg" boxShadow="md">
    <Icon as={icon} w={12} h={12} color="brand.700" />
    <Heading as="h3" size="md">{title}</Heading>
    <Text color="gray.600">{children}</Text>
  </VStack>
);

const AboutPage = () => {
  return (
    <Layout>
      <Flex 
        direction="column"
        align="center"
        justify="center"
        bgImage="url('https://images3.alphacoders.com/132/1322308.jpeg')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        bgAttachment="fixed"
        py={{ base: 20, md: 40 }}
      >
        <Box bg="rgba(0, 0, 0, 0.6)" p={10} borderRadius="xl" textAlign="center">
          <Heading as="h1" size="4xl" color="white" textShadow="2px 2px 4px rgba(0,0,0,0.5)">
            Somos Team Mapache
          </Heading>
          <Text fontSize="2xl" color="gray.200" mt={4}>
            Los exploradores de lo increíble.
          </Text>
        </Box>
      </Flex>

      <Box maxW="container.lg" mx="auto" p={{ base: 6, md: 12 }}>
        <VStack spacing={12} align="stretch">
          <Box textAlign="center">
            <Heading as="h2" size="2xl" mb={4}>Nuestra Historia</Heading>
            <Text fontSize="lg" color="gray.700">
              Todo comenzó con una simple idea: en un mundo lleno de opciones, ¿cómo encontrar las verdaderas joyas? Como los mapaches, somos curiosos por naturaleza, con un talento especial para descubrir tesoros escondidos. Así nació Team Mapache, un colectivo de expertos dedicados a buscar, probar y seleccionar solo los productos más innovadores, útiles y de alta calidad para ti.
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <FeatureCard icon={FaBinoculars} title="Curiosidad Insaciable">
              Exploramos cada rincón del mercado con un ojo crítico y un instinto infalible para encontrar lo extraordinario. No nos conformamos con lo bueno, buscamos lo genial.
            </FeatureCard>
            <FeatureCard icon={FaHeart} title="Pasión por la Calidad">
              Cada producto en nuestra tienda ha sido seleccionado y probado por nosotros. Si no lo usaríamos nosotros mismos, no lo encontrarás aquí. Es así de simple.
            </FeatureCard>
            <FeatureCard icon={FaStar} title="Compromiso Contigo">
              Nuestra mayor recompensa es tu satisfacción. Somos un equipo cercano y dedicado, siempre listos para ayudarte a encontrar exactamente lo que necesitas.
            </FeatureCard>
          </SimpleGrid>

          <Flex direction={{ base: 'column-reverse', md: 'row' }} align="center" gap={10} pt={10}>
            <Box flex={1}>
              <Heading as="h2" size="xl" mb={4}>Nuestra Misión</Heading>
              <Text fontSize="lg" color="gray.600">
                Facilitar tu vida con productos excepcionales que resuelven problemas reales, inspiran creatividad y simplemente, te hacen feliz. Queremos ser tu brújula de confianza en el vasto universo del e-commerce, guiándote siempre hacia la mejor elección.
              </Text>
            </Box>
            <Box flex={1}>
              <Image 
                src="https://aagjnwmkcudxsojjfqzm.supabase.co/storage/v1/object/sign/utils/pngwing.com.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82MDFkOTFlYS1jY2E0LTRmZTUtYjI4Yy1kNTJiOTRkYzNkZDEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1dGlscy9wbmd3aW5nLmNvbS5wbmciLCJpYXQiOjE3NTI3Njc2MzIsImV4cCI6MTc4NDMwMzYzMn0.cok8eUA1Vv69wKQZEHvtORU2n5jA5wMAz-XGkYajDcU" 
                alt="Equipo Mapache en acción"
                borderRadius="lg"
                boxShadow="xl"
              />
            </Box>
          </Flex>
        </VStack>
      </Box>
    </Layout>
  );
};

export default AboutPage;
