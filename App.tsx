/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import LoginScreen from './src/screens/Login';
import UserListScreen from './src/screens/UserList';
import ChatScreen from './src/screens/Chat';
import StatusScreen from './src/screens/Status';
import MoviesScreen from './src/screens/Movies';
import GiftsScreen from './src/screens/Gifts';

const Stack = createNativeStackNavigator();


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="UserList" component={UserListScreen} options={{headerShown: false}} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Status" component={StatusScreen} />
        <Stack.Screen name="Movies" component={MoviesScreen} />
        <Stack.Screen name="Gifts" component={GiftsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
