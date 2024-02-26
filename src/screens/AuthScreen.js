import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
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

  const [isLoading, setLoading] = useState(false);


  const handleLogin = async () => {
    try {
      setLoading(true);
      await auth.signInWithEmailAndPassword(email, password);
      setLoading(false);
      Alert.alert('Success', 'Login successful');
      return true;
    } catch (error) {
      setLoading(false);
      console.error('Erro ao autenticar:', error.message);
      Alert.alert('Error', 'Login failed. Check your credentials.');
      return false;
    }
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      await auth.createUserWithEmailAndPassword(email, password);
      setLoading(false);
      Alert.alert('Success', 'Registration successful');
      return true;
    } catch (error) {
      setLoading(false);
      console.error('Error creating account:', error.message);
      Alert.alert('Error', 'Registration failed. Check your credentials and try again.');
      return false;
    }
  };

  const handleAction = async () => {
    const success = isRegistering ? await handleSignUp() : await handleLogin();
    if (success) {
      console.log('Autenticação feita com sucesso.');
      navigation.navigate('Home');
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

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

    </View>
  );
};

export default LoginScreen;
