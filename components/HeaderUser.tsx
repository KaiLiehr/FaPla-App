// component for displaying the user in the top right corner
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

const HeaderUser = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Do you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout }
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handleLogout}>
      <View style={styles.container}>
        <Text style={styles.username}>{user?.username ?? ''}</Text>
        {user?.id !== undefined && (
          <Text style={styles.userId}> • ID: {user.id}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
  },
  userId: {
    fontSize: 12,
    color: '#888', // slightly lighter than the username
  },
});

export default HeaderUser;