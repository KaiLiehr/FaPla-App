import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthStack';
import api from '../../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen = ({ navigation }: Props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

const handleRegister = async () => {
  if (!username || !email || !password) {
    Alert.alert('Validation', 'All fields are required.');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Validation', 'Passwords do not match.');
    return;
  }

  try {
    await api.post('auth/register/', {
      username,
      email,
      password,
    });

    Alert.alert('Success', 'Account created. You can now log in.');
    navigation.navigate('Login');

  } catch (error: any) {
    console.error('Register error:', error);

    if (error.response?.data) {
      const messages = Object.values(error.response.data).flat().join('\n');
      Alert.alert('Error', messages);
    } else {
      Alert.alert('Error', 'Could not register.');
    }
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
      />

      {/* <Button title="Register" onPress={handleRegister} disabled={!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()} /> */}
      <TouchableOpacity
        style={[
          styles.button,
          (!username.trim() ||
            !email.trim() ||
            !password.trim() ||
            !confirmPassword.trim()) && styles.buttonDisabled
        ]}
        onPress={handleRegister}
        disabled={
          !username.trim() ||
          !email.trim() ||
          !password.trim() ||
          !confirmPassword.trim()
        }
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  linkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#2e7d32',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a5d6a7',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default RegisterScreen;
