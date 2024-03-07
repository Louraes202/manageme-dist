import React from "react";
import { useState } from "react";
import { View, Text } from "react-native";
import styles from "../../../styles/styles"; // Importar estilos globais
import { Fab, Center } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from '../../../../assets/utils/pallete.json';

const TasksTab = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.title_text}>Tasks Screen</Text>

      {/* Footer button */}
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 5 }}>
        <Fab
          renderInPortal={false}
          shadow={2}
          size="sm"
          icon={<FontAwesome5 name="plus" color={"white"} size={24} underlayColor={Colors.navblue}/>}
        />
      </View>
    </View>
  );
};

export default TasksTab;
