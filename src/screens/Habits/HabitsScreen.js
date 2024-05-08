import { View } from "react-native";
import styles from "../../styles/styles";
import createBottomTabNavigator from "@react-navigation/bottom-tabs/src/navigators/createBottomTabNavigator";
import createNativeStackNavigator from "@react-navigation/native-stack/src/navigators/createNativeStackNavigator";
import HabitsTab from "./Tabs/HabitsTab";
import Colors from "../../../assets/utils/pallete.json";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import RoutinesTab from "./Tabs/RoutinesTab";
import AddHabit from "./crud/AddHabit";
import HabitDetail from "./crud/HabitDetail";

import moment from 'moment';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HabitsScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    <Stack.Screen name="AddHabit" component={AddHabit} />
    <Stack.Screen name="HabitDetail" component={HabitDetail} />
  </Stack.Navigator>
);

const MainTabNavigator = () => (
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
    }}
  >
    <Tab.Screen
      name="Habits"
      component={HabitsTab}
      options={{
        tabBarIcon: ({ color, size }) => (
          <FontAwesome5 name="bullseye" color={"white"} size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="Routines"
      component={RoutinesTab}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="repeat-outline" color={"white"} size={30} />
        ),
      }}
    />
  </Tab.Navigator>
);


export default HabitsScreen;
