import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import styles from "../../../styles/styles";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";
import {
  Box,
  Checkbox,
  Divider,
  Flex,
  HStack,
  Pressable,
  Radio,
  ScrollView,
  Spacer,
  VStack,
} from "native-base";
import Colors from "../../../../assets/utils/pallete.json";
import { FontAwesome5 } from "@expo/vector-icons";
import { homestyles } from "../../Home/HomeScreen";
import HabitCard from "../components/HabitCard";
import { AddHabitBox } from "./HabitsTab";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("manageme");

const fetchHabitsFromDatabase = (callback) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Habitos;",
        [],
        (_, { rows: { _array } }) => {
          callback(_array);
        },
        (tx, error) => {
          console.error("Error fetching habits: ", error);
          return false;
        }
      );
    });
  };
  

const RoutineBox = ({ title, description, bgColor, titlesize }) => {
  return (
    <Box
      width={170}
      height={120}
      margin={3}
      paddingX={3}
      paddingY={3}
      backgroundColor={bgColor}
      borderColor={bgColor}
      borderWidth={1.5}
      borderRadius={25}
    >
      <Text style={(titlesize != null ? [homestyles.boxtitle1, {fontSize: titlesize}] : homestyles.boxtitle1)}>{title}</Text>
      <Spacer />
      <Text style={homestyles.boxdesc}>{description}</Text>
    </Box>
  );
};

const RoutinesTab = ({ navigation }) => {
  const isFocused = useIsFocused();

  const [habits, setHabits] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Habitos;",
        [],
        (_, { rows: { _array } }) => {
          setHabits(_array);
        },
        (error) => console.error("Error fetching habits:", error)
      );
    });
  }, []);

  return (
    <ScrollView style={[styles.screen, { padding: 0 }]}>
      <VStack space={2} mx={0}>
        <Text style={[styles.title_textscreen, { padding: 10, marginBottom: -10 }]}>Routines</Text>
        <Flex
          direction="row"
          wrap="wrap"
          justifyItems={"center"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <RoutineBox
            title={"Your routines"}
            description={"Check your routines"}
            bgColor={'cyan.200'}
          ></RoutineBox>
          <RoutineBox
            title={"Your stats"}
            description={"Check your habit stats"}
            bgColor={'fuchsia.200'}
          ></RoutineBox>
          <RoutineBox
            title={"Recomended"}
            titlesize={20}
            description={"Check recomended routines"}
            bgColor={'green.200'}
          ></RoutineBox>
          <RoutineBox
            title={"Popular"}
            description={"Check popular routines"}
            bgColor={'lightBlue.200'}
          ></RoutineBox>
        </Flex>
      </VStack>

      <View style={styles.screen}>
        <VStack>
          <Text style={styles.title_textscreen}>Habits</Text>
          {habits.map((habit) => {
            const days = habit.frequenciaSemanal ? JSON.parse(habit.frequenciaSemanal).map((day) => moment(day, "dddd").day()) : [];
            return (
              <HabitCard
                key={habit.idHabito}
                habitName={habit.nome}
                groupName={"school"} // Adjust this according to your data
                days={days}
              />
            );
          })}
          <AddHabitBox text={'Create Habit'} onPress={() => navigation.navigate('AddHabit')} />
        </VStack>
      </View>
    </ScrollView>
  );
};

export default RoutinesTab;
