// component for displaying the user in the top right corner
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
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
      <Text style={styles.username}>
        {user?.username ?? ''}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  username: {
    marginRight: 12,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HeaderUser;