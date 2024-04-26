import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  Input,
  FormControl,  
  HStack,
  IconButton,
  Select,
  Checkbox,
  VStack,
  Spacer,
  Icon,
  ScrollView,
  Text,
  Button,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";
import * as SQLite from "expo-sqlite";
import { format } from "date-fns";

const db = SQLite.openDatabase("manageme");

const TaskDetails = ({ route, navigation, setUpdateTasks }) => {
  const { task } = route.params;
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
    <ScrollView style={styles.container}>
      <HStack alignItems={"center"}>
        <IconButton
          icon={<Icon as={Ionicons} name="arrow-back" />}
          onPress={() => navigation.goBack()}
        />
        <Text>Edit Task</Text>
      </HStack>
      <FormControl>
        <FormControl.Label>Name</FormControl.Label>
        <Input value={name} onChangeText={setName} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Description</FormControl.Label>
        <Input
          value={description}
          onChangeText={setDescription}
          multiline={true}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>Group</FormControl.Label>
        <Select selectedValue={selectedGroup} onValueChange={setSelectedGroup}>
          {groups.map((group) => (
            <Select.Item
              label={group.name}
              value={group.id.toString()}
              key={group.id}
            />
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <Checkbox isChecked={repeat} onChange={setRepeat}>
          Repeat
        </Checkbox>
      </FormControl>
      <FormControl>
        <Input
          value={format(dueDate, "dd/MM/yyyy")}
          onPressIn={() => setShowDatePicker(true)}
        />
        <DateTimePicker
          isVisible={showDatePicker}
          onConfirm={setDueDate}
          onCancel={() => setShowDatePicker(false)}
        />
      </FormControl>
      <VStack space={4} mt={5}>
        <Button title="Save Changes" onPress={updateTask} />
        <Button title="Delete Task" onPress={deleteTask} color="red" />
      </VStack>
    </ScrollView>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
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
});
