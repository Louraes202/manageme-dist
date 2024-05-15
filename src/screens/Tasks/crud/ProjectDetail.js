import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  Input,
  FormControl,
  ScrollView,
  VStack,
  HStack,
  Icon,
  IconButton,
} from "native-base";
import * as ImagePicker from "expo-image-picker";
import * as SQLite from "expo-sqlite";
import styles from "../../../styles/styles";
import { Ionicons } from "@expo/vector-icons";

const db = SQLite.openDatabase("manageme");

const ProjectDetail = ({ route, navigation, setUpdateProjects }) => {
  const [project, setProject] = useState(route.params.project);
  const [name, setName] = useState(project.nome);
  const [description, setDescription] = useState(project.descricao);
  const [imageUri, setImageUri] = useState(project.imageUri);



  const updateProject = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Projetos SET nome = ?, descricao = ?, imageUri = ? WHERE idProjeto = ?;",
        [name, description, imageUri, project.idProjeto],
        (tx, results) => {
          Alert.alert("Sucesso", "Projeto atualizado com sucesso!");
          setUpdateProjects(true);
          const updatedProject = {
            ...project,
            nome: name,
            descricao: description,
            imageUri: imageUri
          };
          console.log(updatedProject);
          navigation.navigate("Project View", { project: updatedProject });
        },
        (error) => {
          console.error("Erro ao atualizar o projeto:", error);
          Alert.alert("Erro", "Falha ao atualizar o projeto.");
        }
      );
    });
  };
  const deleteProject = () => {
    Alert.alert("Confirmar", "Deseja realmente excluir este projeto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        onPress: () => {
          db.transaction((tx) => {
            tx.executeSql(
              "DELETE FROM Projetos WHERE idProjeto = ?;",
              [project.idProjeto],
              () => {
                Alert.alert("Sucesso", "Projeto excluído com sucesso!");
                setUpdateProjects(true);
                navigation.goBack();
                navigation.goBack();
              },
              (error) => {
                console.error("Erro ao excluir o projeto:", error);
                Alert.alert("Erro", "Falha ao excluir o projeto.");
              }
            );
          });
        },
      },
    ]);
  };

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
        <Text style={styles.title_text}>Edit project</Text>
      </HStack>
      <FormControl style={styles_add.formControl}>
        <FormControl.Label>Nome</FormControl.Label>
        <Input value={name} onChangeText={setName} />
      </FormControl>
      <FormControl style={styles_add.formControl}>
        <FormControl.Label>Descrição</FormControl.Label>
        <Input
          value={description}
          onChangeText={setDescription}
          multiline={true}
        />
      </FormControl>
      <View style={styles_add.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles_add.image} />
      </View>
      <VStack mt={3}>
        <Button title="Change image" onPress={pickImage} />
        <Button title="Save changes" onPress={updateProject} />
        <Button title="Delete project" onPress={deleteProject} color="red" />
      </VStack>
    </ScrollView>
  );
};

const styles_add = StyleSheet.create({
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

export default ProjectDetail;
