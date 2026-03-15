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

import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

const CreateTaskScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueBy, setDueBy] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPersonal, setIsPersonal] = useState(true);
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

      if (!isPersonal) {
        // for now household tasks not implemented in UI
        payload.scope = null;
      }

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

      <View style={styles.switchRow}>
        <Text>Personal Task</Text>
        <Switch value={isPersonal} onValueChange={setIsPersonal} />
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
});

export default CreateTaskScreen;
