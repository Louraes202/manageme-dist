import React, { useState, useEffect } from "react";
import { ScrollView, Text, Button } from "react-native";
import { Box, VStack, HStack, IconButton, Icon, Pressable } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import styles from "../../../styles/styles";
import * as SQLite from "expo-sqlite";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddGroup from "../crud/AddGroup";
import GroupDetail from "../crud/GroupDetail";

const db = SQLite.openDatabase("manageme");
const GroupsStack = createNativeStackNavigator();

const SeeGroups = ({ navigation, groupsUpdate, setGroupsUpdate }) => {
  const [groups, setGroups] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchGroups();
    setGroupsUpdate(false);
  }, []);

  useEffect(() => {
    fetchGroups();
    setGroupsUpdate(false);
  }, [groupsUpdate]);

  const fetchGroups = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Grupos",
        [],
        (_, { rows: { _array } }) => setGroups(_array),
        (_, error) => console.log(error)
      );
    });
  };

  const handleAddGroup = () => {
    navigation.navigate("AddGroup");
  };

  const handleEditGroup = (group) => {
    navigation.navigate("GroupDetail", { group });
  };

  return (
    <ScrollView style={styles.screen}>
      <Text style={styles.title_textscreen}>Groups</Text>
      <VStack space={4} mt={5}>
        {groups.map((group) => (
          <Pressable key={group.idGrupo} onPress={() => handleEditGroup(group)}>
            <Box borderWidth={1} borderColor="coolGray.300" p="5" rounded="md">
              <HStack justifyContent="space-between" alignItems="center">
                <Text>{group.nome}</Text>
                <IconButton
                  icon={<Icon as={AntDesign} name="edit" size="sm" />}
                />
              </HStack>
            </Box>
          </Pressable>
        ))}
        <Button title="Add Group" onPress={handleAddGroup} />
      </VStack>
    </ScrollView>
  );
};

const GroupsTab = ({ navigation }) => {
  const [groupsUpdate, setGroupsUpdate] = useState(false);
  return ( 
  <GroupsStack.Navigator
    initialRouteName="Groups Screen"
    screenOptions={{ header: () => null }}
  >
    <GroupsStack.Screen name="Groups Screen">
      {(props) => <SeeGroups {...props} groupsUpdate={groupsUpdate} setGroupsUpdate={setGroupsUpdate}/>}
    </GroupsStack.Screen>

    <GroupsStack.Screen name="AddGroup">
      {(props) => <AddGroup {...props} setGroupsUpdate={setGroupsUpdate}/>}
    </GroupsStack.Screen>

    <GroupsStack.Screen name="GroupDetail">
      {(props) => <GroupDetail {...props} setGroupsUpdate={setGroupsUpdate}/>}
    </GroupsStack.Screen>
  </GroupsStack.Navigator>
  );
};

export default GroupsTab;
