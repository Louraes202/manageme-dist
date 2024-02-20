// MainScreen.js
import React from 'react';
import { View, Text, Image, StatusBar } from 'react-native';
import styles from '../styles/styles'; // Importar estilos globais

const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../img/mylogo.png')} style={styles.mainlogo} />
      <Text style={styles.maintext}>Welcome to Manage Me!</Text>
      <StatusBar style="auto" />

    </View>
  );
};

export default StartScreen;