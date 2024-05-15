import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import {
  Switch,
  Box,
  Select,
  CheckIcon,
  Button,
  VStack,
  Modal,
  FormControl,
  useToast,
} from 'native-base';
import * as SQLite from 'expo-sqlite';
import { useGlobalContext } from '../../context/GlobalProvider';

const db = SQLite.openDatabase("manageme");

const Settings = () => {
  const [notificacoes, setNotificacoes] = useState(false);
  const [tema, setTema] = useState('light');
  const [fusoHorario, setFusoHorario] = useState('GMT');
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const toast = useToast();
  const { idUtilizador, toggleTheme } = useGlobalContext();

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Configuracoes WHERE idUtilizador = ?',
        [idUtilizador],
        (_, { rows }) => {
          if (rows.length > 0) {
            const config = rows.item(0);
            setNotificacoes(config.notificacoes);
            setTema(config.tema);
            setFusoHorario(config.fusoHorario);
          }
        },
        (tx, error) => {
          console.error('Erro ao carregar configurações: ', error);
        }
      );
    });
  }, [idUtilizador]);

  const saveSettings = () => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT OR REPLACE INTO Configuracoes (idUtilizador, notificacoes, tema, fusoHorario) VALUES (?, ?, ?, ?)',
        [idUtilizador, notificacoes, tema, fusoHorario],
        () => {
          toggleTheme(tema, "");
          toast.show({ description: 'Configurações salvas com sucesso.' });
        },
        (tx, error) => {
          console.error('Erro ao salvar configurações: ', error);
          toast.show({ description: 'Erro ao salvar configurações.' });
        }
      );
    });
  };

  return (
    <View>
      <VStack space={4} padding={4}>
        <FormControl>
          <FormControl.Label>Notificações</FormControl.Label>
          <Switch isChecked={notificacoes} onToggle={() => setNotificacoes(!notificacoes)} />
        </FormControl>

        <FormControl>
          <FormControl.Label>Tema</FormControl.Label>
          <Select
            selectedValue={tema}
            minWidth="200"
            onValueChange={value => setTema(value)}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />
            }}
          >
            <Select.Item label="Light" value="light" />
            <Select.Item label="Dark" value="dark" />
          </Select>
        </FormControl>

        <FormControl>
          <FormControl.Label>Fuso Horário</FormControl.Label>
          <Select
            selectedValue={fusoHorario}
            minWidth="200"
            onValueChange={value => setFusoHorario(value)}
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size="5" />
            }}
          >
            <Select.Item label="GMT" value="GMT" />
            <Select.Item label="CET" value="CET" />
            <Select.Item label="EST" value="EST" />
          </Select>
        </FormControl>

        <Button onPress={saveSettings}>Salvar Configurações</Button>
        <Button onPress={() => setAboutModalVisible(true)}>About</Button>

        <Modal isOpen={aboutModalVisible} onClose={() => setAboutModalVisible(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>About</Modal.Header>
            <Modal.Body>
              <Text>Manage Me App</Text>
              <Text>Versão 1.0.0</Text>
              <Text>Esta aplicação ajuda na gestão de tarefas, eventos e atividades.</Text>
            </Modal.Body>
            <Modal.Footer>
              <Button onPress={() => setAboutModalVisible(false)}>Fechar</Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </VStack>
    </View>
  );
};

export default Settings;
