import React from "react";
import { Pressable, Text, VStack, Box, HStack, Badge, Spacer } from "native-base";

// Função para converter índice em nome do dia da semana
const getDayName = (index) =>
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index];

const DayButton = ({ dayNumber, dayIndex, isSelected, onPress }) => {
  const bgColor = isSelected ? "blue.500" : "gray.200"; // Cor para botões selecionados e não selecionados
  const textColor = isSelected ? "white" : "black";

  return (
    <Pressable onPress={() => onPress(dayIndex)}>
      <VStack alignItems="center" marginX={1}>
        <Text color={"black"}>
          {getDayName(dayIndex)}
        </Text>
        <Box
          backgroundColor={bgColor}
          borderRadius="full"
          width={8}
          height={8}
          alignItems="center"
          justifyContent="center"
        >
          <Text color={textColor} fontWeight="bold">
            {dayNumber}
          </Text>
        </Box>
      </VStack>
    </Pressable>
  );
};

// Habits Card
const HabitCard = ({ habitName, groupName, days, onPress }) => {
  const [selectedDays, setSelectedDays] = React.useState(days);

  const handleDayPress = (dayIndex) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((i) => i !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  return (
    <Pressable onPress={onPress}>
      <Box
        padding={4}
        my={3}
        borderRadius={15}
        backgroundColor="white"
        borderColor="blue.300"
        borderWidth={1}
      >
        <VStack space={2}>
          <HStack>
              <Text fontSize="lg" fontWeight="bold">
                {habitName}
              </Text>
              <Spacer />
              <Badge alignContent={"center"} justifyContent={"center"} backgroundColor={'blue.500'} borderRadius={20}>
                <Text color="white" fontWeight={'bold'}>{groupName}</Text>
              </Badge>
          </HStack>
          <HStack
            space={3}
            flex={1}
            flexDirection={"row"}
            justifyContent={"center"}
          >
            {Array.from({ length: 7 }, (_, i) => (
              <DayButton
                key={i}
                dayNumber={i + 1} // número do dia do mês
                dayIndex={i} // índice do dia da semana
                isSelected={selectedDays.includes(i)}
                onPress={() => {}}
              />
            ))}
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
};

export default HabitCard;
