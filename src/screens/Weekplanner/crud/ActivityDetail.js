import React, { useState, useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import { VStack, FormControl, IconButton, Icon, HStack, Button, Select, Input } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import moment from 'moment';
import { useGlobalContext } from '../../../context/GlobalProvider';

const db = SQLite.openDatabase('manageme');

const ActivityDetail = ({ route, navigation }) => {
  const { activity } = route.params;
  const [nomeAtividade, setNomeAtividade] = useState(activity.nomeAtividade);
  const [descricaoAtividade, setDescricaoAtividade] = useState(activity.descricaoAtividade);
  const [blocos, setBlocos] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const { setUpdateActivities } = useGlobalContext();

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

  const loadGroups = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Grupos;",
        [],
        (tx, results) => {
          const loadedGroups = [];
          for (let i = 0; i < results.rows.length; i++) {
            loadedGroups.push(results.rows.item(i));
          }
          setGroups(loadedGroups);
        },
        (tx, error) => {
          console.error("Error fetching groups:", error);
        }
      );
    });

    db.transaction(tx => {
      tx.executeSql(
        `SELECT idGrupo FROM Atividade_Grupo WHERE idAtividade = ?;`,
        [activity.idAtividade],
        (tx, results) => {
          if (results.rows.length > 0) {
            setSelectedGroup(results.rows.item(0).idGrupo);
          }
        },
        (tx, error) => console.error("Error fetching activity group:", error)
      );
    });
  };

  const updateActivity = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE Atividades SET nomeAtividade = ?, descricaoAtividade = ? WHERE idAtividade = ?;`,
        [nomeAtividade, descricaoAtividade, activity.idAtividade],
        () => {
          tx.executeSql(
            `DELETE FROM Atividade_Grupo WHERE idAtividade = ?;`,
            [activity.idAtividade],
            () => {
              if (selectedGroup) {
                tx.executeSql(
                  `INSERT INTO Atividade_Grupo (idAtividade, idGrupo) VALUES (?, ?);`,
                  [activity.idAtividade, selectedGroup],
                  () => {
                    console.log("Activity and Group association updated successfully!");
                    setUpdateActivities(true);
                    navigation.goBack();
                  }
                );
              } else {
                setUpdateActivities(true);
                navigation.goBack();
              }
            }
          );
        },
        (_, error) => {
          console.error("DB Error: " + error.message);
        }
      );
    });
  };

  const deleteActivity = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM Atividades WHERE idAtividade = ?;`,
        [activity.idAtividade],
        () => {
          console.log('Activity deleted successfully!');
          setUpdateActivities(true);
          navigation.goBack();
        },
        (_, error) => console.error('DB Error: ' + error.message)
      );
    });
  };

  useEffect(() => {
    loadBlocks();
    loadGroups();
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
          <Input value={nomeAtividade} onChangeText={setNomeAtividade} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Description</FormControl.Label>
          <Input value={descricaoAtividade} onChangeText={setDescricaoAtividade} />
        </FormControl>
        <FormControl>
          <FormControl.Label>Group</FormControl.Label>
          <Select
            selectedValue={selectedGroup.toString()}
            minWidth="200"
            placeholder="Select a Group"
            onValueChange={(itemValue) => setSelectedGroup(itemValue)}
          >
            {groups.map((group) => (
              <Select.Item
                label={group.nome}
                value={group.idGrupo.toString()}
                key={group.idGrupo}
              />
            ))}
          </Select>
        </FormControl>
        <Button onPress={updateActivity} colorScheme="blue">Update Activity</Button>
        <Button colorScheme="red" onPress={deleteActivity}>Delete Activity</Button>
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
