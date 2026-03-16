import { apiClient, ApiResponse } from '../api/client';
import { TaxonomyEntity } from '../types/api.types';

class SpeciesService {
  async searchSpecies(query: string, type: 'lepidoptera' | 'plant'): Promise<ApiResponse<TaxonomyEntity[]>> {
    return apiClient.searchSpecies(query, type);
  }

  async getSpeciesById(id: string, type: 'lepidoptera' | 'plant'): Promise<ApiResponse<TaxonomyEntity>> {
    // Assuming your edge function has a route for getting single species
    return apiClient.get<TaxonomyEntity>(`/${type}/${id}`);
  }
}

export const speciesService = new SpeciesService();