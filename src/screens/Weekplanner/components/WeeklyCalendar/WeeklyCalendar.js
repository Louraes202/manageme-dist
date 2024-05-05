import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Platform,
  ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";
import moment from "moment/min/moment-with-locales";
import DateTimePicker from "@react-native-community/datetimepicker";
import { applyLocale, displayTitleByLocale } from "./src/Locale";
import styles from "./src/Style";

import * as SQLite from "expo-sqlite";
import { useGlobalContext } from "../../../../context/GlobalProvider";

const WeeklyCalendar = (props) => {
  const [currDate, setCurrDate] = useState(
    moment(props.selected).locale(props.locale)
  );
  const [weekdays, setWeekdays] = useState([]);
  const [weekdayLabels, setWeekdayLabels] = useState([]);
  const [selectedDate, setSelectedDate] = useState(currDate.clone());
  const [isCalendarReady, setCalendarReady] = useState(false);
  const [pickerDate, setPickerDate] = useState(currDate.clone());
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [cancelText, setCancelText] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [eventMap, setEventMap] = useState(undefined);
  const [scheduleView, setScheduleView] = useState(undefined);
  const [dayViewOffsets, setDayViewOffsets] = useState(undefined);
  const scrollViewRef = useRef();

  // UseState adicional para controlar a exibição por horas
  const [selectedDay, setSelectedDay] = useState(null);
  const [hoursOfDay, setHoursOfDay] = useState([]);

  const {
    updateTasks,
    updateProjects,
    updateEvents,
    updateActivities,
    updateBlocks,
  } = useGlobalContext();

  const [taskEvents, setTaskEvents] = useState("");
  const [eventEvents, setEventEvents] = useState([]);

  useEffect(() => {
    // Fetch tasks once the component mounts
    fetchTasksForWeek()
      .then((eventsFromDb) => {
        // Here we can set the events in state to pass to the WeeklyCalendar later
        setTaskEvents(eventsFromDb);
      })
      .catch((error) => {
        console.error("Error fetching tasks for the week:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch tasks once the component mounts
    fetchTasksForWeek()
      .then((eventsFromDb) => {
        // Here we can set the events in state to pass to the WeeklyCalendar later
        setTaskEvents(eventsFromDb);
      })
      .catch((error) => {
        console.error("Error fetching tasks for the week:", error);
      });
  }, [updateTasks, updateProjects]);

  // eventEvents
  useEffect(() => {
    fetchEventsForWeek()
      .then((eventsFromDb) => {
        setEventEvents(eventsFromDb);
      })
      .catch((error) => {
        console.error("Error fetching events for the week:", error);
      });
  }, []);

  useEffect(() => {
    fetchEventsForWeek()
      .then((eventsFromDb) => {
        setEventEvents(eventsFromDb);
      })
      .catch((error) => {
        console.error("Error fetching events for the week:", error);
      });
  }, [updateEvents]);

  // UseState para controlar a visualização selecionada
  const [viewMode, setViewMode] = useState("week"); // 'week' ou 'hour'

  useEffect(() => {
    // only first mount
    applyLocale(
      props.locale,
      (cancelText) => setCancelText(cancelText),
      (confirmText) => setConfirmText(confirmText)
    );
    setCalendarReady(true);
  }, []);

  const fetchTasksForWeek = () => {
    return new Promise((resolve, reject) => {
      const db = SQLite.openDatabase("manageme");
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM Tarefas WHERE repetir = 1 OR dataConclusao IS NOT NULL`,
          [],
          (_, { rows }) => {
            const tasks = rows._array;
            const events = tasks.flatMap((task) => {
              const taskEvents = [];
              if (task.repetir && task.diasRepeticao) {
                task.diasRepeticao.split(",").forEach((dayOfWeek) => {
                  taskEvents.push({
                    start: moment()
                      .isoWeekday(parseInt(dayOfWeek, 10))
                      .startOf("day")
                      .format("YYYY-MM-DD HH:mm:ss"),
                    duration: "23:59:59",
                    note: task.nome,
                  });
                });
              }
              if (task.dataConclusao) {
                taskEvents.push({
                  start: moment(task.dataConclusao)
                    .startOf("day")
                    .format("YYYY-MM-DD HH:mm:ss"),
                  duration: "23:59:59",
                  note: task.nome,
                });
              }
              console.log(
                "Task events instant: ",
                moment().format("HH:mm:ss.SSS")
              );
              return taskEvents;
            });
            resolve(events);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  const fetchEventsForWeek = () => {
    return new Promise((resolve, reject) => {
      const db = SQLite.openDatabase("manageme");
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM Eventos`,
          [],
          (_, { rows }) => {
            const events = rows._array.flatMap((event) => {
              const eventEvents = [];
              let startTime = moment(event.horaInicio);
              let endTime = moment(event.horaFim);

              if (!startTime.isValid() || !endTime.isValid()) {
                console.error(`Invalid date format for event: ${event.nome}`);
                eventEvents.push([]);
              }

              const durationSeconds = endTime.diff(startTime, "seconds");
              const durationHours = Math.floor(durationSeconds / 3600);
              const durationMinutes = Math.floor((durationSeconds % 3600) / 60);
              const duration = `${String(durationHours).padStart(
                2,
                "0"
              )}:${String(durationMinutes).padStart(2, "0")}:${String(
                durationSeconds % 60
              ).padStart(2, "0")}`;

              eventEvents.push({
                start: startTime.format("YYYY-MM-DD HH:mm:ss"),
                end: endTime.format("YYYY-MM-DD HH:mm:ss"),
                duration: duration,
                note: event.nome,
              });
              console.log(
                "Event events instant: ",
                moment().format("HH:mm:ss.SSS"),
                " ",
                event
              );
              return eventEvents;
            });
            resolve(events);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });
  };

  const fetchBlocksForHourView = () => {
    return new Promise((resolve, reject) => {
      const db = SQLite.openDatabase("manageme");
      db.transaction((tx) => {
        tx.executeSql(
          `SELECT Blocos.*, Atividades.nomeAtividade 
           FROM Blocos
           JOIN Atividades ON Blocos.idAtividade = Atividades.idAtividade`,
          [],
          (_, { rows }) => resolve(rows._array),
          (_, error) => reject(error)
        );
      });
    });
  };

  const fetchDataForWeek = () => {
    return Promise.all([fetchTasksForWeek(), fetchEventsForWeek()]).then(
      ([tasks, events]) => [...tasks, ...events]
    );
  };

  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    fetchDataForWeek()
      .then((events) => {
        console.log("Mapping allEvents: ", moment().format("HH:mm:ss.SSS"));
        setAllEvents(events);
      })
      .catch((error) => {
        console.error("Error fetching data for the week:", error);
      });
  }, [updateTasks, updateEvents, updateProjects]);

  const createEventMap = (events) => {
    const dateMap = new Map();

    events.forEach((event) => {
      const eventDate = moment(event.start).format("YYYY-MM-DD");
      if (!dateMap.has(eventDate)) {
        dateMap.set(eventDate, []);
      }
      dateMap.get(eventDate).push(event);
    });

    setEventMap(dateMap);
    createWeekdays(currDate, dateMap);
  };

  // Update useEffect to call this function:
  useEffect(() => {
    createEventMap(allEvents);
  }, [allEvents]);

  // Hour view section

  const [blockEvents, setBlockEvents] = useState([]);

  useEffect(() => {
    fetchBlocksForHourView()
      .then(setBlockEvents)
      .catch((error) => console.error("Error fetching blocks:", error));
  }, [updateActivities]); // Adjust according to your global context or refresh triggers

  const createWeekdays = (date, map) => {
    let dayViews = [];
    let offsets = [];
    setWeekdays([]);
    for (let i = 0; i < 7; i++) {
      const weekdayToAdd = date.clone().weekday(props.startWeekday - 7 + i);
      setWeekdays((weekdays) => [...weekdays, weekdayToAdd]);
      setWeekdayLabels((weekdayLabels) => [
        ...weekdayLabels,
        weekdayToAdd.format(props.weekdayFormat),
      ]);

      // render schedule view
      let events = map.get(weekdayToAdd.format("YYYY-MM-DD").toString());
      let eventViews = [];
      if (events !== undefined) {
        if (props.renderEvent !== undefined) {
          eventViews = events.map((event, j) => {
            if (props.renderFirstEvent !== undefined && j === 0)
              return props.renderFirstEvent(event, j);
            else if (
              props.renderLastEvent !== undefined &&
              j === events.length - 1
            )
              return props.renderLastEvent(event, j);
            else return props.renderEvent(event, j);
          });
        } else {
          eventViews = events.map((event, j) => {
            let startTime = moment(event.start).format("LT").toString();
            let duration = event.duration.split(":");
            let seconds =
              parseInt(duration[0]) * 3600 +
              parseInt(duration[1]) * 60 +
              parseInt(duration[2]);
            let endTime = moment(event.start)
              .add(seconds, "seconds")
              .format("LT")
              .toString();
            return (
              <View key={i + "-" + j}>
                <View style={styles.event}>
                  <View style={styles.eventDuration}>
                    <View style={styles.durationContainer}>
                      <View style={styles.durationDot} />
                      <Text style={styles.durationText}>{startTime}</Text>
                    </View>
                    <View style={{ paddingTop: 10 }} />
                    <View style={styles.durationContainer}>
                      <View style={styles.durationDot} />
                      <Text style={styles.durationText}>{endTime}</Text>
                    </View>
                    <View style={styles.durationDotConnector} />
                  </View>
                  <View style={styles.eventNote}>
                    <Text style={styles.eventText}>{event.note}</Text>
                  </View>
                </View>
                {j < events.length - 1 && <View style={styles.lineSeparator} />}
              </View>
            );
          });
        }
      }

      let dayView = undefined;
      if (props.renderDay !== undefined) {
        if (props.renderFirstDay !== undefined && i === 0)
          dayView = props.renderFirstDay(eventViews, weekdayToAdd, i);
        else if (props.renderLastDay !== undefined && i === 6)
          dayView = props.renderLastDay(eventViews, weekdayToAdd, i);
        else dayView = props.renderDay(eventViews, weekdayToAdd, i);
      } else {
        dayView = (
          <View
            key={i.toString()}
            style={styles.day}
            onLayout={(event) => {
              offsets[i] = event.nativeEvent.layout.y;
            }}
          >
            <View style={styles.dayLabel}>
              <Text style={[styles.monthDateText, { color: props.themeColor }]}>
                {weekdayToAdd.format("M/D").toString()}
              </Text>
              <Text style={[styles.dayText, { color: props.themeColor }]}>
                {weekdayToAdd.format(props.weekdayFormat).toString()}
              </Text>
            </View>
            <View
              style={[
                styles.allEvents,
                eventViews.length === 0
                  ? { width: "100%", backgroundColor: "lightgrey" }
                  : {},
              ]}
            >
              {eventViews}
            </View>
          </View>
        );
      }
      dayViews.push(dayView);
    }
    setScheduleView(dayViews);
    setDayViewOffsets(offsets);
  };

  const clickLastWeekHandler = () => {
    setCalendarReady(false);
    const lastWeekCurrDate = currDate.subtract(7, "days");
    setCurrDate(lastWeekCurrDate.clone());
    setSelectedDate(lastWeekCurrDate.clone().weekday(props.startWeekday - 7));
    createWeekdays(lastWeekCurrDate.clone(), eventMap);
    setCalendarReady(true);
  };

  const clickNextWeekHandler = () => {
    setCalendarReady(false);
    const nextWeekCurrDate = currDate.add(7, "days");
    setCurrDate(nextWeekCurrDate.clone());
    setSelectedDate(nextWeekCurrDate.clone().weekday(props.startWeekday - 7));
    createWeekdays(nextWeekCurrDate.clone(), eventMap);
    setCalendarReady(true);
  };

  const isSelectedDate = (date) => {
    return (
      selectedDate.year() === date.year() &&
      selectedDate.month() === date.month() &&
      selectedDate.date() === date.date()
    );
  };

  const pickerOnChange = (_event, pickedDate) => {
    if (Platform.OS === "android") {
      setPickerVisible(false);
      setLoading(true);
      if (pickedDate !== undefined) {
        // when confirm pressed
        setTimeout(() => {
          let pickedDateMoment = moment(pickedDate).locale(props.locale);
          setPickerDate(pickedDateMoment);
          confirmPickerHandler(pickedDateMoment);
          setLoading(false);
        }, 0);
      } else setLoading(false);
    } else setPickerDate(moment(pickedDate).locale(props.locale));
  };

  const confirmPickerHandler = (pickedDate) => {
    setCurrDate(pickedDate);
    setSelectedDate(pickedDate);

    setCalendarReady(false);
    createWeekdays(pickedDate, eventMap);
    setCalendarReady(true);

    setPickerVisible(false);
  };

  // Esta função agora inclui lógica para alternar para a visualização por horas
  const onDayPress = (weekday) => {
    setSelectedDate(weekday); // Atualiza o dia selecionado
    setHourlyViewActive(props.viewMode === "hour"); // Verifica se a visualização é por hora
  };

  // Função para gerar as horas do dia para a visualização por horas
  const generateHoursOfDay = (date) => {
    const hours = [];
    const startOfDay = date.clone().startOf("day");
    for (let i = 0; i < 24; i++) {
      hours.push(startOfDay.clone().add(i, "hours"));
    }
    setHoursOfDay(hours);
  };

  const renderHourlyView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i); // Array de horas 0 a 23
    const hourWidth = '80%'; // Define a largura da coluna de hora
    const hourLabelWidth = '20%'; // Define a largura da coluna de rótulo de hora
  
    const eventsPerHour = Array(24).fill([]); // Inicializa uma lista para cada hora
  
    // Popula cada lista de hora com blocos de eventos
    blockEvents.filter(block => {
      const blockDate = moment(block.hora_inicio).format("YYYY-MM-DD");
      return blockDate === selectedDate.format("YYYY-MM-DD");
    }).forEach(block => {
      const blockStart = moment(block.hora_inicio);
      const blockEnd = moment(block.hora_fim);
      const startHour = blockStart.hour();
      const endHour = blockEnd.hour();
  
      for (let hour = startHour; hour <= endHour; hour++) {
        eventsPerHour[hour] = eventsPerHour[hour].concat({
          ...block,
          start: hour === startHour ? blockStart.format("HH:mm") : `${hour}:00`,
          end: hour === endHour ? blockEnd.format("HH:mm") : `${hour + 1}:00`,
        });
      }
    });
  
    return (
      <ScrollView style={styles.hourlyScrollView}>
        {hours.map(hour => (
          <View key={hour} style={styles.hourRow}>
            <View style={[styles.hourLabel, { width: hourLabelWidth }]}>
              <Text style={styles.hourLabelText}>{`${hour}:00`}</Text>
            </View>
            <View style={[styles.hourBlock, { width: hourWidth }]}>
              {eventsPerHour[hour].map((block, idx) => (
                <View key={idx} style={styles.block}>
                  <Text style={styles.blockTitle}>{block.nomeAtividade}</Text>
                  <Text style={styles.blockTime}>{`${block.start} - ${block.end}`}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };
  
  // Adiciona estado para controle da visualização por horas baseado na prop 'viewMode'
  const [hourlyViewActive, setHourlyViewActive] = useState(
    props.viewMode === "hour"
  );

  // Atualiza a visualização baseada na prop 'viewMode' quando ela mudar
  useEffect(() => {
    setHourlyViewActive(props.viewMode === "hour");
  }, [props.viewMode]);

  return (
    <View style={[styles.component, props.style]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={clickLastWeekHandler}
        >
          <Text style={{ color: props.themeColor }}>{"\u25C0"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPickerVisible(true)}>
          <Text style={[styles.title, props.titleStyle]}>
            {isCalendarReady &&
              displayTitleByLocale(
                props.locale,
                selectedDate,
                props.titleFormat
              )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={clickNextWeekHandler}
        >
          <Text style={{ color: props.themeColor }}>{"\u25B6"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.week}>
        <View style={styles.weekdayLabelContainer}>
          <View style={styles.weekdayLabel}>
            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>
              {weekdays.length > 0 ? weekdayLabels[0] : ""}
            </Text>
          </View>
          <View style={styles.weekdayLabel}>
            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>
              {weekdays.length > 0 ? weekdayLabels[1] : ""}
            </Text>
          </View>
          <View style={styles.weekdayLabel}>
            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>
              {weekdays.length > 0 ? weekdayLabels[2] : ""}
            </Text>
          </View>
          <View style={styles.weekdayLabel}>
            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>
              {weekdays.length > 0 ? weekdayLabels[3] : ""}
            </Text>
          </View>
          <View style={styles.weekdayLabel}>
            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>
              {weekdays.length > 0 ? weekdayLabels[4] : ""}
            </Text>
          </View>
          <View style={styles.weekdayLabel}>
            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>
              {weekdays.length > 0 ? weekdayLabels[5] : ""}
            </Text>
          </View>
          <View style={styles.weekdayLabel}>
            <Text style={[styles.weekdayLabelText, props.dayLabelStyle]}>
              {weekdays.length > 0 ? weekdayLabels[6] : ""}
            </Text>
          </View>
        </View>
        <View style={styles.weekdayNumberContainer}>
          <TouchableOpacity
            style={styles.weekDayNumber}
            onPress={onDayPress.bind(this, weekdays[0], 0)}
          >
            <View
              style={
                isCalendarReady && isSelectedDate(weekdays[0])
                  ? [
                      styles.weekDayNumberCircle,
                      { backgroundColor: props.themeColor },
                    ]
                  : {}
              }
            >
              <Text
                style={
                  isCalendarReady && isSelectedDate(weekdays[0])
                    ? styles.weekDayNumberTextToday
                    : { color: props.themeColor }
                }
              >
                {isCalendarReady ? weekdays[0].date() : ""}
              </Text>
            </View>
            {isCalendarReady &&
              eventMap.get(weekdays[0].format("YYYY-MM-DD").toString()) !==
                undefined && (
                <View
                  style={
                    isSelectedDate(weekdays[0])
                      ? [styles.dot, { backgroundColor: "white" }]
                      : [styles.dot, { backgroundColor: props.themeColor }]
                  }
                />
              )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.weekDayNumber}
            onPress={onDayPress.bind(this, weekdays[1], 1)}
          >
            <View
              style={
                isCalendarReady && isSelectedDate(weekdays[1])
                  ? [
                      styles.weekDayNumberCircle,
                      { backgroundColor: props.themeColor },
                    ]
                  : {}
              }
            >
              <Text
                style={
                  isCalendarReady && isSelectedDate(weekdays[1])
                    ? styles.weekDayNumberTextToday
                    : { color: props.themeColor }
                }
              >
                {isCalendarReady ? weekdays[1].date() : ""}
              </Text>
            </View>
            {isCalendarReady &&
              eventMap.get(weekdays[1].format("YYYY-MM-DD").toString()) !==
                undefined && (
                <View
                  style={
                    isSelectedDate(weekdays[1])
                      ? [styles.dot, { backgroundColor: "white" }]
                      : [styles.dot, { backgroundColor: props.themeColor }]
                  }
                />
              )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.weekDayNumber}
            onPress={onDayPress.bind(this, weekdays[2], 2)}
          >
            <View
              style={
                isCalendarReady && isSelectedDate(weekdays[2])
                  ? [
                      styles.weekDayNumberCircle,
                      { backgroundColor: props.themeColor },
                    ]
                  : {}
              }
            >
              <Text
                style={
                  isCalendarReady && isSelectedDate(weekdays[2])
                    ? styles.weekDayNumberTextToday
                    : { color: props.themeColor }
                }
              >
                {isCalendarReady ? weekdays[2].date() : ""}
              </Text>
            </View>
            {isCalendarReady &&
              eventMap.get(weekdays[2].format("YYYY-MM-DD").toString()) !==
                undefined && (
                <View
                  style={
                    isSelectedDate(weekdays[2])
                      ? [styles.dot, { backgroundColor: "white" }]
                      : [styles.dot, { backgroundColor: props.themeColor }]
                  }
                />
              )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.weekDayNumber}
            onPress={onDayPress.bind(this, weekdays[3], 3)}
          >
            <View
              style={
                isCalendarReady && isSelectedDate(weekdays[3])
                  ? [
                      styles.weekDayNumberCircle,
                      { backgroundColor: props.themeColor },
                    ]
                  : {}
              }
            >
              <Text
                style={
                  isCalendarReady && isSelectedDate(weekdays[3])
                    ? styles.weekDayNumberTextToday
                    : { color: props.themeColor }
                }
              >
                {isCalendarReady ? weekdays[3].date() : ""}
              </Text>
            </View>
            {isCalendarReady &&
              eventMap.get(weekdays[3].format("YYYY-MM-DD").toString()) !==
                undefined && (
                <View
                  style={
                    isSelectedDate(weekdays[3])
                      ? [styles.dot, { backgroundColor: "white" }]
                      : [styles.dot, { backgroundColor: props.themeColor }]
                  }
                />
              )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.weekDayNumber}
            onPress={onDayPress.bind(this, weekdays[4], 4)}
          >
            <View
              style={
                isCalendarReady && isSelectedDate(weekdays[4])
                  ? [
                      styles.weekDayNumberCircle,
                      { backgroundColor: props.themeColor },
                    ]
                  : {}
              }
            >
              <Text
                style={
                  isCalendarReady && isSelectedDate(weekdays[4])
                    ? styles.weekDayNumberTextToday
                    : { color: props.themeColor }
                }
              >
                {isCalendarReady ? weekdays[4].date() : ""}
              </Text>
            </View>
            {isCalendarReady &&
              eventMap.get(weekdays[4].format("YYYY-MM-DD").toString()) !==
                undefined && (
                <View
                  style={
                    isSelectedDate(weekdays[4])
                      ? [styles.dot, { backgroundColor: "white" }]
                      : [styles.dot, { backgroundColor: props.themeColor }]
                  }
                />
              )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.weekDayNumber}
            onPress={onDayPress.bind(this, weekdays[5], 5)}
          >
            <View
              style={
                isCalendarReady && isSelectedDate(weekdays[5])
                  ? [
                      styles.weekDayNumberCircle,
                      { backgroundColor: props.themeColor },
                    ]
                  : {}
              }
            >
              <Text
                style={
                  isCalendarReady && isSelectedDate(weekdays[5])
                    ? styles.weekDayNumberTextToday
                    : { color: props.themeColor }
                }
              >
                {isCalendarReady ? weekdays[5].date() : ""}
              </Text>
            </View>
            {isCalendarReady &&
              eventMap.get(weekdays[5].format("YYYY-MM-DD").toString()) !==
                undefined && (
                <View
                  style={
                    isSelectedDate(weekdays[5])
                      ? [styles.dot, { backgroundColor: "white" }]
                      : [styles.dot, { backgroundColor: props.themeColor }]
                  }
                />
              )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.weekDayNumber}
            onPress={onDayPress.bind(this, weekdays[6], 6)}
          >
            <View
              style={
                isCalendarReady && isSelectedDate(weekdays[6])
                  ? [
                      styles.weekDayNumberCircle,
                      { backgroundColor: props.themeColor },
                    ]
                  : {}
              }
            >
              <Text
                style={
                  isCalendarReady && isSelectedDate(weekdays[6])
                    ? styles.weekDayNumberTextToday
                    : { color: props.themeColor }
                }
              >
                {isCalendarReady ? weekdays[6].date() : ""}
              </Text>
            </View>
            {isCalendarReady &&
              eventMap.get(weekdays[6].format("YYYY-MM-DD").toString()) !==
                undefined && (
                <View
                  style={
                    isSelectedDate(weekdays[6])
                      ? [styles.dot, { backgroundColor: "white" }]
                      : [styles.dot, { backgroundColor: props.themeColor }]
                  }
                />
              )}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView ref={scrollViewRef} style={styles.schedule}>
        {props.viewMode === "hour" ? renderHourlyView() : scheduleView}
      </ScrollView>
      {Platform.OS === "ios" && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isPickerVisible}
          onRequestClose={() => setPickerVisible(false)} // for android only
          style={styles.modal}
        >
          <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
            <View style={styles.blurredArea} />
          </TouchableWithoutFeedback>
          <View style={styles.pickerButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setPickerVisible(false)}
            >
              <Text style={styles.modalButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={confirmPickerHandler.bind(this, pickerDate)}
            >
              <Text style={styles.modalButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            locale={props.locale}
            value={pickerDate.toDate()}
            onChange={pickerOnChange}
            style={styles.picker}
          />
        </Modal>
      )}
      {Platform.OS === "android" && isPickerVisible && (
        <DateTimePicker
          locale={props.locale}
          value={pickerDate.toDate()}
          display="spinner"
          onChange={pickerOnChange}
        />
      )}
      {(!isCalendarReady || isLoading) && (
        <ActivityIndicator size="large" color="grey" style={styles.indicator} />
      )}
    </View>
  );
};

WeeklyCalendar.propTypes = {
  /** initially selected day */
  selected: PropTypes.any,
  /** If firstDay = 1, week starts from Monday. If firstDay = 7, week starts from Sunday. */
  startWeekday: PropTypes.number,
  /** Set format to display title (e.g. titleFormat='MMM YYYY' displays "Jan 2020") */
  titleFormat: PropTypes.string,
  /** Set format to display weekdays (e.g. weekdayFormat='dd' displays "Mo" and weekdayFormat='ddd' displays "Mon") */
  weekdayFormat: PropTypes.string,
  /** Set locale (e.g. Korean='ko', English='en', Chinese(Mandarin)='zh-cn', etc.) */
  locale: PropTypes.string,
  /** Set list of events you want to display below weekly calendar.
   * Default is empty array []. */
  events: PropTypes.array,
  /** Specify how each event should be rendered below weekly calendar. Event & index are given as parameters. */
  renderEvent: PropTypes.func,
  /** Specify how first event should be rendered below weekly calendar. Event & index are given as parameters. */
  renderFirstEvent: PropTypes.func,
  /** Specify how last event should be rendered below weekly calendar. Event & index are given as parameters. */
  renderLastEvent: PropTypes.func,
  /** Specify how day should be rendered below weekly calendar. Event Views, day (Moment object), index are given as parameters. */
  renderDay: PropTypes.func,
  /** Specify how first day should be rendered below weekly calendar. Event Views, day (Moment object), index are given as parameters. */
  renderFirstDay: PropTypes.func,
  /** Specify how last day should be rendered below weekly calendar. Event Views, day (Moment object), index are given as parameters. */
  renderLastDay: PropTypes.func,
  /** Handler which gets executed on day press. Default = undefined */
  onDayPress: PropTypes.func,
  /** Set theme color */
  themeColor: PropTypes.string,
  /** Set style of component */
  style: PropTypes.any,
  /** Set text style of calendar title */
  titleStyle: PropTypes.any,
  /** Set text style of weekday labels */
  dayLabelStyle: PropTypes.any,
};

WeeklyCalendar.defaultProps = {
  // All props are optional
  selected: moment(),
  startWeekday: 7,
  titleFormat: undefined,
  weekdayFormat: "ddd",
  locale: "en",
  events: [],
  renderEvent: undefined,
  renderFirstEvent: undefined,
  renderLastEvent: undefined,
  renderDay: undefined,
  renderFirstDay: undefined,
  renderLastDay: undefined,
  onDayPress: undefined,
  themeColor: "#46c3ad",
  style: {},
  titleStyle: {},
  dayLabelStyle: {},
};

export default WeeklyCalendar;
