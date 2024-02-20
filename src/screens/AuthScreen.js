// LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import styles from '../styles/styles'; // Importar estilos globais

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setRegistering] = useState(false);

  const handleAction = () => {
    if (isRegistering) {
      // Lógica para registro
      console.log('Registro:', email, password);
    } else {
      // Lógica para login
      console.log('Login:', email, password);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.maintext}>{isRegistering ? 'Register' : 'Login'} Screen</Text>
      {/* Campos de entrada para e-mail/password */}
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry={true} value={password} onChangeText={setPassword} />
      {/* Botão para login ou registro */}
      <Button title={isRegistering ? 'Register' : 'Login'} onPress={handleAction} />
      {/* Alternar entre login e registo */}
      <Button
        title={isRegistering ? 'Switch to Login' : 'Switch to Register'}
        onPress={() => setRegistering(!isRegistering)}
      />
    </View>
  );
};

export default LoginScreen;