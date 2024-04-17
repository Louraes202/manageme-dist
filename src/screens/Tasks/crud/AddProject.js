import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Input, FormControl, HStack, IconButton } from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as SQLite from "expo-sqlite";

import styles from "../../../styles/styles"; 
import { Ionicons } from "@expo/vector-icons";

const db = SQLite.openDatabase("manageme");

const AddProject = ({ navigation, setUpdateProjects }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const addProject = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Grupos (nome, descricao, imageUri) VALUES (?, ?, ?);",
        [name, description, imageUri],
        (_, result) => {
          console.log("Project added:", result);
          setUpdateProjects(true);
          navigation.goBack(); 
        },
        (_, error) => console.error("Error adding project:", error)
      );
    });
  };

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
        <Text style={styles.title_text}>Add project</Text>
      </HStack>
      <FormControl style={styles_add.formControl}>
        <FormControl.Label>Name</FormControl.Label>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Project Name"
          style={styles_add.input}
        />
      </FormControl>
      <FormControl style={styles_add.formControl}>
        <FormControl.Label>Description</FormControl.Label>
        <Input
          value={description}
          onChangeText={setDescription}
          placeholder="Project Description"
          multiline={true}
          style={styles_add.input}
        />
      </FormControl>
      <Button title="Pick an Image" onPress={pickImage} color="#5A67D8" />
      {imageUri && (
        <View style={styles_add.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles_add.image} />
        </View>
      )}
      <Button title="Add Project" onPress={addProject} color="#4C51BF" />
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

export default AddProject;
