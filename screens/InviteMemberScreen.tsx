import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';

import api from '../services/api';

import { HouseholdStackParamList } from '../types/navigation';
type RouteProps = RouteProp<
  HouseholdStackParamList,
  'InviteMember'
>;





type User = {
  id: number;
  username: string;
};

const InviteMemberScreen = () => {
  const route = useRoute<RouteProps>();
  
  const navigation = useNavigation();

  const { householdId } = route.params;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (text: string) => {
    setQuery(text);

    if (text.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`users/search/?search=${text}`);
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const inviteUser = async (user: User) => {
    try {
      await api.post('memberships/', {
        household: householdId,
        user_id: user.id,
      });

      Alert.alert('Success', `${user.username} invited`);
      navigation.goBack();
    } catch (error: any) {
      console.error('Invite error:', error);

      Alert.alert(
        'Error',
        error?.response?.data?.detail || 'Could not invite user'
      );
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => inviteUser(item)}
    >
      <Text style={styles.username}>
        {item.username} (ID: {item.id})
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search users..."
        value={query}
        onChangeText={searchUsers}
        style={styles.input}
      />

      {loading && <ActivityIndicator style={{ marginTop: 10 }} />}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default InviteMemberScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },

  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  username: {
    fontSize: 16,
  },
});