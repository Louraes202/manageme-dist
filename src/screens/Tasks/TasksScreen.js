import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import styles from '../../styles/styles'; // Importar estilos globais
import TasksTab from './Tabs/TasksTab';
import GroupsTab from './Tabs/GroupsTab';
import CategoriesTab from './Tabs/CategoriesTab';

const Tab = createBottomTabNavigator();

const Tasks = () => {
  return (
    <Tab.Navigator screenOptions={{header: () => null, tabBarStyle: {backgroundColor: '#0062ff', borderTopColor: '#0062ff'}, tabBarActiveTintColor: '#fff', tabBarInactiveTintColor: '#dddddd', tabBarActiveBackgroundColor: '#004cff', tabBarItemStyle: {}, tabBarBadgeStyle: {}}} >
      <Tab.Screen name="Tasks" component={TasksTab} options={{tabBarIcon: ({ color, size }) => (<FontAwesome5 name="check" color={'white'} size={24} />) }}/>
      <Tab.Screen name="Groups" component={GroupsTab} options={{tabBarIcon: ({ color, size }) => (<FontAwesome5 name="layer-group" color={'white'} size={24} />) }} />
      <Tab.Screen name="Categories" component={CategoriesTab} options={{tabBarIcon: ({ color, size }) => (<FontAwesome5 name="list-ol" color={'white'} size={24} />) }} />
    </Tab.Navigator>
  );
};

export default Tasks;
