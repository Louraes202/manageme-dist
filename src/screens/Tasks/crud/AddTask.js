import React, { useState, useEffect } from "react";
import { LogBox } from "react-native";
import { ScrollView, Button, View, StyleSheet, Text } from "react-native";
import {
  Input,
  FormControl,
  HStack,
  IconButton,
  Select,
  Checkbox,
  VStack,
  Modal,
  Spacer,
} from "native-base";
import DateTimePicker from "react-native-modal-datetime-picker";
import * as SQLite from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import MultipleDatePicker from "../components/MultipleDatePicker";
import { Calendar } from "react-native-calendars";

import styles from "../../../styles/styles"; // Este é o caminho correto para seus estilos globais

const db = SQLite.openDatabase("manageme");

const AddTask = ({ navigation, setUpdateTasks }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [Repeat, setRepeat] = useState(false);
  const [frequency, setFrequency] = useState("frequencia"); // Estado inicial
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [repetitionDays, setRepetitionDays] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});
  const { multiPickerVisible, setMultiPickerVisible } = useState(false);

  const addTask = () => {
    // Formatar a data de conclusão para armazenar no banco de dados
    const formattedDueDate = format(dueDate, "yyyy-MM-dd"); // Ajuste o formato conforme a sua necessidade de banco de dados

    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Tarefas (nome, descricao, idGrupo, repetir, diasRepeticao, dataConclusao, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [
          name,
          description,
          selectedGroup,
          Repeat ? 1 : 0,
          repetitionDays,
          formattedDueDate,
          new Date().toISOString(),
        ],
        (_, result) => {
          console.log("Task added:", result);
          setUpdateTasks(true);
          navigation.goBack();
        },
        (_, error) => console.error("Error adding new task:", error)
      );
    });
  };

  const showDateTimePicker = () => {
    setShowDatePicker(true);
  };

  const onDateConfirm = (selectedDate) => {
    const currentDate = selectedDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  const toggleDate = (date) => {
    const newDates = { ...selectedDates };
    if (newDates[date]) {
      delete newDates[date];
    } else {
      newDates[date] = { selected: true, selectedColor: "blue" };
    }
    setSelectedDates(newDates);
  };

  const confirmDates = () => {
    const datesString = Object.keys(selectedDates)
      .map((date) => {
        return format(new Date(date), "dd/MM/yyyy"); // formatando cada data para o formato desejado
      })
      .join(", ");
    setRepetitionDays(datesString);
    setPickerVisible(false); // Fecha o modal após confirmar
  };

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  useEffect(() => {
    // Função para carregar os grupos do banco de dados
    const loadGroups = () => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM Grupos;",
          [],
          (tx, results) => {
            const loadedGroups = [];
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              loadedGroups.push({ id: row.idGrupo, name: row.nome });
            }
            setGroups(loadedGroups);
          },
          (tx, error) => {
            console.error("Error fetching groups:", error);
          }
        );
      });
    };

    loadGroups();
  }, []);

  return (
    <ScrollView style={styles_add.container}>
      <HStack alignItems={"center"} space={""}>
        <IconButton
          py={0}
          px={2}
          _icon={{ as: Ionicons, name: "arrow-back", color: "black" }}
          _pressed={{ backgroundColor: "green.100" }}
          onPress={() => navigation.goBack()}
        ></IconButton>
        <Text style={styles.title_text}>Add task</Text>
      </HStack>
      <FormControl style={styles_add.formControl}>
        <FormControl.Label>Name</FormControl.Label>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Task Name"
          style={styles_add.input}
        />
      </FormControl>
      <FormControl style={styles_add.formControl}>
        <FormControl.Label>Description</FormControl.Label>
        <Input
          value={description}
          onChangeText={setDescription}
          placeholder="Task Description"
          multiline={true}
          style={styles_add.input}
        />
      </FormControl>

      {/* Selecionar Grupo */}
      <FormControl style={styles_add.formControl}>
        <FormControl.Label>Grupo</FormControl.Label>
        <Select
          selectedValue={selectedGroup}
          minWidth="200"
          accessibilityLabel="Choose a group"
          placeholder="Choose a group"
          _selectedItem={{
            bg: "teal.600",
          }}
          onValueChange={(itemValue) => setSelectedGroup(itemValue)}
        >
          {groups.map((group) => (
            <Select.Item
              label={group.name}
              value={group.id.toString()}
              key={group.id}
            />
          ))}
        </Select>
      </FormControl>

      {/* Checkbox Repeat */}
      <FormControl style={styles_add.formControl}>
        <HStack alignItems={"center"}>
          <FormControl.Label>Repeat</FormControl.Label>
          <Spacer />
          <Checkbox
            isChecked={Repeat}
            onChange={setRepeat}
            aria-label="repeat task"
          />
        </HStack>

        {Repeat && (
          <VStack>
            <Input
              value={repetitionDays}
              readOnly={true}
              onChangeText={setRepetitionDays}
              placeholder="Choose when to repeat your task"
              style={styles_add.input}
              onPressIn={() => setPickerVisible(true)}
            />
            <Modal animationPreset="slide" isOpen={isPickerVisible}>
              <Calendar
                markingType={"simple"}
                markedDates={selectedDates}
                onDayPress={(day) => toggleDate(day.dateString)}
              />
              <Button
                title="Confirm"
                onPress={() => {
                  confirmDates();
                }}
              />
            </Modal>
          </VStack>
        )}
      </FormControl>

      {/* End date com DateTimePicker */}
      <FormControl style={styles_add.formControl}>
        <FormControl.Label>Limit date</FormControl.Label>
        <Input
          value={format(dueDate, "dd/MM/yyyy")}
          onPressIn={showDateTimePicker}
          readOnly={true}
        />
        <DateTimePicker
          isVisible={showDatePicker}
          onConfirm={(date) => onDateConfirm(date)}
          onCancel={setShowDatePicker}
          date={dueDate}
        />
      </FormControl>

      <Button title="Add Task" onPress={addTask} color="#4C51BF" />
    </ScrollView>
  );
};

export const styles_add = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  formControl: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    paddingHorizontal: 15,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 6,
  },
});

export default AddTask;
