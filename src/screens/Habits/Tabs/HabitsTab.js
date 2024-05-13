import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import styles from "../../../styles/styles";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";
import {
  Box,
  Checkbox,
  Divider,
  HStack,
  Pressable,
  Radio,
  ScrollView,
  VStack,
} from "native-base";
import CalendarStrip from "react-native-calendar-strip";
import Colors from "../../../../assets/utils/pallete.json";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import * as SQLite from "expo-sqlite";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { getDay } from "date-fns";

import moment from "moment";

const db = SQLite.openDatabase("manageme");

const fetchHabitsFromDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM HABITOS;",
        [],
        (tx, results) => {
          const habits = [];
          for (let i = 0; i < results.rows.length; i++) {
            const habit = results.rows.item(i);
            habits.push(habit);
          }
          resolve(habits);
        },
        (error) => {
          console.error("Error fetching habits from database.", error);
          reject(error);
        }
      );
    });
  });
};

export const AddHabitBox = ({ text, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <Box
        paddingX={0}
        paddingY={0}
        my={3}
        h={70}
        borderRadius={20}
        backgroundColor={"#5983FC"}
        borderColor={"blue.400"}
        borderWidth={2}
      >
        <HStack
          flex={1}
          alignItems={"center"}
          px={4}
          justifyContent={"center"}
          space={2}
        >
          <Entypo name="plus" size={28} color={"white"} />
          <Text style={{ color: "white", fontFamily: "Poppins", fontSize: 20 }}>
            {text}
          </Text>
        </HStack>
      </Box>
    </Pressable>
  );
};

const HabitBox = ({ habit, name, nCheckbox, checkboxStates, selectedDate }) => {
  const [checkedState, setCheckedState] = useState(
    checkboxStates[habit.idHabito] || Array(nCheckbox).fill(false)
  );

  useEffect(() => {
    const completions =
      checkboxStates[habit.idHabito] || Array(nCheckbox).fill(false);
    setCheckedState(completions);
  }, [checkboxStates, habit.idHabito, nCheckbox]);

  const toggleCheckbox = (index) => {
    const newState = checkedState.map((item, idx) =>
      idx === index ? !item : item
    );
    setCheckedState(newState);
    const timesCompleted = newState.filter(Boolean).length;
    markHabitAsComplete(habit.idHabito, selectedDate, timesCompleted);
  };

  const checkboxes = [];
  for (let i = 0; i < nCheckbox; i++) {
    checkboxes.push(
      <Checkbox
        key={i}
        aria-label={`habit-do-${i}`}
        borderRadius={20}
        size={20}
        boxSize={7}
        color={"blue.400"}
        colorScheme={"blue"}
        isChecked={checkedState[i]} // Estado de cada checkbox
        onChange={() => toggleCheckbox(i)} // Alternar o estado ao clicar
      />
    );
  }

  return (
    <Box
      paddingX={0}
      paddingY={0}
      my={3}
      h={70}
      borderRadius={20}
      backgroundColor={"transparent"}
      borderColor={"blue.400"}
      borderWidth={2}
    >
      <HStack flex={1} alignItems={"center"} px={4} space={2}>
        {checkedState.map((isChecked, index) => (
          <Checkbox
            key={index}
            isChecked={isChecked}
            aria-label={`habit-do-${index}`}
            borderRadius={20}
            size={20}
            boxSize={7}
            color={"blue.400"}
            colorScheme={"blue"}
            onChange={() => toggleCheckbox(index)}
          />
        ))}
        <Text style={{ fontFamily: "Poppins", fontSize: 17 }}>{name}</Text>
      </HStack>
    </Box>
  );
};

const markHabitAsComplete = (habitId, date, timesCompleted) => {
  const completionDate = moment(date).format("YYYY-MM-DD");
  db.transaction((tx) => {
    if (timesCompleted > 0) {
      // Garantindo que a cláusula ON CONFLICT esteja funcionando como esperado
      tx.executeSql(
        `INSERT INTO HabitCompletion (habitId, completionDate, timesCompleted)
         VALUES (?, ?, ?)
         ON CONFLICT(habitId, completionDate)
         DO UPDATE SET timesCompleted = ?`,
        [habitId, completionDate, timesCompleted, timesCompleted],
        () => console.log("Habit marked as completed."),
        (_, error) => console.error("Error updating habit completion: ", error)
      );
    } else {
      tx.executeSql(
        `DELETE FROM HabitCompletion WHERE habitId = ? AND completionDate = ?`,
        [habitId, completionDate],
        () => console.log("Habit completion deleted."),
        (_, error) => console.error("Error deleting habit completion: ", error)
      );
    }
  });
};

const fetchCompletionsForDate = (date, setCheckboxStates) => {
  const completionDate = moment(date).format("YYYY-MM-DD");
  db.transaction(tx => {
    tx.executeSql(
      `SELECT habitId, timesCompleted FROM HabitCompletion WHERE completionDate = ?;`,
      [completionDate],
      (_, result) => {
        console.log(result.rows);
        let newCheckedStates = {};
        for (let i = 0; i < result.rows.length; i++) {
          let row = result.rows.item(i);
          newCheckedStates[row.habitId] = Array.from(
            { length: row.timesCompleted },
            (_, index) => index < row.timesCompleted
          );
        }
        setCheckboxStates(newCheckedStates);
      },
      (_, error) => console.error("Error fetching completions: ", error)
    );
  });
};

const HabitsTab = () => {
  const { updateHabits, setUpdateHabits } = useGlobalContext();
  const [filteredHabits, setFilteredHabits] = useState([]);
  const [selectedDate, setSelectedDate] = useState([new Date(moment())]);
  const [habits, setHabits] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({});
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchHabitsFromDatabase().then(setHabits);
  }, [updateHabits]);

  useEffect(() => {
    const dayOfWeek = getDay(selectedDate); // dia da semana como número
    const filtered = habits.filter((habit) => {
      const freqSemanal = habit.frequenciaSemanal.split(",").map(Number);
      return freqSemanal.includes(dayOfWeek);
    });
    setFilteredHabits(filtered);
  }, [isFocused, selectedDate]);

  useEffect(() => {
    fetchCompletionsForDate(selectedDate, setCheckboxStates);
  }, [isFocused, selectedDate]);

  const handleCompletion = (habit) => {
    Alert.alert("Habit Completed", `${habit.nome} has been completed!`);
    // Código da função que completa o hábito
  };

  return (
    <View style={styles.screen}>
      <CalendarStrip
        scrollable
        style={{
          height: 100,
          paddingTop: 20,
          paddingBottom: 10,
          borderRadius: 25,
        }}
        calendarColor={"#5983FC"}
        calendarHeaderStyle={{ color: "white" }}
        dateNumberStyle={{ color: "white", fontSize: 20 }}
        dateNameStyle={{ color: "white" }}
        iconContainer={{ flex: 0.1 }}
        startingDate={new Date(moment())}
        onDateSelected={(date) => {
          const dateObj = new Date(date);
          setSelectedDate(dateObj);
        }}
      />
      <Divider my="3" />
      <Text style={styles.title_textscreen}>Accomplish</Text>
      <ScrollView space={4}>
        {filteredHabits.map((habit) => (
          <HabitBox
            key={habit.idHabito}
            habit={habit}
            name={habit.nome}
            nCheckbox={habit.repeticaoDiaria}
            checkboxStates={checkboxStates}
            selectedDate={selectedDate}
          />
        ))}
      </ScrollView>
      <AddHabitBox text={"Add Habit"} />
    </View>
  );
};

export default HabitsTab;
