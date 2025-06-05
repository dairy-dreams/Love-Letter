import React, {useContext} from 'react';
import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-gesture-handler';
import {primary, secondary} from '../CONSTANTS/COLOR';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {signInWithCredential, GoogleAuthProvider} from 'firebase/auth';
import {auth, db} from '../../firebaseConfig';
import {doc, setDoc} from 'firebase/firestore';
import {AuthContext} from '../../App';

export default function LoginScreen({navigation}: any) {
  const {user} = useContext(AuthContext);

  React.useEffect(() => {
    if (user) {
      navigation.replace('UserList');
    }
  }, [user, navigation]);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken, user: googleUser} = await GoogleSignin.signIn();
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);

      // Save user to Firestore
      await setDoc(
        doc(db, 'users', userCredential.user.uid),
        {
          uid: userCredential.user.uid,
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          avatar: userCredential.user.photoURL,
        },
        {merge: true},
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headingContainer}>
        <Text style={styles.heading}>Login Screen</Text>
        <Text style={styles.subheading}>Love Letter - Where Love Begins</Text>
      </View>
      <Image source={require('../assets/login.png')} style={styles.image} />
      <TouchableOpacity
        style={styles.button}
        onPress={handleGoogleLogin}
        activeOpacity={0.8}>
        <View style={styles.buttonContent}>
          <Image
            source={require('../assets/Google.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.buttonText}>Continue with Google</Text>
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
