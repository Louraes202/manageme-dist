import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import {
  Select,
  Box,
  CheckIcon,
  ScrollView,
  HStack,
  Spacer,
  VStack,
  Button,
} from "native-base";
import { BarChart } from "react-native-gifted-charts";
import moment from "moment";
import * as SQLite from "expo-sqlite";
import styles from "../../../styles/styles";
import { useIsFocused } from "@react-navigation/native";

const db = SQLite.openDatabase("manageme");

// Função para buscar tarefas
const fetchTasksForWeek = () => {
  const startOfWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
  const endOfWeek = moment().endOf('isoWeek').format('YYYY-MM-DD');

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT idTarefa, dataConclusao, diasRepeticao FROM Tarefas
         WHERE (dataConclusao BETWEEN ? AND ?)
         OR (diasRepeticao IS NOT NULL AND diasRepeticao != '');`,
        [startOfWeek, endOfWeek],
        (tx, results) => {
          let taskCounts = Array(7).fill(0); // Initialize counts for each day of the week
          for (let i = 0; i < results.rows.length; i++) {
            const { dataConclusao, diasRepeticao } = results.rows.item(i);
            if (dataConclusao) {
              let weekDay = moment(dataConclusao).day();
              taskCounts[weekDay]++;
            }
            if (diasRepeticao) {
              let days = diasRepeticao.split(',').map(day => parseInt(day));
              days.forEach(day => taskCounts[day]++);
            }
          }
          resolve(taskCounts);
        },
        (error) => {
          console.error("Error fetching tasks data.", error);
          reject(error);
        }
      );
    });
  });
};

// Função para buscar eventos
const fetchEventsForWeek = () => {
  const startOfWeek = moment().startOf("isoWeek").format("YYYY-MM-DD");
  const endOfWeek = moment().endOf("isoWeek").format("YYYY-MM-DD");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT diaMes FROM Eventos
         WHERE diaMes BETWEEN ? AND ?;`,
        [startOfWeek, endOfWeek],
        (tx, results) => {
          let eventCounts = Array(7).fill(0);
          for (let i = 0; i < results.rows.length; i++) {
            const { diaMes } = results.rows.item(i);
            let weekDay = moment(diaMes).day();
            eventCounts[weekDay]++;
          }
          resolve(eventCounts);
        },
        (error) => {
          console.error("Error fetching events data.", error);
          reject(error);
        }
      );
    });
  });
};

// Função para buscar blocos de atividades
const fetchActivitiesForWeek = () => {
  const startOfWeek = moment().startOf("isoWeek").format("YYYY-MM-DD");
  const endOfWeek = moment().endOf("isoWeek").format("YYYY-MM-DD");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT diaMes FROM Blocos
         WHERE diaMes BETWEEN ? AND ?;`,
        [startOfWeek, endOfWeek],
        (tx, results) => {
          let activityCounts = Array(7).fill(0);
          for (let i = 0; i < results.rows.length; i++) {
            const { diaMes } = results.rows.item(i);
            let weekDay = moment(diaMes).day();
            activityCounts[weekDay]++;
          }
          resolve(activityCounts);
        },
        (error) => {
          console.error("Error fetching activities data.", error);
          reject(error);
        }
      );
    });
  });
};


const StatisticsTab = () => {
  const [chartData, setChartData] = useState([]);
  const isFocused = useIsFocused();
  const [selectedCategory, setSelectedCategory] = useState('Tasks');


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasks, activities, events] = await Promise.all([
          fetchTasksForWeek(),
          fetchActivitiesForWeek(),
          fetchEventsForWeek()
        ]);
        

        let data = Array(7).fill(null).map((_, i) => ({
          label: moment().day(i).format('dd')[0].toUpperCase(),
          tasks: tasks[i],
          activities: activities[i],
          events: events[i]
        }));

        setChartData(data);
      } catch (error) {
        console.error("Error fetching data for chart:", error);
      }
    };

    fetchData();
  }, [isFocused]);

  return (
    <View style={styles.screen}>
      <ScrollView>
        <HStack space={3} alignItems="center">
          <Text style={styles.title_textscreen}>This week stats</Text>
          <Spacer />
          <Box width="1/3" maxWidth="300px">
            <Select
              selectedValue={selectedCategory}
              minWidth="100"
              accessibilityLabel="Choose Data"
              placeholder="Choose Data"
              mt={1}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            >
              <Select.Item label="Tasks" value="Tasks" />
              <Select.Item label="Activities" value="Activities" />
              <Select.Item label="Events" value="Events" />
            </Select>
          </Box>
        </HStack>
        <VStack alignContent={"center"} mb={180}>
        <VStack alignContent={'center'}>
          <BarChart
            horizontal
            barWidth={22}
            barBorderRadius={4}
            frontColor="lightgray"
            data={chartData.map(item => ({
              value: item.tasks,
              label: item.label,
              frontColor: '#177AD5'
            }))}
            yAxisThickness={0}
            xAxisThickness={0}
          />
        </VStack>
        </VStack>

        <VStack space={2}>
          <Text
            style={{ fontFamily: "Poppins", fontSize: 20, fontWeight: 300 }}
          >
            Configure your start and end hour
          </Text>
          <HStack space={3}>
            <Button colorScheme={'blue'} borderRadius={25}>Set waking up hour</Button>
            <Button colorScheme={'blue'} borderRadius={25}>Set go to sleep hour</Button>
          </HStack>
        </VStack>
      </ScrollView>
    </View>
  );
};

export default StatisticsTab;
