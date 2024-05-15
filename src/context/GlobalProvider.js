import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchAllDataFromSQLite, uploadDataToFirebase, downloadDataFromFirebase } from './dataSyncFunction';
import moment from "moment";
import firebase from 'firebase/compat/app';
import NetInfo from "@react-native-community/netinfo";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("manageme");

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);



export const GlobalProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);

  const [updateTasks, setUpdateTasks] = useState(false);
  const [updateProjects, setUpdateProjects] = useState(false);
  const [updateGroups, setUpdateGroups] = useState(false);
  const [updateEvents, setUpdateEvents] = useState(false);
  const [updateActivities, setUpdateActivities] = useState(false);
  const [updateBlocks, setUpdateBlocks] = useState(false);
  const [updateHabits, setUpdateHabits] = useState(false);
  const [theme, setTheme] = useState("light");
  const [idUtilizador, setIdUtilizador] = useState();

  const syncDataToFirebase = async () => {
    if (!isOnline) return;
    const data = await fetchAllDataFromSQLite();
    await uploadDataToFirebase(data);
  };

  const syncDataFromFirebase = async () => {
    if (!isOnline) return;
    await downloadDataFromFirebase();
  };

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT tema FROM Configuracoes WHERE idUtilizador = ?',
        [idUtilizador], 
        (_, { rows }) => {
          if (rows.length > 0) {
            setTheme(rows.item(0).tema);
          }
        }
      );
    });
  }, []);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Configuracoes SET tema = ? WHERE idUtilizador = ?',
        [newTheme, idUtilizador], 
        () => {
          console.log("Tema atualizado com sucesso.");
        },
        (tx, error) => {
          console.error("Erro ao atualizar o tema: ", error);
        }
      );
    });
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        syncDataFromFirebase(); // Sincroniza ao fazer login
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    return () => {
      unsubscribeNetInfo();
    };
  }, []);
  

  useEffect(() => {
    syncDataToFirebase();
  }, [isOnline, updateTasks, updateProjects, updateGroups, updateEvents, updateActivities, updateBlocks, updateHabits]);

  const value = {
    updateTasks,
    setUpdateTasks,
    updateProjects,
    setUpdateProjects,
    updateGroups,
    setUpdateGroups,
    updateEvents,
    setUpdateEvents,
    updateActivities,
    setUpdateActivities,
    updateBlocks,
    setUpdateBlocks,
    updateHabits,
    setUpdateHabits,
    theme,
    toggleTheme,
    idUtilizador,
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
