import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
  TouchableOpacity,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { useHouseholds } from '../context/HouseholdContext';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

const CreateShoppingItemScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { households } = useHouseholds();
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<number | null>(null);
  const [amount, setAmount] = useState('');
  const [preferredBrand, setPreferredBrand] = useState('');
  const [store, setStore] = useState('');

  const CreateShoppingItem = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Task name is required.');
      return;
    }

    try {
      const payload: any = {
        name,
        description,
        amount,
        preferred_brand: preferredBrand,
        store,
      };

      payload.scope = selectedHouseholdId;

      await api.post('shopping-items/', payload);

      Alert.alert('Success', 'Task created successfully');

      navigation.goBack();
    } catch (error) {
      console.error('Create task error:', error);
      Alert.alert('Error', 'Could not create task.');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter product name"
      />

      <Text style={styles.label}>Description (optional)</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        placeholder="Task description"
        multiline
      />

      <Text style={styles.label}>Amount (optional)</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="e.g. 2kg, 1 bottle, 6 pcs"
      />

      <Text style={styles.label}>Preferred Brand (optional)</Text>
      <TextInput
        style={styles.input}
        value={preferredBrand}
        onChangeText={setPreferredBrand}
        placeholder="e.g. Oatly, Barilla"
      />

      <Text style={styles.label}>Store (optional)</Text>
      <TextInput
        style={styles.input}
        value={store}
        onChangeText={setStore}
        placeholder="e.g. REWE, Lidl, Aldi"
      />

      <Text style={styles.label}>Scope</Text>
      <TouchableOpacity
        style={[
          styles.option,
          selectedHouseholdId === null && styles.selectedOption,
        ]}
        onPress={() => setSelectedHouseholdId(null)}
      >
       <Text>Personal</Text>
      </TouchableOpacity>

      {households.map(h => (
      <TouchableOpacity
        key={h.id}
        style={[
          styles.option,
          selectedHouseholdId === h.id && styles.selectedOption,
        ]}
        onPress={() => setSelectedHouseholdId(h.id)}
      >
        <Text>{h.name}</Text>
      </TouchableOpacity>
      ))}

      <Button title="Add to shopping list" onPress={CreateShoppingItem} />
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
    marginBottom: 4,
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },

  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },

  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
    alignItems: 'center',
  },
  option: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  selectedOption: {
    borderColor: '#2e7d32',
    backgroundColor: '#e8f5e9',
  },
  optionText: {
    fontSize: 14,
  },
});

export default CreateShoppingItemScreen;
