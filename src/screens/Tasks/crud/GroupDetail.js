import React, { useState, useEffect } from "react";
import { View, Button, TextInput, Text } from "react-native";
import styles from "../../../styles/styles";
import * as SQLite from "expo-sqlite";
import { Input, TextArea, VStack } from "native-base";

const db = SQLite.openDatabase("manageme");

const GroupDetail = ({ route, navigation, setGroupsUpdate }) => {
  const { group } = route.params;

  const [name, setName] = useState(group.nome);
  const [description, setDescription] = useState(group.descricao);

  const handleSave = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Grupos SET nome = ?, descricao = ? WHERE idGrupo = ?;",
        [name, description, group.idGrupo],
        () => {
          console.log("Group updated:", { name, description });
          setGroupsUpdate(true);
          navigation.goBack();
        },
        (_, error) => console.log(error)
      );
    });
  };

  const handleDelete = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM Grupos WHERE idGrupo = ?;",
        [group.idGrupo],
        () => {
          console.log("Group deleted:", group.idGrupo);
          setGroupsUpdate(true);
          navigation.goBack();
        },
        (_, error) => console.log(error)
      );
    });
  };

  return (
    <View style={styles.screen}>
      <VStack space={3}>
        <Text style={styles.title_textscreen}>Edit group</Text>
        <Text>Name:</Text>
        <Input value={name} onChangeText={setName} />
        <Text>Description:</Text>
        <Input
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />
        <Button title="Save Changes" onPress={handleSave} />
        <Button title="Delete Group" onPress={handleDelete} color="red" />
      </VStack>
    </View>
  );
};

export default GroupDetail;
