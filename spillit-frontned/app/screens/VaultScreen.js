import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Fun random pseudonyms list
const ADJECTIVES = ['Silent', 'Salty', 'Ghostly', 'Sneaky', 'Curious', 'Mystic', 'Wandering', 'Cynical', 'Wild', 'Chill'];
const NOUNS = ['Panda', 'Ghost', 'Ninja', 'Koala', 'Owl', 'Fox', 'Wolf', 'Raccoon', 'Phoenix', 'Cheetah'];

export default function VaultScreen({ myPosts = [], onBurnPost }) {
  const [pseudonym, setPseudonym] = useState('SilentGhost42');
  const [rollCount, setRollCount] = useState(0);

  // Stats calculation
  const totalPosts = myPosts.length + 3; // adding mock posts count
  const totalUpvotes = myPosts.reduce((acc, p) => acc + p.upvotes, 0) + 247;
  const avgTruth = myPosts.length > 0 
    ? Math.round(myPosts.reduce((acc, p) => {
        const total = p.real_votes + p.cap_votes;
        return acc + (total > 0 ? (p.real_votes / total) * 100 : 50);
      }, 0) / myPosts.length)
    : 84;

  const handleRollPseudonym = () => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(10 + Math.random() * 90);
    setPseudonym(`${adj}${noun}${num}`);
    setRollCount(prev => prev + 1);
  };

  const handleShareStats = async () => {
    try {
      await Share.share({
        message: `My Spillit Secrets stats: Spilled ${totalPosts} secrets with an average Truth score of ${avgTruth}%! 🔥`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  // Combining mock personal posts and passed posts
  const defaultMyPosts = [
    {
      id: 'mock-1',
      content: 'I borrowed my brother\'s favorite hoodie 2 years ago, told him I lost it, and it is currently sitting in my closet.',
      category: 'confession',
      upvotes: 18,
      downvotes: 1,
      real_votes: 15,
      cap_votes: 4,
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
    {
      id: 'mock-2',
      content: 'I skip online classes to play video games but still manage to get straight A\'s. ChatGPT is carrying my degree.',
      category: 'college',
      upvotes: 229,
      downvotes: 11,
      real_votes: 210,
      cap_votes: 30,
      created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    }
  ];

  const allMyPosts = [...myPosts, ...defaultMyPosts];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>The Vault 🔒</Text>
          <Text style={styles.headerSubtitle}>Your secret space and identity stats</Text>
        </View>

        {/* Identity Card */}
        <View style={styles.identityCard}>
          <View style={styles.identityHeader}>
            <View>
              <Text style={styles.identityLabel}>Current Pseudonym</Text>
              <Text style={styles.identityValue}>{pseudonym}</Text>
            </View>
            <TouchableOpacity 
              style={styles.rollButton} 
              onPress={handleRollPseudonym}
            >
              <Ionicons name="refresh" size={18} color="#A78BFA" />
              <Text style={styles.rollButtonText}>Roll</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.identityHint}>
            Used when posting confessions with "With Pseudonym" selected. Roll to change it instantly!
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalPosts}</Text>
              <Text style={styles.statLabel}>Secrets Spilled</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalUpvotes}</Text>
              <Text style={styles.statLabel}>Upvotes Received</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{avgTruth}%</Text>
              <Text style={styles.statLabel}>Avg. Truth</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.shareStatsBtn} onPress={handleShareStats}>
            <Ionicons name="share-social-outline" size={16} color="white" />
            <Text style={styles.shareStatsText}>Share Stats</Text>
          </TouchableOpacity>
        </View>

        {/* My Secrets Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Spilled Secrets</Text>
          <Text style={styles.sectionBadge}>{allMyPosts.length}</Text>
        </View>

        <FlatList
          data={allMyPosts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="key-outline" size={48} color="#3F3F46" />
              <Text style={styles.emptyText}>You haven't spilled any secrets yet.</Text>
            </View>
          }
          renderItem={({ item }) => {
            const totalVotes = item.real_votes + item.cap_votes;
            const truthPct = totalVotes > 0 
              ? Math.round((item.real_votes / totalVotes) * 100) 
              : 50;

            return (
              <View style={styles.secretCard}>
                <View style={styles.secretCardHeader}>
                  <Text style={styles.categoryText}>#{item.category}</Text>
                  <TouchableOpacity 
                    style={styles.burnButton}
                    onPress={() => onBurnPost && onBurnPost(item.id)}
                  >
                    <Ionicons name="flame-outline" size={16} color="#EF4444" />
                    <Text style={styles.burnButtonText}>Burn</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.secretContent}>{item.content}</Text>

                <View style={styles.secretStatsRow}>
                  <View style={styles.statItem}>
                    <Ionicons name="arrow-up-circle-outline" size={14} color="#A1A1AA" />
                    <Text style={styles.statItemText}>{item.upvotes} Upvotes</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="checkmark-circle-outline" size={14} color="#A1A1AA" />
                    <Text style={styles.statItemText}>{truthPct}% Truth Verdict</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#71717A',
    marginTop: 4,
  },
  identityCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    marginBottom: 16,
  },
  identityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  identityLabel: {
    fontSize: 11,
    color: '#71717A',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  identityValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  rollButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  rollButtonText: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '700',
  },
  identityHint: {
    fontSize: 11,
    color: '#52525B',
    lineHeight: 16,
  },
  statsContainer: {
    marginBottom: 20,
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#18181B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#27272A',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#A78BFA',
  },
  statLabel: {
    fontSize: 10,
    color: '#71717A',
    marginTop: 4,
    fontWeight: '600',
  },
  shareStatsBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#27272A',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  shareStatsText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A78BFA',
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  listContainer: {
    paddingBottom: 30,
    gap: 10,
  },
  secretCard: {
    backgroundColor: '#18181B',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  secretCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A78BFA',
    textTransform: 'uppercase',
  },
  burnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  burnButtonText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '700',
  },
  secretContent: {
    color: '#D4D4D8',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  secretStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statItemText: {
    color: '#71717A',
    fontSize: 11,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    color: '#71717A',
    fontSize: 13,
  },
});
