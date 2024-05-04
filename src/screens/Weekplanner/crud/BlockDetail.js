import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { VStack, FormControl, Button, IconButton, Icon, HStack } from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('manageme');

const BlockDetail = ({ route, navigation }) => {
  const { bloco } = route.params;
  const [horaInicio, setHoraInicio] = useState(new Date(bloco.hora_inicio));
  const [horaFim, setHoraFim] = useState(new Date(bloco.hora_fim));
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

  const updateBlock = () => {
    const start = format(horaInicio, 'yyyy-MM-dd HH:mm:ss');
    const end = format(horaFim, 'yyyy-MM-dd HH:mm:ss');

    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE Blocos SET hora_inicio = ?, hora_fim = ? WHERE idBloco = ?;`,
        [start, end, bloco.idBloco],
        () => {
          console.log('Block updated successfully!');
          navigation.goBack();
        },
        (_, error) => console.error('DB Error:', error)
      );
    });
  };

  const deleteBlock = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM Blocos WHERE idBloco = ?;`,
        [bloco.idBloco],
        () => {
          console.log('Block deleted successfully!');
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
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Block Details</Text>
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
        <Button onPress={updateBlock} colorScheme="blue">
          Update Block
        </Button>
        <Button onPress={deleteBlock} colorScheme="red">
          Delete Block
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

export default BlockDetail;
