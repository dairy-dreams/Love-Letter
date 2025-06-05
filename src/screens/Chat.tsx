import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import {Text} from 'react-native-gesture-handler';
import {primary} from '../CONSTANTS/COLOR';
import {Swipeable} from 'react-native-gesture-handler';
import { db } from '../../firebaseConfig';
import { AuthContext } from '../../App';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

export default function ChatScreen({navigation, route}: any) {
  const { user } = useContext(AuthContext);
  const { userId, userName, avatar } = route.params || {};
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Generate a unique chatId for the two users (sorted)
  const chatId = [user.uid, userId].sort().join('_');

  useEffect(() => {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt')
    );
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsub;
  }, [chatId]);

  // Keyboard handling
  React.useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height + (replyTo ? 60 : 30));
      console.log('Keyboard height:', e.endCoordinates.height + 180);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardHeight(replyTo ? 30 : 0),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [replyTo]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.header}>
          <Image source={{uri: avatar}} style={styles.headerAvatar} />
          <Text style={styles.headerName}>{userName}</Text>
        </View>
      ),
    });
  }, [navigation, userName, avatar]);

  const sendMessage = async () => {
    if (input.trim()) {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: input,
        sender: user.uid,
        senderName: user.displayName,
        createdAt: serverTimestamp(),
        replyTo: replyTo ? replyTo.text : undefined,
      });
      setInput('');
      setReplyTo(null);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  };

  // Swipeable reply action
  const renderLeftActions = (progress: any, dragX: any, item: any) => {
    return (
      <View style={styles.replyAction}>
        <Text style={styles.replyActionText}>Reply</Text>
      </View>
    );
  };

  const handleSwipeReply = (item: any) => {
    setReplyTo(item);
  };

  const renderItem = ({item}: any) => (
    <Swipeable
      renderLeftActions={(progress, dragX) =>
        renderLeftActions(progress, dragX, item)
      }
      onSwipeableLeftOpen={() => handleSwipeReply(item)}
      overshootLeft={false}
      friction={2}>
      <View
        style={[
          styles.messageContainer,
          item.sender === user.uid ? styles.myMessage : styles.theirMessage,
        ]}>
        {item.replyTo && (
          <View style={styles.replyToContainer}>
            <Text style={styles.replyToText}>{item.replyTo}</Text>
          </View>
        )}
        <Text
          style={[
            styles.messageText,
            item.sender === user.uid
              ? styles.myMessageText
              : styles.theirMessageText,
          ]}>
          {item.text}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        <View style={[styles.container, {paddingBottom: keyboardHeight || 0}]}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({animated: true})
            }
          />
              {replyTo && (
                <View style={styles.replyPreview}>
                  <Text style={styles.replyPreviewText} numberOfLines={1}>
                    Replying to: {replyTo.text}
                  </Text>
                  <TouchableOpacity onPress={() => setReplyTo(null)}>
                    <Text style={styles.closeReply}>×</Text>
                  </TouchableOpacity>
                </View>
              )}
          <View style={styles.inputBar}>
            <View style={{flex: 1, flexDirection: 'column'}}>
              <TextInput
                style={[
                  styles.input,
                  {
                    minHeight: 44,
                    height: Math.max(60, 44), // Always at least 60 when replying, never less than 44
                  },
                ]}
                placeholder="Type a message..."
                value={input}
                onChangeText={setInput}
                placeholderTextColor="#aaa"
                onFocus={() =>
                  setTimeout(
                    () => flatListRef.current?.scrollToEnd({animated: true}),
                    100,
                  )
                }
              />
            </View>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              activeOpacity={0.8}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primary,
  },
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 16,
  },
  messageContainer: {
    maxWidth: '75%',
    marginBottom: 14,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageText: {
    fontSize: 16,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#222',
  },
  replyToContainer: {
    backgroundColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
    maxWidth: '100%',
  },
  replyToText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  inputBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 8,
  },
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  replyPreviewText: {
    flex: 1,
    color: '#444',
    fontSize: 14,
  },
  closeReply: {
    fontSize: 18,
    color: '#888',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#222',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 0,
  },
  sendButton: {
    backgroundColor: primary,
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 22,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  replyAction: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 80,
    height: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 18,
    paddingLeft: 18,
  },
  replyActionText: {
    color: primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
