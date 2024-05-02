import React, { useState, useEffect } from "react";
import { ScrollView, Text } from "react-native";
import {
  Button,
  VStack,
  FormControl,
  Input,
  IconButton,
  Icon,
  HStack,
  Select,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("manageme");

const AddActivity = ({ navigation }) => {
  const [nomeAtividade, setNomeAtividade] = useState("");
  const [descricaoAtividade, setDescricaoAtividade] = useState("");
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

  useEffect(() => {
    // Carregar os grupos para o dropdown
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Grupos;",
        [],
        (tx, results) => {
          const loadedGroups = [];
          for (let i = 0; i < results.rows.length; i++) {
            loadedGroups.push(results.rows.item(i));
          }
          setGroups(loadedGroups);
        },
        (tx, error) => {
          console.error("Error fetching groups:", error);
        }
      );
    });
  }, []);

  const addActivity = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Atividades (nomeAtividade, descricaoAtividade) VALUES (?, ?);`,
        [nomeAtividade, descricaoAtividade],
        (_, result) => {
          const newActivityId = result.insertId;
          if (selectedGroup) {
            tx.executeSql(
              `INSERT INTO Atividade_Grupo (idAtividade, idGrupo) VALUES (?, ?);`,
              [newActivityId, selectedGroup],
              () => {
                console.log("Activity and Group association added successfully!");
                navigation.goBack();
              },
              (_, error) => {
                console.error("DB Error: " + error.message);
              }
            );
          } else {
            navigation.goBack();
          }
        },
        (_, error) => {
          console.error("DB Error: " + error.message);
        }
      );
    });
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <HStack alignItems={"center"}>
        <IconButton
          py={0}
          px={2}
          _icon={{ as: Ionicons, name: "arrow-back", color: "black" }}
          _pressed={{ backgroundColor: "green.100" }}
          onPress={() => navigation.goBack()}
        />
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>Add Activity</Text>
      </HStack>
      <VStack space={3}>
        <FormControl>
          <FormControl.Label>Name</FormControl.Label>
          <Input value={nomeAtividade} onChangeText={setNomeAtividade} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Description</FormControl.Label>
          <Input value={descricaoAtividade} onChangeText={setDescricaoAtividade} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Group</FormControl.Label>
          <Select
            selectedValue={selectedGroup}
            minWidth="200"
            placeholder="Select a Group"
            onValueChange={(itemValue) => setSelectedGroup(itemValue)}
          >
            {groups.map((group) => (
              <Select.Item
                label={group.nome}
                value={group.idGrupo}
                key={group.idGrupo}
              />
            ))}
          </Select>
        </FormControl>
        <Button onPress={addActivity} colorScheme="blue">
          Add Activity
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default AddActivity;
