import React from "react";
import { useState } from "react";
import { View, Text } from "react-native";
import styles from "../../../styles/styles"; // Importar estilos globais
import {
  NativeBaseProvider,
  Container,
  Content,
  Footer,
  Button,
  Spacer,
  Center,
  Modal,
  FormControl,
  Input,


} from "native-base";

const TasksTab = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.maintext}>Tasks Screen</Text>


      {/* Footer button */}
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 5 }}>
        <Button style={{ borderRadius: 25, backgroundColor: "#22d3ee" }}>
          <Text style={{ color: "#fff", fontSize: 18 }}>Adicionar tarefa</Text>
        </Button>
      </View>
    </View>
  );
};

export default TasksTab;
