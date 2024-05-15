import { StyleSheet, View } from "react-native";
import styles from "../../../styles/styles";
import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  IconButton,
  Image,
  ScrollView,
  Spacer,
  Text,
  TextArea,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { AntDesign, Entypo, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { useIsFocused } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("manageme");

const ProjectView = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const [project, setProject] = useState(route.params.project);

  const id = project.idProjeto;
  const { updateProjects } = useGlobalContext();
  const [name, setName] = useState(project.nome);
  const [description, setDescription] = useState(project.descricao);
  const [imageUri, setImageUri] = useState(project.imageUri);

  useEffect(() => {
    console.log("Route params", route.params.project);
  }, [updateProjects]);

  useEffect(() => {
    if (route.params?.project) {
      const { nome, descricao, imageUri } = route.params.project;
      setProject(route.params.project);
      setName(nome);
      setDescription(descricao);
      setImageUri(imageUri);
    }
  }, [route.params?.project]);

  return (
    <View style={styles.screen}>
      <VStack space={3}>
        <Box alignSelf={"center"} marginTop={-150} borderBottomRadius={10}>
          { imageUri && <Image
            source={{ uri: imageUri }}
            width={500}
            height={200}
            px={230}
            alt="project-image"
            borderBottomRadius={0}
          />}
        </Box>
        <ScrollView>
          <VStack space={5}>
            <HStack alignItems={"center"}>
              <Text fontSize={24} fontFamily={"Poppins"}>
                {name}
              </Text>
              <Spacer />
              <IconButton
                icon={<Icon as={AntDesign} name="edit" size="sm" />}
                onPress={() => {
                  navigation.navigate("Project Detail", { project });
                }}
              />
            </HStack>
            <VStack space={1}>
              <Text
                fontSize={20}
                color={"blue.500"}
                fontFamily={"heading"}
                bold
              >
                Description
              </Text>
              <Text font={16}>{description}</Text>
            </VStack>

            <VStack space={1}>
              <Text
                fontSize={20}
                color={"blue.500"}
                fontFamily={"heading"}
                bold
              >
                Members
              </Text>
              <Button w={60} h={60} backgroundColor={'blue.500'} alignItems={'center'}>
                <Center>
                  <IconButton _icon={{ as: Ionicons, name: "add", color: "white" }} name='add'></IconButton>
                  <Text color={'white'}>Add</Text>
                </Center>
              </Button>
            </VStack>

            <VStack space={1}>
              <Text
                fontSize={20}
                color={"blue.500"}
                fontFamily={"heading"}
                bold
              >
                Atachments
              </Text>
              <Button w={60} h={60} backgroundColor={'blue.500'} alignItems={'center'}>
                <Center>
                  <IconButton _icon={{ as: Ionicons, name: "add", color: "white" }} name='add'></IconButton>
                  <Text color={'white'}>Add</Text>
                </Center>
              </Button>
            </VStack>

            <VStack space={1}>
              <Text
                fontSize={20}
                color={"blue.500"}
                fontFamily={"heading"}
                bold
              >
                Notes
              </Text>
              <Button w={60} h={60} backgroundColor={'blue.500'} alignItems={'center'}>
                <Center>
                  <IconButton _icon={{ as: Ionicons, name: "add", color: "white" }} name='add'></IconButton>
                  <Text color={'white'}>Add</Text>
                </Center>
              </Button>
            </VStack>

            <VStack space={1}>
              <Text
                fontSize={20}
                color={"blue.500"}
                fontFamily={"heading"}
                bold
              >
                Subtasks
              </Text>
              <Button w={60} h={60} backgroundColor={'blue.500'} alignItems={'center'}>
                <Center>
                  <IconButton _icon={{ as: Ionicons, name: "add", color: "white" }} name='add'></IconButton>
                  <Text color={'white'}>Add</Text>
                </Center>
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>
    </View>
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

export default ProjectView;
