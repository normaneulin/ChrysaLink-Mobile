import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { observationService } from '../services/observation-service';
import { Observation } from '../types';
import ObservationCard from '../components/ObservationCard';

export default function ExploreScreen() {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [observations, setObservations] = useState<Observation[]>([]);
  const [filteredObs, setFilteredObs] = useState<Observation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchObservations();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredObs(observations);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = observations.filter(obs => {
        const lepName = obs.lepidoptera_taxonomy?.common_name || obs.lepidoptera_taxonomy?.scientific_name || '';
        const plantName = obs.plant_taxonomy?.common_name || obs.plant_taxonomy?.scientific_name || '';
        return lepName.toLowerCase().includes(lowerQuery) || plantName.toLowerCase().includes(lowerQuery);
      });
      setFilteredObs(filtered);
    }
  }, [searchQuery, observations]);

  const fetchObservations = async () => {
    setIsLoading(true);
    const response = await observationService.getPublicObservations();
    if (response.success && response.data) {
      setObservations(response.data);
      setFilteredObs(response.data);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header & Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#a1a1aa" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search species..."
            placeholderTextColor="#a1a1aa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* View Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === 'map' && styles.toggleActive]}
            onPress={() => setViewMode('map')}
          >
            <Ionicons name="map" size={20} color={viewMode === 'map' ? '#09090b' : '#a1a1aa'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={20} color={viewMode === 'list' ? '#09090b' : '#a1a1aa'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Area */}
      {isLoading ? (
        <View style={styles.centered}><ActivityIndicator size="large" color="#4ade80" /></View>
      ) : viewMode === 'map' ? (
        <MapView 
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={{
            latitude: 10.3157, // Defaulting to Central Visayas/Cebu based on typical ChrysaLink data
            longitude: 123.8854,
            latitudeDelta: 5.0,
            longitudeDelta: 5.0,
          }}
          userInterfaceStyle="dark"
        >
          {filteredObs.map(obs => (
            obs.latitude && obs.longitude ? (
              <Marker
                key={obs.id}
                coordinate={{ latitude: obs.latitude, longitude: obs.longitude }}
                title={obs.lepidoptera_taxonomy?.common_name || 'Observation'}
                description={obs.location_name || ''}
                pinColor="#4ade80"
              />
            ) : null
          ))}
        </MapView>
      ) : (
        <FlatList
          data={filteredObs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ObservationCard observation={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b' },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#f4f4f5', height: '100%' },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#18181b',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272a',
    overflow: 'hidden',
  },
  toggleBtn: { padding: 8, paddingHorizontal: 12 },
  toggleActive: { backgroundColor: '#4ade80' },
  map: { flex: 1 },
  listContent: { padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});