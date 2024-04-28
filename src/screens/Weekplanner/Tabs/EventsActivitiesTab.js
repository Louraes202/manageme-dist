import React from "react";
import { View, Text } from "react-native";
import styles from "../../../styles/styles";
import { VStack } from "native-base";
import { SearchBar } from "../../Tasks/Tabs/TasksTab";

const EventsActivitiesTab = () => {
  return (
    <View style={styles.screen}>
      <SearchBar placeholder={'Search Events and Activities'}/>
      <VStack>
        <Text style={styles.title_textscreen}>Events</Text>
      </VStack>
    </View>
  );
};

export default EventsActivitiesTab;
