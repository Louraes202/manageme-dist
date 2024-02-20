// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import styles from '../styles/styles'; // Import global styles

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setRegistering] = useState(false);

  const handleAction = () => {
    if (isRegistering) {
      // Logic for registration
      console.log('Registration:', email, password);
    } else {
      // Logic for login
      console.log('Login:', email, password);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.maintext}>{isRegistering ? 'Register' : 'Login'} Screen</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={email => setEmail(email)}
        style={authStyles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={password => setPassword(password)}
        secureTextEntry
        style={authStyles.input}
      />

      {/* Button for login or registration */}
      <TouchableOpacity onPress={handleAction} style={authStyles.button}>
        <Text style={authStyles.buttonText}>{isRegistering ? 'Register' : 'Login'}</Text>
      </TouchableOpacity>

      {/* Button to switch between Login and Register */}
      <TouchableOpacity onPress={() => setRegistering(!isRegistering)} style={authStyles.button}>
        <Text style={authStyles.buttonText}>
          {isRegistering ? 'Switch to Login' : 'Switch to Register'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const authStyles = StyleSheet.create({
  input: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#1c73ff',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  switchButtonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  switchButton: {
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#1c73ff',
    fontSize: 16,
  },
});

export default LoginScreen;
