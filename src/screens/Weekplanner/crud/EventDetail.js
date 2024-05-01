import React, { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from "date-fns";
import * as SQLite from "expo-sqlite";
import {
  VStack,
  FormControl,
  Input,
  IconButton,
  Icon,
  Button,
  HStack
} from "native-base";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import styles from "../../../styles/styles";

const db = SQLite.openDatabase("manageme");

const EventDetail = ({ route, navigation }) => {
  const { event } = route.params;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleConfirm = (date) => {
    hideDatePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const deleteEvent = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM Eventos WHERE idEvento = ?;`,
        [idEvento],
        () => {
          console.log("Event deleted successfully!");
          navigation.goBack();
        },
        (t, error) => {
          console.log("DB Error: " + error.message);
        }
      );
    });
  };

  return event ? (
    <ScrollView style={{ padding: 20 }}>
      <HStack alignItems={"center"} space={""}>
        <IconButton
          py={0}
          px={2}
          _icon={{ as: Ionicons, name: "arrow-back", color: "black" }}
          _pressed={{ backgroundColor: "green.100" }}
          onPress={() => navigation.goBack()}
        ></IconButton>
        <Text style={styles.title_text}>Edit event</Text>
      </HStack>
      <VStack space={3}>
        <FormControl>
          <FormControl.Label>Name</FormControl.Label>
          <Input value={event.nome} isReadOnly={true} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Description</FormControl.Label>
          <Input value={event.descricao} isReadOnly={true} />
        </FormControl>
        <Button
          onPress={showDatePicker}
          leftIcon={<Icon as={FontAwesome5} name="clock" size="sm" />}
        >
          Change Start Time
        </Button>
        <Text>Start Time: {event.horaInicio}</Text>
        <Button
          onPress={showDatePicker}
          leftIcon={<Icon as={FontAwesome5} name="clock" size="sm" />}
        >
          Change End Time
        </Button>
        <Text>End Time: {event.horaFim}</Text>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        <Button onPress={deleteEvent} colorScheme="red">
          Delete Event
        </Button>
      </VStack>
    </ScrollView>
  ) : (
    <View style={styles.screen}>
      <Text style={styles.title_textscreen}>Loading...</Text>
    </View>
  );
};

export default EventDetail;
