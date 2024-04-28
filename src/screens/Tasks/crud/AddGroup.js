import React, { useState } from 'react';
import { View, Button, TextInput, Text } from 'react-native';

import styles from '../../../styles/styles';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("manageme");

const AddGroup = ({route, navigation, setGroupsUpdate}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSave = () => {
        db.transaction(tx => {
            tx.executeSql(
                "INSERT INTO Grupos (nome, descricao) VALUES (?, ?);",
                [name, description],
                () => {
                    console.log('Group added:', { name, description });
                    setGroupsUpdate(true);
                    navigation.goBack();
                },
                (_, error) => console.log(error)
            );
        });
    };

    return (
        <View style={styles.container}>
            <Text>Name:</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <Text>Description:</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                multiline
            />
            <Button title="Save" onPress={handleSave} />
        </View>
    );
};

export default AddGroup;
