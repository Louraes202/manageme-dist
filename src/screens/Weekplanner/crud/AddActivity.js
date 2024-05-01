import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { Button, VStack, FormControl, Input, IconButton, Icon, HStack } from 'native-base';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('manageme');

const AddActivity = ({ navigation }) => {
  const [nomeAtividade, setNomeAtividade] = useState('');
  const [descricaoAtividade, setDescricaoAtividade] = useState('');

  const addActivity = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Atividades (nomeAtividade, descricaoAtividade, flexivel) VALUES (?, ?, ?);`,
        [nomeAtividade, descricaoAtividade, false],
        () => {
          console.log('Activity added successfully!');
          navigation.goBack();
        },
        (t, error) => {
          console.log('DB Error: ' + error.message);
        }
      );
    });
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <HStack alignItems={"center"} space={""}>
        <IconButton
          py={0}
          px={2}
          _icon={{ as: Ionicons, name: "arrow-back", color: "black" }}
          _pressed={{ backgroundColor: "green.100" }}
          onPress={() => navigation.goBack()}
        ></IconButton>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Add Activity</Text>
      </HStack>
      <VStack space={3}>
        <FormControl>
          <FormControl.Label>Name</FormControl.Label>
          <Input value={nomeAtividade} onChangeText={setNomeAtividade} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Description</FormControl.Label>
          <Input value={descricaoAtividade} onChangeText={setDescricaoAtividade} />
        </FormControl>
        <Button onPress={addActivity} colorScheme="blue">
          Add Activity
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default AddActivity;
