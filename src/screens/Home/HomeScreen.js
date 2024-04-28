import React from "react";
import { View, Text } from "react-native";
import styles from "../../styles/styles"; // Importar estilos globais
import * as SQLite from "expo-sqlite";

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.maintext}>Home Screen</Text>
    </View>
  );
};

export default Home;
