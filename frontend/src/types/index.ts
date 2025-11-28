/**
 * Type definitions for the application
 */

export interface Room {
  id: string;
  code: string;
  language: string;
  created_at: string;
  active_users: number;
}

export interface RoomResponse {
  room_id: string;
}

export interface AutocompleteRequest {
  code: string;
  cursor_position: number;
  language: string;
}

export interface AutocompleteResponse {
  suggestion: string;
  start_position: number;
  end_position: number;
}

export interface WebSocketMessage {
  type: 'init' | 'code_update' | 'cursor_position' | 'user_joined' | 'user_left' | 'pong';
  code?: string;
  language?: string;
  active_users?: number;
  user_id?: string;
  position?: number;
  line?: number;
  column?: number;
}

export interface CodeEditorState {
  code: string;
  language: string;
  cursorPosition: number;
  isConnected: boolean;
  activeUsers: number;
}
