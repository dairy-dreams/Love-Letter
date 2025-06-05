/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, createContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, useColorScheme } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import LoginScreen from './src/screens/Login';
import UserListScreen from './src/screens/UserList';
import ChatScreen from './src/screens/Chat';
import StatusScreen from './src/screens/Status';
import MoviesScreen from './src/screens/Movies';
import GiftsScreen from './src/screens/Gifts';

const Stack = createNativeStackNavigator();

export const AuthContext = createContext<{ user: User | null }>({ user: null });

// Configure GoogleSignin ONCE, outside the component
GoogleSignin.configure({
  webClientId: '270409569896-4mt1c2bp6phvfh3l95ns7j9bbs1tt0lv.apps.googleusercontent.com',
});

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      <NavigationContainer>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="UserList" component={UserListScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Status" component={StatusScreen} />
          <Stack.Screen name="Movies" component={MoviesScreen} />
          <Stack.Screen name="Gifts" component={GiftsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
