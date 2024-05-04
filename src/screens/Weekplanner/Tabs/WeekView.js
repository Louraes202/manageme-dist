import React, { useCallback, useState, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { HStack, Select, ScrollView } from "native-base";
import WeeklyCalendar from "../components/WeeklyCalendar/WeeklyCalendar";
import { fetchActivitiesFromDatabase } from "./EventsActivitiesTab";
import styles from "../../../styles/styles";
import ActivityCard from "../components/ActivityCard";

const WeekView = ({ navigation }) => {
  const [selectedView, setSelectedView] = useState("hour");
  const [activities, setActivities] = useState([]);
  const [calendarBounds, setCalendarBounds] = useState(null);

  const loadActivities = useCallback(() => {
    fetchActivitiesFromDatabase().then(setActivities).catch(console.error);
  }, []);

  const onDrop = (activity, x, y, resetPosition) => {
    if (
      calendarBounds &&
      x >= calendarBounds.x &&
      x <= calendarBounds.x + calendarBounds.width &&
      y >= calendarBounds.y &&
      y <= calendarBounds.y + calendarBounds.height
    ) {
      console.log(`Activity ${activity.id} dropped in the grid!`);
      // Atualize o bloco de atividades na grade
    } else {
      console.log(`Activity ${activity.id} dropped outside the grid.`);
      resetPosition();
    }
  };

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return (
    <View style={styles.screen}>
      <HStack justifyContent={"space-between"} alignItems={"center"}>
        <Text style={styles.title_textscreen}>Weekly View</Text>
        <Select
          selectedValue={selectedView}
          width={170}
          onValueChange={(value) => setSelectedView(value)}
          accessibilityLabel="Choose view"
        >
          <Select.Item label="Hour Block View" value="hour" />
          <Select.Item label="Weekly View" value="week" />
        </Select>
      </HStack>
      <View
        style={{ zIndex: 0 }}
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setCalendarBounds({ x, y, width, height });
        }}
      >
        <WeeklyCalendar
          viewMode={selectedView}
          themeColor={"blue"}
          style={{
            marginLeft: -10,
            marginTop: 15,
            borderColor: "white",
          }}
        />
      </View>

      {selectedView === "hour" && (
        <ScrollView horizontal zIndex={1}>
          <HStack space={3}>
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isDraggable
                onDrop={onDrop}
                onPress={() =>
                  navigation.navigate("ActivityDetail", { activity })
                }
              />
            ))}
          </HStack>
        </ScrollView>
      )}
    </View>
  );
};

export default WeekView;
