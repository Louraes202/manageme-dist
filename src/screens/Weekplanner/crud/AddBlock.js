import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { VStack, FormControl, Button, IconButton, Icon, HStack } from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('manageme');

const AddBlock = ({ route, navigation }) => {
  const { activity } = route.params;
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFim, setHoraFim] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [pickerType, setPickerType] = useState('');

  const handleConfirm = (date) => {
    if (pickerType === 'start') {
      setHoraInicio(date);
    } else {
      setHoraFim(date);
    }
    hideDatePicker();
  };

  const showDatePicker = (type) => {
    setPickerType(type);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const addBlock = () => {
    const start = format(horaInicio, 'yyyy-MM-dd HH:mm:ss');
    const end = format(horaFim, 'yyyy-MM-dd HH:mm:ss');
    
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Blocos (hora_inicio, hora_fim, idAtividade) VALUES (?, ?, ?);`,
        [start, end, activity.idAtividade],
        () => {
          console.log('Block added successfully!');
          navigation.goBack();
        },
        (_, error) => console.error('DB Error:', error)
      );
    });
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <HStack alignItems={"center"}>
        <IconButton
          py={0}
          px={2}
          _icon={{ as: Ionicons, name: "arrow-back", color: "black" }}
          _pressed={{ backgroundColor: "green.100" }}
          onPress={() => navigation.goBack()}
        />
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Add Block</Text>
      </HStack>
      <VStack space={3}>
        <FormControl>
          <FormControl.Label>Start Time</FormControl.Label>
          <Button onPress={() => showDatePicker('start')}>
            {format(horaInicio, 'yyyy-MM-dd HH:mm:ss')}
          </Button>
        </FormControl>
        <FormControl>
          <FormControl.Label>End Time</FormControl.Label>
          <Button onPress={() => showDatePicker('end')}>
            {format(horaFim, 'yyyy-MM-dd HH:mm:ss')}
          </Button>
        </FormControl>
        <Button onPress={addBlock} colorScheme="blue">
          Add Block
        </Button>
      </VStack>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </ScrollView>
  );
};

export default AddBlock;
