import { apiClient, ApiResponse } from '../api/client';
import { Observation } from '../types/api.types';

export interface CreateObservationData {
  lepidoptera_id?: string;
  plant_id?: string;
  latitude: number;
  longitude: number;
  location_name?: string;
  observation_date: string;
  notes?: string;
  is_public: boolean;
  images: string[]; 
}

class ObservationService {
  async getPublicObservations(): Promise<ApiResponse<Observation[]>> {
    return apiClient.getObservations();
  }

  async getObservationById(id: string): Promise<ApiResponse<Observation>> {
    return apiClient.get<Observation>(`/observations/${id}`);
  }

  async getUserObservations(userId: string): Promise<ApiResponse<Observation[]>> {
    return apiClient.get<Observation[]>(`/observations/user/${userId}`);
  }

  async createObservation(data: CreateObservationData): Promise<ApiResponse<Observation>> {
    return apiClient.post<Observation>('/observations', data);
  }

  async updateObservation(id: string, data: Partial<CreateObservationData>): Promise<ApiResponse<Observation>> {
    return apiClient.put<Observation>(`/observations/${id}`, data);
  }

  async deleteObservation(id: string): Promise<ApiResponse> {
    return apiClient.delete(`/observations/${id}`);
  }
}

export const observationService = new ObservationService();