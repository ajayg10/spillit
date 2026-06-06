import { View, Text, StyleSheet, FlatList } from 'react-native';

const dummyPosts = [
  { id: '1', content: 'I lied in my interview and got the job 💀' },
  { id: '2', content: 'My friend is dating my ex and I act chill 🙂' },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Spillit 🔥</Text>

      <FlatList
        data={dummyPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0f0f0f',
  },
  header: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1c1c1c',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
});