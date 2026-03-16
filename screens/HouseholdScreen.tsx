import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import api from '../services/api';

type HouseholdMember = {
  member_id: number;
  member_name: string;
  joined_at: string;
  inviter: number;
};

type Household = {
  id: number;
  name: string;
  created_at: string;
  creator: number;
  members: HouseholdMember[];
};

const HouseholdScreen = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHouseholds = async () => {
    try {
      const response = await api.get('my-households/');
      setHouseholds(response.data);
    } catch (error) {
      console.error('Error fetching households:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHouseholds();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHouseholds();
  };

  const renderItem = ({ item }: { item: Household }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.name}</Text>

        <Text style={styles.memberHeader}>Members:</Text>

        {item.members.map(member => (
          <Text key={member.member_id} style={styles.member}>
            • {member.member_name}
          </Text>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!households.length) {
    return (
      <View style={styles.center}>
        <Text>You are not part of any households.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={households}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },

  memberHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#555',
  },

  member: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HouseholdScreen;