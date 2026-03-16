import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../api/client';
import { supabase } from '../api/supabase';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [badge, setBadge] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (userId) {
        const [profileRes, badgeRes] = await Promise.all([
          apiClient.getProfile(userId),
          apiClient.get(`/users/${userId}/badge`) // Matches your fallback method signature
        ]);

        if (profileRes.success) setProfile(profileRes.data);
        if (badgeRes.success) setBadge(badgeRes.data);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // AppNavigator's auth state listener in App.tsx will auto-route to Landing
  };

  if (isLoading) {
    return (
      <View style={styles.centered}><ActivityIndicator size="large" color="#4ade80" /></View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Profile Section */}
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.name?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.name}>{profile?.name || 'Explorer'}</Text>
          <Text style={styles.username}>@{profile?.username || 'user'}</Text>
          
          <View style={styles.badgeTag}>
            <Ionicons name="shield-checkmark" size={14} color="#09090b" />
            <Text style={styles.badgeText}>{badge?.level || 'Novice'}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Ionicons name="camera-outline" size={24} color="#4ade80" />
            <Text style={styles.statValue}>{profile?.points || 0}</Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="leaf-outline" size={24} color="#4ade80" />
            <Text style={styles.statValue}>{profile?.observation_count || 0}</Text>
            <Text style={styles.statLabel}>Observations</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#4ade80" />
            <Text style={styles.statValue}>{profile?.validated_species || 0}</Text>
            <Text style={styles.statLabel}>Validated</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.actionButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.actionText}>Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  centered: { flex: 1, backgroundColor: '#09090b', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16 },
  
  headerCard: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 16,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#4ade80',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#09090b' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#f4f4f5' },
  username: { fontSize: 16, color: '#a1a1aa', marginBottom: 12 },
  badgeTag: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#4ade80',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
  },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: '#09090b', marginLeft: 4 },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    flex: 1, backgroundColor: '#18181b',
    borderRadius: 12, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#27272a',
    marginHorizontal: 4,
  },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#f4f4f5', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#a1a1aa', marginTop: 4 },

  actionButton: {
    flexDirection: 'row', backgroundColor: '#18181b',
    padding: 16, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#27272a',
  },
  actionText: { color: '#ef4444', fontSize: 16, fontWeight: '600', marginLeft: 8 }
});