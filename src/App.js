import React, { useEffect, useCallback, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';

const LoadingScreen = ({ styles }) => (
  <View style={styles.container}>
    <Image source={require('../img/mylogo.png')} style={styles.mainlogo}/>
    <Text style={styles.maintext}>Loading...</Text>
  </View>
);

const MainScreen = ({ styles, navigation }) => (
  <View style={{ flex: 1 }}>
    <View style={styles.container}>
      <Image source={require('../img/mylogo.png')} style={styles.mainlogo}/>
      <Text style={styles.maintext}>Welcome to Manage Me!</Text>
      <StatusBar style="auto" />
    </View>
  </View>
);

const Home = ({styles, navigation}) => {
  return ( 
    <View>
      <Text>Home!</Text>
    </View>
   );
}
 

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

  return ( 

    <NavigationContainer>
      {/*<MainScreen styles={styles} />*/}
      <Drawer.Navigator initialRouteName="MainScreen" screenOptions={{drawerStyle: {backgroundColor: '#c6cbef'}, headerStyle: {backgroundColor: '#c6cbef'}} }>
        <Drawer.Screen name="MainScreen">
          {() => <MainScreen styles={styles} />}
        </Drawer.Screen>        
        <Drawer.Screen name="Home">
          {() => <Home styles={styles} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>

  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c73ff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  maintext: {
    fontFamily: 'Kode Mono',
    fontSize: 24,
    color: '#ffffff',
  },

  mainlogo: {
    width: width * 0.5, 
    height: height * 0.2, 
    marginBottom: 30,
  },
});

export default App;
