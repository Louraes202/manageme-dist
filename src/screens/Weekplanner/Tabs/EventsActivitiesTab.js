import React, { useState, useEffect, useCallback } from "react";
import { Text, View } from "react-native";
import { VStack, HStack, ScrollView } from "native-base";
import { SearchBar, AddButton } from "../../Tasks/Tabs/TasksTab";
import EventCard from "../components/EventCard";
import { useIsFocused } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import styles from "../../../styles/styles";

const fetchEventsFromDatabase = () => {
  return new Promise((resolve, reject) => {
    const db = SQLite.openDatabase("manageme");
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Eventos",
        [],
        (tx, results) => {
          const events = [];
          for (let i = 0; i < results.rows.length; i++) {
            events.push(results.rows.item(i));
          }
          resolve(events);
        },
        (error) => {
          console.error("Error fetching events from database.", error);
          reject(error);
        }
      );
    });
  });
};

const EventsActivitiesTab = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [updateEvents, setUpdateEvents] = useState(false);
  const isFocused = useIsFocused();

  const loadEvents = useCallback(() => {
    fetchEventsFromDatabase().then(setEvents).catch(console.error);
  }, []);

  useEffect(() => {
    if (isFocused || updateEvents) {
      loadEvents();
      setUpdateEvents(false);
    }
  }, [isFocused, updateEvents, loadEvents]);

  return (
    <ScrollView style={styles.screen}>
      <SearchBar placeholder={'Search Events and Activities'} />
      <Text style={styles.title_textscreen}>Events</Text>
      <VStack space={4} mt="4">
        <ScrollView horizontal={1}>
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => navigation.navigate("EventDetail", { event: event })}
            />
          ))}
        </ScrollView>
        <AddButton
            color="#5983FC"
            paddingX={168}
            paddingY={2}
            onPress={() => navigation.navigate("AddEvent")}
          />
      </VStack>
    </ScrollView>
  );
};

export default EventsActivitiesTab;
