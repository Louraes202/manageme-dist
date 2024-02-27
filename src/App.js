import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AuthScreen from './../src/screens/AuthScreen';
import HomeScreen from './../src/screens/HomeScreen';
import TasksScreen from '../src/screens/Tasks/TasksScreen';
import styles from '.././src/styles/styles'; // Importar estilos globais
import 'react-native-gesture-handler';

const LoadingScreen = ({ styles }) => (
  <View style={styles.container}>
    <Image source={require('../img/mylogo.png')} style={styles.mainlogo}/>
    <Text style={styles.maintext}>Welcome to Manage Me!</Text>
  </View>
);

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    'Kode Mono': require('../assets/fonts/Kode_Mono/static/KodeMono-Regular.ttf'),
    'Roboto': require('../assets/fonts/Roboto/Roboto-Light.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 0)); // alterar para 2000
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

  return  (
    <NavigationContainer> {/* Meter auth dentro do drawer no fim do desenvolvimento */}
      <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false, drawerItemStyle: { height: 0 } }}/>
      
      <Drawer.Navigator initialRouteName="Auth" screenOptions={{headerStyle: {backgroundColor: '#0062ff', borderBottomColor: '#0062ff'}, headerTintColor: '#fff', drawerStyle: {backgroundColor: '#0062ff'}, drawerActiveTintColor:  '#fff', drawerInactiveTintColor: '#fff'}}>
        <Drawer.Screen name="Home" component={HomeScreen} options={{}}/>
        <Drawer.Screen name="Tasks" component={TasksScreen} options={{}}/>
      </Drawer.Navigator>
    </NavigationContainer>

  );
};

export default App;
