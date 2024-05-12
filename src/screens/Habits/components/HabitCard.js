import React, { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  VStack,
  Box,
  HStack,
  Badge,
  Spacer,
} from "native-base";

import moment from "moment";

// Função para converter índice em nome do dia da semana
const getDayName = (index) =>
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][index];

export const getWeekDays = () => {
  const startOfWeek = moment().startOf("week");
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push({
      dayOfWeek: startOfWeek.format("ddd"), // 'Sun', 'Mon', 'Tue', etc.
      dateOfMonth: startOfWeek.date(), // 1, 2, 3, etc.
    });
    startOfWeek.add(1, "day");
  }
  return days;
};

const DayButton = ({ dayNumber, dayIndex, isSelected, onPress }) => {
  const bgColor = isSelected ? "blue.500" : "gray.200"; // Cor para botões selecionados e não selecionados
  const textColor = isSelected ? "white" : "black";

  return (
    <VStack alignItems="center" marginX={1}>
      <Text color={"black"}>{getDayName(dayIndex)}</Text>
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
  );
};

// Habits Card
const HabitCard = ({ habitName, groupName, days, onPress }) => {
  const [selectedDays, setSelectedDays] = useState(days);

  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    setWeekDays(getWeekDays());
  }, []);

  const handleDayPress = (dayIndex) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((i) => i !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  useEffect(() => {
    setSelectedDays(days);
  }, [days]);

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
            <Badge
              alignContent={"center"}
              justifyContent={"center"}
              backgroundColor={"blue.500"}
              borderRadius={20}
            >
              <Text color="white" fontWeight={"bold"}>
                {groupName}
              </Text>
            </Badge>
          </HStack>
          <HStack
            space={3}
            flex={1}
            flexDirection={"row"}
            justifyContent={"center"}
          >
            {weekDays.map((day, index) => (
              <DayButton
                key={index}
                dayNumber={day.dateOfMonth} // Número do dia no mês
                dayIndex={index} // Índice do dia na semana
                isSelected={selectedDays.includes(index)}
              />
            ))}
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
};

export default HabitCard;
