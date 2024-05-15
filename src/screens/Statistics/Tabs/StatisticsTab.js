import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import {
  View,
  Select,
  Box,
  CheckIcon,
  ScrollView,
  HStack,
  Spacer,
  VStack,
  Button,
  Modal,
  Input,
} from "native-base";
import { BarChart } from "react-native-gifted-charts";
import moment from "moment";
import * as SQLite from "expo-sqlite";
import styles from "../../../styles/styles";
import { useIsFocused } from "@react-navigation/native";
import { useGlobalContext } from "../../../context/GlobalProvider";

const db = SQLite.openDatabase("manageme");

const fetchUserSettings = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT wakeUpTime, sleepTime FROM UserSettings WHERE id = 1;",
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0));
          } else {
            resolve({ wakeUpTime: null, sleepTime: null });
          }
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

const updateUserSettings = (wakeUpTime, sleepTime) => {
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT OR REPLACE INTO UserSettings (id, wakeUpTime, sleepTime) VALUES (1, ?, ?);",
      [wakeUpTime, sleepTime]
    );
  });
};

// Função para buscar tarefas
const fetchTasksForWeek = () => {
  const startOfWeek = moment().startOf("isoWeek").format("YYYY-MM-DD");
  const endOfWeek = moment().endOf("isoWeek").format("YYYY-MM-DD");

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
              if (weekDay >= 0 && weekDay <= 6) {
                taskCounts[weekDay] = (taskCounts[weekDay] || 0) + 1;
              }
            }
            if (diasRepeticao) {
              let days = diasRepeticao.split(",").map((day) => parseInt(day));
              if (days.every((day) => day >= 0 && day <= 6)) {
                days.forEach((day) => taskCounts[day]++);
              } else {
                console.error("Invalid day indices found:", days);
              }
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
        `SELECT horaInicio FROM Eventos
         WHERE horaInicio BETWEEN ? AND ?;`,
        [startOfWeek, endOfWeek],
        (tx, results) => {
          let eventCounts = Array(7).fill(0);
          for (let i = 0; i < results.rows.length; i++) {
            const { horaInicio } = results.rows.item(i);
            let weekDay = moment(horaInicio).day();
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

const fetchActivitiesForWeek = () => {
  const startOfWeek = moment().startOf("isoWeek").format("YYYY-MM-DD");
  const endOfWeek = moment().endOf("isoWeek").format("YYYY-MM-DD");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT hora_inicio FROM Blocos
         WHERE hora_inicio BETWEEN ? AND ?;`,
        [startOfWeek, endOfWeek],
        (tx, results) => {
          let activityCounts = Array(7).fill(0);
          for (let i = 0; i < results.rows.length; i++) {
            const { hora_inicio } = results.rows.item(i);
            let weekDay = moment(hora_inicio).day();
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
// Função para buscar blocos de atividades
const fetchActivitiesForWeekWeight = () => {
  const startOfWeek = moment().startOf("isoWeek").format("YYYY-MM-DD");
  const endOfWeek = moment().endOf("isoWeek").format("YYYY-MM-DD");

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT hora_inicio, hora_fim, idAtividade FROM Blocos
         WHERE hora_inicio BETWEEN ? AND ?;`,
        [startOfWeek, endOfWeek],
        (tx, results) => {
          let activityCounts = [];
          for (let i = 0; i < results.rows.length; i++) {
            const { hora_inicio, hora_fim, idAtividade } = results.rows.item(i);
            activityCounts.push({ hora_inicio, hora_fim, idAtividade });
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

const fetchActivityNames = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT idAtividade, nomeAtividade FROM Atividades;`,
        [],
        (tx, results) => {
          let activityNames = {};
          for (let i = 0; i < results.rows.length; i++) {
            const { idAtividade, nomeAtividade } = results.rows.item(i);
            activityNames[idAtividade] = nomeAtividade;
          }
          resolve(activityNames);
        },
        (error) => {
          console.error("Error fetching activity names.", error);
          reject(error);
        }
      );
    });
  });
};

const calculateOccupiedTime = (wakeUpTime, sleepTime, activities, events) => {
  const wakeUpMoment = moment(wakeUpTime, "HH:mm");
  const sleepMoment = moment(sleepTime, "HH:mm");
  const totalMinutesInDay = sleepMoment.diff(wakeUpMoment, "minutes");

  let occupiedMinutes = 0;

  activities.forEach((activity) => {
    const start = moment(activity.hora_inicio, "YYYY-MM-DD HH:mm:ss");
    const end = moment(activity.hora_fim, "YYYY-MM-DD HH:mm:ss");
    if (
      start.isBetween(wakeUpMoment, sleepMoment) ||
      end.isBetween(wakeUpMoment, sleepMoment)
    ) {
      occupiedMinutes += end.diff(start, "minutes");
    }
  });

  events.forEach((event) => {
    const start = moment(event.horaInicio, "YYYY-MM-DD HH:mm:ss");
    const end = moment(event.horaFim, "YYYY-MM-DD HH:mm:ss");
    if (
      start.isBetween(wakeUpMoment, sleepMoment) ||
      end.isBetween(wakeUpMoment, sleepMoment)
    ) {
      occupiedMinutes += end.diff(start, "minutes");
    }
  });

  const freeMinutes = totalMinutesInDay - occupiedMinutes;
  return freeMinutes / 60; // Return in hours
};

const StatisticsTab = () => {
  const [chartData, setChartData] = useState([]);
  const isFocused = useIsFocused();
  const [selectedCategory, setSelectedCategory] = useState("Tasks");

  const [wakeUpTime, setWakeUpTime] = useState(null);
  const [sleepTime, setSleepTime] = useState(null);
  const [freeTimePerDay, setFreeTimePerDay] = useState(0);
  const [heaviestActivity, setHeaviestActivity] = useState(null);

  const [showWakeUpModal, setShowWakeUpModal] = useState(false);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [wakeUpTimeInput, setWakeUpTimeInput] = useState("");
  const [sleepTimeInput, setSleepTimeInput] = useState("");

  useEffect(() => {
    fetchUserSettings().then((settings) => {
      setWakeUpTime(settings.wakeUpTime);
      setSleepTime(settings.sleepTime);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasks, activities, activitiesWeight, events, activityNames] =
          await Promise.all([
            fetchTasksForWeek(),
            fetchActivitiesForWeek(),
            fetchActivitiesForWeekWeight(),
            fetchEventsForWeek(),
            fetchActivityNames(),
          ]);

        let data = Array(7)
          .fill(null)
          .map((_, i) => ({
            label: moment().day(i).format("dd")[0].toUpperCase(),
            tasks: Number.isFinite(tasks[i]) ? tasks[i] : 0,
            activities: Number.isFinite(activities[i]) ? activities[i] : 0,
            events: Number.isFinite(events[i]) ? events[i] : 0,
          }));

        console.log(tasks, activities, events);
        setChartData(data);

        if (wakeUpTime && sleepTime) {
          let totalFreeTime = 0;
          let activityTimeMap = {};

          activitiesWeight.forEach((activity) => {
            const day = moment(activity.hora_inicio).day();
            const duration = moment(activity.hora_fim).diff(
              moment(activity.hora_inicio),
              "minutes"
            );
            activityTimeMap[activity.idAtividade] =
              (activityTimeMap[activity.idAtividade] || 0) + duration;
          });

          for (let i = 0; i < 7; i++) {
            const dayActivities = activitiesWeight.filter(
              (activity) => moment(activity.hora_inicio).day() === i
            );
            const dayEvents = events.filter(
              (event) => moment(event.horaInicio).day() === i
            );

            totalFreeTime += calculateOccupiedTime(
              wakeUpTime,
              sleepTime,
              dayActivities,
              dayEvents
            );
          }

          const heaviestActivityId = Object.keys(activityTimeMap).reduce(
            (a, b) => (activityTimeMap[a] > activityTimeMap[b] ? a : b),
            null
          );
          const heaviestActivity =
            activityNames[heaviestActivityId] || "No activities set yet";

          setFreeTimePerDay(totalFreeTime / 7);
          setHeaviestActivity(heaviestActivity);
        }
      } catch (error) {
        console.error("Error fetching data for chart:", error);
      }
    };

    fetchData();
  }, [isFocused, wakeUpTime, sleepTime]);

  const handleSetWakeUpTime = () => {
    setWakeUpTime(wakeUpTimeInput);
    updateUserSettings(wakeUpTimeInput, sleepTime);
    setShowWakeUpModal(false);
  };

  const handleSetSleepTime = () => {
    setSleepTime(sleepTimeInput);
    updateUserSettings(wakeUpTime, sleepTimeInput);
    setShowSleepModal(false);
  };

  const updatedChartData = chartData.map((item) => {
    const taskValue = item.tasks ?? 0;
    const activityValue = item.activities ?? 0;
    const eventValue = item.events ?? 0;

    return {
      value:
        selectedCategory === "Tasks"
          ? taskValue
          : selectedCategory === "Activities"
          ? activityValue
          : selectedCategory === "Events"
          ? eventValue
          : 0,
      label: item.label,
      frontColor: "#177AD5",
    };
  });

  return (
    <View style={styles.screen}>
      <ScrollView>
        <HStack space={3} alignItems="center">
          <Text style={styles.title_textscreen}>This week task stats</Text>
          <Spacer />
          <Box width="1/3" maxWidth="300px">
            {/*}
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
            {*/}
          </Box>
        </HStack>
        <VStack alignContent={"center"} mb={50} mt={0}>
          <VStack>
            <ScrollView horizontal height={350}>
              <BarChart
                horizontal
                barWidth={22}
                barBorderRadius={4}
                frontColor="lightgray"
                data={chartData.map((item) => ({
                  value: item.tasks,
                  label: item.label,
                  frontColor: "#177AD5",
                }))}
                yAxisThickness={0}
                xAxisThickness={0}
              />
              <BarChart
                horizontal
                barWidth={22}
                barBorderRadius={4}
                frontColor="lightgray"
                data={chartData.map((item) => ({
                  value: item.activities,
                  label: item.label,
                  frontColor: "#fde047",
                }))}
                yAxisThickness={0}
                xAxisThickness={0}
              />
              <BarChart
                horizontal
                barWidth={22}
                barBorderRadius={4}
                frontColor="lightgray"
                data={chartData.map((item) => ({
                  value: item.events,
                  label: item.label,
                  frontColor: "#34d399",
                }))}
                yAxisThickness={0}
                xAxisThickness={0}
              />
            </ScrollView>
          </VStack>
        </VStack>

        <HStack alignItems={"center"} space={4} mt={-10} mb={10}>
          <HStack alignItems={"center"} space={2}>
            <Box
              width={2}
              height={2}
              borderRadius={50}
              bgColor={"#177AD5"}
            ></Box>
            <Text>Tasks</Text>
          </HStack>
          <HStack alignItems={"center"} space={2}>
            <Box
              width={2}
              height={2}
              borderRadius={50}
              bgColor={"#fde047"}
            ></Box>
            <Text>Activities</Text>
          </HStack>
          <HStack alignItems={"center"} space={2}>
            <Box
              width={2}
              height={2}
              borderRadius={50}
              bgColor={"#34d399"}
            ></Box>
            <Text>Events</Text>
          </HStack>
        </HStack>

        <VStack space={2}>
          <Text
            style={{ fontFamily: "Poppins", fontSize: 20, fontWeight: 300 }}
          >
            Configure your start and end hour
          </Text>
          <HStack space={3}>
            <Button
              colorScheme={"blue"}
              borderRadius={25}
              onPress={() => setShowWakeUpModal(true)}
            >
              Set waking up hour
            </Button>
            <Button
              colorScheme={"blue"}
              borderRadius={25}
              onPress={() => setShowSleepModal(true)}
            >
              Set go to sleep hour
            </Button>
          </HStack>

          <Modal
            isOpen={showWakeUpModal}
            onClose={() => setShowWakeUpModal(false)}
          >
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Set Waking Up Hour</Modal.Header>
              <Modal.Body>
                <Input
                  placeholder="HH:MM"
                  value={wakeUpTimeInput}
                  onChangeText={setWakeUpTimeInput}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="ghost"
                    onPress={() => setShowWakeUpModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button onPress={handleSetWakeUpTime}>Save</Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>

          <Modal
            isOpen={showSleepModal}
            onClose={() => setShowSleepModal(false)}
          >
            <Modal.Content maxWidth="400px">
              <Modal.CloseButton />
              <Modal.Header>Set Go to Sleep Hour</Modal.Header>
              <Modal.Body>
                <Input
                  placeholder="HH:MM"
                  value={sleepTimeInput}
                  onChangeText={setSleepTimeInput}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button.Group space={2}>
                  <Button
                    variant="ghost"
                    onPress={() => setShowSleepModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button onPress={handleSetSleepTime}>Save</Button>
                </Button.Group>
              </Modal.Footer>
            </Modal.Content>
          </Modal>

          <VStack>
            <Text style={styles.title_textscreen}>Metrics</Text>
            <HStack alignItems={"center"}>
              <Text
                style={{ fontFamily: "Poppins", fontSize: 15, fontWeight: 300 }}
              >
                Free time per day (in a week)
              </Text>
              <Spacer />
              <Text
                style={{ fontFamily: "Poppins", fontSize: 15, fontWeight: 500 }}
              >
                {freeTimePerDay.toFixed(2)} h
              </Text>
            </HStack>
            <HStack alignItems={"center"}>
              <Text
                style={{ fontFamily: "Poppins", fontSize: 15, fontWeight: 300 }}
              >
                Heaviest activity
              </Text>
              <Spacer />
              <Text
                style={{ fontFamily: "Poppins", fontSize: 15, fontWeight: 500 }}
              >
                {heaviestActivity}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>
    </View>
  );
};

export default StatisticsTab;
