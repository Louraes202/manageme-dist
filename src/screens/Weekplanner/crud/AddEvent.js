import React, { useState } from "react";
import { ScrollView, Text } from "react-native";
import { Button, VStack, FormControl, Input, IconButton, Icon, HStack } from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import * as SQLite from "expo-sqlite";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "../../../context/GlobalProvider";
import styles from "../../../styles/styles";

const db = SQLite.openDatabase("manageme");

const AddEvent = ({ navigation }) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFim, setHoraFim] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentPicker, setCurrentPicker] = useState("");
  const { setUpdateEvents } = useGlobalContext();

  const handleConfirm = (date) => {
    if (currentPicker === "inicio") {
      setHoraInicio(date);
    } else {
      setHoraFim(date);
    }
    hideDatePicker();
  };

  const showDatePicker = (picker) => {
    setCurrentPicker(picker);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const addEvent = () => {
    const start = format(horaInicio, "yyyy-MM-dd HH:mm:ss");
    const end = format(horaFim, "yyyy-MM-dd HH:mm:ss");

    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Eventos (nome, descricao, horaInicio, horaFim) VALUES (?, ?, ?, ?);`,
        [nome, descricao, start, end],
        () => {
          console.log("Event added successfully!");
          setUpdateEvents(true);
          navigation.goBack();
        },
        (t, error) => {
          console.log("DB Error: " + error.message);
        }
      );
    });
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <HStack alignItems={"center"} space={""}>
        <IconButton
          py={0}
          px={2}
          _icon={{ as: Ionicons, name: "arrow-back", color: "black" }}
          _pressed={{ backgroundColor: "green.100" }}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title_text}>Add event</Text>
      </HStack>
      <VStack space={3}>
        <FormControl>
          <FormControl.Label>Name</FormControl.Label>
          <Input value={nome} onChangeText={setNome} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Description</FormControl.Label>
          <Input value={descricao} onChangeText={setDescricao} />
        </FormControl>
        <Button
          onPress={() => showDatePicker("inicio")}
          leftIcon={<Icon as={FontAwesome6} name="clock" size="sm" />}
        >
          Start Time
        </Button>
        <Text>{format(horaInicio, "yyyy-MM-dd HH:mm:ss")}</Text>
        <Button
          onPress={() => showDatePicker("fim")}
          leftIcon={<Icon as={FontAwesome6} name="clock" size="sm" />}
        >
          End Time
        </Button>
        <Text>{format(horaFim, "yyyy-MM-dd HH:mm:ss")}</Text>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <Button onPress={addEvent} colorScheme="blue">
          Add Event
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default AddEvent;
