import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Initial dummy confessions matching the Go backend structure
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
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
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
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
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
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
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
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
  }
];

const CATEGORIES = ['all', 'confession', 'college', 'relationships', 'career', 'random'];

export default function HomeScreen({ posts, setPosts, onAddPost }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('confession');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [showSpillForm, setShowSpillForm] = useState(false);

  // Voting handlers
  const handleVote = (postId, type) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id !== postId) return post;
        
        // Prevent voting multiple times in a real app, here we just toggle/increment
        if (type === 'up') {
          return { ...post, upvotes: post.upvotes + 1 };
        } else if (type === 'down') {
          return { ...post, downvotes: post.downvotes + 1 };
        } else if (type === 'truth') {
          return { ...post, real_votes: post.real_votes + 1 };
        } else if (type === 'cap') {
          return { ...post, cap_votes: post.cap_votes + 1 };
        }
        return post;
      })
    );
  };

  // Submit confession
  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now().toString(),
      content: newPostContent.trim(),
      category: newPostCategory,
      is_anonymous: isAnonymous,
      pseudonym: isAnonymous ? undefined : `User${Math.floor(100 + Math.random() * 900)}`,
      upvotes: 0,
      downvotes: 0,
      real_votes: 0,
      cap_votes: 0,
      created_at: new Date().toISOString(),
    };

    setPosts([newPost, ...posts]);
    if (onAddPost) {
      onAddPost(newPost);
    }
    setNewPostContent('');
    setShowSpillForm(false);
  };

  // Filter posts based on active pill
  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'confession': return '#EC4899'; // Pink
      case 'college': return '#3B82F6'; // Blue
      case 'relationships': return '#EF4444'; // Red
      case 'career': return '#10B981'; // Green
      case 'random': return '#F59E0B'; // Orange
      default: return '#8B5CF6'; // Purple
    }
  };

  const timeAgo = (dateStr) => {
    const elapsed = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(elapsed / 60000);
    const hours = Math.floor(minutes / 60);
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>Spillit<Text style={styles.logoFire}>🔥</Text></Text>
            <Text style={styles.tagline}>Spill the tea. No judgements.</Text>
          </View>
          <TouchableOpacity 
            style={styles.spillButton}
            onPress={() => setShowSpillForm(!showSpillForm)}
          >
            <Ionicons name={showSpillForm ? "close" : "add"} size={22} color="white" />
            <Text style={styles.spillButtonText}>{showSpillForm ? "Cancel" : "Spill"}</Text>
          </TouchableOpacity>
        </View>

        {/* Input Form container */}
        {showSpillForm && (
          <View style={styles.formCard}>
            <TextInput
              style={styles.textInput}
              placeholder="What's your secret today? Keep it real..."
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              value={newPostContent}
              onChangeText={setNewPostContent}
              maxLength={280}
            />
            
            <View style={styles.formRow}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.categoryPickerRow}>
                  {CATEGORIES.filter(c => c !== 'all').map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.miniPickerPill,
                        newPostCategory === cat && { backgroundColor: getCategoryColor(cat) }
                      ]}
                      onPress={() => setNewPostCategory(cat)}
                    >
                      <Text style={styles.miniPickerText}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.anonToggle}
                onPress={() => setIsAnonymous(!isAnonymous)}
              >
                <Ionicons 
                  name={isAnonymous ? "eye-off" : "eye"} 
                  size={18} 
                  color={isAnonymous ? "#A78BFA" : "#9CA3AF"} 
                />
                <Text style={[styles.anonText, isAnonymous && styles.anonTextActive]}>
                  {isAnonymous ? "Anonymous" : "With Pseudonym"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.submitBtn,
                  !newPostContent.trim() && styles.submitBtnDisabled
                ]}
                onPress={handleCreatePost}
                disabled={!newPostContent.trim()}
              >
                <Text style={styles.submitBtnText}>Post 🤐</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Category Filter Horizontal Scroll */}
        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            data={CATEGORIES}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterPill,
                  selectedCategory === item && styles.filterPillActive,
                  selectedCategory === item && { borderBottomColor: getCategoryColor(item) }
                ]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text 
                  style={[
                    styles.filterText, 
                    selectedCategory === item && styles.filterTextActive
                  ]}
                >
                  {item === 'all' ? '✨ All' : item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Feed List */}
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.feedList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const truthPct = item.real_votes + item.cap_votes > 0 
              ? Math.round((item.real_votes / (item.real_votes + item.cap_votes)) * 100) 
              : 50;

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardMeta}>
                    <View 
                      style={[
                        styles.badge, 
                        { backgroundColor: getCategoryColor(item.category) + '20' }
                      ]}
                    >
                      <Text style={[styles.badgeText, { color: getCategoryColor(item.category) }]}>
                        {item.category.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.timeText}>{timeAgo(item.created_at)}</Text>
                  </View>
                  <Text style={styles.authorText}>
                    {item.is_anonymous ? '🤫 Anonymous' : `👤 ${item.pseudonym}`}
                  </Text>
                </View>

                <Text style={styles.cardContent}>{item.content}</Text>

                {/* Truth or Cap Meter */}
                <View style={styles.truthCapSection}>
                  <View style={styles.meterHeader}>
                    <Text style={styles.meterLabel}>Community Verdict</Text>
                    <Text style={styles.meterValue}>{truthPct}% Truth</Text>
                  </View>
                  <View style={styles.meterTrack}>
                    <View style={[styles.meterFill, { width: `${truthPct}%` }]} />
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  {/* Left side: Likes/Dislikes */}
                  <View style={styles.voteGroup}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleVote(item.id, 'up')}
                    >
                      <Ionicons name="triangle" size={16} color="#4ADE80" />
                      <Text style={styles.voteCount}>{item.upvotes}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleVote(item.id, 'down')}
                    >
                      <Ionicons name="triangle" style={{ transform: [{ rotate: '180deg' }] }} size={16} color="#F87171" />
                      <Text style={styles.voteCount}>{item.downvotes}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Right side: Truth vs Cap quick vote */}
                  <View style={styles.opinionGroup}>
                    <TouchableOpacity 
                      style={[styles.opinionButton, styles.truthBtn]}
                      onPress={() => handleVote(item.id, 'truth')}
                    >
                      <Text style={styles.opinionText}>Truth ({item.real_votes})</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.opinionButton, styles.capBtn]}
                      onPress={() => handleVote(item.id, 'cap')}
                    >
                      <Text style={styles.opinionText}>Cap ({item.cap_votes})</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </KeyboardAvoidingView>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F23',
  },
  logoText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  logoFire: {
    fontSize: 24,
  },
  tagline: {
    fontSize: 12,
    color: '#71717A',
    marginTop: 2,
  },
  spillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 4,
  },
  spillButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  formCard: {
    backgroundColor: '#18181B',
    margin: 15,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  textInput: {
    color: '#FFFFFF',
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  formRow: {
    marginBottom: 14,
  },
  formGroup: {
    gap: 6,
  },
  formLabel: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  miniPickerPill: {
    backgroundColor: '#27272A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  miniPickerText: {
    color: '#D4D4D8',
    fontSize: 11,
    fontWeight: '600',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#27272A',
    paddingTop: 12,
  },
  anonToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  anonText: {
    color: '#71717A',
    fontSize: 13,
  },
  anonTextActive: {
    color: '#A78BFA',
    fontWeight: '500',
  },
  submitBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  submitBtnDisabled: {
    backgroundColor: '#27272A',
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#09090B',
    fontWeight: '700',
    fontSize: 13,
  },
  filterContainer: {
    paddingVertical: 12,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  filterPillActive: {
    backgroundColor: '#27272A',
    borderBottomWidth: 3,
  },
  filterText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  feedList: {
    paddingHorizontal: 15,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  timeText: {
    color: '#71717A',
    fontSize: 11,
  },
  authorText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '500',
  },
  cardContent: {
    color: '#E4E4E7',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  truthCapSection: {
    marginBottom: 16,
    backgroundColor: '#09090B',
    padding: 10,
    borderRadius: 8,
  },
  meterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  meterLabel: {
    color: '#71717A',
    fontSize: 11,
  },
  meterValue: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
  },
  meterTrack: {
    height: 4,
    backgroundColor: '#27272A',
    borderRadius: 2,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#27272A',
    paddingTop: 12,
  },
  voteGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#27272A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  voteCount: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '600',
  },
  opinionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  opinionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  truthBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  capBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  opinionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
