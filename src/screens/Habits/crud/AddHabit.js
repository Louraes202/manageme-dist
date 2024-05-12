// AddHabit.js
import React, { useEffect, useState } from "react";
import { View, Button, TextInput, Alert, Pressable, Text } from "react-native";
import { Box, VStack, HStack, IconButton, FormControl, Input } from "native-base";
import moment from "moment";
import * as SQLite from "expo-sqlite";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../../styles/styles";
import { getWeekDays } from "../components/HabitCard";

const db = SQLite.openDatabase("manageme");

export const DayButton = ({ dayIndex, isSelected, onPress, dayNumber }) => {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const bgColor = isSelected ? "blue.500" : "gray.200"; // Button colors
  const textColor = isSelected ? "white" : "black";

  return (
    <Pressable onPress={() => onPress(dayIndex)}>
      <VStack alignItems="center" marginX={1}>
        <Text style={{marginTop: 15}}>{dayNames[dayIndex]}</Text>
        <Box
          backgroundColor={bgColor}
          borderRadius="full"
          width={8}
          height={8}
          alignItems="center"
          justifyContent="center"
        >
          <Text style={{color: textColor, fontWeight: 'bold'}}>
            {dayNumber+1}
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

  const { updateHabits, setUpdateHabits } = useGlobalContext();

  const [weekDays, setWeekDays] = useState([]);

  useEffect(() => {
    setWeekDays(getWeekDays());
  }, []);

  const toggleDaySelection = (dayIndex) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((i) => i !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const addHabit = () => {
    // Convert selected days to moment format and serialize them
    const weekDaysDB = selectedDays.join(",");

    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Habitos (nome, descricao, frequenciaSemanal, repeticaoDiaria) VALUES (?, ?, ?, ?);",
        [name, description, weekDaysDB, dailyFrequency],
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
      <HStack alignItems={"center"} space={""}>
        <IconButton
          py={0}
          px={2}
          _icon={{ as: Ionicons, name: "arrow-back", color: "black" }}
          _pressed={{ backgroundColor: "green.100" }}
          onPress={() => navigation.goBack()}
        ></IconButton>
        <Text style={styles.title_text}>Create habit</Text>
      </HStack>

      <FormControl>
        <FormControl.Label>Name</FormControl.Label>
        <Input onChangeText={setName} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Description</FormControl.Label>
        <Input onChangeText={setDescription} multiline />
      </FormControl>

      {/* Weekday Buttons */}
      <HStack space={3} justifyContent="center" mb={4}>
        {weekDays.map((day, index) => (
          <DayButton
            key={index}
            dayNumber={day.dateOfMonth} // Número do dia no mês
            dayIndex={index} // Índice do dia na semana
            isSelected={selectedDays.includes(index)}
            onPress={toggleDaySelection}
          />
        ))}
      </HStack>

      <FormControl>
        <FormControl.Label>Daily Frequency</FormControl.Label>
        <Input
          keyboardType="number-pad"
          onChangeText={(text) => setDailyFrequency(Number(text))}
        />
      </FormControl>

      <Button title="Add Habit" onPress={addHabit} />
    </View>
  );
};

export default AddHabit;
