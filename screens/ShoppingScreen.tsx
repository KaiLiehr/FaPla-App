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

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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

// if clicked, send a patch req to reverse bought status
const toggleBought = async (item: ShoppingItem) => {
  try {
    await api.patch(`shopping-items/${item.id}/`, {
      bought: !item.bought,
    });

    fetchShoppingItems(); // refresh list
  } catch (error) {
    console.error('Toggle bought error:', error);
  }
};

const renderItem = ({ item }: { item: ShoppingItem }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => toggleBought(item)}
    >
      <View style={[styles.cardRow, item.bought && styles.boughtItem]}>

        {/* Checkbox */}
        <MaterialIcons
          name={item.bought ? 'check-box' : 'check-box-outline-blank'}
          size={26}
          color={item.bought ? '#2e7d32' : '#888'}
          style={styles.checkbox}
        />

        {/* Item content */}
        <View style={styles.itemContent}>
          <Text style={[styles.title, item.bought && styles.boughtText]}>
            {item.name}
          </Text>

          {item.amount ? (
            <Text style={styles.meta}>Amount: {item.amount}</Text>
          ) : null}

          {item.preferred_brand ? (
            <Text style={styles.meta}>
              Brand: {item.preferred_brand}
            </Text>
          ) : null}

          {item.store ? (
            <Text style={styles.meta}>
              Store: {item.store}
            </Text>
          ) : null}

          {item.description ? (
            <Text style={styles.description}>
              {item.description}
            </Text>
          ) : null}
        </View>

      </View>
    </TouchableOpacity>
  );
};

// split shopping list into not bought up top and bought below
const sortedShoppingItems = [...shoppingItems].sort(
  (a, b) => Number(a.bought) - Number(b.bought)
);


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
        data={sortedShoppingItems}
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
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  itemContent: {
    flex: 1,
  },
  boughtItem: {
    opacity: 0.6,
  },
});

export default ShoppingScreen;