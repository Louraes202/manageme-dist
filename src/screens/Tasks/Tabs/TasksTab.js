import React from "react";
import AddProject from "../crud/AddProject";
import { useState, useEffect, StyleSheet } from "react";
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
  Pressable,
  Radio,
} from "native-base";
import { Entypo, FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import Colors from "../../../../assets/utils/pallete.json";
import Task from "../components/Task";
import { ScrollView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useIsFocused } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import createTablesQuery from "../../../services/SQLite/createQuery";
import ProjectCard from "../components/ProjectCard";
import ProjectDetail from "../crud/ProjectDetail";
import AddTask from "../crud/AddTask";
import TaskDetails from "../crud/TaskDetail";
import RadioGroup from "../components/RadioGroup";
import { useGlobalContext } from "../../../context/GlobalProvider";

const { width, height } = Dimensions.get("window");

const fetchTasksFromDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = SQLite.openDatabase("manageme");
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT t.*, g.nome as groupName FROM Tarefas t LEFT JOIN Grupos g ON t.idGrupo = g.idGrupo;",
        [],
        (tx, results) => {
          const tasks = [];
          for (let i = 0; i < results.rows.length; i++) {
            tasks.push(results.rows.item(i));
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

const fetchProjectsFromDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = SQLite.openDatabase("manageme");
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Projetos",
        [],
        (tx, results) => {
          const len = results.rows.length;
          const projects = [];
          for (let i = 0; i < len; i++) {
            const project = results.rows.item(i);
            projects.push(project);
          }
          resolve(projects);
        },
        (error) => {
          console.error("Error fetching projects from database.", error);
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

export const SearchBar = ({placeholder, value, onChangeText}) => {
  return (
    <VStack w="100%" my={2} alignSelf="center">
      <Input
        placeholder={placeholder}
        width="100%"
        borderRadius="4"
        py="3"
        px="1"
        value={value}
        onChangeText={onChangeText}
        InputLeftElement={
          <Icon
            m="2"
            ml="3"
            size="6"
            color="gray.400"
            as={<Ionicons name="search"/>}
          />
        }
        InputRightElement={
          <Icon
            m="2"
            mr="3"
            size="6"
            color="gray.400"
            as={<FontAwesome name="" />}
          />
        }
      />
    </VStack>
  );
};

export const AddButton = ({ color, onPress, paddingX, paddingY }) => {
  return (
    <Box alignItems="center">
      <Pressable maxW="96" onPress={onPress}>
        {({ isHovered, isFocused, isPressed }) => {
          return (
            <Box
              bg={
                isPressed
                  ? "coolGray.200"
                  : isHovered
                  ? "coolGray.200"
                  : color
              }
              style={{
                transform: [
                  {
                    scale: isPressed ? 0.96 : 1,
                  },
                ],
              }}
              px={paddingX}
              py={paddingY}
              rounded="8"
              shadow={3}
              borderWidth="1"
              borderColor="coolGray.300"
            >
              <FontAwesome6 name="plus" size="30" color="white" />
              <Text style={{ color: "white" }}>New</Text>
            </Box>
          );
        }}
      </Pressable>
    </Box>
  );
};


const SeeTasks = ({
  navigation,
  updateProjects,
  setUpdateProjects,
  updateTasks,
  setUpdateTasks,
}) => {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("one");

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjectsFromDatabase().then((data) => {
      setProjects(data);
      setUpdateProjects(false);
    });
  }, []);

  useEffect(() => {
    if (updateProjects) {
      fetchProjectsFromDatabase().then((data) => {
        setProjects(data);
        setUpdateProjects(false);
      });
    }
  }, [updateProjects]);

  useEffect(() => {
    fetchTasksFromDatabase().then((data) => {
      setTasks(data);
      setUpdateTasks(false);
    });
  }, []);

  useEffect(() => {
    if (updateTasks) {
      fetchTasksFromDatabase().then((data) => {
        setTasks(data);
        setUpdateTasks(false);
      });
    }
  }, [updateTasks]);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchProjectsFromDatabase().then(setProjects);
    fetchTasksFromDatabase().then(setTasks);
  }, []);

  const filteredProjects = projects.filter(project =>
    project.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    project.descricao.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredTasks = tasks.filter(task =>
    task.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    task.descricao.toLowerCase().includes(searchText.toLowerCase())
  );


  const isFocused = useIsFocused();

  return (
    <View style={styles.screen}>
      <ScrollView>
        {/* Início */}
        {/* Zona de pesquisa */}
        <SearchBar placeholder={'Search Projects and Tasks'} value={searchText} onChangeText={setSearchText}/>
        {/* Zona dos projetos */}
        <VStack>
          <HStack alignItems={"center"}>
            <Text style={styles.title_textscreen}>Projects</Text>
            <Spacer />
            <Text>See all</Text>
          </HStack>
          <VStack my={2}>
            <ScrollView style={{ paddingBottom: 20 }} horizontal={true}>
            {filteredProjects.map((project) => (
              <Pressable key={project.id} onPress={() => navigation.navigate("Project Detail", { project })}>
                <ProjectCard project={project} />
              </Pressable>
            ))}
              <AddButton
                color="#5983FC"
                paddingX={8}
                paddingY={8}
                onPress={() => navigation.navigate("Add Group")}
              />
            </ScrollView>
          </VStack>
        </VStack>

        {/* Zona das tarefas */}
        <VStack my={2}>
          <HStack alignItems={"center"}>
            <Text style={styles.title_textscreen}>Tasks</Text>
            <Spacer />
            <Text>See all</Text>
          </HStack>
          <RadioGroup radioOptions={[{label: 'All', value: 'all'}, {label: 'Today', value: 'today'}, {label: 'From project', value: 'fromproject'}]}></RadioGroup>

        </VStack>
        <ScrollView>
          <VStack py="">
            <Flex direction="column">
              {filteredTasks.map((task) => (
                <Task
                  onPress={() =>
                    navigation.navigate("Task Detail", { task, setUpdateTasks })
                  }
                  deleteTask={deleteTask}
                  doTask={doTask}
                  task={task}
                  key={task.idTarefa}
                  name={task.nome}
                  desc={task.descricao}
                  groupName={task.groupName}
                  updateTasks={updateTasks}
                  setUpdateTasks={setUpdateTasks}
                  createdAt={task.createdAt}
                />
              ))}
            </Flex>
          </VStack>
          <AddButton
            color="#5983FC"
            paddingX={168}
            paddingY={4}
            onPress={() => navigation.navigate("Add Task")}
          ></AddButton>
        </ScrollView>

        <Box>
          <Menu w="190" trigger={(triggerProps) => {}}>
            <Menu.Item onPress={() => openModal()}>New task</Menu.Item>
            <Menu.Item>New task</Menu.Item>
            <Menu.Item>New project</Menu.Item>
          </Menu>
        </Box>
      </ScrollView>
    </View>
  );
};

const TasksTab = ({ navigation }) => {
  {/* Aqui vão ficar os hooks dos respetivos ecrãs */}
  const { updateTasks, setUpdateTasks, updateProjects, setUpdateProjects } = useGlobalContext();

  {/* Zona de navegação */}
  return (
    <TasksStack.Navigator
      initialRouteName="Tasks Screen"
      screenOptions={{ header: () => null }}
    >
      <TasksStack.Screen name="Tasks Screen">
        {(props) => (
          <SeeTasks
            {...props}
            updateProjects={updateProjects}
            setUpdateProjects={setUpdateProjects}
            updateTasks={updateTasks}
            setUpdateTasks={setUpdateTasks}
          />
        )}
      </TasksStack.Screen>
      <TasksStack.Screen name="Add Group">
        {(props) => (
          <AddProject {...props} setUpdateProjects={setUpdateProjects} />
        )}
      </TasksStack.Screen>
      <TasksStack.Screen name="Project Detail">
        {(props) => (
          <ProjectDetail {...props} setUpdateProjects={setUpdateProjects} />
        )}
      </TasksStack.Screen>
      <TasksStack.Screen name="Add Task">
        {(props) => <AddTask {...props} setUpdateTasks={setUpdateTasks} />}
      </TasksStack.Screen>
      <TasksStack.Screen name="Task Detail">
        {(props) => <TaskDetails {...props} setUpdateTasks={setUpdateTasks} />}
      </TasksStack.Screen>
    </TasksStack.Navigator>
  );
};

export default TasksTab;
