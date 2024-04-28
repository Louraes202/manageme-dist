import React from "react";
import { View, Text } from "react-native";
import { useState, useEffect } from "react";
import WeeklyCalendar from "../components/WeeklyCalendar/WeeklyCalendar";
import { Menu, Fab, HStack, Select, Spacer } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import * as SQLite from "expo-sqlite";
import moment from "moment/min/moment-with-locales";
import { useGlobalContext } from "../../../context/GlobalProvider";

import styles from "../../../styles/styles";
import { StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const WeekView = () => {
  const sampleEvents = [
    { start: "2020-03-23 09:00:00", duration: "00:20:00", note: "Walk my dog" },
  ];

  const [selectedView, setSelectedView] = useState("hour");


  return (
    <View style={styles.screen}>
      <HStack justifyContent={"space-between"} alignItems={"center"}>
        <Text style={styles.title_textscreen}>Weekly view</Text>
        <Spacer />
        <Select
          selectedValue={selectedView}
          width={170}
          onValueChange={(value) => setSelectedView(value)}
          accessibilityLabel="Choose view"
        >
          <Select.Item label="Hour Block View" value="hour" />
          <Select.Item label="Weekly View" value="week" />
        </Select>
      </HStack>
      <WeeklyCalendar
        viewMode={selectedView}
        themeColor={"blue"}
        style={{
          marginLeft: -10,
          marginTop: 15,
          height: 600,
          borderColor: "white",
        }}


      />
    </View>
  );
};

export default WeekView;
