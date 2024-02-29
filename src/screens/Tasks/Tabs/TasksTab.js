import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../../styles/styles'; // Importar estilos globais
import * as SQLite from 'expo-sqlite';


const TasksTab = () => {
    return (
      <View style={styles.screen}>
        <Text style={styles.maintext}>Tasks Screen</Text>
        <Text style={styles.maintext}></Text>
      </View>
    )
  }
 
export default TasksTab;