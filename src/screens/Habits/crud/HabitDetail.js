import React, { useState, useEffect } from "react";
import { Alert, ScrollView, View, Text } from "react-native";
import { Input, FormControl, Checkbox, VStack, Button, HStack } from "native-base";
import * as SQLite from "expo-sqlite";
import { format } from "date-fns";
import { DayButton } from "./AddHabit";
import { useGlobalContext } from "../../../context/GlobalProvider";

const db = SQLite.openDatabase("manageme");

const HabitDetail = ({ route, navigation }) => {
  const { habit } = route.params;
  const [name, setName] = useState(habit.nome);
  const [description, setDescription] = useState(habit.descricao);
  const [selectedDays, setSelectedDays] = useState(habit.frequenciaSemanal ? habit.frequenciaSemanal.split(',').map(Number) : []);
  const [dailyFrequency, setDailyFrequency] = useState(habit.repeticaoDiaria);
  const {updateHabits, setUpdateHabits} = useGlobalContext();


  const toggleDaySelection = (dayIndex) => {
    setSelectedDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((i) => i !== dayIndex)
        : [...prev, dayIndex]
    );
  };

  const updateHabit = () => {
    const weekDays = selectedDays.join(",");
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Habitos SET nome = ?, descricao = ?, frequenciaSemanal = ?, repeticaoDiaria = ? WHERE idHabito = ?;",
        [name, description, weekDays, dailyFrequency, habit.idHabito],
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
    Alert.alert("Confirm Delete", "Are you sure you want to delete this habit?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => {
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
      }}
    ]);
  };

  return (
    <ScrollView style={{ padding: 20 }}>
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
        {Array.from({ length: 7 }, (_, i) => (
          <DayButton
            key={i}
            dayIndex={i}
            isSelected={selectedDays.includes(i)}
            onPress={toggleDaySelection}
            readonly={true}
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
        <Button colorScheme="danger" onPress={deleteHabit}>Delete Habit</Button>
      </VStack>
    </ScrollView>
  );
};

export default HabitDetail;
