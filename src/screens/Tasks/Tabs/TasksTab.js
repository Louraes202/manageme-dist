import React from "react";
import { useState } from "react";
import { View, Text } from "react-native";
import styles from "../../../styles/styles"; // Importar estilos globais
import {
  Fab,
  Center,
  Flex,
  VStack,
  Menu,
  Box,
  HamburgerIcon,
  Pressable,
} from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "../../../../assets/utils/pallete.json";
import Task from "../components/Task";
import { ScrollView } from "react-native-gesture-handler";

const TasksTab = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.title_text}>Tasks Screen</Text>
      <ScrollView>
        <VStack py="">
          <Flex direction="column">
            <Task
              name="testa"
              desc="tesasdasdasdasdasdasdsad asdasdsd asdasdads asdasdt"
              group="test"
            ></Task>
          </Flex>
        </VStack>
      </ScrollView>

      {/* Footer button */}

      <Box>
        <Menu
          w="190"
          trigger={(triggerProps) => {
            return (
              <Fab
                accessibilityLabel="More options menu"
                {...triggerProps}
                icon={
                  <FontAwesome5
                    name="plus"
                    color={"white"}
                    size={24}
                    underlayColor={Colors.navblue}
                  />
                }
                style={{marginBottom: 50}}
              ></Fab>
            );
          }}
        >
          <Menu.Item>New task</Menu.Item>
          <Menu.Item>New group</Menu.Item>
          <Menu.Item>New category</Menu.Item>
        </Menu>
      </Box>
    </View>
  );
};

export default TasksTab;
