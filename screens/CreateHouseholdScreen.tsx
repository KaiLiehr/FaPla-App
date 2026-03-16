import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const CreateHouseholdScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');

  const createHousehold = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Household name is required.');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
      };

      await api.post('my-households/', payload);

      Alert.alert('Success', 'Household created successfully.');

      navigation.goBack(); // return to HouseholdScreen
    } catch (error) {
      console.error('Create household error:', error);
      Alert.alert('Error', 'Could not create household.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Household Name *</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter household name"
      />

      <View style={styles.buttonContainer}>
        <Button title="Create Household" onPress={createHousehold} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },

  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },

  buttonContainer: {
    marginTop: 24,
  },
});

export default CreateHouseholdScreen;