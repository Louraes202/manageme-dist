import React from "react";
import { useState, useEffect } from "react";
import { View, TextInput, Text } from "react-native";
import styles from "../../../styles/styles"; // Importar estilos globais
import { Dimensions } from "react-native";
import {
  Fab,
  Heading,
  Center,
  Flex,
  VStack,
  Icon,
  Menu,
  Input,
  Stack,
  Box,
  Button,
  Modal,
  FormControl,
  Image,
  AspectRatio,
  Checkbox,
  HStack,
} from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from "../../../../assets/utils/pallete.json";
import Task from "../components/Task";
import { ScrollView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import createTablesQuery from "../../../services/SQLite/createQuery";

const { width, height } = Dimensions.get("window");

const fetchTasksFromDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = SQLite.openDatabase("manageme");
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM TAREFAS",
        [],
        (tx, results) => {
          const len = results.rows.length;
          const tasks = [];
          for (let i = 0; i < len; i++) {
            const task = results.rows.item(i);
            const taskId = task.key; // Acessa o campo idTarefa
            console.log(taskId);
            const taskName = task.nome; // Acessa o campo nome
            const taskDescription = task.descricao; // Acessa o campo descricao
            tasks.push(task);
          }
          resolve(tasks);
        },
        (error) => {
          console.error("Error fetching tasks from database.", error);
          reject(error);
        }
      );
    });
  });
};

const doTask = (task) => {
  const db = SQLite.openDatabase("manageme");
  db.transaction((tx) => {
    tx.executeSql(""),
      [],
      (error) => {
        console.error("Error doing task (" + { task } + "). :", error);
        reject(error);
      };
  });
};

const deleteTask = (task) => {
  const db = SQLite.openDatabase("manageme");
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM TAREFAS WHERE idTarefa = ?",
      [task.idTarefa],
      () => {
        console.log("Task deleted successfully.");
      },
      (error) => {
        console.error("Error deleting task:", error);
      }
    );
  });
};

const TasksStack = createNativeStackNavigator();

const SeeTasks = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [update, setUpdate] = useState(false);

  const openModal = (placement) => {
    setOpen(true);
  };

  useEffect(() => {
    fetchTasksFromDatabase()
      .then((tasks) => {
        setTasks(tasks), setUpdate(false);
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [update]);

  const isFocused = useIsFocused();

  return (
    <View style={styles.screen}>
      <NewTask
        open={open}
        setOpen={setOpen}
        tasks={tasks}
        setTasks={setTasks}
        update={update}
        setUpdate={setUpdate}
      />
      <VStack w="100%" space={5} alignSelf="center">
        <Input
          placeholder="Search Tasks & Projects"
          width="100%"
          borderRadius="20"
          py="3"
          px="1"
          fontSize="14"
          InputLeftElement={
            <Icon
              m="2"
              ml="3"
              size="6"
              color="gray.400"
              as={<FontAwesome5 name="search" />}
            />
          }
        />
      </VStack>

      <ScrollView>
        <Flex marginY={5}>
          <HStack justifyContent={"space-between"}>
            <Heading>Projects</Heading>
            <Button
              borderRadius={25}
              colorScheme={"blue"}
              leftIcon={<FontAwesome5 name="plus" color="white" />}
            >
              Add
            </Button>
          </HStack>
          <Text>You have {} projects</Text>
          <ScrollView horizontal>
            <Box alignItems="" my={2}>
              <Box
                maxW="80"
                rounded="lg"
                overflow="hidden"
                borderColor="coolGray.200"
                borderWidth="1"
                _dark={{
                  borderColor: "coolGray.600",
                  backgroundColor: "gray.700",
                }}
                _web={{
                  shadow: 2,
                  borderWidth: 0,
                }}
                _light={{
                  backgroundColor: "gray.50",
                }}
              >
                <Box>
                  <AspectRatio w="100%" ratio={16 / 9}>
                    <Image
                      source={{
                        uri: "https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg",
                      }}
                      alt="image"
                    />
                  </AspectRatio>
                  <Center
                    bg="violet.500"
                    _dark={{
                      bg: "violet.400",
                    }}
                    _text={{
                      color: "warmGray.50",
                      fontWeight: "700",
                      fontSize: "xs",
                    }}
                    position="absolute"
                    bottom="0"
                    px="3"
                    py="1.5"
                  >
                    Category
                  </Center>
                </Box>
                <Stack p="4" space={3}>
                  <Stack space={2}>
                    <Heading size="md" ml="-1">
                      Project Example
                    </Heading>
                    <Text
                      fontSize="xs"
                    >Productivity app.
                    </Text>
                  </Stack>
                  <HStack
                    alignItems="center"
                    space={4}
                    justifyContent="space-between"
                  >
                    <HStack alignItems="center">
                      <Text
                        color="coolGray.600"
                        _dark={{
                          color: "warmGray.200",
                        }}
                        fontWeight="400"
                      >
                        6 mins ago
                      </Text>
                    </HStack>
                  </HStack>
                </Stack>
              </Box>
            </Box>
          </ScrollView>
        </Flex>

        <Flex marginY={5}>
          <Heading>Today's Tasks</Heading>
        </Flex>
      </ScrollView>

      {/*}<ScrollView>
        <VStack py="">
          <Flex direction="column">
            {tasks.map((task) => (
              <Task
                task={task}
                key={task["idTarefa"]}
                name={task["nome"]}
                desc={task["descricao"]}
                group={task["grupo"]}
                doTask={() => doTask(task)} 
                deleteTask={() => deleteTask(task)} 
                update = {update}
                setUpdate = {setUpdate}
              />
            ))}
          </Flex>
        </VStack>
      </ScrollView>
      {*/}
    </View>
  );
};

const NewTask = ({ open, setOpen, tasks, setTasks, update, setUpdate }) => {
  const addNewTask = (name, description) => {
    const db = SQLite.openDatabase("manageme");
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO TAREFAS (nome, descricao) VALUES (?, ?)",
        [name, description],
        setUpdate(true),

        (error) => {
          console.error("Error adding new task:", error);
        }
      );
    });
  };

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)} safeAreaTop={true}>
      <Modal.Content maxWidth="350" center>
        <Modal.CloseButton />
        <Modal.Header>New Task</Modal.Header>
        <Modal.Body>
          <FormControl nativeID="newTaskForm">
            <FormControl.Label>Name</FormControl.Label>
            <Input
              value={name}
              onChangeText={(value) => {
                setName(value);
              }}
            />
          </FormControl>
          <FormControl mt="3">
            <FormControl.Label>Description</FormControl.Label>
            <Input
              value={description}
              onChangeText={(value) => {
                setDescription(value);
              }}
            />
          </FormControl>
          <FormControl mt="3" flexDirection="row" alignItems="center">
            <FormControl.Label mr="2">Notify</FormControl.Label>
            <Checkbox aria-label="Notify" />
          </FormControl>
          <FormControl mt="3" flexDirection="row" alignItems="center">
            <FormControl.Label mr="2">Repeat</FormControl.Label>
            <Checkbox aria-label="Repeat" />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              variant="ghost"
              colorScheme="blueGray"
              onPress={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                addNewTask(name, description);
                setOpen(false);
              }}
            >
              Add
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

const TasksTab = ({ navigation }) => {
  return (
    <TasksStack.Navigator
      initialRouteName="Tasks Screen"
      screenOptions={{ header: () => null }}
    >
      <TasksStack.Screen name="Tasks Screen" component={SeeTasks} />
    </TasksStack.Navigator>
  );
};

export default TasksTab;
