import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { TasksStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import api from '../services/api';
import { useHouseholds } from '../context/HouseholdContext';

type RouteProps = RouteProp<TasksStackParamList, 'EditTask'>;
type NavProps = NativeStackNavigationProp<TasksStackParamList>;

const EditTaskScreen = () => {
  const navigation = useNavigation<NavProps>();
  const route = useRoute<RouteProps>();
  const { task } = route.params;

  const { households } = useHouseholds();

  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || '');
  const [dueBy, setDueBy] = useState<Date | null>(
    task.due_by ? new Date(task.due_by) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [type, setType] = useState(task.type || 'chore');
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<number | null>(
    task.scope
  );

  const updateTask = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Task name is required.');
      return;
    }

    try {
      const payload: any = {
        name,
        description,
        type,
        scope: selectedHouseholdId,
      };

      if (dueBy) {
        payload.due_by = dueBy.toISOString();
      }

      await api.patch(`tasks/${task.id}/`, payload);

      Alert.alert('Success', 'Task updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Update task error:', error);
      Alert.alert('Error', 'Could not update task.');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDueBy(selectedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Task Name *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Due Date</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>
          {dueBy ? dueBy.toLocaleDateString() : 'Select a due date'}
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
      <TextInput style={styles.input} value={type} onChangeText={setType} />

      {/* Scope Selection */}
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

      {households.map((h) => (
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

      <Button title="Save Changes" onPress={updateTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  label: { marginTop: 12, marginBottom: 4, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  multiline: { height: 80, textAlignVertical: 'top' },

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
});

export default EditTaskScreen;