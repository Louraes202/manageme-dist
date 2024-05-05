import { View } from "react-native";
import styles from "../../styles/styles";
import createBottomTabNavigator from "@react-navigation/bottom-tabs/src/navigators/createBottomTabNavigator";
import createNativeStackNavigator from "@react-navigation/native-stack/src/navigators/createNativeStackNavigator";
import HabitsTab from "./Tabs/HabitsTab";
import Colors from "../../../assets/utils/pallete.json";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import RoutinesTab from "./Tabs/RoutinesTab";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HabitsScreen = ({ navigation }) => {
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
};

export default HabitsScreen;
