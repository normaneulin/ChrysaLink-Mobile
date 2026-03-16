import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl,
  // Remove SafeAreaView from here
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // <-- ADD IT HERE
import { observationService } from '../services/observation-service';
import { Observation } from '../types';
import ObservationCard from '../components/ObservationCard';

export default function HomeScreen() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchObservations = async () => {
    setError(null);
    const response = await observationService.getPublicObservations();
    
    if (response.success && response.data) {
      setObservations(response.data);
    } else {
      setError(response.error || 'Failed to load observations');
    }
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    await fetchObservations();
    setIsLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchObservations();
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    loadInitialData();
  }, []);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Recent Discoveries</Text>
      <Text style={styles.headerSubtitle}>Explore community observations</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4ade80" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={observations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ObservationCard observation={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          refreshControl={
            <RefreshControl 
              refreshing={isRefreshing} 
              onRefresh={onRefresh} 
              tintColor="#4ade80" 
              colors={['#4ade80']} 
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No observations found yet.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b', // zinc-950
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f4f4f5',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    marginTop: 4,
  },
  errorText: {
    color: '#ef4444', // red-500
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#a1a1aa',
    fontSize: 16,
  }
});