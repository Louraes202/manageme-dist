import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
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
const { width, height } = Dimensions.get('window');

const bottomTab = StyleSheet.create({
  bottomTab: {
    display: "flex",
    backgroundColor: "#CCCCFF",
    width: width * 0.8,
    height: height * 0.07,
    borderRadius: 15,

    position: "fixed",
    bottom: 0,
  }
})

const Tasks = ({ navigation }) => {
  return (
    <View style={{height: "100%", height: height}}>
      <Text style={styles.maintext}>Tasks</Text>
      
      <Text style={styles.maintext}>Tasks</Text>

      <View style={{display: "flex", alignItems: "center", width: width, height: height}}><View style={bottomTab.bottomTab}></View></View>
    </View>
  )
};

export default Tasks;
