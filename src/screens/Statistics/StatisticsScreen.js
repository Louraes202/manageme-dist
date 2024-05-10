import { View } from "react-native";
import styles from "../../styles/styles";
import createBottomTabNavigator from "@react-navigation/bottom-tabs/src/navigators/createBottomTabNavigator";
import createNativeStackNavigator from "@react-navigation/native-stack/src/navigators/createNativeStackNavigator";
import HabitsTab from "./Tabs/HabitsTab";
import Colors from "../../../assets/utils/pallete.json";
import { Ionicons } from "@expo/vector-icons";
import StatisticsTab from "./Tabs/StatisticsTab";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const StatisticsScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    <Stack.Screen name="AddHabit" component={AddHabit} />
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
      name="StatisticsTab"
      component={StatisticsTab}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="bullseye" color={"white"} size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="IATab"
      component={<></>}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="repeat-outline" color={"white"} size={30} />
        ),
      }}
    />
  </Tab.Navigator>
);


export default StatisticsScreen;
