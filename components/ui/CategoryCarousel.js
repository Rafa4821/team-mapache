import Slider from 'react-slick';
import { Box, Button, useBreakpointValue } from '@chakra-ui/react';

// Configuración base para el carrusel
const baseSettings = {
  dots: false,          // No mostrar puntos de navegación
  infinite: false,      // No hacer el carrusel infinito
  speed: 500,           // Velocidad de la animación en ms
  slidesToScroll: 2,    // Cuántos elementos se mueven a la vez
  arrows: true,         // Mostrar flechas de navegación
  variableWidth: true,  // Ajustar el ancho de cada slide a su contenido
};

const CategoryCarousel = ({ categories, activeCategory, onSelectCategory }) => {
  // Ajustar el número de slides visibles según el tamaño de la pantalla para que sea responsive
  const slidesToShow = useBreakpointValue({ base: 3, sm: 4, md: 6, lg: 8, xl: 10 });

  const settings = {
    ...baseSettings,
    slidesToShow: slidesToShow,
  };

  return (
    <Box width="full" className="category-carousel">
      <Slider {...settings}>
        {categories.map((category) => (
          <Box key={category} py={2} px={2}>
            <Button
              variant={activeCategory === category ? 'solid' : 'outline'}
              colorScheme={activeCategory === category ? 'red' : 'gray'}
              onClick={() => onSelectCategory(category)}
              width="max-content" // El botón se ajusta al texto
              size="sm"
            >
              {category}
            </Button>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default CategoryCarousel;
