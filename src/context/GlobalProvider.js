import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [updateTasks, setUpdateTasks] = useState(false);
  const [updateProjects, setUpdateProjects] = useState(false);
  const [updateGroups, setUpdateGroups] = useState(false);
  const [updateEvents, setUpdateEvents] = useState(false);
  const [updateActivities, setUpdateActivities] = useState(false);
  const [updateBlocks, setUpdateBlocks] = useState(false);
  
  
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
  };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
