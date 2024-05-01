import React from 'react';
import { ScrollView, Text, Button } from 'react-native';
import { VStack, FormControl, Input, IconButton, Icon, HStack } from 'native-base';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('manageme');

const ActivityDetail = ({ route, navigation }) => {
  const { activity } = route.params;

  const deleteActivity = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM Atividades WHERE idAtividade = ?;`,
        [activity.idAtividade],
        () => {
          console.log('Activity deleted successfully!');
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
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Activity Details</Text>
      </HStack>
      <VStack space={3}>
        <FormControl>
          <FormControl.Label>Name</FormControl.Label>
          <Input value={activity.nomeAtividade} isReadOnly />
        </FormControl>
        <FormControl>
          <FormControl.Label>Description</FormControl.Label>
          <Input value={activity.descricaoAtividade} isReadOnly />
        </FormControl>
        <Button colorScheme="red" onPress={deleteActivity}>
          Delete Activity
        </Button>
      </VStack>
    </ScrollView>
  );
};

export default ActivityDetail;
