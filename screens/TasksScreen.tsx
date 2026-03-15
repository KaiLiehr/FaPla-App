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
import { Task } from '../types/Task';
import { useAuth } from '../context/AuthContext';

const TasksScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const { user } = useAuth();
  const navigation = useNavigation();

  const fetchTasks = async () => {
    try {
      const response = await api.get('tasks/');
      console.log('Tasks response:', response.data);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

 useFocusEffect(
  useCallback(() => {
    fetchTasks();
  }, [])
);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

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

  const toggleFinished = async (task: Task) => {
  try {
    await api.patch(`tasks/${task.id}/`, {
      finished: !task.finished,
    });

    fetchTasks();
  } catch (error) {
    console.error('Toggle finished error:', error);
  }
  };


  const renderItem = ({ item }: { item: Task }) => {
  const isExpanded = expandedTaskId === item.id;
  const isExecutor = item.executors.some(
    executor => executor.id === user?.id
  );

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => setExpandedTaskId(isExpanded ? null : item.id)}
    >
      <View
        style={[
          styles.card,
          isExpanded && styles.expandedCard,
          item.finished && styles.finishedCard,
        ]}
      >
        {/* ROW: checkbox + title */}
        <View style={styles.row}>
          <TouchableOpacity onPress={() => toggleFinished(item)}>
            <MaterialIcons
              name={item.finished ? 'check-box' : 'check-box-outline-blank'}
              size={26}
              color={item.finished ? '#2e7d32' : '#888'}
              style={styles.checkbox}
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={[styles.title, item.finished && styles.finishedText]}>
              {item.name}
            </Text>

            {item.description ? (
              <Text style={styles.description}>{item.description}</Text>
            ) : null}
          </View>
        </View>

        {/* META INFORMATION */}
        <Text style={styles.meta}>
          {item.scope === null ? 'Personal Task' : 'Household Task'}
        </Text>

        {item.executors.length > 0 && (
          <Text style={styles.meta}>
            Executors: {item.executors.map(e => e.username).join(', ')}
          </Text>
        )}

        {item.due_by && (
          <Text style={styles.meta}>
            Due: {new Date(item.due_by).toLocaleDateString()}
          </Text>
        )}

        {/* EXPANDED SECTION */}
        {isExpanded && (
          <View style={styles.expandedSection}>
            <Button
              title={
                isExecutor
                  ? 'Give Up Responsibility'
                  : 'Take Responsibility'
              }
              onPress={() => toggleResponsibility(item)}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

  const sortedTasks = [...tasks].sort(
  (a, b) => Number(a.finished) - Number(b.finished)
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : !tasks.length ? (
        <View style={styles.center}>
          <Text>No tasks found.</Text>
        </View>
      ) : (
        <FlatList
          data={sortedTasks}
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
        onPress={() => navigation.navigate('CreateTask' as never)}
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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  finishedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  finishedCard: {
    opacity: 0.6,
  },
});

export default TasksScreen;