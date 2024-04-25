import React, { useState, useEffect } from 'react';
import { ScrollView, Button, View, StyleSheet, Text } from 'react-native';
import { Input, FormControl, HStack, IconButton, Select, Checkbox, VStack } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';

import styles from "../../../styles/styles"; // Este é o caminho correto para seus estilos globais

const db = SQLite.openDatabase("manageme");

const AddTask = ({ navigation, setUpdateTasks }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [repetir, setRepetir] = useState(false);
  const [frequency, setFrequency] = useState('frequencia'); // Estado inicial
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [repetitionDays, setRepetitionDays] = useState('');
  
  const addTask = () => {
    const currentDate = new Date().toISOString();
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Tarefas (nome, descricao, createdAt) VALUES (?, ?, ?);",
        [name, description, currentDate],
        (_, result) => {
          console.log("Task added:", result);
          setUpdateTasks(true);
          navigation.goBack(); 
        },
        (_, error) => console.error("Error adding new task:", error)
      );
    });
  };

  // Função para exibir o DateTimePicker
  const showDateTimePicker = () => {
    setShowDatePicker(true);
  };

  // Função para lidar com a mudança de data
  const onDueDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  useEffect(() => {
    // Função para carregar os grupos do banco de dados
    const loadGroups = () => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM Grupos;',
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
            console.error('Error fetching groups:', error);
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
          accessibilityLabel="Selecione um Grupo"
          placeholder="Selecione um Grupo"
          _selectedItem={{
            bg: 'teal.600',
          }}
          onValueChange={(itemValue) => setSelectedGroup(itemValue)}
        >
          {groups.map((group) => (
            <Select.Item label={group.name} value={group.id.toString()} key={group.id} />
          ))}
        </Select>
      </FormControl>

      {/* Checkbox Repetir */}
      <FormControl style={styles_add.formControl}>
        <FormControl.Label>Repetir</FormControl.Label>
        <Checkbox isChecked={repetir} onChange={setRepetir}>
          Repetir
        </Checkbox>
        {repetir && (
          <VStack>
            <Select
              selectedValue={frequency}
              onValueChange={(itemValue) => setFrequency(itemValue)}
              minWidth="200"
              accessibilityLabel="Escolha a Frequência"
              placeholder="Escolha a Frequência"
              mt={2}
            >
              <Select.Item label="Frequência" value="frequencia" />
              <Select.Item label="Selecionar Dias" value="selecionarDias" />
            </Select>
            {frequency === 'selecionarDias' && (
              <Input
                value={repetitionDays}
                onChangeText={setRepetitionDays}
                placeholder="Dias de repetição"
                style={styles_add.input}
              />
            )}
          </VStack>
        )}
      </FormControl>

      {/* Data de Conclusão com DateTimePicker */}
      <FormControl style={styles_add.formControl}>
        <FormControl.Label>Data de Conclusão</FormControl.Label>
        <Button onPress={showDateTimePicker} title="Escolha a Data" />
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode={'date'}
            is24Hour={true}
            display='default'
            onChange={onDueDateChange}
          />
        )}
      </FormControl>

      <Button title="Add Task" onPress={addTask} color="#4C51BF"/>
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
    fontSize: 16,
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
