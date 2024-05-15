import React from "react";
import { useState, useEffect, useCallback } from "react";
import { GlobalProvider } from "./context/GlobalProvider";
import { useFonts } from "expo-font";
import { StyleSheet, Text, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AuthScreen from "./../src/screens/AuthScreen";
import HomeScreen from "./screens/Home/HomeScreen";
import TasksScreen from "../src/screens/Tasks/TasksScreen";
import WeekPlannerScreen from "../src/screens/Weekplanner/WeekPlannerScreen";
import styles from ".././src/styles/styles"; // Importar estilos globais
import "react-native-gesture-handler";
import * as SQLite from "expo-sqlite";
import { databaseSchema } from "./services/SQLite/databaseSchema";
import Colors from "../assets/utils/pallete.json";
import {
  NativeBaseProvider,
  extendTheme,
  IconButton,
  Center,
  Modal,
  Button,
} from "native-base";
import createTablesQuery from "./services/SQLite/createQuery";
import Icon from "react-native-vector-icons/Ionicons";
import { LogBox } from "react-native";
import HabitsScreen from "./screens/Habits/HabitsScreen";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import StatisticsScreen from "./screens/Statistics/StatisticsScreen";
import { firebase, firestore, auth } from "./services/firebaseConfig";

const theme = extendTheme({
  colors: {
    // Add new color
    primary: {
      50: "#E3F2F9",
      100: "#C5E4F3",
      200: "#A2D4EC",
      300: "#7AC1E4",
      400: "#47A9DA",
      500: "#0088CC",
      600: "#007AB8",
      700: "#006BA1",
      800: "#005885",
      900: "#003F5E",
    },
    // Redefining only one shade, rest of the color will remain same.
    amber: {
      400: "#d97706",
    },
  },
  config: {
    // Changing initialColorMode to 'dark'
    initialColorMode: "white",
  },
});

const handleLogout = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Limpar dados do SQLite
      db.transaction(
        (tx) => {
          tx.executeSql("DELETE FROM Tarefas");
          tx.executeSql("DELETE FROM Eventos");
          tx.executeSql("DELETE FROM Atividades");
          tx.executeSql("DELETE FROM Blocos");
          tx.executeSql("DELETE FROM Projetos");
          tx.executeSql("DELETE FROM Grupos");
          tx.executeSql("DELETE FROM Habitos");
        },
        (error) => {
          console.error("Erro ao limpar dados do SQLite: ", error);
        },
        () => {
          // Redirecionar para a tela de login
          navigation.navigate("Auth");
        }
      );
    })
    .catch((error) => {
      console.error("Erro ao fazer logout: ", error);
    });
};

const LoadingScreen = ({ styles }) => (
  <View style={styles.container_loading}>
    <Image source={require("../img/mylogo.png")} style={styles.mainlogo} />
    <Text style={styles.maintext_loading}>Welcome to Manage Me!</Text>
  </View>
);

const db = SQLite.openDatabase("manageme");

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const [fontsLoaded] = useFonts({
    "Kode Mono": require("../assets/fonts/Kode_Mono/static/KodeMono-Regular.ttf"),
    Roboto: require("../assets/fonts/Roboto/Roboto-Light.ttf"),
    Poppins: require("../assets/fonts/Poppins/Poppins-Light.ttf"),
    Poppins_Bold: require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    Poppins_Medium: require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
  });

  useEffect(() => {
    LogBox.ignoreAllLogs(true);
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        const queries = createTablesQuery
          .trim()
          .split(";")
          .filter((query) => query.length > 0);

        db.transaction((tx) => {
          queries.forEach((query) => {
            tx.executeSql(
              query,
              [],
              (_, result) => console.log("Tabela criada ou já existe", result),
              (_, error) => console.log("Erro ao criar tabela", error)
            );
          });

          tx.executeSql(
            // funçao para executar queries ocasionais
            "",
            [],
            (_, result) => console.log("Alterações: ", result),
            (_, error) => console.log("Erro ao efetuar alterações", error)
          );
        });

        // Espera artificial, ajuste conforme necessário
        await new Promise((resolve) => setTimeout(resolve, 2000));
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

  const VoiceModal = () => {
    return (
      <Center>
        <Modal
          isOpen={showVoiceModal}
          onClose={() => setShowVoiceModal(false)}
          _backdrop={{
            _dark: {
              bg: "coolGray.800",
            },
            bg: "warmGray.50",
          }}
        >
          <Modal.Content alignItems={"center"} alignContent={"center"}>
            <Modal.CloseButton />
            <Modal.Header>Voice Commands</Modal.Header>
            <Modal.Body>
              To do a voice command, press the microphone button and say your
              command in the following order: "'Operation' 'element' 'Name'
              'AditionalData'". Example: "Add Task Homework Group School
              ConclusionDate Tomorrow"
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowVoiceModal(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    setShowVoiceModal(false);
                  }}
                >
                  Ok
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    );
  };

  return (
    <GlobalProvider>
      <NativeBaseProvider theme={theme}>
        <NavigationContainer>
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false, drawerItemStyle: { height: 0 } }}
          />
          {showVoiceModal && <VoiceModal />}
          <Drawer.Navigator
            style={{ backgroundColor: Colors.mainbg }}
            initialRouteName="Auth"
            screenOptions={{
              sceneContainerStyle: { backgroundColor: Colors.mainbg },
              headerBackgroundContainerStyle: { backgroundColor: "#ffffff" },
              headerStyle: {
                backgroundColor: Colors.navblue,
                borderBottomColor: "transparent",
              },
              headerTintColor: "#fff",
              drawerStyle: { backgroundColor: Colors.navblue },
              drawerActiveTintColor: "#fff",
              drawerInactiveTintColor: "#fff",

              headerRight: () => (
                <IconButton
                  icon={
                    <Ionicons
                      name="mic"
                      color={"white"}
                      size={24}
                      style={{ margin: 3 }}
                    />
                  }
                  onPress={() => {
                    setShowVoiceModal(true);
                  }}
                />
              ),
            }}
          >
            <Drawer.Screen
              name="Home"
              component={HomeScreen}
              options={{
                drawerLabel: "Home",
                headerTitle: "Home",
                drawerIcon: ({ focused, color, size }) => (
                  <Icon
                    name={focused ? "home" : "home-outline"}
                    style={{ marginRight: -20 }}
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Tasks Screen"
              component={TasksScreen}
              options={{
                drawerLabel: "Tasks & Projects",
                headerTitle: "Tasks & Projects",
                drawerIcon: ({ focused, color, size }) => (
                  <Icon
                    name={
                      focused ? "checkmark-circle" : "checkmark-circle-outline"
                    }
                    style={{ marginRight: -20 }}
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Planner"
              component={WeekPlannerScreen}
              options={{
                drawerLabel: "Planner",
                headerTitle: "Planner",
                drawerIcon: ({ focused, color, size }) => (
                  <Icon
                    name={focused ? "calendar" : "calendar-outline"}
                    style={{ marginRight: -20 }}
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Habit"
              component={HabitsScreen}
              options={{
                drawerLabel: "Habit Tracker",
                headerTitle: "Habit Tracker",
                drawerIcon: ({ focused, color, size }) => (
                  <Icon
                    name={focused ? "disc" : "disc-outline"}
                    style={{ marginRight: -20 }}
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Stats"
              component={StatisticsScreen}
              options={{
                drawerLabel: "Statistics & AI",
                headerTitle: "Statistics & AI",
                drawerIcon: ({ focused, color, size }) => (
                  <Icon
                    name={focused ? "bar-chart" : "bar-chart-outline"}
                    style={{ marginRight: -20 }}
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Drawer.Screen
              name="Settings"
              component={View}
              options={{
                drawerLabel: "Settings",
                headerTitle: "Settings",
                drawerIcon: ({ focused, color, size }) => (
                  <Icon
                    name={focused ? "settings" : "settings-outline"}
                    style={{ marginRight: -20 }}
                    color={color}
                    size={size}
                  />
                ),
              }}
            />

            <Drawer.Screen
              name="Logout"
              component={() => null}
              options={{
                drawerLabel: "Logout",
                drawerIcon: ({ focused, color, size }) => (
                  <Icon
                    name={focused ? "log-out-outline" : "log-out-outline"}
                    style={{ marginRight: -20 }}
                    color={color}
                    size={size}
                  />
                ),
                drawerItemStyle: { marginTop: 400 },
              }}
              listeners={({ navigation }) => ({
                focus: () => {
                  handleLogout(navigation);
                },
              })}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </GlobalProvider>
  );
};

export default App;
