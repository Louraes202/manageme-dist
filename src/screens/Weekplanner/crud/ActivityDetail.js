import React, { useState, useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import { VStack, FormControl, IconButton, Icon, HStack, Button } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import moment from 'moment';

const db = SQLite.openDatabase('manageme');

const ActivityDetail = ({ route, navigation }) => {
  const { activity } = route.params;
  const [blocos, setBlocos] = useState([]);

  const loadBlocks = () => {
    const startOfWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
    const endOfWeek = moment().endOf('isoWeek').format('YYYY-MM-DD');

    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM Blocos WHERE idAtividade = ? AND diaMes BETWEEN ? AND ?;`,
        [activity.idAtividade, startOfWeek, endOfWeek],
        (_, results) => setBlocos(results.rows._array),
        (_, error) => console.error('DB Error:', error)
      );
    });
  };

  useEffect(() => {
    loadBlocks();
  }, []);

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
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Activity Details</Text>
      </HStack>
      <VStack space={3}>
        <FormControl>
          <FormControl.Label>Name</FormControl.Label>
          <Text>{activity.nomeAtividade}</Text>
        </FormControl>
        <FormControl>
          <FormControl.Label>Description</FormControl.Label>
          <Text>{activity.descricaoAtividade}</Text>
        </FormControl>
        <Button colorScheme="red" onPress={() => deleteActivity(activity.idAtividade)}>
          Delete Activity
        </Button>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 20 }}>Blocks This Week</Text>
        {blocos.map((bloco) => (
          <HStack key={bloco.idBloco} justifyContent="space-between" alignItems="center">
            <Text>{moment(bloco.hora_inicio).format('LLLL')} - {moment(bloco.hora_fim).format('LLLL')}</Text>
            <Button onPress={() => navigation.navigate('BlockDetail', { bloco })}>Edit</Button>
          </HStack>
        ))}
        <Button onPress={() => navigation.navigate('AddBlock', { activity })}>
          Add Block
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default ActivityDetail;
