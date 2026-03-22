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

const CreateTaskScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueBy, setDueBy] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { households } = useHouseholds();
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<number | null>(null);
  const [type, setType] = useState('chore');

  const createTask = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Task name is required.');
      return;
    }

    try {
      const payload: any = {
        name,
        description,
        type,
      };

      if (dueBy) {
        payload.due_by = dueBy.toISOString();
      }

      payload.scope = selectedHouseholdId; // null = personal

      await api.post('tasks/', payload);

      Alert.alert('Success', 'Task created successfully');

      navigation.goBack();
    } catch (error) {
      console.error('Create task error:', error);
      Alert.alert('Error', 'Could not create task.');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
  setShowDatePicker(false);

  if (selectedDate) {
    setDueBy(selectedDate);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter task name"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        placeholder="Task description"
        multiline
      />

      <Text style={styles.label}>Due Date (optional)</Text>

    <TouchableOpacity
    style={styles.input}
    onPress={() => setShowDatePicker(true)}
    >
        <Text>
        {dueBy
            ? dueBy.toLocaleDateString()
            : 'Select a due date'}
        </Text>
    </TouchableOpacity>

    {showDatePicker && (
        <DateTimePicker
            value={dueBy || new Date()}
        mode="date"
        display="default"
        onChange={onDateChange}
        />
    )}

      <Text style={styles.label}>Task Type</Text>
      <TextInput
        style={styles.input}
        value={type}
        onChangeText={setType}
        placeholder="chore / cooking / shopping"
      />

      <View>
        <Text style={styles.label}>Scope</Text>
        {/* Personal Option */}
        <TouchableOpacity
          style={[
            styles.option,
            selectedHouseholdId === null && styles.selectedOption,
          ]}
          onPress={() => setSelectedHouseholdId(null)}
        >
          <Text style={styles.optionText}>Personal</Text>
        </TouchableOpacity>

        {/* Household Options */}
        {households.map((household) => (
        <TouchableOpacity
          key={household.id}
          style={[
            styles.option,
            selectedHouseholdId === household.id && styles.selectedOption,
          ]}
          onPress={() => setSelectedHouseholdId(household.id)}
        >
          <Text style={styles.optionText}>{household.name}</Text>
        </TouchableOpacity>
        ))}
      </View>

      <Button title="Create Task" onPress={createTask} />
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

export default CreateTaskScreen;
