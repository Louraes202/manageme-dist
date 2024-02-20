import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AuthScreen from './../src/screens/AuthScreen';
import HomeScreen from './../src/screens/HomeScreen';
import StartScreen from '../src/screens/StartScreen';
import styles from '.././src/styles/styles'; // Importar estilos globais

const LoadingScreen = ({ styles }) => (
  <View style={styles.container}>
    <Image source={require('../img/mylogo.png')} style={styles.mainlogo}/>
    <Text style={styles.maintext}>Loading...</Text>
  </View>
);


const Drawer = createDrawerNavigator();

// Componente App que organiza os outros componentes
const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    'Kode Mono': require('../assets/fonts/Kode_Mono/KodeMono-VariableFont_wght.ttf'),
    'Roboto': require('../assets/fonts/Roboto/Roboto-Light.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
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

  return  (
    <AuthScreen styles={styles}/>
  );
};

export default App;
