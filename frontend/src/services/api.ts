/**
 * API service for making HTTP requests to the backend
 */
import axios from 'axios';
import type { RoomResponse, Room, AutocompleteRequest, AutocompleteResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const roomsApi = {
  /**
   * Create a new room
   */
  createRoom: async (language: string = 'python'): Promise<RoomResponse> => {
    const response = await api.post<RoomResponse>('/rooms', { language });
    return response.data;
  },

  /**
   * Get room details by ID
   */
  getRoom: async (roomId: string): Promise<Room> => {
    const response = await api.get<Room>(`/rooms/${roomId}`);
    return response.data;
  },
};

export const autocompleteApi = {
  /**
   * Get autocomplete suggestion
   */
  getSuggestion: async (request: AutocompleteRequest): Promise<AutocompleteResponse> => {
    const response = await api.post<AutocompleteResponse>('/autocomplete', request);
    return response.data;
  },
};

export default api;
