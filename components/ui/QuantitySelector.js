import { HStack, IconButton, Text } from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

const QuantitySelector = ({ value, onChange, min = 1, max = 99 }) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <HStack spacing={2}>
      <IconButton
        icon={<MinusIcon boxSize={3} />}
        size="sm"
        aria-label="Restar cantidad"
        onClick={handleDecrement}
        isDisabled={value <= min}
      />
      <Text fontWeight="bold" fontSize="md" w="30px" textAlign="center">
        {value}
      </Text>
      <IconButton
        icon={<AddIcon boxSize={3} />}
        size="sm"
        aria-label="Añadir cantidad"
        onClick={handleIncrement}
        isDisabled={value >= max}
      />
    </HStack>
  );
};

export default QuantitySelector;
