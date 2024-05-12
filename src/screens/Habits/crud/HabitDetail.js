import React, { useState, useEffect } from "react";
import { Alert, ScrollView, View, Text } from "react-native";
import {
  Input,
  FormControl,
  Checkbox,
  VStack,
  Button,
  HStack,
  IconButton,
} from "native-base";
import * as SQLite from "expo-sqlite";
import { format } from "date-fns";
import { DayButton } from "./AddHabit";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { getWeekDays } from "../components/HabitCard";
import { Ionicons } from "@expo/vector-icons";

import styles from "../../../styles/styles";

const db = SQLite.openDatabase("manageme");

const HabitDetail = ({ route, navigation }) => {
  const { habit } = route.params;
  const [name, setName] = useState(habit.nome);
  const [description, setDescription] = useState(habit.descricao);
  const [selectedDays, setSelectedDays] = useState(
    habit.frequenciaSemanal
      ? habit.frequenciaSemanal.split(",").map(Number)
      : []
  );
  const [dailyFrequency, setDailyFrequency] = useState(habit.repeticaoDiaria);
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

  const updateHabit = () => {
    const weekDaysDB = selectedDays.join(",");
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Habitos SET nome = ?, descricao = ?, frequenciaSemanal = ?, repeticaoDiaria = ? WHERE idHabito = ?;",
        [name, description, weekDaysDB, dailyFrequency, habit.idHabito],
        () => {
          Alert.alert("Success", "Habit updated successfully");
          setUpdateHabits(true);
          navigation.goBack();
        },
        (_, error) => console.error("Error updating habit:", error)
      );
    });
  };

  const deleteHabit = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this habit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            db.transaction((tx) => {
              tx.executeSql(
                "DELETE FROM Habitos WHERE idHabito = ?;",
                [habit.idHabito],
                () => {
                  Alert.alert("Success", "Habit deleted successfully");
                  setUpdateHabits(true);
                  navigation.goBack();
                },
                (_, error) => console.error("Error deleting habit:", error)
              );
            });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <HStack alignItems={"center"} space={""}>
        <IconButton
          py={0}
          px={2}
          _icon={{ as: Ionicons, name: "arrow-back", color: "black" }}
          _pressed={{ backgroundColor: "green.100" }}
          onPress={() => navigation.goBack()}
        ></IconButton>
        <Text style={styles.title_text}>Edit habit</Text>
      </HStack>

      <FormControl>
        <FormControl.Label>Name</FormControl.Label>
        <Input value={name} onChangeText={setName} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Description</FormControl.Label>
        <Input value={description} onChangeText={setDescription} multiline />
      </FormControl>

      {/* Day Buttons */}
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
          value={String(dailyFrequency)}
          keyboardType="number-pad"
          onChangeText={(text) => setDailyFrequency(Number(text))}
        />
      </FormControl>

      <VStack space={4} mt={5}>
        <Button onPress={updateHabit}>Save Changes</Button>
        <Button colorScheme="danger" onPress={deleteHabit}>
          Delete Habit
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default HabitDetail;
