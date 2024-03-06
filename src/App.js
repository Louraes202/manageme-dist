import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useFonts } from "expo-font";
import { StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AuthScreen from "./../src/screens/AuthScreen";
import HomeScreen from "./../src/screens/HomeScreen";
import TasksScreen from "../src/screens/Tasks/TasksScreen";
import styles from ".././src/styles/styles"; // Importar estilos globais
import "react-native-gesture-handler";
import * as SQLite from "expo-sqlite";
import { databaseSchema } from "./services/SQLite/databaseSchema";
import Colors from "../assets/utils/pallete.json";

const LoadingScreen = ({ styles }) => (
  <View style={styles.container}>
    <Image source={require("../img/mylogo.png")} style={styles.mainlogo} />
    <Text style={styles.maintext}>Welcome to Manage Me!</Text>
  </View>
);

const db = SQLite.openDatabase("manageme");

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    "Kode Mono": require("../assets/fonts/Kode_Mono/static/KodeMono-Regular.ttf"),
    Roboto: require("../assets/fonts/Roboto/Roboto-Light.ttf"),
    Poppins: require("../assets/fonts/Poppins/Poppins-Light.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await db.transactionAsync(async (tx) => {
          const result = await tx.executeSqlAsync(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='Tarefas';",
            []
          );
          console.log(result);
        }, false);

        await new Promise((resolve) => setTimeout(resolve, 0)); // alterar para 2000
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return <LoadingScreen styles={styles} />;
  }

  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();

  return (
    <NavigationContainer>
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false, drawerItemStyle: { height: 0 } }}
      />
      <Drawer.Navigator
        style={{ backgroundColor: Colors.mainbg }}
        initialRouteName="Auth"
        screenOptions={{
          sceneContainerStyle: { backgroundColor: Colors.mainbg },
          headerBackgroundContainerStyle: { backgroundColor: Colors.mainbg },
          headerStyle: {
            backgroundColor: Colors.navblue,
            borderBottomColor: "transparent",
            borderBottomRightRadius: 25,
            borderBottomLeftRadius: 25,
          },
          headerTintColor: "#fff",
          drawerStyle: { backgroundColor: Colors.navblue },
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#fff",
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} options={{}} />
        <Drawer.Screen name="Tasks" component={TasksScreen} options={{}} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
