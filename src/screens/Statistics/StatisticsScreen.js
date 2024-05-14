import { View } from "react-native";
import styles from "../../styles/styles";
import createBottomTabNavigator from "@react-navigation/bottom-tabs/src/navigators/createBottomTabNavigator";
import createNativeStackNavigator from "@react-navigation/native-stack/src/navigators/createNativeStackNavigator";
import Colors from "../../../assets/utils/pallete.json";
import { Ionicons } from "@expo/vector-icons";
import StatisticsTab from "./Tabs/StatisticsTab";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const StatisticsScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MainTabs">
    <Stack.Screen name="MainTabs" component={MainTabNavigator} />
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
          <Ionicons name="analytics-outline" color={"white"} size={24} />
        ),
      }}
    />
    <Tab.Screen
      name="IATab"
      component={View}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="robot-excited" color={"white"} size={30} />
        ),
      }}
    />
  </Tab.Navigator>
);


export default StatisticsScreen;
