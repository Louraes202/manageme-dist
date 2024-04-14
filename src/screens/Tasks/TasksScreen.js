import React from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { Menu, Fab } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import styles from "../../styles/styles"; // Importar estilos globais
import TasksTab from "./Tabs/TasksTab";
import GroupsTab from "./Tabs/GroupsTab";
import CategoriesTab from "./Tabs/CategoriesTab";
import Colors from "../../../assets/utils/pallete.json";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
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
        backgroundColor: "blue",
        // Estilize seu FAB aqui
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

const Tasks = ({ navigation }) => {
  return (
<<<<<<< HEAD
    <Tab.Navigator
      screenOptions={{
        header: () => null,
        tabBarStyle: {
          backgroundColor: Colors.navblue,
          borderTopColor: "#0062ff",

=======
<<<<<<< HEAD
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Tab.Navigator
        screenOptions={{
          header: () => null,
          tabBarStyle: {
            backgroundColor: Colors.navblue,
            borderTopColor: "#0062ff",
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10
          },
          
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#dddddd",
          tabBarActiveBackgroundColor: Colors.activeitem,
          tabBarInactiveBackgroundColor: "transparent",
          tabBarItemStyle: {borderTopStartRadius: 10, borderTopEndRadius: 10},
          tabBarBadgeStyle: {},
        }}
      >
        <Tab.Screen
          name="Home"
          component={TasksTab}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="check" color={"white"} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Projects"
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

    </View>
=======
    <Tab.Navigator
      screenOptions={{
        header: () => null,
        tabBarStyle: {
          backgroundColor: Colors.navblue,
          borderTopColor: "#0062ff",

>>>>>>> a24e2ad (Merge branch 'testing' of https://github.com/Louraes202/manageme-dist into testing)
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
            <FontAwesome5 name="check" color={"white"} size={24} />
          ),
          tabBar
        }}
        
      />
      <Tab.Screen
        name="FAB"
        component={View} // Componente dummy, já que o FAB não abrirá uma tela
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome5 name="plus" color={"white"} size={24} />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
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
    </Tab.Navigator>
<<<<<<< HEAD
=======
>>>>>>> a6acfee2d726d61d7d3b325669c146d9fac91e13
>>>>>>> a24e2ad (Merge branch 'testing' of https://github.com/Louraes202/manageme-dist into testing)
  );
};

export default Tasks;
