import { StatusBar } from 'expo-status-bar';
import { Dimensions } from "react-native";
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Image source={require('./img/mylogo.png')} style={styles.mainlogo}/>
      <Text style={styles.maintext}>Welcome to Manage Me!</Text>
      <StatusBar style="auto" />
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
    fontFamily: 'Montserrat',
    fontSize: 24,
  },

  mainlogo: {
    width: width * 0.5, 
    height: height * 0.2, 
    marginBottom: 30,
  },

});
