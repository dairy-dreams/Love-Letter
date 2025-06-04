import React from 'react';
import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-gesture-handler';
import {primary, secondary} from '../CONSTANTS/COLOR';

export default function LoginScreen({navigation}: any) {
  return (
    <View style={styles.screen}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Login Screen</Text>
        <Text style={styles.subheading}>Love Letter - Where Love Begins</Text>
      </View>
      <Image source={require('../assets/login.png')} style={styles.image} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserList')}
        activeOpacity={0.8}>
        <View style={styles.buttonContent}>
          <Image source={require('../assets/Google.png')} style={styles.googleIcon} />
          <Text style={styles.buttonText}>Login with Google</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  headingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    color: primary,
  },
  subheading: {
    fontSize: 10,
    fontWeight: 'bold',
    color: secondary,
  },
  image: {width: 480, height: 480, objectFit: 'contain'},
  button: {
    backgroundColor: primary,
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 24,
    shadowColor: primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
    resizeMode: 'contain',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
    textAlign: 'center',
  },
});
