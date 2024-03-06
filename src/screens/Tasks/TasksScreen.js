import React from "react";
import { View, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import styles from "../../styles/styles"; // Importar estilos globais
import TasksTab from "./Tabs/TasksTab";
import GroupsTab from "./Tabs/GroupsTab";
import CategoriesTab from "./Tabs/CategoriesTab";
import Colors from "../../../assets/utils/pallete.json";

const Tab = createBottomTabNavigator();

const Tasks = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => null,
        tabBarStyle: {
          backgroundColor: Colors.navblue,
          borderTopColor: "#0062ff",
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#dddddd",
        tabBarActiveBackgroundColor: Colors.activeitem,
        tabBarInactiveBackgroundColor: "transparent",
        tabBarItemStyle: {borderTopStartRadius: 25, borderTopEndRadius: 25},
        tabBarBadgeStyle: {},
      }}
    >
      <Tab.Screen
        name="Tasks"
        component={TasksTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="check" color={"white"} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="layer-group" color={"white"} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="list-ol" color={"white"} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tasks;
