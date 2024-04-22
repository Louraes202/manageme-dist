import React from "react";
import { View, Text } from "react-native";
import { useState } from "react";
import WeeklyCalendar from "react-native-weekly-calendar";
import { Menu, Fab, HStack, Select, Spacer } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";

import styles from "../../styles/styles";
import { StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const Weekplanner = () => {
  const sampleEvents = [
    { start: "2020-03-23 09:00:00", duration: "00:20:00", note: "Walk my dog" },
    {
      start: "2020-03-24 14:00:00",
      duration: "01:00:00",
      note: "Doctor's appointment",
    },
    {
      start: "2020-03-25 08:00:00",
      duration: "00:30:00",
      note: "Morning exercise",
    },
    {
      start: "2020-03-25 14:00:00",
      duration: "02:00:00",
      note: "Meeting with client",
    },
    {
      start: "2020-03-25 19:00:00",
      duration: "01:00:00",
      note: "Dinner with family",
    },
    { start: "2020-03-26 09:30:00", duration: "01:00:00", note: "Schedule 1" },
    { start: "2020-03-26 11:00:00", duration: "02:00:00", note: "Schedule 2" },
    { start: "2020-03-26 15:00:00", duration: "01:30:00", note: "Schedule 3" },
    { start: "2020-03-26 18:00:00", duration: "02:00:00", note: "Schedule 4" },
    { start: "2020-03-26 22:00:00", duration: "01:00:00", note: "Schedule 5" },
  ];

  const [selectedView, setSelectedView] = useState('week');

  return (
    <View style={styles.screen}>
      <HStack justifyContent={'space-between'} alignItems={'center'}>
        <Text style={styles.title_textscreen}>Weekly view</Text>
        <Spacer />
        <Select selectedValue={selectedView} defaultValue="week" width={170} onValueChange={value => setSelectedView(value)}>
          <Select.Item label="Weekly view" value="week" />
          <Select.Item label="Month view" value="month" />
        </Select>
      </HStack>
      { selectedView === "week" ? (
      <WeeklyCalendar
        events={sampleEvents}
        themeColor={"blue"}
        style={{
          marginLeft: -10,
          marginTop: 15,
          height: 700,
          borderColor: "white",
        }}
      />
      ) : (
        <Calendar />
      )
    }
    </View>
  );
};

const planner_styles = StyleSheet.create({});

export default Weekplanner;
