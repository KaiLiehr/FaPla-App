import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

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
  const [isPersonal, setIsPersonal] = useState(item.scope === null);

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

      if (!isPersonal) {
        payload.scope = null; // keep consistent with your current logic
      }

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

      <View style={styles.switchRow}>
        <Text>Personal Item</Text>
        <Switch value={isPersonal} onValueChange={setIsPersonal} />
      </View>

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
});

export default EditShoppingItemScreen;