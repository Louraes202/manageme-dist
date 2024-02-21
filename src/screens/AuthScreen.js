import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import styles from '../styles/styles'; // Import global styles
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from '../services/firebaseConfig';
import { Dimensions } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setRegistering] = useState(false);
  
  const { width, height } = Dimensions.get('window');

  // to initialize the firebase App
  const firebaseApp = firebase.initializeApp(firebaseConfig);

  // for db & auth
  const db = firebaseApp.firestore();
  const auth = firebase.auth();



  const handleLogin = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Login successful');
      return true;
    } catch (error) {
      console.error('Erro ao autenticar:', error.message);
      Alert.alert('Error', 'Login failed. Check your credentials.');
      return false;
    }
  };

  const handleSignUp = async () => {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Registration successful');
      return true;
    } catch (error) {
      console.error('Error creating account:', error.message);
      Alert.alert('Error', 'Registration failed. Check your credentials and try again.');
      return false;
    }
  };

  const handleAction = async () => {
    const success = isRegistering ? await handleSignUp() : await handleLogin();
    if (success) {
      console.log('Autenticação feita com sucesso.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.authmaintext}>{isRegistering ? 'Register' : 'Login'} Screen</Text>

      <TextInput
        label="Email"
        value={email}
        style={styles.input}
        onChangeText={email => setEmail(email)}
      />

      <TextInput
        label="Password"
        value={password}
        style={styles.input}
        onChangeText={password => setPassword(password)}
        secureTextEntry
      />


        {/* Button for login or registration */}
        <TouchableOpacity onPress={handleAction} style={styles.button}>
          <Text>{isRegistering ? 'Register' : 'Login'}</Text>
        </TouchableOpacity>
        {/* Button to switch between Login and Register */}
        <TouchableOpacity onPress={() => setRegistering(!isRegistering)} style={styles.button}>
          <Text>
            {isRegistering ? 'Switch to Login' : 'Switch to Register'}
          </Text>
        </TouchableOpacity>

    </View>
  );
};

export default LoginScreen;
