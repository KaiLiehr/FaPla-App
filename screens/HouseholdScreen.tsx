import React, { useState, useCallback } from 'react';
import {
  Alert,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HouseholdStackParamList } from '../types/navigation';

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


type HouseholdNavProp = NativeStackNavigationProp<
  HouseholdStackParamList,
  'Households'
>;



const HouseholdScreen = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation<HouseholdNavProp>();

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

const leaveHousehold = async (household: Household) => {
  try {
    const confirmed = await new Promise<boolean>((resolve) => {
      Alert.alert(
        'Leave Household',
        `Are you sure you want to leave "${household.name}"? (If the last member leaves, the household gets deleted, entirely.)`,
        [
          { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
          { text: 'Leave', style: 'destructive', onPress: () => resolve(true) },
        ],
        { cancelable: true }
      );
    });

    if (!confirmed) return;

    await api.delete(`memberships/${household.id}/`);

    fetchHouseholds(); // refresh list
  } catch (error) {
    console.error('Leave household error:', error);
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

        {/* Leave Button */}
        <TouchableOpacity
          style={styles.leaveButton}
          onPress={() => leaveHousehold(item)}
        >
          <Text style={styles.leaveButtonText}>Leave Household</Text>
        </TouchableOpacity>

        {/* Invite Button */}
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() =>
            navigation.navigate('InviteMember', {
              householdId: item.id,
            })
          }
        >
          <Text style={styles.inviteButtonText}>Invite New Member</Text>
        </TouchableOpacity>

      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : households.length === 0 ? (
        <View style={styles.center}>
          <Text>You are not part of any households.</Text>
        </View>
      ) : (
        <FlatList
          data={households}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        />
      )}

      {/* Floating Create Household Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateHousehold' as never)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

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

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  fabText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  leaveButton: {
    marginTop: 12,
    backgroundColor: '#d32f2f',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  leaveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  inviteButton: {
    marginTop: 8,
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default HouseholdScreen;