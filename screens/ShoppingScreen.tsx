import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Button,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import api from '../services/api';
import { ShoppingItem } from '../types/Task';
import { useAuth } from '../context/AuthContext';

const ShoppingScreen = () => {
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  //const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const { user } = useAuth();
  const navigation = useNavigation();

  const fetchShoppingItems = async () => {
    try {
      const response = await api.get('shopping-items/');
      console.log('Shopping Items response:', response.data);
      setShoppingItems(response.data);
    } catch (error) {
      console.error('Error fetching shopping items:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

 useFocusEffect(
  useCallback(() => {
    fetchShoppingItems();
  }, [])
);

  const onRefresh = () => {
    setRefreshing(true);
    fetchShoppingItems();
  };

 /* // CURRENTLY NO RESPONSIBILITY FOR SHOPPING ITEMS
 const toggleResponsibility = async (task: Task) => {
  try {
    const isExecutor = task.executors.some(
 	 executor => executor.id === user?.id
	);

    if (isExecutor) {
      await api.delete(`tasks/${task.id}/responsibility/`);
    } else {
      await api.post(`tasks/${task.id}/responsibility/`);
    }

    fetchTasks(); // refresh list
    } catch (error) {
      console.error('Responsibility error:', error);
   }
  }; 
  */



  const renderItem = ({ item }: { item: ShoppingItem }) => {
  //const isExpanded = expandedTaskId === item.id;
  //const isExecutor = item.executors.length > 0;

  // TODO maybe add scope, date and creator?
  return (
    <TouchableOpacity activeOpacity={0.9}> 
      <View style={styles.card}>
        {/* Item name */}
        <Text style={[styles.title, item.bought && styles.boughtText]}>
          {item.name}
        </Text>  

        {/* Amount */}
        {item.amount ? (
          <Text style={styles.meta}>
            Amount: {item.amount}
          </Text>
        ) : null}

        {/* Optional description */}
        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null}

        {/* Preferred brand */}
        {item.preferred_brand ? (
          <Text style={styles.meta}>
            Brand: {item.preferred_brand}
          </Text>
        ) : null}

        {/* Store */}
        {item.store ? (
          <Text style={styles.meta}>
            Store: {item.store}
          </Text>
        ) : null}

        {/* Bought status */}
        {item.bought && (
          <Text style={styles.meta}>
            ✓ Bought
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  
}; 

return (
  <View style={styles.container}>
    {loading ? (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    ) : !shoppingItems.length ? (
      <View style={styles.center}>
        <Text>No Shopping Items found.</Text>
      </View>
    ) : (
      <FlatList
        data={shoppingItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      />
    )}

    {/* Floating Create Item Button */}
    <TouchableOpacity
      style={styles.fab}
      onPress={() => navigation.navigate('CreateShoppingItem' as never)}
    >
      <Text style={styles.fabText}>+</Text>
    </TouchableOpacity>
  </View>
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
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    marginTop: 4,
    color: '#555',
  },
  meta: {
    marginTop: 6,
    fontSize: 12,
    color: '#888',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandedCard: {
  borderWidth: 1,
  borderColor: '#2e7d32',
  },

  expandedSection: {
  marginTop: 12,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30, // sits above the bottom tab bar
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2e7d32',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // shadow for Android
  },
  fabText: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  boughtText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});

export default ShoppingScreen;