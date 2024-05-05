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
  VStack,
} from "native-base";
import CalendarStrip from "react-native-calendar-strip";
import Colors from "../../../../assets/utils/pallete.json";
import { FontAwesome5 } from "@expo/vector-icons";


export const AddHabitBox = ({text, onPress}) => {
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
        <HStack flex={1} alignItems={"center"} px={4} justifyContent={'center'} space={2}>
          <FontAwesome5 name="plus" size="20" color="white" />
          <Text style={{ color: "white", fontFamily: 'Poppins', fontSize: 20 }}>{text}</Text>
        </HStack>
      </Box>
    </Pressable>
  );
};

const HabitBox = ({ name, nCheckbox, checkedIndices = [] }) => {
  // Inicializa o estado das checkboxes com base nos índices marcados
  const [checkedState, setCheckedState] = useState(
    Array.from({ length: nCheckbox }, (_, i) => checkedIndices.includes(i))
  );

  // Função para alternar o estado de uma checkbox específica
  const toggleCheckbox = (index) => {
    setCheckedState((prevState) =>
      prevState.map((isChecked, i) => (i === index ? !isChecked : isChecked))
    );
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
        {checkboxes}
        <Text style={{ fontFamily: "Poppins", fontSize: 17 }}>{name}</Text>
      </HStack>
    </Box>
  );
};

const HabitsTab = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    console.log(selectedDate);
  }, [selectedDate]);

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
        onDateSelected={(date) => {setSelectedDate(date)}}
      />

      <Divider my={3}></Divider>

      <Text style={styles.title_textscreen}>Accomplish</Text>

      <HabitBox nCheckbox={3} name={'Meditate'} checkedIndices={[0]}/>
      <AddHabitBox text={'Add Habit'} />
    </View>
  );
};

export default HabitsTab;
