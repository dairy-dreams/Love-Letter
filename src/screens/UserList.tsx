import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity, Image, TextInput } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { primary, secondary } from '../CONSTANTS/COLOR';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { AuthContext } from '../../App';

const TABS = [
  { key: 'chat', label: 'Chat' },
  { key: 'status', label: 'Status' },
  { key: 'movies', label: 'Movies' },
  { key: 'gifts', label: 'Gifts' },
];

export default function HomeScreen({ navigation }: any) {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users'),
      where('uid', '!=', user.uid)
    );
    const unsub = onSnapshot(q, snap => {
      setUsers(snap.docs.map(doc => doc.data()));
    });
    return unsub;
  }, [user]);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => navigation.navigate('Chat', { userId: item.uid, userName: item.name, avatar: item.avatar })}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <Text style={styles.userName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <Text style={styles.heading}>Lover Letter</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search users..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#888"
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
      <View style={styles.bottomNav}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={styles.navItem}
            onPress={() => {setActiveTab(tab.key); navigation.navigate(tab.label)}}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.navLabel,
              { color: activeTab === tab.key ? primary : '#888' }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    color: primary,
    marginBottom: 24,
  },
  searchBar: {
    width: '100%',
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 18,
    color: '#222',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  listContent: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingBottom: 80, // space for bottom nav
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#ddd',
  },
  userName: {
    fontSize: 20,
    color: '#222',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    zIndex: 100,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
});
