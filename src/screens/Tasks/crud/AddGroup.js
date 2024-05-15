import React, { useState } from "react";
import { View, Button, TextInput, Text } from "react-native";

import styles from "../../../styles/styles";
import * as SQLite from "expo-sqlite";
import { Input, VStack } from "native-base";

const db = SQLite.openDatabase("manageme");

const AddGroup = ({ route, navigation, setGroupsUpdate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Grupos (nome, descricao) VALUES (?, ?);",
        [name, description],
        () => {
          console.log("Group added:", { name, description });
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
        <Text style={styles.title_textscreen}>Add group</Text>
        <Text>Name:</Text>
        <Input value={name} onChangeText={setName} />
        <Text>Description:</Text>
        <Input
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />
        <Button title="Add Group" onPress={handleSave} />
      </VStack>
    </View>
  );
};

export default AddGroup;
