import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import VaultScreen from './screens/VaultScreen';

// Root posts state initializer
const INITIAL_POSTS = [
  {
    id: '1',
    content: 'I lied on my resume and got hired as a senior dev. It\'s been 3 months and I\'m still just copying stuff from ChatGPT and stackoverflow. Nobody has noticed yet.',
    category: 'career',
    is_anonymous: true,
    upvotes: 42,
    downvotes: 3,
    real_votes: 28,
    cap_votes: 14,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: '2',
    content: 'My roommate thinks the apartment is haunted because I keep moving their keys and hiding the remote. It\'s actually just me trying to get them to clean up.',
    category: 'random',
    is_anonymous: true,
    upvotes: 128,
    downvotes: 12,
    real_votes: 110,
    cap_votes: 18,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: '3',
    content: 'Dating my ex\'s best friend and we are keeping it a secret. It\'s stressful but honestly we have way better chemistry.',
    category: 'relationships',
    is_anonymous: false,
    pseudonym: 'SecretLover99',
    upvotes: 75,
    downvotes: 25,
    real_votes: 40,
    cap_votes: 35,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: '4',
    content: 'Failed my midterms but told my parents I aced them. The grade report is coming out next week and I am planning my escape.',
    category: 'college',
    is_anonymous: true,
    upvotes: 54,
    downvotes: 5,
    real_votes: 48,
    cap_votes: 6,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [myPosts, setMyPosts] = useState([]);

  // Callback to track user's own confessions
  const handleNewPost = (newPost) => {
    setMyPosts([newPost, ...myPosts]);
  };

  // Callback to "burn" (delete) confessions from the vault
  const handleBurnPost = (postId) => {
    setMyPosts(prev => prev.filter(p => p.id !== postId));
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Screen Render */}
      <View style={styles.mainContent}>
        {activeTab === 'feed' ? (
          <HomeScreen 
            posts={posts} 
            setPosts={setPosts} 
            onAddPost={handleNewPost} 
          />
        ) : (
          <VaultScreen 
            myPosts={myPosts} 
            onBurnPost={handleBurnPost} 
          />
        )}
      </View>

      {/* Modern Frosted-style Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'feed' && styles.tabItemActive]}
          onPress={() => setActiveTab('feed')}
        >
          <Ionicons
            name={activeTab === 'feed' ? 'chatbubbles' : 'chatbubbles-outline'}
            size={22}
            color={activeTab === 'feed' ? '#7C3AED' : '#71717A'}
          />
          <Text style={[styles.tabLabel, activeTab === 'feed' && styles.tabLabelActive]}>
            Feed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'vault' && styles.tabItemActive]}
          onPress={() => setActiveTab('vault')}
        >
          <Ionicons
            name={activeTab === 'vault' ? 'lock-closed' : 'lock-closed-outline'}
            size={22}
            color={activeTab === 'vault' ? '#7C3AED' : '#71717A'}
          />
          <Text style={[styles.tabLabel, activeTab === 'vault' && styles.tabLabelActive]}>
            The Vault
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  mainContent: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#111115',
    borderTopWidth: 1,
    borderTopColor: '#1F1F23',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  tabItemActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.08)',
  },
  tabLabel: {
    fontSize: 10,
    color: '#71717A',
    marginTop: 4,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#7C3AED',
    fontWeight: '700',
  },
});