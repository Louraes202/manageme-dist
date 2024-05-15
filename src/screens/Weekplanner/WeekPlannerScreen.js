import React from "react";
import { View } from "react-native";
import { useState } from "react";
import WeeklyCalendar from "react-native-weekly-calendar";
import { Menu, Fab, HStack, Select, Spacer, Text } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dimensions } from "react-native";
import { Calendar } from "react-native-calendars";
import styles from "../../styles/styles";
import { StyleSheet } from "react-native";
import { CustomTabBarButton } from "../Tasks/TasksScreen";
import EventsActivitiesTab from "./Tabs/EventsActivitiesTab";
import WeekView from "./Tabs/WeekView";
import Colors from "../../../assets/utils/pallete.json";
import AddEvent from "./crud/AddEvent";
import EventDetail from "./crud/EventDetail";
import AddActivity from "./crud/AddActivity";
import ActivityDetail from "./crud/ActivityDetail";
import BlockDetail from "./crud/BlockDetail";
import AddBlock from "./crud/AddBlock";

const { width, height } = Dimensions.get("window");

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const Weekplanner = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="AddEvent" component={AddEvent} />
      <Stack.Screen name="EventDetail" component={EventDetail} />
      <Stack.Screen name="AddActivity" component={AddActivity} />
      <Stack.Screen name="ActivityDetail" component={ActivityDetail} />
      <Stack.Screen name="AddBlock" component={AddBlock} />
      <Stack.Screen name="BlockDetail" component={BlockDetail} />
    </Stack.Navigator>
  );
};


const MainTabNavigator = ({ navigation }) => {
  {
    /* Aqui vão ficar os hooks e outros dados dos respetivos ecrãs, se for preciso trocar estes dados entre eles */
  }
  {
    /* Zona de navegação */
  }
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => null,
        tabBarStyle: {
          backgroundColor: Colors.navblue,
          borderTopColor: "#0062ff",
          borderRadius: 25,
          marginBottom: 30,
          marginHorizontal: 10,
          height: 50,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#fff",
        tabBarActiveBackgroundColor: Colors.activeitem,
        tabBarInactiveBackgroundColor: "transparent",
        tabBarItemStyle: {
          height: 50,
          borderRadius: 25,
        },
        tabBarShowLabel: false,
        tabBarBadgeStyle: {},
      }}
    >
      <Tab.Screen
        name="Events and Activities"
        component={EventsActivitiesTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="event-note" color={"white"} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Weekly view"
        component={WeekView}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="calendar-week" color={"white"} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Weekplanner;
