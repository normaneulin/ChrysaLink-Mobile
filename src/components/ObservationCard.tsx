import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Observation } from '../types';

interface ObservationCardProps {
  observation: Observation;
  onPress?: () => void;
}

export default function ObservationCard({ observation, onPress }: ObservationCardProps) {
  // Extract primary image or fallback
  const primaryImage = observation.observation_images?.find(img => img.is_primary)?.image_url 
    || observation.observation_images?.[0]?.image_url;

  // Format date
  const formattedDate = new Date(observation.observation_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Header: User Info */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {observation.profiles?.name?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <View>
          <Text style={styles.userName}>{observation.profiles?.name || 'Unknown Explorer'}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
      </View>

      {/* Main Image */}
      {primaryImage ? (
        <Image source={{ uri: primaryImage }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="leaf-outline" size={48} color="#52525b" />
        </View>
      )}

      {/* Body: Taxonomy & Location */}
      <View style={styles.body}>
        {observation.lepidoptera_taxonomy && (
          <View style={styles.taxonomyTag}>
            <Ionicons name="bug" size={14} color="#4ade80" />
            <Text style={styles.taxonomyText} numberOfLines={1}>
              {observation.lepidoptera_taxonomy.common_name || observation.lepidoptera_taxonomy.scientific_name}
            </Text>
          </View>
        )}
        
        {observation.plant_taxonomy && (
          <View style={[styles.taxonomyTag, { marginTop: 4 }]}>
            <Ionicons name="leaf" size={14} color="#4ade80" />
            <Text style={styles.taxonomyText} numberOfLines={1}>
              {observation.plant_taxonomy.common_name || observation.plant_taxonomy.scientific_name}
            </Text>
          </View>
        )}

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color="#a1a1aa" />
          <Text style={styles.locationText} numberOfLines={1}>
            {observation.location_name || `${observation.latitude.toFixed(4)}, ${observation.longitude.toFixed(4)}`}
          </Text>
        </View>

        {observation.notes && (
          <Text style={styles.notesText} numberOfLines={2}>{observation.notes}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#18181b', // zinc-900
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#27272a', // zinc-800
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4ade80',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#09090b',
    fontWeight: 'bold',
    fontSize: 16,
  },
  userName: {
    color: '#e4e4e7', // zinc-200
    fontWeight: '600',
    fontSize: 14,
  },
  dateText: {
    color: '#a1a1aa', // zinc-400
    fontSize: 12,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#27272a',
  },
  placeholderImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 16,
  },
  taxonomyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#09090b',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  taxonomyText: {
    color: '#4ade80',
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '500',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  locationText: {
    color: '#a1a1aa',
    marginLeft: 4,
    fontSize: 13,
  },
  notesText: {
    color: '#e4e4e7',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  }
});