import React from "react";
import { View, Text } from "react-native";
import styles from "../../../styles/styles";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";
import { Box, Checkbox, Divider, HStack, Radio, VStack } from "native-base";

const HorizontalCalendar = () => {
  return <Box h={150} w={50}></Box>;
};

const HabitBox = () => {
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
      <HStack flex={1} alignItems={'center'} px={4}>
        <Checkbox aria-label="habit-do" borderRadius={20} size={20} boxSize={7} color={'blue.400'} colorScheme={'blue'}/>
      </HStack>
    </Box>
  );
};

const HabitsTab = ({ navigation }) => {
  const isFocused = useIsFocused();
  return (
    <View style={styles.screen}>
      <Text style={styles.title_textscreen}>Habits</Text>

      <HorizontalCalendar></HorizontalCalendar>

      <Divider my={3}></Divider>

      <Text style={styles.title_textscreen}>Accomplish</Text>

      <HabitBox />
    </View>
  );
};

export default HabitsTab;
