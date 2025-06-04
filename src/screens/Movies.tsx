import { Button, StyleSheet, View } from "react-native";
import { Text } from "react-native-gesture-handler";

export default function MoviesScreen({navigation}: any) {
  return (
    <View style={styles.screen}>
      <Text>Movie Screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '5%',
    paddingTop: '10%',
    backgroundColor: 'white',
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});