import { useCallback, useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Dimensions } from "react-native";
import { StyleSheet, Text, View, Image } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Kode Mono': require('../assets/fonts/Kode_Mono/KodeMono-VariableFont_wght.ttf'),
    'Roboto': require('../assets/fonts/Roboto/Roboto-Light.ttf'),
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!

        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      // Pre-load fonts, make any API calls you need to do here

      
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={styles.container}>
        <Image source={require('../img/mylogo.png')} style={styles.mainlogo}/>
        <Text style={styles.maintext}>Loading...</Text>
      </View>
    );
  } 
  

  return (
    <View style={{flex:1}}>
      <View style={styles.container}>
        <Image source={require('.././img/mylogo.png')} style={styles.mainlogo}/>
        <Text style={styles.maintext}>Welcome to Manage Me!</Text>
        <StatusBar style="auto" />
      </View>
    </View>
    );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c73ff',
    alignItems: 'center',
    justifyContent: 'center',

  },

  maintext: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: '#ffffff',
  },

  mainlogo: {
    width: width * 0.5, 
    height: height * 0.2, 
    marginBottom: 30,
  },

});
