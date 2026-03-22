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

import { useNavigation, useRoute } from '@react-navigation/native';

import { useHouseholds } from '../context/HouseholdContext';

import api from '../services/api';

const EditShoppingItemScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const { item } = route.params;

  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description || '');
  const [amount, setAmount] = useState(item.amount || '');
  const [preferredBrand, setPreferredBrand] = useState(item.preferred_brand || '');
  const [store, setStore] = useState(item.store || '');
  const { households } = useHouseholds();
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<number | null>(item.scope);

  const updateItem = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Item name is required.');
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

      await api.patch(`shopping-items/${item.id}/`, payload);

      Alert.alert('Success', 'Item updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Update item error:', error);
      Alert.alert('Error', 'Could not update item.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Item Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.multiline]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Preferred Brand</Text>
      <TextInput
        style={styles.input}
        value={preferredBrand}
        onChangeText={setPreferredBrand}
      />

      <Text style={styles.label}>Store</Text>
      <TextInput
        style={styles.input}
        value={store}
        onChangeText={setStore}
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

      <Button title="Save Changes" onPress={updateItem} />
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
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 6,
  },
  selectedOption: {
    borderColor: '#2e7d32',
    backgroundColor: '#e8f5e9',
  },
});

export default EditShoppingItemScreen;