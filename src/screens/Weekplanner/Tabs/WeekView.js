import React from "react";
import { View, Text } from "react-native";
import { useState } from "react";
import WeeklyCalendar from "../components/WeeklyCalendar/WeeklyCalendar";
import { Menu, Fab, HStack, Select, Spacer } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";

import styles from "../../../styles/styles";
import { StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const WeekView = () => {
  const sampleEvents = [
    { start: "2020-03-23 09:00:00", duration: "00:20:00", note: "Walk my dog" },
  ];

  const [selectedView, setSelectedView] = useState("week");

  return (
    <View style={styles.screen}>
      <HStack justifyContent={"space-between"} alignItems={"center"}>
        <Text style={styles.title_textscreen}>Weekly view</Text>
        <Spacer />
        <Select
          selectedValue={selectedView}
          defaultValue="week"
          width={170}
          onValueChange={(value) => setSelectedView(value)}
        >
          <Select.Item label="Weekly view" value="week" />
          <Select.Item label="Month view" value="month" />
        </Select>
      </HStack>
      {selectedView === "week" ? (
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
      )}
    </View>
  );
};

export default WeekView;

