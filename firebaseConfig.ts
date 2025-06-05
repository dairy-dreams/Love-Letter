import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
//@ts-ignore
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: 'AIzaSyD4cub_6agONFLc0FlfNliJag3QNvaDwrM',
  authDomain: 'chat-app-55d36.firebaseapp.com',
  projectId: 'chat-app-55d36',
  storageBucket: 'chat-app-55d36.firebasestorage.app',
  messagingSenderId: '270409569896',
  appId: '1:270409569896:android:c916b0bc57c0d37c9f0ddd',
};


const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
