import React from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { Menu, Fab } from "native-base";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import styles from "../../styles/styles"; // Importar estilos globais
import TasksTab from "./Tabs/TasksTab";
import GroupsTab from "./Tabs/GroupsTab";
import CategoriesTab from "./Tabs/CategoriesTab";
import Colors from "../../../assets/utils/pallete.json";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      position: "fixed",
      bottom: -15,
      justifyContent: "center",
      alignItems: "center",
      // Estilize seu FAB aqui
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.navblue,
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

const Tasks = ({ navigation }) => {
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
        name="Tasks"
        component={TasksTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="check" color={"white"} size={24} />
          ),
  
        }}
        
      />
      <Tab.Screen
        name="AddButton"
        component={View} 
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome6 name="plus" color={"white"} size={24} />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupsTab}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="layer-group" color={"white"} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tasks;
