import React, { useState, useEffect } from "react";
import { Alert, ScrollView, StyleSheet, View, Text } from "react-native";
import {
  Input,
  FormControl,
  HStack,
  IconButton,
  Select,
  Checkbox,
  VStack,
  Modal,
  Button,
  Icon,
  Spacer,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";
import * as SQLite from "expo-sqlite";
import { format } from "date-fns";
// import { Calendar } from "react-native-calendars";

const db = SQLite.openDatabase("manageme");

const TaskDetails = ({ route, navigation, setUpdateTasks }) => {
  const { task } = route.params;
  const [name, setName] = useState(task.nome);
  const [description, setDescription] = useState(task.descricao);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(task.idGrupo);
  const [repeat, setRepeat] = useState(task.repetir === 1);
  const [dueDate, setDueDate] = useState(new Date(task.dataConclusao));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedDates, setSelectedDates] = useState({});

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Grupos;",
        [],
        (_, { rows }) => setGroups(rows._array),
        (_, error) => console.error("Error fetching groups:", error)
      );
    });
  };

  const updateTask = () => {
    const formattedDueDate = format(dueDate, "yyyy-MM-dd");
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Tarefas SET nome = ?, descricao = ?, idGrupo = ?, repetir = ?, dataConclusao = ? WHERE idTarefa = ?;",
        [name, description, selectedGroup, repeat ? 1 : 0, formattedDueDate, task.idTarefa],
        () => {
          Alert.alert("Success", "Task updated successfully");
          setUpdateTasks(true);
          navigation.goBack();
        },
        (_, error) => console.error("Error updating task:", error)
      );
    });
  };

  const deleteTask = () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => {
        db.transaction((tx) => {
          tx.executeSql(
            "DELETE FROM Tarefas WHERE idTarefa = ?;",
            [task.idTarefa],
            () => {
              Alert.alert("Success", "Task deleted successfully");
              setUpdateTasks(true);
              navigation.goBack();
            },
            (_, error) => console.error("Error deleting task:", error)
          );
        });
      }}
    ]);
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
      .map(date => format(new Date(date), "dd/MM/yyyy"))
      .join(", ");
    Alert.alert("Selected Dates", datesString);
    setPickerVisible(false);
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <HStack alignItems="center" space={3}>
      <IconButton
          py={0}
          px={2}
          _icon={{ as: Ionicons, name: "arrow-back", color: "black" }}
          _pressed={{ backgroundColor: "green.100" }}
          onPress={() => navigation.goBack()}
        ></IconButton>
        <Text bold>Edit Task</Text>
      </HStack>
      <FormControl>
        <FormControl.Label>Name</FormControl.Label>
        <Input value={name} onChangeText={setName} />
      </FormControl>
      <FormControl>
        <FormControl.Label>Description</FormControl.Label>
        <Input value={description} onChangeText={setDescription} multiline />
      </FormControl>
      <FormControl>
        <FormControl.Label>Group</FormControl.Label>
        <Select
          selectedValue={selectedGroup}
          onValueChange={setSelectedGroup}
          placeholder="Select group"
        >
          {groups.map(group => (
            <Select.Item label={group.nome} value={group.idGrupo} key={group.idGrupo} />
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <Checkbox isChecked={repeat} onChange={setRepeat}>
          Repeat
        </Checkbox>
      </FormControl>
      <FormControl>
        <FormControl.Label>Due Date</FormControl.Label>
        <Input
          value={format(dueDate, "dd/MM/yyyy")}
          onTouchStart={() => setShowDatePicker(true)}
          isReadOnly
        />
        <DateTimePicker
          isVisible={showDatePicker}
          mode="date"
          onConfirm={(date) => {
            setDueDate(date);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      </FormControl>
      {repeat && (
        <Button onPress={() => setPickerVisible(true)}>Select Repetition Days</Button>
      )}
      <Modal isOpen={isPickerVisible} onClose={() => setPickerVisible(false)}>
        <Calendar
          markingType="custom"
          markedDates={selectedDates}
          onDayPress={(day) => toggleDate(day.dateString)}
        />
        <Button onPress={confirmDates}>Confirm Dates</Button>
      </Modal>
      <VStack space={4} mt={5}>
        <Button onPress={updateTask}>Save Changes</Button>
        <Button colorScheme="danger" onPress={deleteTask}>Delete Task</Button>
      </VStack>
    </ScrollView>
  );
};

export default TaskDetails;
