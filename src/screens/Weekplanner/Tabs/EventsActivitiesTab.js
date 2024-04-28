import React from "react";
import { View, Text } from "react-native";
import styles from "../../../styles/styles";
import { VStack } from "native-base";
import { SearchBar } from "../../Tasks/Tabs/TasksTab";
import { AddButton } from "../../Tasks/Tabs/TasksTab";
import { useIsFocused } from "@react-navigation/native";

const AddBlock = () => {
  return (
    <View></View>
  );
}

const EventsActivitiesTab = ({ navigation }) => {
  const isFocused = useIsFocused();
  return (
    <View style={styles.screen}>
      <SearchBar placeholder={'Search Events and Activities'}/>
      <VStack>
        <Text style={styles.title_textscreen}>Events</Text>
        <AddButton
            color="#5983FC"
            paddingX={168}
            paddingY={4}
            onPress={() => navigation.navigate("")}
          ></AddButton>

      </VStack>
    </View>
  );
};

export default EventsActivitiesTab;
