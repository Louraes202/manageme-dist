import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchAllDataFromSQLite, uploadDataToFirebase, downloadDataFromFirebase } from './dataSyncFunction';
import moment from "moment";
import firebase from 'firebase/compat/app';

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
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        syncDataFromFirebase(); // Sincroniza ao fazer login
      }
    });
    return () => unsubscribe();
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
    setUpdateHabits
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
