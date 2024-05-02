import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { VStack, FormControl, Input, Button, IconButton, Icon, HStack } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('manageme');

const AddBlock = ({ route, navigation }) => {
  const { activity } = route.params;
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');

  const addBlock = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Blocos (hora_inicio, hora_fim, idAtividade) VALUES (?, ?, ?);`,
        [horaInicio, horaFim, activity.idAtividade],
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
          <Input value={horaInicio} onChangeText={setHoraInicio} />
        </FormControl>
        <FormControl>
          <FormControl.Label>End Time</FormControl.Label>
          <Input value={horaFim} onChangeText={setHoraFim} />
        </FormControl>
        <Button onPress={addBlock} colorScheme="blue">
          Add Block
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default AddBlock;
