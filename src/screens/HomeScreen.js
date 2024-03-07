import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/styles"; // Importar estilos globais

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.maintext}>Home Screen</Text>
      {/* Conteúdo específico Home */}
    </View>
  );
};

export default Home;
