import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import styles from "../../styles/styles"; // Importar estilos globais
import {
  Box,
  FlatList,
  Flex,
  Icon,
  Pressable,
  Spacer,
  VStack,
} from "native-base";
import { Dimensions } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("manageme");

const { width, height } = Dimensions.get("window");

const DataBox = ({ title, subtitle, description }) => {
  return (
    <Box
      width={160}
      height={160}
      margin={3}
      padding={3}
      backgroundColor={"transparent"}
      borderColor={"blue.500"}
      borderWidth={1.5}
      borderRadius={25}
    >
      <Text style={homestyles.boxtitle1}>{title}</Text>
      <Text style={homestyles.boxtitle2}>{subtitle}</Text>
      <Spacer />
      <Text style={homestyles.boxdesc}>{description}</Text>
    </Box>
  );
};

const NavBox = ({
  title,
  subtitle,
  description,
  icontype,
  icon,
  text,
  color,
  onPress,
}) => {
  return (
    <Box
      height={60}
      margin={3}
      padding={2.5}
      backgroundColor={color}
      borderColor={color}
      borderWidth={1.5}
      borderRadius={10}
    >
      <Pressable flexDirection={"row"} alignItems={"center"} onPress={onPress}>
        {!icontype ? <Icon m="2" size="6" color="white" as={<FontAwesome name={icon} />} /> : <Icon m="2" size="6" color="white" as={icontype} />}
        <Text style={homestyles.navtext}>{text}</Text>
      </Pressable>
    </Box>
  );
};

const Home = ({ navigation }) => {
  const [tasksCount, setTasksCount] = useState(0);
  const [habitsCount, setHabitsCount] = useState(0);
  const [activitiesCount, setActivitiesCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);

  useEffect(() => {
    fetchTasksCount();
    fetchHabitsCount();
    fetchActivitiesCount();
    fetchProjectsCount();
  }, []);

  const fetchTasksCount = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM Tarefas',
        [],
        (_, { rows }) => {
          setTasksCount(rows.item(0).count);
        },
        (txObj, error) => {
          console.log('Error fetching tasks count', error);
        }
      );
    });
  };

  const fetchHabitsCount = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM Habitos',
        [],
        (_, { rows }) => {
          setHabitsCount(rows.item(0).count);
        },
        (txObj, error) => {
          console.log('Error fetching habits count', error);
        }
      );
    });
  };

  const fetchActivitiesCount = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM Atividades',
        [],
        (_, { rows }) => {
          setActivitiesCount(rows.item(0).count);
        },
        (txObj, error) => {
          console.log('Error fetching activities count', error);
        }
      );
    });
  };

  const fetchProjectsCount = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM Projetos',
        [],
        (_, { rows }) => {
          setProjectsCount(rows.item(0).count);
        },
        (txObj, error) => {
          console.log('Error fetching projects count', error);
        }
      );
    });
  };

  return (
    <ScrollView style={styles.screen}>
      <Text
        style={[
          styles.title_textscreen,
          { marginLeft: 10, marginTop: 10, marginBottom: -10 },
        ]}
      >
        Welcome back, Martim.
      </Text>

      <Flex
        direction="row"
        wrap="wrap"
        marginY={15}
        justifyItems={"center"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <DataBox title={tasksCount.toString()} subtitle="Tasks" description="To conclude today" />
        <DataBox title={habitsCount.toString()} subtitle="Habits" description="To fulfill today" />
        <DataBox title={activitiesCount.toString()} subtitle="Activities" description="Going on today" />
        <DataBox title={projectsCount.toString()} subtitle="Projects" description="In progress" />
      </Flex>

      <Text style={[styles.title_textscreen, { marginLeft: 10 }]}>
        Navigate to
      </Text>
      <VStack marginBottom={10}>
        <NavBox
          icon="check"
          text="Tasks"
          color="blue.500"
          onPress={() => navigation.navigate("Tasks Screen")}
        />
        <NavBox
          icon="calendar"
          text="Planner"
          color="blue.500"
          onPress={() => navigation.navigate("Planner")}
        />
        <NavBox
          icon="bullseye"
          text="Habits"
          color="blue.500"
          onPress={() => navigation.navigate("Habit")}
        />
        <NavBox
          icontype={<MaterialIcons name="query-stats"/>}
          text="Statistics & IA"
          color="blue.500"
          onPress={() => navigation.navigate("Stats")}
        />
      </VStack>
    </ScrollView>
  );
};

export default Home;

export const homestyles = StyleSheet.create({
  boxtitle1: {
    fontFamily: "Poppins_Medium",
    fontSize: 24,
  },
  boxtitle2: {
    fontFamily: "Poppins",
    fontSize: 20,
  },
  boxdesc: {
    fontFamily: "Poppins",
  },
  navtext: {
    fontFamily: "Poppins_Medium",
    fontSize: 20,
    marginLeft: 7,
    color: "#ffffff",
  },
});
