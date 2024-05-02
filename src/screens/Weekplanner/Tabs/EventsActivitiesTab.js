import React, { useState, useEffect, useCallback } from "react";
import { Text, ScrollView } from "react-native";
import { VStack } from "native-base";
import { SearchBar, AddButton } from "../../Tasks/Tabs/TasksTab";
import EventCard from "../components/EventCard";
import ActivityCard from "../components/ActivityCard";
import { useIsFocused } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import styles from "../../../styles/styles";
import { useGlobalContext } from "../../../context/GlobalProvider";

// Fetch Functions
const fetchEventsFromDatabase = async () => {
  const db = SQLite.openDatabase("manageme");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Eventos",
        [],
        (_, results) => {
          resolve(results.rows._array);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

const fetchActivitiesFromDatabase = async () => {
  const db = SQLite.openDatabase("manageme");
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Atividades",
        [],
        (_, results) => {
          resolve(results.rows._array);
        },
        (error) => {
          reject(error);
        }
      );
    });
  });
};

// Main Component
const EventsActivitiesTab = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [activities, setActivities] = useState([]);

  const { updateEvents, setUpdateEvents, updateActivities, setUpdateActivities } = useGlobalContext();
  const isFocused = useIsFocused();

  const loadEvents = useCallback(() => {
    fetchEventsFromDatabase().then(setEvents).catch(console.error);
  }, []);

  const loadActivities = useCallback(() => {
    fetchActivitiesFromDatabase().then(setActivities).catch(console.error);
  }, []);

  useEffect(() => {
    if (isFocused || updateEvents) {
      loadEvents();
      setUpdateEvents(false); 
    }
  }, [isFocused, updateEvents, loadEvents]);

  useEffect(() => {
    if (isFocused || updateActivities) {
      loadActivities();
      setUpdateActivities(false); 
    }
  }, [isFocused, updateActivities, loadActivities]);

  return (
    <ScrollView style={styles.screen}>
      <SearchBar placeholder={"Search Events and Activities"} />
      <VStack space={2}>
        <VStack>
          <VStack space={events.length === 0 ? 2 : 4} mb="4">
            <Text style={styles.title_textscreen}>Events</Text>
            <ScrollView horizontal={true}>
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() =>
                    navigation.navigate("EventDetail", { event })
                  }
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
        </VStack>

        <VStack>
          <VStack space={activities.length === 0 ? 2 : 4} mb="4">
            <Text style={styles.title_textscreen}>Activities</Text>
            <ScrollView horizontal={true}>
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onPress={() =>
                    navigation.navigate("ActivityDetail", { activity })
                  }
                />
              ))}
            </ScrollView>
            <AddButton
              color="#5983FC"
              paddingX={168}
              paddingY={2}
              onPress={() => navigation.navigate("AddActivity")}
            />
          </VStack>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default EventsActivitiesTab;
