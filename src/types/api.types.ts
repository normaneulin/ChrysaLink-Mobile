export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  points: number;
  created_at: string;
  role: 'user' | 'admin' | 'expert';
}

export interface TaxonomyEntity {
  id: string;
  scientific_name: string;
  common_name?: string;
  family?: string;
  order?: string;
  class?: string;
  phylum?: string;
  kingdom?: string;
  description?: string;
  image_url?: string;
  is_placeholder?: boolean;
}

export interface Observation {
  id: string;
  user_id: string;
  lepidoptera_id?: string;
  plant_id?: string;
  latitude: number;
  longitude: number;
  location_name?: string;
  observation_date: string;
  notes?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  profiles?: {
    name: string;
    avatar_url?: string;
    username: string;
  };
  lepidoptera_taxonomy?: TaxonomyEntity;
  plant_taxonomy?: TaxonomyEntity;
  observation_images?: ObservationImage[];
}

export interface ObservationImage {
  id: string;
  observation_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface SpeciesSearchResponse {
  success: boolean;
  data: TaxonomyEntity[];
  error?: string;
}