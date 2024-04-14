import React from "react";
import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import styles from "../../../styles/styles"; // Importar estilos globais
import { Dimensions } from "react-native";
import {
  Fab,
  Center,
  Flex,
  VStack,
  HStack,
  Menu,
  Box,
  Input,
  Modal,
  FormControl,
  Button,
  Checkbox,
  Divider,
  Heading,
  Spacer,
  Icon,
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

  const SearchBar = () => {
    return (
      <VStack w="100%" my={2} alignSelf="center">
        <Input
          placeholder="Search People & Places"
          width="100%"
          borderRadius="4"
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
          InputRightElement={
            <Icon
              m="2"
              mr="3"
              size="6"
              color="gray.400"
              as={<FontAwesome5 name="mic" />}
            />
          }
        />
      </VStack>
    );
  };

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

      {/* Início */}
      <Text style={styles.title_text}>What's next?</Text>

      {/* Zona de pesquisa */}
      <SearchBar />

      {/* Zona dos projetos */}
      <VStack my={2}>
        <HStack alignItems={'center'} >
          <Text style={styles.title_textscreen}>Projects</Text>
          <Spacer/>
          <Text>See all</Text>
        </HStack>

        <ScrollView horizontal={true}>
          
        </ScrollView>
      </VStack>

      {/* Zona das tarefas */}
      <ScrollView>
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
                update={update}
                setUpdate={setUpdate}
              />
            ))}
          </Flex>
        </VStack>
      </ScrollView>

      <Box>
        <Menu w="190" trigger={(triggerProps) => {}}>
          <Menu.Item onPress={() => openModal()}>New task</Menu.Item>
          <Menu.Item>New group</Menu.Item>
          <Menu.Item>New category</Menu.Item>
        </Menu>
      </Box>
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
