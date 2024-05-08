// AddHabit.js
import React, { useState } from "react";
import { View, Button, TextInput, Alert, Pressable } from "react-native";
import { Box, Text, VStack, HStack } from "native-base";
import moment from "moment";
import * as SQLite from "expo-sqlite";
import { useGlobalContext } from "../../../context/GlobalProvider";

const db = SQLite.openDatabase("manageme");

export const DayButton = ({ dayIndex, isSelected, onPress }) => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const bgColor = isSelected ? "blue.500" : "gray.200"; // Button colors
  const textColor = isSelected ? "white" : "black";

  return (
    <Pressable onPress={() => onPress(dayIndex)}>
      <VStack alignItems="center" marginX={1}>
        <Text color={"black"}>{dayNames[dayIndex]}</Text>
        <Box
          backgroundColor={bgColor}
          borderRadius="full"
          width={8}
          height={8}
          alignItems="center"
          justifyContent="center"
        >
          <Text color={textColor} fontWeight="bold">
            {dayIndex + 1}
          </Text>
        </Box>
      </VStack>
    </Pressable>
  );
};

const AddHabit = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [dailyFrequency, setDailyFrequency] = useState(1);

  const {updateHabits, setUpdateHabits} = useGlobalContext();

  const toggleDaySelection = (dayIndex) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((i) => i !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const addHabit = () => {
    // Convert selected days to moment format and serialize them
    const weekDaysMoment = selectedDays.map((day) =>
      moment().day(day).format("dddd")
    );
    const weekDays = JSON.stringify(weekDaysMoment);

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Habitos (nome, descricao, frequenciaSemanal, repeticaoDiaria) VALUES (?, ?, ?, ?);",
        [name, description, weekDays, dailyFrequency],
        () => {
          Alert.alert("Success", "Habit added successfully");
          setUpdateHabits(true);
          navigation.goBack();
        },
        (error) => {
          Alert.alert("Error", "Failed to add habit");
          console.error(error);
        }
      );
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Habit Name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <TextInput
        placeholder="Habit Description"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      {/* Weekday Buttons */}
      <HStack space={3} justifyContent="center" mb={4}>
        {Array.from({ length: 7 }, (_, i) => (
          <DayButton
            key={i}
            dayIndex={i}
            isSelected={selectedDays.includes(i)}
            onPress={toggleDaySelection}
          />
        ))}
      </HStack>

      {/* Daily Frequency */}
      <TextInput
        placeholder="Daily Frequency"
        value={String(dailyFrequency)}
        keyboardType="number-pad"
        onChangeText={(text) => setDailyFrequency(Number(text))}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <Button title="Add Habit" onPress={addHabit} />
    </View>
  );
};

export default AddHabit;
